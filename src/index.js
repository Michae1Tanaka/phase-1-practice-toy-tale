let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => data.forEach(addAllToysOnLoad))
    .catch((error) => console.log(error));

  //callback function to add all toys to the DOM on page load
  function addAllToysOnLoad(toys) {
    //creates html elements for request data
    const cards = document.createElement("div");
    const h2 = document.createElement("h2");
    const image = document.createElement("img");
    const paragraph = document.createElement("p");
    const likeButton = document.createElement("button");

    //Sets attributes for html elements
    cards.setAttribute("class", "card");
    image.src = toys.image;
    image.setAttribute("class", "toy-avatar");
    likeButton.setAttribute("id", `${toys.id}`);
    likeButton.setAttribute("class", "like-btn");

    //Sets data from request to html elements
    h2.textContent = toys.name;
    paragraph.textContent = `${toys.likes} Likes`;
    likeButton.textContent = "Like ❤️";

    //Appends all the data we provided from the server
    toyCollection.appendChild(cards);
    cards.appendChild(h2);
    cards.appendChild(image);
    cards.appendChild(paragraph);
    cards.appendChild(likeButton);

    likeButton.addEventListener("click", likeButtonEventHandler);

    //increments the likes on each toy whenever the event is activated.
    function likeButtonEventHandler(e) {
      fetch(`http://localhost:3000/toys/${likeButton.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: ++toys.likes,
        }),
      });
      paragraph.textContent = `${toys.likes} Likes`;
    }
  }
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//add Event listener to the add toy firm that allows to create a new toy
const newToyForm = document.querySelector(".add-toy-form");
newToyForm.addEventListener("submit", newToySubmitHandler);

function newToySubmitHandler(e) {
  e.preventDefault();
  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: e.target[0].value,
      image: e.target[1].value,
      likes: 0,
    }),
  };
  fetch("http://localhost:3000/toys", configurationObject)
    .then((resp) => resp.json())
    .then((data) => {
      const newCard = document.createElement("div");
      const newH2 = document.createElement("h2");
      const newImage = document.createElement("img");
      const newParagraph = document.createElement("p");
      const newLikeButton = document.createElement("button");
      const newToyCollection = document.getElementById("toy-collection");

      newCard.setAttribute("class", "card");
      newImage.setAttribute("class", "toy-avatar");
      newLikeButton.setAttribute("id", data.id);
      newLikeButton.setAttribute("class", "like-btn");

      newH2.textContent = data.name;
      newImage.src = data.image;
      newLikeButton.textContent = "Like ❤️";
      newParagraph.textContent = `${data.likes}` + " Likes";

      newToyCollection.appendChild(newCard);
      newCard.appendChild(newH2);
      newCard.appendChild(newImage);
      newCard.appendChild(newParagraph);
      newCard.appendChild(newLikeButton);

      newLikeButton.addEventListener('click',newLikeButtonEventHandler)

      //increments the likes on each toy whenever the event is activated.
      function newLikeButtonEventHandler(e) {
        fetch(`http://localhost:3000/toys/${newLikeButton.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            likes: ++data.likes,
          }),
        });
        newParagraph.textContent = `${data.likes} Likes`;
      }
      //add event to new card when liked, like count increments.
    });
}
