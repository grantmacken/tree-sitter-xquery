'3.12.4 Window Clause',
'3.12.4.1 Tumbling Windows',
for tumbling window $w in (2, 4, 6, 8, 10, 12, 14)
    start at $s when fn:true()
    only end at $e when $e - $s eq 2
return <window>{ $w }</window>, 
'3.12.4.2 Sliding Windows', 
for sliding window $w in (2, 4, 6, 8, 10, 12, 14)
    start at $s when fn:true()
    only end at $e when $e - $s eq 2
return avg($w)
