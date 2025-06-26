document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    searchBtn: document.getElementById("search-btn"),
    searchInput: document.getElementById("search-input"),
    dogImage: document.getElementById("dog-image"),
    dogName: document.getElementById("dog-name"),
    dogDetails: document.getElementById("dog-details"),
    favBtn: document.getElementById("fav-btn"),
    favouritesList: document.getElementById("favourites-list"),
    addBreedForm: document.getElementById("add-breed-form")
  };

  // Verify essential elements exist
  if (!elements.searchBtn || !elements.searchInput) {
    console.error("Essential elements not found!");
    return;
  }

  // State
  const favourites = [];
  const API_URL = 'http://localhost:3000/breeds';

  // Helper Functions
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function displayDogInfo(dog) {
    elements.dogImage.src = dog.image;
    elements.dogImage.style.display = "block";
    elements.dogName.textContent = capitalize(dog.name);
    elements.dogDetails.textContent = `Origin: ${dog.origin}. Sub-breeds: ${
      dog.subBreeds.length ? dog.subBreeds.join(", ") : "None"
    }`;
    elements.favBtn.style.display = "inline-block";
    elements.favBtn.dataset.breed = dog.name;
  }

  function displayNotFound() {
    elements.dogImage.style.display = "none";
    elements.dogName.textContent = "Breed not available";
    elements.dogDetails.textContent = "Please try an available breed. Not all breeds are listed.";
    elements.favBtn.style.display = "none";
  }

  function displayError(error) {
    console.error("Error:", error);
    elements.dogImage.style.display = "none";
    elements.dogName.textContent = "Error";
    elements.dogDetails.textContent = "Failed to fetch data. Please try again later.";
    elements.favBtn.style.display = "none";
  }

  // Event Listeners
  elements.searchBtn.addEventListener("click", async () => {
    const breed = elements.searchInput.value.toLowerCase().trim();
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

  if (elements.favBtn) {
    elements.favBtn.addEventListener("click", () => {
      const breedName = elements.favBtn.dataset.breed;
      if (breedName && !favourites.includes(breedName)) {
        favourites.push(breedName);
        addToFavouritesList(breedName);
      }
    });
  }

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
          if (elements.favBtn.dataset.breed === breedName) {
            elements.favBtn.dataset.breed = updated.name;
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
      elements.favouritesList.removeChild(li);
    });

    li.append(span, editBtn, deleteBtn);
    elements.favouritesList.appendChild(li);
  }

  // Add new breed form
  if (elements.addBreedForm) {
    elements.addBreedForm.addEventListener("submit", async (e) => {
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
        elements.addBreedForm.reset();
        
        // Optional: auto-display the new breed
        elements.searchInput.value = newBreed.name;
        displayDogInfo(newBreed);
      } catch (error) {
        console.error("Add breed error:", error);
        alert(error.message || "Failed to add new breed");
      }
    });
  }
});