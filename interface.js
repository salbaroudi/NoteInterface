
 //This structure is used to control what is displayed in our gui.
  var hidelists = {
    add: {"modeoptsinputs":0,"displaymodeopts":0,"addtextblobs":1},
    display: {"modeoptsinputs":1,"displaymodeopts":1,"addtextblobs":0},
    relation: {"modeoptsinputs":0,"displaymodeopts":0,"addtextblobs":0}
  };

  //State object to keep track of current state, and differences.
    var modestate = {
      curr: [0,0,0],
      diff: [0,0,0]
    };

    //For the random option
    var othoptstate = {
      curr: [0,0],
      diff: [0,0]
    };

    //Keeps track of what set operations the user has chosen, before submit request.
    var setoptstate = {
      curr: [0,0,0],
      diff: [0,0,0]
    };

    //Signature:Array[Int] -> Void
    //Purpose: Given a state array, toggle what needs to be shown.
    function hideToggle(hideArr) {
      for (key in hideArr) {
        if (hideArr[key] == 0) {
          $("#" + key).addClass("hide");
        } else {
          $("#" + key).removeClass("hide");
        }
      }
      return;
    }

    //Signature: Array -> String
    //Purpose: Stringify an array for quick comparison.
    function compArr(arrA, arrB) {
      return (JSON.stringify(arrA) == JSON.stringify(arrB));
    }

    //Signature: String Int -> Void
    //Purpose: Given an ID name and switch, toggle the UI option. Works for many different
    //Components
    function optionToggle(refName, isOn) {
      if(isOn == 1) {$("#" + refName).addClass("operateon");}
      else if (isOn == 0) {$("#" + refName).removeClass("operateon");}
      return;
    }

    //Signature: String -> Void
    // Purpose: When one of the two mode buttons is clicked,
    // we check to see if a valid state transition has occured,
    // update the data structure and then change the UI to reflect this.
    function addClickMode(refName) {
      $(("#" + refName)).click(function(ev) {
        //First, figure out what button was clicked.
        if (refName == "addmode") {
          modestate.diff = [1,0,0];
          hideToggle(hidelists.add);
        }
        else if (refName == "displaymode") {
          modestate.diff = [0,1,0];
          hideToggle(hidelists.display);
        }
        else if (refName == "relationmode") {
          modestate.diff = [0,0,1];
          hideToggle(hidelists.relation);
        }
        //Next, check state transition cases.
        if (compArr(modestate.curr,modestate.diff)) {
          modestate.curr = [0,0,0]; //same; cancel out settings.
        } else { //We can only have one button active at a time!
          modestate.curr = modestate.diff;
        }
        modestate.diff = [0,0,0]; //always reset!
        optionToggle("addmode", modestate.curr[0]);
        optionToggle("displaymode", modestate.curr[1]);
        optionToggle("relationmode", modestate.curr[2]);
        return;
      });
    }
    //Signature: String -> Void
    //Purpose: This controls our state of Operation Display Mode Options.
    function addClickSetOps(refName) {
      //What element was clicked?
      $(("#" + refName)).click(function(ev) {
        if (refName == "intersectopt") {
          setoptstate.diff = [1,0,0];
        }
        else if (refName == "unionopt") {
          setoptstate.diff = [0,1,0];
        }
        else if (refName == "diffopt") {
          setoptstate.diff = [0,0,1];
        }
        if (compArr(setoptstate.curr,setoptstate.diff)) {
          setoptstate.curr = [0,0,0]; //same; cancel out settings.
        } else {
          setoptstate.curr = setoptstate.diff;
        }
        setoptstate.diff = [0,0,0]; //always reset!
        optionToggle("intersectopt", setoptstate.curr[0]);
        optionToggle("unionopt", setoptstate.curr[1]);
        optionToggle("diffopt", setoptstate.curr[2]);
        ogeSetOpstoRand();
        return;
      });
    }
    //Signature: String -> Void
    //
    function addClickOthOp(refName) {
      $(("#" + refName)).click(function(ev) {
        if (refName == "randomopt") {
          othoptstate.diff = [1,0];
        }
        else { //By deduction.
          othoptstate.diff = [0,1];
        }

        if (compArr(othoptstate.curr,othoptstate.diff)) {
          othoptstate.curr = [0,0]; //same; cancel out settings.
        } else {
          othoptstate.curr = othoptstate.diff;
        }
        othoptstate.diff = [0,0]; //always reset!
        optionToggle("randomopt", othoptstate.curr[0]);
        optionToggle("timeopt", othoptstate.curr[1]);
        ogeRandtoSetOps();
        return;
      });
    }

    //Signature: Void -> Void
    //Purpose: If Random or Time button is toggled, the set ops buttons need to be turned off.
    //OGE stands for Other Group Effect; the set op buttons are in a separate "group"
    function ogeRandtoSetOps() {
      setoptstate.curr = [0,0,0];
      optionToggle("intersectopt", setoptstate.curr[0]);
      optionToggle("unionopt", setoptstate.curr[1]);
      optionToggle("diffopt", setoptstate.curr[2]);
      return
    }
    //Signature: None
    //Other Group effect: when the state of one group affects another.
    //Here, clicking the Random Button turns off our Set Operation Buttons.
    function ogeSetOpstoRand() {
      othoptstate.curr = [0,0];
      optionToggle("randomopt", othoptstate.curr[0]);
      optionToggle("timeopt", othoptstate.curr[1]);
    }

    var mouseadd = function() {
        $(this).addClass("pointer");
        if (!$(this).hasClass("operateon")) {
          $(this).addClass("hoverhighlight");
        }
      };

    var mouseremove = function() {
      $(this).removeClass("pointer");
      $(this).removeClass("hoverhighlight");
    };

    function addMouseOver(refName) {
      $(("#" + refName)).mouseenter(mouseadd);
      $(("#" + refName)).mouseleave(mouseremove);
    }

    //Prep all of our listeners.
    $(document).ready(function(){
        $("#newtbopt").click(generateTextBlob);
        addMouseOver("addmode");
        addMouseOver("displaymode");
        addMouseOver("relationmode");
        addMouseOver("randomopt");
        addMouseOver("timeopt")
        addMouseOver("intersectopt");
        addMouseOver("unionopt");
        addMouseOver("diffopt");
        addMouseOver("submitpush");
        addMouseOver("submitpull");
        addMouseOver("textonlyopt");
        addMouseOver("newtbopt");
        addClickMode("addmode");
        addClickMode("displaymode");
        addClickMode("relationmode");
        addClickSetOps("intersectopt");
        addClickSetOps("unionopt");
        addClickSetOps("diffopt");
        addClickOthOp("randomopt");
        addClickOthOp("timeopt");
        hideToggle(hidelists.add);
    });
