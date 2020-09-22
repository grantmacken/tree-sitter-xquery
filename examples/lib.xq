xquery version "3.1";
(:
: here there be dragons 
:)
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
  <response>
    <title>Hello { $who }!</title>
  </response>
};

declare
%rest:path("version3") 
function foo:version3() {
  <rest:response>
    <output:serialization-parameters>
      <output:media-type value='text/plain'/>
    </output:serialization-parameters>
  </rest:response>,
  'Not that simple anymore'
};

