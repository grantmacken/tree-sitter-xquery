

(: Written By: Frans Englich(maintainer, not original author :)
(: Purpose: Return the name of the person with ID `person0'. :)
(: Date: 2007-03-09 :)

declare namespace local = "http://www.example.com/";


declare function local:convert($v as xs:decimal?) as xs:decimal?
{
  2.20371 * $v (: convert Dfl to Euro :)
};

<XMark-result-All/>
