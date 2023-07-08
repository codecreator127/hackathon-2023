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
  var auth = firebase.auth();
  
  // Get the login form element
  var loginForm = document.getElementById("login-form");
  
  // Add submit event listener to the form
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
  
    // Get user input values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
  
    // Sign in the user
    auth.signInWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        var user = userCredential.user;
        console.log("User logged in:", user);
        // Redirect or show success message to the user
        window.location.href = "profile.html";
      })
      .catch(function (error) {
        console.error("Error logging in: ", error);
        // Show error message to the user
      });
  });
  