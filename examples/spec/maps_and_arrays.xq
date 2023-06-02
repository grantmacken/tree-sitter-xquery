'3.11 Maps and Arrays',
'3.11.1 Maps',
map {
  "Su" : "Sunday",
  "Mo" : "Monday",
  "Tu" : "Tuesday",
  "We" : "Wednesday",
  "Th" : "Thursday",
  "Fr" : "Friday",
  "Sa" : "Saturday"
},
  map {
    "book": map {
        "title": "Data on the Web",
        "year": 2000,
        "author": [
            map {
                "last": "Abiteboul",
                "first": "Serge"
            },
            map {
                "last": "Buneman",
                "first": "Peter"
            },
            map {
                "last": "Suciu",
                "first": "Dan"
            }
        ],
        "publisher": "Morgan Kaufmann Publishers",
        "price": 39.95
    }
},
'3.11.1.2 Map Lookup using Function Call Syntax',
$weekdays("Su"),
$books("Green Eggs and Ham"),
$b("book")("title"),
$b("book")("author")(1)("last"),
'3.11.2 Arrays',
[ 1, 2, 5, 7 ],
[ (), (27, 17, 0)],
[ $x, local:items(), <tautology>It is what it is.</tautology> ],
array { $x },
array { local:items() },
array { 1, 2, 5, 7 },
array { (), (27, 17, 0) },
array { $x, local:items(), <tautology>It is what it is.</tautology> },
'3.11.2.2 Array Lookup using Function Call Syntax',
'TODO! says path expr, should be a function call',
[ 1, 2, 5, 7 ](4),
'3.11.3 The Lookup Operator ("?") for Maps and Arrays',
?name,
?2,
?("$funky / <looking @string"),
?($a),
?(2 to 4),
[1, 2, 5, 7]?*,
[[1, 2, 3], [4, 5, 6]]?*,
'3.11.3.2 Postfix Lookup',
map { "first" : "Jenna", "last" : "Scott" }?first,
[4, 5, 6]?2,
(map {"first": "Tom"}, map {"first": "Dick"}, map {"first": "Harry"})?first,
([1,2,3], [4,5,6])?2
