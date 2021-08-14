declare decimal-format local:de 
  decimal-separator = "," grouping-separator = "."; 

declare decimal-format local:en 
  decimal-separator = "." grouping-separator = ","; 
       
let $numbers := (1234.567, 789, 1234567.765) 
for $i in $numbers
return ( 
  format-number($i, "#.###,##", "local:de"), 
  format-number($i, "#,###.##", "local:en") 
)
