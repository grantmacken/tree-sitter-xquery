xquery version "3.1";
module namespace newBase60  = "http://gmack.nz/#newBase60";
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
:)

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

declare
function newBase60:getFullYear(){
  xs:date(current-dateTime()) => year-from-date()
};

declare
function newBase60:dateToInteger( $dateTime as xs:dateTime) as xs:integer{
try {
let $date := $dateTime cast as xs:date
  return (
  format-date(xs:date($date),"[Y01][d]") cast as xs:integer
  )
  } catch * { () }
};

