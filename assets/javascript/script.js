// Initialize Firebase
var config = {
	apiKey: "AIzaSyAVMPyiurr7zOrLmpdgr523XjWSh91m5Mo",
	authDomain: "trainscheduler-338d4.firebaseapp.com",
	databaseURL: "https://trainscheduler-338d4.firebaseio.com",
	storageBucket: "trainscheduler-338d4.appspot.com",
	messagingSenderId: "325529871248"
};

firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function(snapshot) {


	if ( ( snapshot.child("Train_Name").exists() ) && (snapshot.child("Train_Destination").exists()) && (snapshot.child("Train_Frequency").exists()) && (snapshot.child("Next_Arrival").exists()) && (snapshot.child("Minutes_Away").exists())){

		var trainName = snapshot.val().Train_Name;
		
		var trainDestination = snapshot.val().Train_Destination;
		
		var trainFrequency = snapshot.val().Train_Frequency;
		
		var nextarrival = snapshot.val().Next_Arrival;

		var minutesaway = snapshot.val().Minutes_Away;

		var newRow = $("<tr>");
		var newName = $("<td>");
		var newDest = $("<td>");
		var newFreq = $("<td>");
		var newArrival = $("<td>");
		var newMins = $("<td>");

		newName.text(trainName);
		newDest.text(trainDestination);
		newFreq.text(trainFrequency);
		newArrival.text(nextarrival);
		newMins.text(minutesaway);

		newRow.append(newName, newDest, newFreq, newArrival, newMins);

		$("#train-table").append(newRow);
	}
	

}, function(errorObject) {

  console.log("The read failed: " + errorObject.code);

});

$(document).on("click", "#submit-btn", function(event){

	event.preventDefault();

	var name = $("#train-name").val().trim();
	var destination = $("#train-destination").val().trim();
	var frequency = $("#train-frequency").val().trim();
	var firstTime = $("#first-time").val().trim();
	var nextArrival;
	var minutesAway;


	var now = moment(new Date());
	now = moment(now, "YYYY-MM-DD HH:mm");
	
	var end = moment(firstTime, "HH:mm");
	end = moment(end, "YYYY-MM-DD HH:mm")

	if ( now < end ) {

		var halfs = 0;

		for (var i=0;i<100;i++){
			
			var now = moment(now).add(frequency, 'm');
			halfs = halfs+1;

			if ( now > end ) {

				var duration = moment.duration(now.diff(end));
				nextArrival = moment(now).format("YYYY-MM-DD HH:mm");

				var minutes = duration.asMinutes();
				minutes = Math.round(minutes);

				var hours = Math.round((halfs*30)/60);

				minutesAway = (hours+" hours and "+minutes+" minutes");

				pushData(name,destination,frequency,nextArrival,minutesAway);

				return;
				
			}

		}

	}

	if ( now > end ) {

		var halfs = 0;

		for (var i=0;i<100;i++){
			
			var end = moment(end).add(frequency, 'm');
			halfs = halfs+1;

			if ( now < end ) {

				var duration = moment.duration(end.diff(now));
				nextArrival = moment(now).format("YYYY-MM-DD HH:mm");

				var minutes = duration.asMinutes();
				minutes = Math.round(minutes);

				var hours = Math.round((halfs*30)/60);

				minutesAway = (hours+" hours and "+minutes+" minutes");

				pushData(name,destination,frequency,nextArrival,minutesAway);

				return;

			}

		}

	}

});

function pushData (name,destination,frequency,nextArrival,minutesAway){

	database.ref().push({

		Train_Name: name,
		Train_Destination: destination,
		Train_Frequency: frequency,
		Next_Arrival: nextArrival,
		Minutes_Away: minutesAway

	});

};