for $p in $products
order by $p/sales descending
count $rank
where $rank <= 3
return
  <product rank="{$rank}">
    {$p/name, $p/sales}
  </product>

