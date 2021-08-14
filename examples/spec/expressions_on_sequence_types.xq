(
'3.18 Expressions on SequenceTypes',
'3.18.1 Instance Of',
5 instance of xs:integer,
5 instance of xs:decimal,
<a>{5}</a> instance of xs:integer,
(5, 6) instance of xs:integer+,
'TODO adjust grammar for 3.18.2 Typeswitch',
typeswitch($customer/billing-address)
   case $a as element(*, USAddress) return $a/state
   case $a as element(*, CanadaAddress) return $a/province
   case $a as element(*, JapanAddress) return $a/prefecture
   default return "unknown",
typeswitch($customer/billing-address)
   case $a as element(*, USAddress)
            | element(*, AustraliaAddress)
            | element(*, MexicoAddress)
     return $a/state
   case $a as element(*, CanadaAddress)
     return $a/province
   case $a as element(*, JapanAddress)
     return $a/prefecture
   default
     return "unknown",
'3.18.(3,4) Cast Castable', 
if ($x castable as hatsize)
   then $x cast as hatsize
   else if ($x castable as IQ)
   then $x cast as IQ
   else $x cast as xs:string,
'3.18.5 Constructor Functions',
xs:date("2000-01-01"),
xs:decimal($floatvalue * 0.2E-5),
xs:dayTimeDuration("P21D"),
'3.18.6 Treat',
$myaddress treat as element(*, USAddress),
usa:zipcode("12345")
)
