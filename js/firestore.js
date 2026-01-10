import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

// File Status Update
document.getElementById('image_file').addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name;
    if (fileName) document.getElementById('file-status').innerText = `Selected: ${fileName}`;
});

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const imageFile = document.getElementById('image_file').files[0];
    
    btn.disabled = true;
    btn.innerText = "Uploading Image...";

    try {
        let finalImageUrl = "";
        
        // Step 1: Upload to Firebase Storage
        if (imageFile) {
            const storageRef = ref(storage, `recipe_images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            finalImageUrl = await getDownloadURL(snapshot.ref);
        }

        btn.innerText = "Syncing Firestore...";

        // Step 2: Save Document
        await addDoc(collection(db, "recipes"), {
            title: document.getElementById('title').value,
            cooking_time: parseInt(document.getElementById('cooking_time').value) || 0,
            category: document.getElementById('category').value,
            calories: parseInt(document.getElementById('calories').value) || 0,
            protein: parseInt(document.getElementById('protein').value) || 0,
            carbs: parseInt(document.getElementById('carbs').value) || 0,
            fat: parseInt(document.getElementById('fat').value) || 0,
            image_url: finalImageUrl, // Dynamic link saved here
            ingredients: document.getElementById('ingredients').value.split(',').map(i => i.trim()),
            created_at: serverTimestamp()
        });

        alert("Success! Recipe uploaded and image synced.");
        e.target.reset();
        document.getElementById('file-status').innerText = "Click to upload image";
    } catch (err) {
        console.error(err);
        alert("Upload failed. Check Firebase Storage rules.");
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 Sync to Firestore";
    }
});