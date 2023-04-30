'3.10 String Constructors',
``[ 3.10 String Constructors]``,
``[ allow closing ] or ]` or ]] which is not a constructors end ]``,
``[ allow standalone ` or `[  or `` which is not a interpolation start]``,
``[ allow standalone { or {` or {{ or {[ which is not a interpolation start  ]``,
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
]``
