('3.10 String Constructors',
``[`{ $i, ``[literal text]``, $j, ``[more literal text]`` }`]``,
``[Hello `{$a?name}`
You have just won `{$a?value}` dollars!
`{ 
   if ($a?in_ca) 
   then ``[Well, `{$a?taxed_value}` dollars, after taxes.]``
   else ""
}`]``,
``[<div>
  <h1>Hello `{$a?name}`</h1>
  <p>You have just won `{$a?value}` dollars!</p>
    `{ 
      if ($a?in_ca) 
      then ``[  <p>Well, `{$a?taxed_value}` dollars, after taxes.</p> ]``
      else ""
    }`
</div>]``,
``[{ 
  "name" : `{ $a?name }`
  "value" : `{ $a?value }`
  `{
  if ($a?in_ca) 
  then 
  ``[, 
  "taxed_value" : `{ $a?taxed_value }`]``  
  else ""
  }`
}]``
'end'
)
