const { animate, createDraggable, mapTo, utils } = anime;

// DOM ELEMENTS
const container = document.querySelector(".character-container");
const paginationContainer = document.querySelector(".pagination");
const paginationButtons = document.querySelectorAll(".pagination-button");
const [prevBtn, pageBtn, nextBtn] = paginationButtons;

let characters = [];
let currentPage = 1;
let totalPages = 0;
prevBtn.disabled = true;

const handleAPICall = async () => {
  try {
    const url = `https://rickandmortyapi.com/api/character/?page=${currentPage}`;
    const response = await fetch(url);
    console.log(url);
    const data = await response.json();
    console.log(data);
    characters = data.results;
    totalPages = data.info.pages;
  } catch (error) {
    console.error(error);
  }
};

const updatePage = async (page) => {
  currentPage = page;
  pageBtn.textContent = currentPage;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  await displayCharacters();
};

prevBtn.onclick = () => {
  if (currentPage > 1) updatePage(currentPage - 1);
};

nextBtn.onclick = () => {
  updatePage(currentPage + 1);
};

// init middle button
pageBtn.textContent = currentPage;

const displayCharacters = async () => {
  await handleAPICall();
  // For each character, create a card and append it to the container
  container.innerHTML = "";
  characters.forEach((character) => {
    const card = document.createElement("div");
    card.classList.add("character-card", "square");
    const { name, image, status, species, origin, location } = character;
    card.innerHTML = `
     <div class="card-face card-front">
        <div class="img-char-container">
          <img src=${image} alt=${name} />
        </div>
        <h2 class="name">${name}</h2>
        <p class="species">${species}</p>
      </div>
    <div class="card-face card-back">
      <h2 class="name">${name}</h2>
      <ul class="card-details">
        <li><span class="label">Status</span><span class="${status === "Dead" ? "value dead" : "value alive"}">${status}</span></li>
        <li><span class="label">Species</span><span class="value">${species}</span></li>
        <li><span class="label">Origin</span><span class="value">${origin.name}</span></li>
        <li><span class="label">Location</span><span class="value">${location.name}</span></li>
      </ul>
    </div>
    `;
    container.appendChild(card);

    // Set up draggable animation for the current card
    utils.set(card, { z: 100 });
    // Maps the x movement to rotateY and y movement to z-axis translation
    createDraggable(card, {
      x: { mapTo: "rotateY" },
      y: { mapTo: "z" },
    });
  });
};

displayCharacters();
