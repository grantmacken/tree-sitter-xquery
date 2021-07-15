(
 '3.13 Ordered and Unordered Expressions', 
unordered {
  for $p in fn:doc("parts.xml")/parts/part[color = "Red"],
      $s in fn:doc("suppliers.xml")/suppliers/supplier
  where $p/suppno = $s/suppno
  return
    <ps>
       { $p/partno, $s/suppno }
    </ps>
}
 )


