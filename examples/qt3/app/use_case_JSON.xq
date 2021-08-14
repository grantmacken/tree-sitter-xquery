declare namespace array="http://www.w3.org/2005/xpath-functions/array";
declare namespace map="http://www.w3.org/2005/xpath-functions/map";
declare variable $data := map {
    "color" : "blue",
    "closed" : true(),
    "points" : [[10,10], [20,10], [20,20], [10,20]]
  }; 
 declare variable $stroke := attribute stroke { $data("color") };
 declare variable $points := attribute points { array:flatten($data("points")) };

declare function local:deep-put($input as item()*, $key as xs:string, $value as item()*) as item()* {
  for $i in $input return
    if ($i instance of map(*))
      then map:merge(map:for-each($i, function($k, $v) {
            if ($k eq $key) then map{$k : $value} else map{$k : local:deep-put($v, $key, $value)} }))
    else if ($i instance of array(*))
      then array{ local:deep-put($i?*, $key, $value) }
    else $i
};
(
json-doc("mildred.json")?phone?*[?type = 'mobile']?number,
let $input := json-doc('employees.json')
for $k in map:keys($input)
return 
<department name="{$k}">{
let $arr := $input($k)
for $i in 1 to array:size($arr)
      let $emp := $arr($i)
        return
        <employee>
        <firstName>{ $emp('firstName') }</firstName>
        <lastName>{ $emp('lastName') }</lastName>
        <age>{ $emp('age') }</age>
        </employee>
}</department>,
local:deep-put(json-doc("bookinfo.json"), "first", "John"),
let $users := json-doc('users.json')?*
for $sarah in $users, $friend in $users
where $sarah?name = "Sarah" and $friend?name = $sarah?friends 
return $friend?name,
let $products := json-doc('sales.json')?*
return map:merge((
      for $sales in $products
      let $pname := $sales?product
      group by $pname
      return map { $pname : sum(for $s in $sales return $s?quantity) }
      )),
       array {
         for $store in json-doc('stores.json')?*
           let $state := $store?state
             group by $state
             order by $state
             return
             map {
               $state :  array {
                 for $product in json-doc('products.json')?*
                   let $category := $product?category
                     group by $category
                     order by $category
                     return
                     map {
                       $category :  map:merge((
                             for $sales in json-doc('sales.json')?*
                             where $sales?("store number") = $store?("store number") and $sales?product = $product?name
                             let $pname := $sales?product
                             group by $pname
                             order by $pname
                             return map { $pname :  sum(for $s in $sales return $s?quantity)}
                             ))
                     }
               }
             }
       },
 let $sats := json-doc("satellites.json")("satellites")
 return map { "visible" : array { map:keys($sats)[$sats(.)("visible")] }, "invisible" : array { map:keys($sats)[not($sats(.)("visible"))] } },
 array {
    for $page in doc($uri)//page
    return map {
            "title": string($page/title),
            "id" : string($page/id),
            "last updated" : string($page/revision[1]/timestamp),
            "authors" : array { for $a in $page/revision/contributor/username return string($a) }
           }               
   },
 if ($data("closed")) then <svg><polygon>{ $stroke, $points }</polygon></svg>
         else <svg><polyline>{ $stroke, $points }</polyline></svg>,
 <html>
 <body>
 <table>
  <tr> 
{ (: Column headings :) 
  <th> </th>,
    for $th in json-doc("table.json")("col labels")?*
      return <th>{ $th }</th>
}
  </tr>
{  (: Data for each row :)
  for $r at $i in json-doc("table.json")("data")?*
    return
      <tr>
      {
        <th>{ json-doc("table.json")("row labels")[$i] }</th>,
        for $c in $r?*
          return <td>{ $c }</td>
      }
  </tr>
}
</table>				
</body>
</html>,
        let $users := [map { "userid" : "W0342", "firstname" : "Walter", "lastname" : "Denisovich" }, map { "userid" : "M0535", "firstname" : "Mick", "lastname" : "Goulish" }]?* 
        let $holdings := [map { "userid" : "W0342", "ticker" : "DIS", "shares" : 153212312 }, map { "userid" : "M0535", "ticker" : "DIS", "shares" : 10 }, map { "userid" : "M0535", "ticker" : "AIG", "shares" : 23412 }]?*   
        return array {
          for $u in $users
          order by $u("userid")
          return map { "userid" : $u("userid"), 
                       "first" :  $u("firstname"), 
                       "last" :   $u("lastname"), 
                       "holdings" : array {
                          for $h in $holdings
                          where $h("userid") = $u("userid")
                          order by $h("ticker")
									        return map { "ticker" : $h("ticker"), "share" : $h("shares") }
										    }
                 }
        },
  let $feed := json-doc("incoming.json")("feed")
      , $entry := $feed("entry")
    return
    if ($entry?*("app$control")("yt$state")("name") = "restricted")
      then map:remove($feed, "entry")
      else $feed       
)
