        var countyListArray = new Array(); 
        counter=0;
        var newRow="";
        var key="";
        counter = 0;
        var states=new Array("Active","Pending","Completed","Inactive","Unknown");
        $.getJSON("data/channels.json", function(counties) {
        channelList = counties;
        color="white";
        for (var key in counties) {
            //key=counties[oldKey];
            if (key != 0) {
                //console.log(data[key];
                countyName=counties[key];
                console.log("subscribed to:",key)
                countyListArray[key] = bio.join(key);
                countyListArray[key].watch(function(data, action) {
                console.log('WATCHING: ', action, data,key);

                    if (action == "fetch") {
                     color="grey";
                     } else if(action == "error") {
                       color="red";
                    } else if(action == "lock") {
                        color="cyan";
                    } else if (action == "complete") {
                        color="green";
                    }
        counter++;
        if(action == "error") {
            newRow="<tr id=\"tr"+counter+"\">"; 
            newRow+="<td><font color='"+color+"'>"+action+"&nbsp;</color></td>"; 
            newRow+="<td  colspan=\"7\">"+data.message+"&nbsp;</td>"; 
            newRow+="</tr>";
        } else {
            try {   
                owner_name=data.owner.name;
                owner_id  =data.owner.id;
             }catch(Ex){
                owner_name="-";
                owner_id  ="-";
             }
            newRow="<tr id=\"tr"+counter+"\">"; 
            newRow+="<td><font color='"+color+"'>"+action+"&nbsp;</color></td>"; 
            newRow+="<td>"+counties[data.county]+"&nbsp;</td>"; 
            newRow+="<td>"+countyName+"</td>";
            //newRow+="<td>"+key+"&nbsp;</td>"; 
            //newRow+="<td>"+data.id+"&nbsp;</td>"; 
            //newRow+="<td>"+data.description+"&nbsp;</td>"; // apparently this data doesn't exist
            newRow+="<td>"+states[data.state]+"&nbsp;</td>"; 
            newRow+="<td>"+owner_name+"&nbsp;</td>"; 
            newRow+="<td>"+owner_id+"</td>"; 
            newRow+="</tr>"; 
        }
                    
                 
                 $('#actionList tr:first').after(newRow);
                 $('#tr'+counter+'').effect("highlight", { color: color},2000);
                });

               

            }//if key not 0
        }// freaking long foreach on the bids objec (counties in reality) ;)
        
        });//json init --- async !!!!

        bio = bio(io, 'http://' + window.location.hostname + ':3000');
        var socket = bio.connect();
        socket.on('connect', function() {
            $('#connection').html('<font color=green>connected</font>');
        });

        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
        function keyPress(){
            //not at this time :O
        }
