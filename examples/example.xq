
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
     return "unknown"
