var Item = require("../models/item");

var allItems=[];


function getMatches(item,queries){
    var mTitles = 0;
    var mTags = 0;
    var mDescription = 0;
    var mCategory = 0;
    var mSubcatogory = 0;
    queries.forEach(function(q){
        q = q.toLowerCase();
        mTitles += item.title.toLowerCase().indexOf(q)>=0 ? 1 : 0;
        mTags += item.tags.join(" ").toLowerCase().split(q).length - 1;
        mCategory += item.category.toLowerCase().indexOf(q)>=0 ? 1 : 0;
        mSubcatogory += item.subcategory.toLowerCase().indexOf(q)>=0 ? 1 : 0;
        mDescription += item.description.toLowerCase().split(q).length - 1;
    });
    return mTitles*10 + mTags*5 + mCategory*5 + mSubcatogory*5 + mDescription;
}

module.exports = function(q){
    var matchingItems = [];
    var queries = q.split(" ");

    allItems.forEach(function(item){
        var score = getMatches(item,queries);
        console.log(score);
        if(score==0)return;
        item.score = score;
        if(matchingItems.length==0){
            return matchingItems.push(item);
        }
        var i = 0;
        while(i<matchingItems.length && matchingItems[i].score >= score ){
            i++;
        }
        if(i==matchingItems.length){
            console.log("inserting last");
            return matchingItems.push(item);
        }
        var j=i+1;
        matchingItems.push(matchingItems[matchingItems.length-1]);
        for(var j=matchingItems.length-2;j>i;j--){
            matchingItems[j] = matchingItems[j-1];
        }
        matchingItems[i] = item;
        console.log("inserting :: "+i);
    });
    return matchingItems;
}

setInterval(function(){
    Item.find({}).populate("seller").exec(function(err,items){
        if(!err){
            allItems = items;
        }
    });
},1000);
