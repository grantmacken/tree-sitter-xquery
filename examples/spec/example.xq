'stable order by',
'zero-or-one($b/location) ascending empty greatest',
'3.12.6 Count Clause descending',
for $p in $products
order by $p/sales ascending empty greatest
return ()
