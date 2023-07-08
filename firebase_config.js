// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzDQQlu5k3OK8ebCpxQFXvMs1hM9gR4-Y",
    authDomain: "hackathon-2023-4b597.firebaseapp.com",
    projectId: "hackathon-2023-4b597",
    storageBucket: "hackathon-2023-4b597.appspot.com",
    messagingSenderId: "210075235253",
    appId: "1:210075235253:web:6bea6b2623e4cd7a545ffc",
    measurementId: "G-27JWSZFK3K"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
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
  