# dog Breed Explorer
this is a program that is used to view images and understand more about different types of dog breeds 

# Objectives 
1. to make people to understand different traits of dog breeds.
2.for people to be able to view different puctures of animals.
3. to be able to view pictures of the different types of breeds
4.understand the sub breeds of dogs

##  Features

- Search for a dog breed by name.
- View an image, origin, and sub-breeds (if any).
- Add a breed to your list of favourites.
-  Remove a breed from your favourites list.

## setup
clone into your repository by running
--git clone git@github.com:est-chumo/-project-001.git
make sure you have a running local server:
tart the local server** (if using `json-server`):

   npm install -g json-server
   json-server --watch db.json --port 3000


## how it works

this program works by the user searching for a dog breed by inputing the breed name in the search bar and clicking search.
the app fetches breed data from a local server (`https://localhost:3000/breeds`)
if the breed exists its image and information is displayed
- the user can also add a breed to favorites and be listed next to the image 
- it also has a delete button to be able to remove a breed from favourites list

## Author
Elvis Chumo

## License
MIT License