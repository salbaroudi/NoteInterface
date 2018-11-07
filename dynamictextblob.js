
//Purpose: We have a singleton state object that iterates dynamic IDs;
//we call this, and then update it everytime a new object is made.
var dynamID = {
  currID:0,
  //Method: CurrID++
  //Method: reset currID property to zero.
}

//Signature: Void -> Int
//Purpose: Update dynamID by one, and return an ID to a generating function.
function idUpdate(){
  dynamID.currID = dynamID.currID + 1;
  return (dynamID.currID - 1);
}

//Signature: Void -> AddModeState Object.
//Purpose: This is our object constructor for the Add Mode; we produce a Singleton Object.
function AddModeState() {
  this.numTextBlobs = 0;
  this.textBlobList = [];
  //Object method.
  this.addTB = function (tbID) {this.textBlobList.push(tbID);}
}

//Signature: Void -> DisplayModeState Object
//Purpose: For Display mode, this is our singleton state object. Its values are updated
//as the user inputs information.
function DisplayModeState() {
  this.randOpt = false;
  this.allTags = false;
  this.intersectOp = false;
  this.unionOp = false;
  this.diffOp = false;
  this.tagSearchList = [];
  this.limit = -1;
}

//Signature: String Int Boolean -> Tag Object.
//Purpose: Our "Blueprint" Constructor for tags.
//Tags are not used in a mutable way. They can be deleted in entirety, though.
function Tag(label,id,created) {
  this.label = label;
  this.id = id;
  this.created = created;
}

//Signature: Int, Int(Date) List(Tag Objects) String -> TextBlob Objects.
//Purpose: This represents an actual textblob; these may be specified by the
//user (ADD mode), or generated from a Pull Request (DISPLAY mode).
function TextBlob(id, gettime_date, taglist, textblob) {
  this.id = id;
  this.date = gettime_date;
  this.archive = false;
  this.taglist = taglist;
  this.tblob = textblob;
}

//Lets make our global state structures:

var addModeObj = new AddModeState();

//We implement the GUI support for dyanmic textblobs. This is just the addtextblob.html
//refactored into our current interface code.

//Signature: None
//Purpose: This function is called when a user blurs() a tag box, after entering input.
function processTagInput() {
  idIndex = idUpdate();
  var usertext = $(this).prop("value");
  $(this).hide();
  var spoint = jQuery("<span/>", {
      id: "stag" + idIndex,
      class: "all",
      html: usertext,
  });
  $(this).parent().prepend(spoint);
}

//Signature: None.
//Purpose: This function is called when a user clicks the new tag button in a textBlob box.
function addTag() {
  idIndex = idUpdate();
  let tagpointId = "tag" + idIndex;
  var tagpoint = jQuery("<div/>", {
    id: tagpointId,
    class: "all tagshared tagcont",
  });

  let inputId = "i" + idIndex;
  var inputpoint = jQuery("<input/>", {
    id: inputId,
    class: "all ibox",
    value: "...",
  });

  var buttonpoint = jQuery("<span/>", {
    id: "b" + idIndex,
    class: "all",
    html: "&otimes;",
  });

    $(this).parent().prepend(tagpoint);

    $("#" + tagpointId).append(inputpoint);
    $("#" + tagpointId).append(buttonpoint);
    $("#" + inputId).on("blur", processTagInput);
}

//Signature: None
//Purpose: This generates a new textblob, dynamically (for ADD Mode)
function generateTextBlob() {
  var idIndex = idUpdate();
  let tbId = "tb" + idIndex;
  //Generate Outer box: all, containshared outcontain
  var tblobbox = jQuery("<div/>", {
    id: tbId,
    class: "all tboxcontain",
  });

  var txtbox = jQuery("<textarea/>", {
    id: "ta" + idIndex,
    class: "all textbox",
    value: "An Input Textbox.",
  });

  let tagboxId = "outtb" + idIndex;
  var tagboxout = jQuery("<div/>", {
    id: tagboxId,
    class: "all tagshared parenttagcont",
    value: "",
  });

  var oplusId = "b" + idIndex;
  var buttonpoint = jQuery("<span/>", {
    id: oplusId,
    class: "all tagshared plusbutton",
    html: "&oplus;",
  });

  //We need to add tbId to our AddView DataStructure:
  addModeObj.addTB(tbId);

  $("body").append(tblobbox);
  $("#" + tbId).append(txtbox);
  $("#" + tbId).append(tagboxout);
  $("#" + tagboxId).append(buttonpoint);
  $("#" + oplusId).on("click", addTag);
  addMouseOver((oplusId));
}
