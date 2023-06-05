'3.12 FLWOR Expressions',
'3.12.2 For Clause',
for $y allowing empty at $j in ($x to 3)
return (),
'3.12.3 Let Clause',
let $x := $expr1, $y := $expr2
return ( $x + $y ),
let $e := fn:doc("emps.xml")/emps/emp[deptno eq $d]
return $e,
'3.12.4.1 Tumbling Windows',
for tumbling window $w in (2, 4, 6, 8, 10, 12, 14)
    start at $s when fn:true()
    only end at $e when $e - $s eq 2
return <window>{ $w }</window>, 
'3.12.4.2 Sliding Windows', 
for sliding window $w in (2, 4, 6, 8, 10, 12, 14)
    start at $s when fn:true()
    only end at $e when $e - $s eq 2
return avg($w),
'3.12.5 Where Clause',
for $x at $i in $inputvalues
where $i mod 100 = 0
return $x,
'3.12.6 Count Clause',
for $p in $productsgg
order by $p/sales descending
count $rank
where $rank <= 3
return
   <product rank="{$rank}">
      {$p/name, $p/sales}
   </product>,
'3.12.7 Group By Clause',
'TODO department name attr should contain enclosed expression like char_data in department text',
let $x := 64000
for $c in //customer
let $d := $c/department
where $c/salary > $x
group by $d
return
 <department name="{$d}">
  Number of employees earning more than ${distinct-values($x)} is {count($c)}
 </department>,
 for $s in $sales,
    $p in $products[itemno = $s/itemno]
let $revenue := $s/qty * $p/price
group by $storeno := $s/storeno, 
    $category := $p/category
return
    <summary storeno="{$storeno}"
              category="{$category}"
              revenue="{sum($revenue)}"/>,
for $s1 in $sales
let $storeno := $s1/storeno
group by $storeno
order by $storeno
return
  <store storeno="{$storeno}">
    {for $s2 in $s1,
         $p in $products[itemno = $s2/itemno]
     let $category := $p/category,
         $revenue := $s2/qty * $p/price
     group by $category
     let $group-revenue := sum($revenue)
     where $group-revenue > 10000
     order by $group-revenue descending
     return <category name="{$category}" revenue="{$group-revenue}"/>
    }
  </store>,
 let $high-price := 1000
for $p in $products[price > $high-price]
let $category := $p/category
group by $category
return
   <category name="{$category}">
      {fn:count($p)} products have price greater than {$high-price}
   </category>,
'3.12.8 Order By Clause',
for $e in $employees
order by $e/salary descending
return $e/name,
'3.12.9 Return Clause',
for $d in fn:doc("depts.xml")//dept
let $e := fn:doc("emps.xml")//emp[deptno eq $d/deptno]
where fn:count($e) >= 10
order by fn:avg($e/salary) descending
return
   <big-dept>
      {
      $d/deptno,
      <headcount>{fn:count($e)}</headcount>,
      <avgsal>{fn:avg($e/salary)}</avgsal>
      }
</big-dept>,
  let $i := 5,
  $j := 20 * $i
return ($i, $j),
'@',
$N[if (@x castable as xs:date)
   then xs:date(@x) gt xs:date("2000-01-01")
   else false()],
let $vat := function($art) { $art/@vat + $art/@price }
return shop/article/$vat(.),
let $ctx := shop/article,
$vat := function() { for $a in $ctx return $a/@vat + $a/@price }
return $vat()

