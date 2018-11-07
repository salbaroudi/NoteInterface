//Signature: Object[?] -> String
//Purpose: We take the implicit arguements Object
//local to our function's scope, and pass it to
//this function.
function ppargs(theArgs) {
  return (JSON.stringify(arguments["0"],null,2));
}

//Signature AssocArray -> String
//Purpose: We use this function to look at a functions implicit Arguments
//Object, and print everything out. Useful if our APIs are implicit, or not
//well documented.

function diagargs(args) {
  let objStr = ppargs(args);
  $("#diagbox").append(objStr);
}

//Signature Object -> String
//Purpose: Used to look at predefined object fields
//Again, APIs can be scattered or unclear. This is helpful for exploration
//and debugging.
function diagobj(theObj){
  let objStr = ppargs(theObj);
  $("#diagbox").append(objStr);
}

var myvar = {"tb1":{"text":"This is my text",
        "tags":["Tag3","Tag2","Tag1"]},
 "tb2":{"text":"Some more text",
        "tags":["Reminders"]},
 "tb3":{"text":"Go shopping...",
        "tags":["Car Stuff", "Reminders"]},
 "tb4":{"text":"Tyrosine and Sulfurophane",
                "tags":["Inflammation","Nootropics"],
 "tb5":{"text":"to be preserved. We don't exactly have the luxury of using <pre> tags, do we?",
        "tags":["MetaRefExample","DevelopmentNotes"]}}};

//Signature: String -> Array[String]
//Purpose: JSON can't store formatted strings easily (from what I could see)
//We split on NL, and make an array of strings to be rebuilt later.
//Idea comes from: https://www.gun.io/blog/multi-line-strings-in-json
function splitnewline() {
  return;
}

//Signature: Void -> String[JSON]
//Purpose: Purpose: Figure out what state our UI is in, and then
//Encode relevent information into a JSON object, to be sent to Node.
function getcurrstate() {
  if (modestate.curr[0] == 1) {
    prepaddreq();
  }
  else if (modestate.curr[1] == 1) {
    prepdisplayreq();
  }
  else if (modestate.curr[2] == 1) {
    return; //Relation mode not implemented in this version.
  }
  else {
    console.log("ERROR: getcurrstate()");
  }
}

//Signature: Void -> String[JSON]
//Purpose: If in add mode, grab all tblobs and tags, and form a JSON string.
function prepaddreq() {
  var superJSONObj = {};

  $("div[id^='tb']").each(function(index) { //for each text blob box...
    var subObj = {};
    var text = ($(this).find("textarea[id^='ta']").prop("value"));
    var textArr = (text.split("\n")).filter(q => q !== "");
    subObj[$(this).prop("id")] = textArr;
    var tagArray = [];
    $(this).find("span[id^='stag']").each(function(index) {
      tagArray.push( $(this).text());
      subObj["tags"] = tagArray;
    });
    superJSONObj[$(this).prop("id")] = subObj;
  });

  diagobj(superJSONObj);
  return superJSONObj;
}

//Signature: Void -> String[JSON]
//Purpose: Purpose: If in display mode, encode request with JSON string.
function prepdisplayreq() {
  var prepJSON = {};
  prepJSON["mode"]="display";
  var foundOp = "";
  if (setoptstate.curr[0] == 1) {
    foundOp = "intersect";
  }
  else if (setoptstate.curr[1] == 1) {
    foundOp = "union";
  }
  else if (setoptstate.curr[2] == 1) {
    foundOp = "difference";
  }
  else if (othoptstate.curr[0] == 1) {
    foundOp = "random";
  }
  else if (othoptstate.curr[1] == 1) {
    foundOp = "time";
  }
  else {
    console.log("ERROR: prepdisplayreq()");
  }

  prepJSON["op"]=foundOp;

  var inputText = $("#inputtext").prop("value");
  prepJSON["opargs"] = inputText.split(" ");

  diagobj(prepJSON);
  return;
}

//Prep all of our listeners.
$(document).ready(function(){
    $("#submitpull").on("click", prepdisplayreq);
    $("#submitpush").on("click", prepaddreq);

});
