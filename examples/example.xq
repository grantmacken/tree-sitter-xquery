let $f := function ($seq, $delim) { fn:fold-left($seq, "", fn:concat(?, $delim, ?)) },
    $paf := $f(?, ".")
return $paf(1 to 5)




