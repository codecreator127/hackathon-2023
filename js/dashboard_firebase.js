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
  
  // Get the 'user' element from the HTML
  const userElement = document.getElementById('user');
  
  // Function to update the user name in the navigation
  function updateUserName(user) {
    if (user) {
      const displayName = user.displayName;
      const email = user.email;
      const name = displayName || email;
      userElement.textContent = name;
    }
  }
  
  // Add an observer to check for changes in the user's authentication state
  auth.onAuthStateChanged(function(user) {
    updateUserName(user);
  });



// Fetch and display the events
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    const userId = user.uid;
    const eventsRef = db.collection("all_users").doc(userId).collection("events");
    const eventsList = document.getElementById("eventList");

    // Function to update and display the current user's events
// Function to update and display the current user's events
function updateEventsList() {
  eventsRef.get().then(function (querySnapshot) {
    let eventsHtml = "";

    querySnapshot.forEach(function (doc) {
      const eventData = doc.data();
      const name = eventData.name;
      const day = eventData.day;
      const month = eventData.month;
      const year = eventData.year;
      const startTime = eventData.startTime;
      const endTime = eventData.endTime;

      eventsHtml += `<li class="list-group-item">
                      <strong>Name:</strong> ${name}<br>
                      <strong>Day:</strong> ${day}<br>
                      <strong>Month:</strong> ${month}<br>
                      <strong>Year:</strong> ${year}<br>
                      <strong>Start Time:</strong> ${startTime}<br>
                      <strong>End Time:</strong> ${endTime}
                    </li>`;
    });

    eventsList.innerHTML = eventsHtml;
  }).catch(function (error) {
    console.error("Error getting events: ", error);
  });
}


    // Real-time listener for changes in the events collection
    eventsRef.onSnapshot(function (snapshot) {
      updateEventsList();
    });

    // Update and display the current user's events initially
    updateEventsList();
  } else {
    // User is signed out
    console.log("No user is currently signed in.");
  }
});

// weather api stuff below
const apiKey = "b5fd6286c30c4b14bcf2b6be37125493";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}` + "&units=metric");
    var data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C"; 
    document.querySelector(".country").innerHTML = data.sys.country;
    document.querySelector(".weather").innerHTML = data.weather[0].main;
}

searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
})



