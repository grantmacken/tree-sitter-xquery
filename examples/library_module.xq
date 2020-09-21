xquery version "3.1";
module namespace foo = "http://example.org/#foo";
declare namespace baa = "http://example.org/baa";
declare variable $x := 'bar';

declare 
function foo:summary($emps as element(employee)*) as element(dept)* { 
 fn:distinct-values($emps/deptno)
};

declare  
function foo:copySign( $magnitude, $sign ) 
external;

declare 
%rest:path("hello/{$who}") 
%rest:GET 
function foo:hello($who) {
  <response/>
};
