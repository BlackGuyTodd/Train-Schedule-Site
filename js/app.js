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
var firstTime;

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

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});

databaseRef.ref().on("child_added", function (childSnapshot) {
  
  frequency = parseInt(childSnapshot.val().frequency);
  firstTime = childSnapshot.val().first_train;
  
  
  
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  
  
  // Current Time
  var currentTime = moment();
  
  
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted).format("mm"), "minutes");
  var tRemainder = diffTime % frequency;
  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  // full list of items to the well
  $("#train-table").append("<tr><td class='train-name'> " +
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

