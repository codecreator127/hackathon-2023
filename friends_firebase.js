  // Fetch and display the friendsTo fetch and display the friends of the currently signed-in user, you can update the `friends.js` file with the following code:
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

// Fetch and display the friends
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    const userId = user.uid;
    const friendsRef = db.collection("all_users").doc(userId).collection("friends");
    const friendsList = document.getElementById("friendsList");

    // Function to update and display the current user's friends
    function updateFriendsList() {
      friendsRef.get().then(function (querySnapshot) {
        let friendsHtml = "";

        // Create an array of promises for getUserInfo requests
        const getUserInfoPromises = [];

        querySnapshot.forEach(function (doc) {
          const friendId = doc.data().friendId;
          console.log(friendId);

          const userInfoPromise = getUserInfo(friendId)
            .then(function (userInfo) {
              const name = userInfo.name;
              const email = userInfo.email;
              console.log(name);
              console.log(email);
              friendsHtml += `<li class="list-group-item">${name} - ${email}</li>`;
            })
            .catch(function (error) {
              console.error("Error fetching user information: ", error);
            });

          getUserInfoPromises.push(userInfoPromise);
        });

        // Wait for all getUserInfo promises to resolve before updating the UI
        Promise.all(getUserInfoPromises)
          .then(function () {
            friendsList.innerHTML = friendsHtml;
          })
          .catch(function (error) {
            console.error("Error getting friends: ", error);
          });
      }).catch(function (error) {
        console.error("Error getting friends: ", error);
      });
    }

    // Real-time listener for changes in the friends collection
    friendsRef.onSnapshot(function (snapshot) {
      updateFriendsList();
    });

    // Update and display the current user's friends initially
    updateFriendsList();
  } else {
    // User is signed out
    console.log("No user is currently signed in.");
  }
});


//display pending friend requests
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    const userId = user.uid;
    const pendingRef = db.collection("all_users").doc(userId).collection("pending");
    const requestsRef = db.collection("all_users").doc(userId).collection("requests");
    const pendingPanel = document.getElementById("pending");

    // Function to update and display the current pending users
    function updatePendingPanel() {
      pendingRef.get().then(function (querySnapshot) {
        let pendingHtml = "";

        // Create an array of promises for getUserInfo requests
        const getUserInfoPromises = [];

        querySnapshot.forEach(function (doc) {
          const pendingId = doc.data().friendId;
          const userInfoPromise = getUserInfo(pendingId)
            .then(function (userInfo) {
              const name = userInfo.name;
              const email = userInfo.email;
              pendingHtml += `<li class="list-group-item list-group-item-action" data-pending-id="${pendingId}">${name} - ${email} <button class="btn btn-primary btn-sm float-right accept-friend-btn">Accept Friend</button></li>`;
            })
            .catch(function (error) {
              console.error("Error fetching user information: ", error);
            });

          getUserInfoPromises.push(userInfoPromise);
        });

        // Wait for all getUserInfo promises to resolve before updating the UI
        Promise.all(getUserInfoPromises)
          .then(function () {
            pendingList.innerHTML = pendingHtml;

            // Add event listeners to "Accept Friend" buttons
            const acceptFriendBtns = document.getElementsByClassName("accept-friend-btn");
            for (let i = 0; i < acceptFriendBtns.length; i++) {
              acceptFriendBtns[i].addEventListener("click", function (event) {
                const listItem = event.target.closest("li");
                const pendingId = listItem.dataset.pendingId;

                // Call the acceptFriendRequest function
                acceptFriendRequest(userId, pendingId)
                  .then(function () {
                    // Remove the current user ID from the requested user's pending collection
                    const requestedUserRef = db.collection("all_users").doc(pendingId).collection("requests");

                    requestedUserRef.doc(userId).delete()
                      .then(function () {
                        // Remove the requested user's ID from the logged-in user's requests collection
                        pendingRef.doc(pendingId).delete()
                          .then(function () {
                            // Update the UI to reflect the change
                            console.log("pending deleted");

                            // Remove the list item from the UL
                            listItem.remove();
                          })
                          .catch(function (error) {
                            console.error("Error removing requested user's ID from logged-in user's requests collection: ", error);
                          });
                      })
                      .catch(function (error) {
                        console.error("Error removing current user ID from requested user's pending collection: ", error);
                      });
                  })
                  .catch(function (error) {
                    console.error("Error accepting friend request: ", error);
                  });
              });
            }
          })
          .catch(function (error) {
            console.error("Error getting pending: ", error);
          });
      }).catch(function (error) {
        console.error("Error getting pending: ", error);
      });
    }

    // Add event listener to the panel element
    pendingPanel.addEventListener("click", updatePendingPanel);

    // Real-time listener for changes in the pending collection
    pendingRef.onSnapshot(function (snapshot) {

      console.log("snapshot");
      updatePendingPanel();
    });

    // Update and display the current pending users initially
    updatePendingPanel();

  } else {
    // User is signed out
    console.log("No user is currently signed in.");
  }
});


function acceptFriendRequest(userId, pendingId) {
  //add the current user Id to the requested friend:
  db.collection("all_users").doc(pendingId).collection("friends").doc(userId).set({friendId: userId});
  
  // Add pendingId to the friends collection of the current user
  return db
    .collection("all_users")
    .doc(userId)
    .collection("friends")
    .doc(pendingId)
    .set({friendId: pendingId})
    .catch(function (error) {
      console.error("Error accepting friend request: ", error);
    });
}

function getUserInfo(userId) {
  // Get the user document from the 'all_users' collection
  return db.collection("all_users")
    .doc(userId)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        const name = userData.name;
        const email = userData.email;

        return {name, email};
      } else {
        throw new Error("User document not found");
      }
    })
    .catch(function (error) {
      console.error("Error fetching user information: ", error);
    });
}

//display friend requests
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    const userId = user.uid;
    const requestedRef = db.collection("all_users").doc(userId).collection("requests");
    const requestList = document.getElementById("requestList");

    // Function to update and display the latest requests collection
    function updateRequestedPanel() {
      requestedRef.get().then(function (querySnapshot) {
        let requestedHtml = "";

        // Create an array of promises for getUserInfo requests
        const getUserInfoPromises = [];

        querySnapshot.forEach(function (doc) {
          const requestId = doc.id;
          const requestedId = doc.data().friendId;

          const userInfoPromise = getUserInfo(requestedId)
            .then(function (userInfo) {
              const name = userInfo.name;
              const email = userInfo.email;
              requestedHtml += `<li class="list-group-item list-group-item-action" data-request-id="${requestId}" data-requested-id="${requestedId}">${name} - ${email} <button class="btn btn-danger btn-sm float-right remove-request-btn">Remove Request</button></li>`;
            })
            .catch(function (error) {
              console.error("Error fetching user information: ", error);
            });

          getUserInfoPromises.push(userInfoPromise);
        });

        // Wait for all getUserInfo promises to resolve before updating the UI
        Promise.all(getUserInfoPromises)
          .then(function () {
            requestList.innerHTML = requestedHtml;

            // Add event listeners to "Remove Request" buttons
            const removeRequestBtns = document.getElementsByClassName("remove-request-btn");
            for (let i = 0; i < removeRequestBtns.length; i++) {
              removeRequestBtns[i].addEventListener("click", function (event) {
                const listItem = event.target.closest("li");
                const requestId = listItem.dataset.requestId;
                const requestedId = listItem.dataset.requestedId;

                // Remove the signed-in user ID from the requested user's pending collection
                const requestedUserRef = db.collection("all_users").doc(requestedId).collection("pending");
                console.log("removed from requesteds pending");

                // Iterate through the pending collection to find and remove the matching element
                requestedUserRef
                  .where("friendId", "==", userId)
                  .get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      doc.ref
                        .delete()
                        .then(function () {
                          console.log("Removed from requesteds pending");
                        })
                        .catch(function (error) {
                          console.error("Error removing from requesteds pending: ", error);
                        });
                    });
                  })
                  .catch(function (error) {
                    console.error("Error querying requesteds pending: ", error);
                  });

                // Remove the requested item from the "requests" collection
                requestedRef.doc(requestId).delete()
                  .then(function () {
                    console.log("removed from requests");

                    // Update the UI to reflect the change
                    listItem.remove();
                  })
                  .catch(function (error) {
                    console.error("Error removing requested item from requests collection: ", error);
                  });
              });
            }
          })
          .catch(function (error) {
            console.error("Error getting requested: ", error);
          });
      }).catch(function (error) {
        console.error("Error getting requested: ", error);
      });
    }

    // Add event listener to the panel element
    const requestedPanel = document.getElementById("requested");
    requestedPanel.addEventListener("click", updateRequestedPanel);

    // Real-time listener for changes in the requests collection
    requestedRef.onSnapshot(function (snapshot) {
      updateRequestedPanel();
    });

    // Update and display the latest requests collection initially
    updateRequestedPanel();
  } else {
    // User is signed out
    console.log("No user is currently signed in.");
  }
});


//sending friend requests
// Get the search user input and search results list elements
const searchUserInput = document.getElementById("searchUserInput");
const searchResultsList = document.getElementById("searchResultsList");

// Function to display search results
function displaySearchResults(results) {
  // Clear the previous search results
  searchResultsList.innerHTML = "";

  // Create and append list items for each user in the search results
  results.forEach(function (result) {
    const userData = result.data();
    const name = userData.name;
    const email = userData.email;

    // Create list item element
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";

    // Create name element
    const nameElement = document.createElement("strong");
    nameElement.textContent = name;
    listItem.appendChild(nameElement);

    // Create email element
    const emailElement = document.createElement("span");
    emailElement.textContent = " - " + email;
    listItem.appendChild(emailElement);

    // Create add button
    const addButton = document.createElement("button");
    addButton.className = "btn btn-primary btn-sm float-right";
    addButton.textContent = "Add User";
    addButton.addEventListener("click", function () {
      addUser(result.id, addButton);
    });

    listItem.appendChild(addButton);

    // Append the list item to the search results list
    searchResultsList.appendChild(listItem);
  });
}

// Function to update the button text to "Requested"
function setButtonAsRequested(button) {
  button.textContent = "Requested";
  button.disabled = true;
}

// Function to add user
function addUser(userId, addButton) {
  const currentUser = auth.currentUser;
  const currentUserRef = db.collection("all_users").doc(currentUser.uid);
  const requestedUserRef = db.collection("all_users").doc(userId);

  // Add requested user to the currently logged-in user's requests collection
  currentUserRef
    .collection("requests")
    .doc(userId)
    .set({
      friendId: userId,
    })
    .then(function () {
      console.log("User added to requests collection");

      // Add currently logged-in user to the requested user's pending collection
      requestedUserRef
        .collection("pending")
        .doc(currentUser.uid)
        .set({
          friendId: currentUser.uid,
        })
        .then(function () {
          console.log("Current user added to pending collection");
          setButtonAsRequested(addButton); // Set button as "Requested"
        })
        .catch(function (error) {
          console.error("Error adding current user to pending collection: ", error);
        });
    })
    .catch(function (error) {
      console.error("Error adding user to requests collection: ", error);
    });
}




// Event listener for the search user input
searchUserInput.addEventListener("input", function () {
  const searchQuery = searchUserInput.value.trim().toLowerCase();

  if (searchQuery === "") {
    searchResultsList.innerHTML = "";
    return;
  }

  const usersRef = db.collection("all_users");

  usersRef
    .where("name", ">=", searchQuery)
    .where("name", "<=", searchQuery + "\uf8ff")
    .limit(5) // Limit the number of search results to display
    .get()
    .then(function (querySnapshot) {
      const searchResults = querySnapshot.docs;
      displaySearchResults(searchResults);
    })
    .catch(function (error) {
      console.error("Error searching users: ", error);
    });
});

