//to make sure the html is fully loaded before the .js
document.addEventListener("DOMContentLoaded", () => {
    //grabbing data from html file
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const dogImage = document.getElementById("dog-image");
  const dogName = document.getElementById("dog-name");
  const dogDetails = document.getElementById("dog-details");
  const favBtn = document.getElementById("fav-btn");
  const favouritesList = document.getElementById("favourites-list");

  const favourites = [];
//adding a search button
  searchBtn.addEventListener("click", () => {
    const breed = searchInput.value.toLowerCase().trim();
//input validation
    if (breed === "") {
      alert("Please enter a breed name");
      return;
    }
//fetch data from server
    fetch('http://localhost:3000/breeds')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const matchedDog = data.find(dog => dog.name.toLowerCase() === breed);
//if function to see if dog breed matches
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
      //incase of unexpected error
      .catch(error => {
        dogImage.style.display = "none";
        dogName.textContent = "Unavailable!";
        dogDetails.textContent = "Something went wrong. Try again later.";
        console.error("Error fetching dog image:", error);
      });
  });
//add click fave button
  favBtn.addEventListener("click", () => {
    const breedName = favBtn.dataset.breed;
    if (!favourites.includes(breedName)) {
      favourites.push(breedName);
      addToFavouritesList(breedName);
    }
  });
// delete from favorites button
  function addToFavouritesList(breedName) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = capitalize(breedName);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "fav-delete-btn";
//removing child
    deleteBtn.addEventListener("click", () => {
      favourites.splice(favourites.indexOf(breedName), 1);
      favouritesList.removeChild(li);
    });
//appending list
    li.appendChild(span);
    li.appendChild(deleteBtn);
    favouritesList.appendChild(li);
  }
// to capitalize the first letter of the breed
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
