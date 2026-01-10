// CDN links use kar rahe hain taakay "Failed to resolve module" wala error khatam ho
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmBfjq_BmM4d7T-aJyzKmXG1AQ-wn4LIY",
  authDomain: "food-route-rfem38.firebaseapp.com",
  projectId: "food-route-rfem38",
  storageBucket: "food-route-rfem38.firebasestorage.app",
  messagingSenderId: "878548309612",
  appId: "1:878548309612:web:a4c2d075dddbebcf71ea49"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch dashboard insights
 
   async function fetchInsights() {
    console.log("Fetching real-time insights from schema...");
    try {
        const usersRef = collection(db, "users");

        // 1. Total Users Count (Ye sahi chal raha tha)
        const totalSnapshot = await getCountFromServer(usersRef);
        document.getElementById('total-users').innerText = totalSnapshot.data().count;

        // 2. Active Subscribers (subscription_status == "active")
        // Aapne schema mein String rakha hai, isliye "active" quotes mein aayega
        const activeQuery = query(usersRef, where("subscription_status", "==", "active"));
        const activeSnapshot = await getCountFromServer(activeQuery);
        document.getElementById('active-subs').innerText = activeSnapshot.data().count;

        // 3. Non-Subscribers (subscription_status != "active")
        // Note: Firestore mein direct '!=' count ke liye tricky hota hai
        // Iska behtareen jugar ye hai: Total - Active = Inactive
        const totalCount = totalSnapshot.data().count;
        const activeCount = activeSnapshot.data().count;
        document.getElementById('inactive-subs').innerText = totalCount - activeCount;

        console.log("Stats synced with subscription_status field!");

    } catch (error) {
        console.error("Schema mismatch or error: ", error);
    }
}


// Run on page load
fetchInsights();