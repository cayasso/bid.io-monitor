var countyListArray = new Array(); // the array to hold county list
counter = 0; 
var newRow = ""; // row to be inserted
var key = ""; //this is the index in the county array
var states = new Array("Active", "Pending", "Completed", "Inactive", "Unknown"); //this is the string value for states 
$.getJSON("data/channels.json", function(counties) { ///let's make a json request
    //channelList = counties; // and put it in a chanelList -- and then never use it again :)
    color = "white"; //default color for display text
    for (var key in counties) { 
        if (key != 0) { // we don't process "All" in county list 0=> All
            countyName = counties[key];
            console.log("subscribed to:", key)
            countyListArray[key] = bio.join(key);
            countyListArray[key].watch(function(data, action) {
            console.log('WATCHING: ', action, data);
                if (action == "fetch") {
                    color = "grey";
                } else if (action == "error") {
                    color = "red";
                } else if (action == "lock") {
                    color = "cyan";
                } else if (action == "complete") {
                    color = "green";
                }
                counter++;
                
                if (action !== "error") {
                    try {
                        owner_name = data.owner.name;
                        owner_id = data.owner.id;
                    } catch (Ex) {
                        owner_name = "-";
                        owner_id = "-";
                    }
                    newRow = "<tr id=\"tr" + counter + "\">";
                    newRow += "<td><font color='" + color + "'>" + action + "&nbsp;</color></td>";
                    newRow += "<td>" + counties[data.county] + "&nbsp;</td>";
                    var stateString="";
                    if(typeof data.state !== "undefined") {
                        //protect state from showing undefined
                        stateString = states[data.state];
                    
                    }
                    newRow += "<td>" + stateString + "&nbsp;</td>";
                    newRow += "<td>" + owner_name + "&nbsp;</td>";
                    newRow += "<td>" + owner_id + "</td>";
                    newRow += "</tr>";
                $('#actionList tr:first').after(newRow);
                $('#tr' + counter + '').effect("highlight", {color: color}, 2000); 
                }
            });
        }//if key not 0
    }// freaking long foreach on the bids object (counties in reality) ;)
});//json init --- async !!!!
/*
 * make connection to the remote
 */
bio = bio(io, 'http://' + window.location.hostname + ':3000');
var socket = bio.connect();
socket.on('connect', function() {
    //we removed it as it wasn't needed I leave it here for reference
    //$('#connection').html('<font color=green>connected</font>');
});
/*
 * Remove range from array
 */
Array.prototype.remove = function(from, to) { 
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
//end