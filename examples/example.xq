
xquery version "3.1";
module namespace newBase60  = "http://markup.nz/#newBase60";
(:~
: The <b>newBase60</b> library provides function for handling 
: dates and times to and from 'New Base 60' aka newBase60
: 
: based on a date-time stamp as xs:dateTime
: 1. Date: year-month-day will convert to and from 3 chars
: 2. Time: hours:minutes:seconds will convert to and from 3 chars
: 
: the newBase60 conversion can be used to name and archive documents.
: This would be suitable for archiving blog posts.
: A simple wait/sleep could be used the prevent duplicates, 
: if more than one post per second
: 
:)

declare variable  $newBase60:chars := 
         ["0","1","2","3","4","5","6","7","8","9",
          "A","B","C","D","E","F","G","H","J","K",
          "L","M","N","P","Q","R","S","T","U","V",
          "W","X","Y","Z","_","a","b","c","d","e",
          "f","g","h","i","j","k","m","n","o","p",
          "q","r","s","t","u","v","w","x","y","z"];

declare variable $newBase60:base := array:size($newBase60:chars);

(:~
show what lib can do in example
:)
declare
function newBase60:example() as xs:string*{
 let $nl := "&#10;"
 let $dateTime := current-dateTime() => adjust-dateTime-to-timezone(xs:dayTimeDuration('PT13H'))
 let $iDate := $dateTime => newBase60:dateToInteger()
 let $bDate :=  $dateTime => newBase60:dateToInteger() => newBase60:encode()
 let $bDateDecoded :=  $bDate =>  newBase60:decode()
 let $dtDate :=  $bDate =>  newBase60:decode() => newBase60:integerToDate()
 let $iTime := $dateTime => newBase60:timeToInteger()
 let $bTime := $dateTime => newBase60:timeToInteger() =>  newBase60:encode()
 let $bTimeDecoded :=  $bTime =>  newBase60:decode()
 let $dtTime := $bTime  =>  newBase60:decode() => newBase60:integerToTime()
 let $dtStamp := concat( string($bDate) , string($bTime) )
 return
  (
  ' - local current dateTime: ' || string($dateTime) ,$nl,
  ' - current date  : [ ' ||  string($dateTime cast as xs:date )|| ' ] ',$nl,
  ' - from date to integer:  [' || string($iDate) || ' ] ' ,$nl,
  ' - from integer to base60:[ ' ||  string($bDate)|| ' ] ',$nl,
  ' - from base60 to integer:[ ' ||  string($bDateDecoded)|| ' ] ',$nl,
  ' - from integer to date : [ ' ||  string($dtDate)|| ' ] ',$nl,
  ' - - - - - - - - - - - - - - - - - - - - - - - - ',$nl,
  ' - current time  : [ ' ||  string($dateTime cast as xs:time )|| ' ] ',$nl,
  ' - from time to integer: [' || string($iTime) || ' ] ' ,$nl,
  ' - from integer to base60:[ ' ||  string($bTime) || ' ] ',$nl,
  ' - from base60 to integer:[ ' ||  string($bTimeDecoded)|| ' ] ',$nl,
  ' - from integer to time : [ ' ||  string($dtTime)|| ' ] ',$nl,
  ' - - - - - - - - - - - - - - - - - - - - - - - - ',$nl,
  ' - 6 char date-time stamp: [ ' ||  string($dtStamp) || ' ] ',$nl,
  $nl
  )
};

declare
function newBase60:getFullYear(){
  xs:date(current-dateTime()) => year-from-date()
};

declare
function newBase60:getFullYear( $dateTime as xs:dateTime ){
 xs:date($dateTime) => year-from-date()
};

(:~
convert dateTime converted to an integer consisting of
a short date year + ordinal days in year
@param $dateTime xs:dateTime
@return represents a short date year + ordinal days in year
:)
declare
function newBase60:dateToInteger( $dateTime as xs:dateTime) as xs:integer{
try {
let $date := $dateTime cast as xs:date
  return (
  format-date(xs:date($date),"[Y01][d]") cast as xs:integer
  )
  } catch * {
    util:log-system-out(   'ERR:' || $err:code || ': '  || $err:description)
   }
};


(:~
convert dateTime to integer representing time as 
number of seconds from days start
@param $dateTime as xs:dateTime
@return xs:integer representing time as seconds from days start
:)
declare
function newBase60:timeToInteger( $dateTime as xs:dateTime) as xs:integer{
let $time := $dateTime cast as xs:time
let $hours :=    hours-from-dateTime($dateTime)
let $minutes :=  minutes-from-dateTime($dateTime)
let $seconds :=  floor(seconds-from-dateTime($dateTime))
let $totSecs := (xs:integer($hours) * 60 * 60) + (xs:integer($minutes) * 60) + xs:integer($seconds) 
return
xs:integer((xs:integer($hours) * 60 * 60) + (xs:integer($minutes) * 60) + xs:integer($seconds))
};

(:~
from a time or date represented as an integer encode as a base60 string
@param $n as xs:integer
@return a base60 encoded string 
:)
declare
function newBase60:encode($n as xs:integer) as xs:string {
let $getRemainder := function( $n as xs:integer ){($n mod xs:integer($newBase60:base))}
let $getChar := function($n){$newBase60:chars => array:get(xs:integer($getRemainder($n) + 1))}
let $nextN   := function($n as xs:integer){
    ($n - xs:integer($getRemainder($n))) div $newBase60:base
    }
return
   ($getChar($n => $nextN() => $nextN()),
    $getChar($n => $nextN()), 
    $getChar($n)) => string-join('')
};

(:~
from a newBase60 decode into a time or date represented as an integer
@param $nb60 as xs:string encoded date or time
@return decoded a time or date represented as an integer
:)
declare 
function newBase60:decode($nb60 as xs:string ){
 let $nl := "&#10;"
 let $decode := 
    function( $codePoint ){
   let $c := xs:integer($codePoint)
   return
           if ($c >= 48 and $c <= 57 ) then ($c - 48)
     else if ($c >= 65 and $c <= 72 ) then ($c - 55)
     else if ($c eq 73 or $c eq 108 ) then (1)
     else if ($c >= 74 and $c <= 78 ) then ($c - 56)
     else if ($c eq 79 ) then (0)
     else if ($c >= 80 and $c <= 90 ) then ($c - 57)
     else if ($c eq 95 ) then (34)
     else if ($c >= 97 and $c <= 107 ) then ($c - 62)
     else if ($c >= 109 and $c <= 122 ) then ($c - 63)
     else(0)
     } 
  let $seq := for $cp in string-to-codepoints($nb60)
              return $cp => $decode()
return
fold-left($seq,0,
          function($seed, 
                   $current){
                      ($newBase60:base * $seed) + $current
                    }
          )
 };

(:~
convert a decoded short date integer into xs:date
@param  $decoded as xs:integer
@return a xs:date [yyyy-mm-dd]
:)
declare
function newBase60:integerToDate( $decoded as xs:integer ) as xs:date {
  let $yr := '20' || substring($decoded, 1, 2)
  let $yrStart := xs:date($yr || string('-01-01'))
  let $dysInYr := substring($decoded, 3, 5)
  let $duration := xs:dayTimeDuration("P" || string(xs:integer($dysInYr)- 1)  || "D")
  let $decodedDate := xs:date($yrStart + $duration)
  let $formatedDate := format-date($decodedDate, "[Y0001]-[M01]-[D01]", 'en', (), ())
  return
  xs:date($yrStart + $duration)
};

(:~
convert a decoded time integer into xs:time
@param  $decoded as xs:integer
@return a xs:time [hh-mm-ss]
:)
declare
function newBase60:integerToTime( $decoded as xs:integer) as xs:time{
  try {
  let $log := util:log-system-out('INFO:' || $decoded  )
  let $duration := xs:dayTimeDuration("PT" || string(xs:integer($decoded))  || "S")
  let $log := util:log-system-out('INFO:' || $duration  )
  let $tStart := xs:time(string('00:00:00'))
  return
  xs:time($tStart + $duration)
  } catch * {
    util:log-system-out(   'ERR:' || $err:code || ': '  || $err:description)
   }
 };


