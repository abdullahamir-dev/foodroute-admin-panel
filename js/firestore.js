import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmBfjq_BmM4d7T-aJyzKmXG1AQ-wn4LIY",
    authDomain: "food-route-rfem38.firebaseapp.com",
    projectId: "food-route-rfem38",
    storageBucket: "food-route-rfem38.firebasestorage.app",
    messagingSenderId: "878548309612",
    appId: "1:878548309612:web:a4c2d075dddbebcf71ea49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "⏳ Syncing...";

    try {
        // Converting String to List<String> for Ingredients
        const ingredientsStr = document.getElementById('ingredients').value;
        const ingredientsArray = ingredientsStr ? ingredientsStr.split(',').map(i => i.trim()) : [];

        const recipeData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value,
            calories: parseInt(document.getElementById('calories').value) || 0,
            protein: parseInt(document.getElementById('protein').value) || 0,
            carbs: parseInt(document.getElementById('carbs').value) || 0,
            fat: parseInt(document.getElementById('fat').value) || 0,
            cooking_time: parseInt(document.getElementById('cooking_time')) || 0,
            image_url: document.getElementById('image_url').value,
            ingredients: ingredientsArray,
            steps: [], // Default empty list
            created_at: serverTimestamp()
        };

        await addDoc(collection(db, "recipes"), recipeData);
        
        alert("Success! Recipe is now live on FoodRoute App.");
        e.target.reset();
    } catch (err) {
        console.error(err);
        alert("Error: Data integrity check failed.");
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 Sync to Firestore";
    }
});