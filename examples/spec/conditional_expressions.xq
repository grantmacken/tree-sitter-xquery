(
 '3.14 Conditional Expressions', 
 if ($widget1/unit-cost < $widget2/unit-cost)
 then $widget1
 else $widget2,
 if ($part/@discounted)
 then $part/wholesale
 else $part/retail
 )


