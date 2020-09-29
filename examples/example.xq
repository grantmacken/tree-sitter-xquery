xquery version "3.1";
module namespace newBase60  = "http://gmack.nz/#newBase60";

declare variable  $newBase60:chars := 
    ["0","1","2","3","4","5","6","7","8","9",
    "A","B","C","D","E","F","G","H","J","K",
    "L","M","N","P","Q","R","S","T","U","V",
    "W","X","Y","Z","_","a","b","c","d","e",
    "f","g","h","i","j","k","m","n","o","p",
    "q","r","s","t","u","v","w","x","y","z"];

declare 
variable $newBase60:base as xs:integer := 
         array:size($newBase60:chars);



