module namespace mod = "http://example.org/#mod";
declare namespace foo = "http://example.org/#foo";
declare default element namespace "http://example.org/names";
import schema namespace geometry = "http://example.org/geo-schema-declarations";
import module namespace geo = "http://example.org/geo-functions";

declare context item as item() external;
declare variable $mod:bar := "main module dummy";
declare 
function mod:summary($emps as element(employee)*) as element(dept)* { 
 fn:distinct-values($emps/deptno)
};

declare  
function mod:copySign( $magnitude, $sign ) 
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
function mod:version3() {
  <rest:response>
    <output:serialization-parameters>
      <output:media-type value='text/plain'/>
    </output:serialization-parameters>
  </rest:response>,
  (
   1,
  'Not that simple anymore'
  )
};

