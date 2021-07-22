(
try {
    $x cast as xs:integer
}
catch * {
    0
},
try {
    $x cast as xs:integer
}
catch err:FORG0001 {
    0
},
try {
    $x cast as xs:integer
}
catch err:FORG0001 | err:XPTY0004 {
    0
},
try {
    fn:error(fn:QName('http://www.w3.org/2005/xqt-errors', 'err:FOER0000'))
}
catch * {
    $err:code, $err:value, " module: ",
    $err:module, "(", $err:line-number, ",", $err:column-number, ")"
}
)


