/**
 * Created by Administrator on 21.10.2014.
 */



//return an array of values that match on a certain key
//Moved your array otherwise it will be overwritten every time you call function1
var community = []
function getValuesCommunity(obj, key) {
    for (var i in obj) {
        //to avoid iterating over unnecesry keys use .hasownproperty
        if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                getValuesCommunity(obj[i], key);
            }
         }
        if (i == key) {
            if (typeof obj[i].slice(1) != "undefined") {
                community.push(obj[i]);
            }
        }
        return community;
    }






//http://techslides.com/how-to-parse-and-search-json-in-javascript/
// split the string array into corresponding constituent
function SplitFxn() {
    community2 = community2.split("/");
    return community2
}

var all1=[]
for (var i in array1){
    all1 = all1.concat(array1[i].substring(1));
//alert(all1);
}

var all2=[]
for (var i in array2){
    all2 = all2.concat(array2[i].substring(1));
//alert(all2);
}

countSimilarity = all1.filter(function (el) {
    return all2.indexOf(el) != -1
});

alert(countSimilarity)