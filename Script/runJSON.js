<script>

//http://techslides.com/how-to-parse-and-search-json-in-javascript/

//return an array of values that match on a certain key
function getValuesCommunity(obj, key) {
    var community = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            community = community.concat(getValuesCommunity(obj[i], key));
        } else if (i == key) {
            community.push(obj[i]);
        }
    }
    return community;
}



// split the string array into corresponding constituent
function SplitFxn(compoundStr) {    
    var parts = compoundStr.split("/");
    return parts
}


var ACTIVITIES = 
{"games":
    [
       {"Definition1":
         [
           {"SPORTS" : "SPORTS"},
           {"PHYSICAL SPORTS" : "SPORTS/PHYSICAL SPORTS"},
           {"MENTAL SPORTS" : "SPORTS/MENTAL SPORTS"},
           {"COMPUTER GAMES" : "SPORTS/COMPUTER GAMES"}
         ]
       },
       {"Definition2":
         [
           {"SPORTS" : "SPORTS"},
           {"name" : "article2"}
         ]
       }
    ]
};

var partition=getValuesCommunity(ACTIVITIES, "PHYSICAL SPORTS")

http://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute
var start = window.performance.now();
//do something
x=1
var end = window.performance.now();
var dur = end - start;
alert('It took ' + dur + ' ms.');


mmm=["yy/zz"]
partition = SplitFxn(partition[0])
alert (partition)
//document.getElementById("demo").innerHTML = st2;


</script>
</body>
</html>