declare 
   %java:method("java.lang.StrictMath.copySign") 
   function smath:copySign($magnitude, $sign) 
   external;

declare function local:summary($emps as element(employee)*) as element(dept)* 
{ 
  for $d in fn:distinct-values($emps/deptno) 
  let $e := $emps[deptno = $d]
  return 
     <dept> 
       <deptno>{$d}</deptno> 
       <headcount> {fn:count($e)}
       </headcount> 
       <payroll> 
       {fn:sum($e/salary)} 
       </payroll> 
     </dept> 
};
declare function local:depth($e as node()) as xs:integer
{
   (: A node with no children has depth 1 :)
   (: Otherwise, add 1 to max depth of children :)
   if (fn:empty($e/*)) then 1
   else fn:max(for $c in $e/* return local:depth($c)) + 1
};

(          
local:summary(fn:doc("acme_corp.xml")//employee[location = "Denver"]),
local:depth(fn:doc("partlist.xml"))
)

