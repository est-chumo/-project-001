document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const dogImage = document.getElementById("dog-image");
  const dogName = document.getElementById("dog-name");
  const dogDetails = document.getElementById("dog-details");
  const favBtn = document.getElementById("fav-btn");
  const favouritesList = document.getElementById("favourites-list");
  const addBreedForm = document.getElementById("add-breed-form");

  const favourites = [];

  searchBtn.addEventListener("click", () => {
    const breed = searchInput.value.toLowerCase().trim();
    if (breed === "") {
      alert("Please enter a breed name");
      return;
    }

    fetch('http://localhost:3000/breeds')
      .then(res => res.json())
      .then(data => {
        const matchedDog = data.find(dog => dog.name.toLowerCase() === breed);
        if (matchedDog) {
          dogImage.src = matchedDog.image;
          dogImage.style.display = "block";
          dogName.textContent = capitalize(breed);
          dogDetails.textContent = `Origin: ${matchedDog.origin}. Sub-breeds: ${matchedDog.subBreeds.length ? matchedDog.subBreeds.join(", ") : "None"}`;
          favBtn.style.display = "inline-block";
          favBtn.dataset.breed = matchedDog.name;
        } else {
          dogImage.style.display = "none";
          dogName.textContent = "Breed not available";
          dogDetails.textContent = "Please try an available breed. Not all breeds are listed.";
        }
      })
      .catch(error => {
        dogImage.style.display = "none";
        dogName.textContent = "Unavailable!";
        dogDetails.textContent = "Something went wrong. Try again later.";
        console.error("Error fetching dog image:", error);
      });
  });

  favBtn.addEventListener("click", () => {
    const breedName = favBtn.dataset.breed;
    if (!favourites.includes(breedName)) {
      favourites.push(breedName);
      addToFavouritesList(breedName);
    }
  });

  function addToFavouritesList(breedName) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = capitalize(breedName);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "fav-delete-btn";
    deleteBtn.addEventListener("click", () => {
      favourites.splice(favourites.indexOf(breedName), 1);
      favouritesList.removeChild(li);
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "fav-edit-btn";
    editBtn.addEventListener("click", () => {
      const newName = prompt("Enter new name for the breed:");
      if (newName) {
        fetch(`http://localhost:3000/breeds/${breedName.toLowerCase()}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName })
        })
          .then(res => res.json())
          .then(updated => {
            span.textContent = capitalize(updated.name);
            favBtn.dataset.breed = updated.name;
          });
      }
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    favouritesList.appendChild(li);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  
  addBreedForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("new-breed-name").value.trim();
    const origin = document.getElementById("new-breed-origin").value.trim();
    const image = document.getElementById("new-breed-image").value.trim();
    const subBreedsStr = document.getElementById("new-breed-subbreeds").value.trim();
    const subBreeds = subBreedsStr ? subBreedsStr.split(",").map(s => s.trim()) : [];

    const newBreed = {
      name,
      origin,
      image,
      subBreeds
    };

    fetch("http://localhost:3000/breeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBreed)
    })
      .then(res => res.json())
      .then(data => {
        alert("Breed added successfully!");
        addBreedForm.reset();
      })
      .catch(err => {
        console.error("Error adding breed:", err);
        alert("Something went wrong. Try again.");
      });
  });
});
