import schema namespace geometry = "http://example.org/geo-schema-declarations"; 
import module namespace geo = "http://example.org/geo-functions"; 
declare variable $t as geometry:triangle := geo:make-triangle(); 
$t
