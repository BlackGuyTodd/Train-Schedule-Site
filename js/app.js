//VARIABLES=============================================================================================
var config = {
  apiKey: "AIzaSyBbopMQO120hhEESIYqCcUibANBLbTYXcQ",
  authDomain: "train-schedule-database-1f365.firebaseapp.com",
  databaseURL: "https://train-schedule-database-1f365.firebaseio.com",
  projectId: "train-schedule-database-1f365",
  storageBucket: "",
  messagingSenderId: "173559125014"
};
firebase.initializeApp(config);

var databaseRef = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime;
var frequency;





// Time is 3:30 AM
var firstTime;

// First Time (pushed back 1 year to make sure it comes before current time)


// Time apart (remainder)

// Next Train

// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



//FUNCTIONS=============================================================================================
$("#add-train").on("click", function (event) {
  event.preventDefault();

  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTime = $("#first-train-time").val().trim();
  frequency = $("#frequency").val().trim();




  databaseRef.ref().push({

    train_name: trainName,
    destination: destination,
    first_train: firstTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});

databaseRef.ref().on("child_added", function (childSnapshot) {
  console.log(moment(currentTime).format("hh:mm a"));
  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().train_name);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().first_train);
  console.log(childSnapshot.val().frequency);

  frequency = childSnapshot.val().frequency;
  firstTime = childSnapshot.val().first_train;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log(moment(nextTrain).format("hh:mm"));
  console.log(frequency);
  console.log(diffTime);
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);



  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted).format("mm"), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // full list of items to the well
  $("#train-table").append("<tr class='row'><td class='train-name'> " +
    childSnapshot.val().train_name +
    " </td><td class='train-destination'> " + childSnapshot.val().destination +
    " </td><td class='train-freq'> " + childSnapshot.val().frequency +
    " </td><td class='next-arrival'>" + moment(nextTrain).format("hh:mm") + "</td>" +
    " <td class='till-next-train'>" + tMinutesTillTrain + "</td>" +
    "</tr>");

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

