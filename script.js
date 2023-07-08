// Get a reference to the Firestore database
var db = firebase.firestore();

// Get the sign-up form element
var signupForm = document.getElementById("signup-form");

// Add submit event listener to the form
signupForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  // Get user input values
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Store user details in Firestore
  db.collection("all_users").add({
    name: name,
    email: email,
    password: password
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
    // Redirect or show success message to the user
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
    // Show error message to the user
  });
});
