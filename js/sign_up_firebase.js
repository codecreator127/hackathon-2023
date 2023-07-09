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
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Get the sign-up form element
  const signupForm = document.querySelector("form");
  
  // Add submit event listener to the form
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
  
    // Get user input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Create user in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        const user = userCredential.user;
  
        // Store user details in Firestore
        db.collection("all_users").doc(user.uid).set({
          name: name,
          email: email
        })
          .then(function () {
            console.log("User added to Firestore");
  
            // Create a 'pending' collection for user (people user is requesting)
            db.collection("all_users").doc(user.uid).collection("pending").add({})
              .then(function (pendingDocRef) {
                console.log("Pending collection created for user with ID: ", pendingDocRef.id);
  
                // Create a 'requests' collection for user (people requesting)
                db.collection("all_users").doc(user.uid).collection("requests").add({})
                  .then(function (requestsDocRef) {
                    console.log("Requests collection created for user with ID: ", requestsDocRef.id);
  
                    // Create a 'friends' collection for the user
                    db.collection("all_users").doc(user.uid).collection("friends").add({})
                      .then(function (friendsDocRef) {
                        console.log("Friends collection created for user with ID: ", friendsDocRef.id);
  
                        // Redirect or show success message to the user
                        window.location.href = "friends.html";
                      })
                      .catch(function (error) {
                        console.error("Error creating friends collection: ", error);
                        // Show error message to the user
                      });
                  })
                  .catch(function (error) {
                    console.error("Error creating requests collection: ", error);
                    // Show error message to the user
                  });
              })
              .catch(function (error) {
                console.error("Error creating pending collection: ", error);
                // Show error message to the user
              });
          })
          .catch(function (error) {
            console.error("Error adding user to Firestore: ", error);
            // Show error message to the user
          });
      })
      .catch(function (error) {
        console.error("Error creating user: ", error);
        // Show error message to the user
      });
  });
  