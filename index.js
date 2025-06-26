document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const dogImage = document.getElementById("dog-image");
  const dogName = document.getElementById("dog-name");
  const dogDetails = document.getElementById("dog-details");
  const favBtn = document.getElementById("fav-btn");
  const favouritesList = document.getElementById("favourites-list");
  const addBreedForm = document.getElementById("add-breed-form");

  // State
  const favourites = [];
  const API_URL = 'http://localhost:3000/breeds';

  // Helper Functions
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function displayDogInfo(dog) {
    dogImage.src = dog.image;
    dogImage.style.display = "block";
    dogName.textContent = capitalize(dog.name);
    dogDetails.textContent = `Origin: ${dog.origin}. Sub-breeds: ${
      dog.subBreeds.length ? dog.subBreeds.join(", ") : "None"
    }`;
    favBtn.style.display = "inline-block";
    favBtn.dataset.breed = dog.name;
  }

  function displayNotFound() {
    dogImage.style.display = "none";
    dogName.textContent = "Breed not found";
    dogDetails.textContent = "Please try a different breed name";
    favBtn.style.display = "none";
  }

  function displayError(error) {
    console.error("Error:", error);
    dogImage.style.display = "none";
    dogName.textContent = "Error";
    dogDetails.textContent = "Failed to fetch data. Please try again later.";
    favBtn.style.display = "none";
  }

  // Event Listeners
  searchBtn.addEventListener("click", async () => {
    const breed = searchInput.value.toLowerCase().trim();
    if (!breed) {
      alert("Please enter a breed name");
      return;
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      const matchedDog = data.find(dog => dog.name.toLowerCase() === breed);
      
      if (matchedDog) {
        displayDogInfo(matchedDog);
      } else {
        displayNotFound();
      }
    } catch (error) {
      displayError(error);
    }
  });

  favBtn.addEventListener("click", () => {
    const breedName = favBtn.dataset.breed;
    if (breedName && !favourites.includes(breedName)) {
      favourites.push(breedName);
      addToFavouritesList(breedName);
    }
  });

  function addToFavouritesList(breedName) {
    const li = document.createElement("li");
    li.className = "favourite-item";
    
    const span = document.createElement("span");
    span.textContent = capitalize(breedName);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "fav-edit-btn";
    editBtn.addEventListener("click", async () => {
      const newName = prompt("Enter new name for the breed:", breedName);
      if (newName && newName.trim() !== breedName) {
        try {
          const response = await fetch(`${API_URL}/${breedName.toLowerCase()}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim().toLowerCase() })
          });
          
          if (!response.ok) throw new Error("Failed to update breed");
          
          const updated = await response.json();
          span.textContent = capitalize(updated.name);
          
          // Update in favourites array
          const index = favourites.indexOf(breedName);
          if (index !== -1) {
            favourites[index] = updated.name;
          }
          
          // Update fav button if showing same breed
          if (favBtn.dataset.breed === breedName) {
            favBtn.dataset.breed = updated.name;
          }
        } catch (error) {
          console.error("Edit error:", error);
          alert("Failed to update breed name");
        }
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "fav-delete-btn";
    deleteBtn.addEventListener("click", () => {
      const index = favourites.indexOf(breedName);
      if (index !== -1) {
        favourites.splice(index, 1);
      }
      favouritesList.removeChild(li);
    });

    li.append(span, editBtn, deleteBtn);
    favouritesList.appendChild(li);
  }

  // Add new breed form
  addBreedForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("new-breed-name").value.trim();
    const origin = document.getElementById("new-breed-origin").value.trim();
    const image = document.getElementById("new-breed-image").value.trim();
    const subBreedsStr = document.getElementById("new-breed-subbreeds").value.trim();
    const subBreeds = subBreedsStr ? subBreedsStr.split(",").map(s => s.trim()) : [];

    // Validation
    if (!name || !origin || !image) {
      alert("Please fill in all required fields (Name, Origin, Image)");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.toLowerCase(),
          origin,
          image,
          subBreeds
        })
      });

      if (!response.ok) throw new Error("Breed may already exist");

      const newBreed = await response.json();
      alert(`Successfully added ${capitalize(newBreed.name)}!`);
      addBreedForm.reset();
      
      // Optional: auto-display the new breed
      searchInput.value = newBreed.name;
      displayDogInfo(newBreed);
    } catch (error) {
      console.error("Add breed error:", error);
      alert(error.message || "Failed to add new breed");
    }
  });
});