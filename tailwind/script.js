// script.js
import { httpGet } from "./core/api.js";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const movieContainer = document.getElementById("movie-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const currentPageElement = document.getElementById("current-page");
const movieModal = document.getElementById("movie-modal");
const closeModal = document.getElementById("close-modal");
const defaultQuery = "Doraemon";

let currentPage = 1;

async function fetchMovies(query, page = 1) {
  const data = await httpGet("/search/movie", {
    query: query,
    page: page,
  });
  return data;
}

function displayMovies(movies) {
  movieContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "bg-white rounded shadow p-4 cursor-pointer";
    movieCard.innerHTML = `
            <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="rounded w-full h-auto">
            <h3 class="text-lg font-semibold mt-2">${movie.title}</h3>
        `;
    movieCard.addEventListener("click", () => showModal(movie));
    movieContainer.appendChild(movieCard);
  });
}

function showModal(movie) {
  document.getElementById("modal-title").innerText = movie.title;
  document.getElementById(
    "modal-image"
  ).src = `${IMAGE_URL}${movie.poster_path}`;
  document.getElementById("modal-overview").innerText = movie.overview;
  document.getElementById("modal-rating").innerText = movie.vote_average;
  document.getElementById("modal-release-date").innerText = movie.release_date;
  movieModal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  movieModal.classList.add("hidden");
});

searchButton.addEventListener("click", async () => {
  const query = searchInput.value || defaultQuery;
  currentPage = 1;
  const data = await fetchMovies(query, currentPage);
  displayMovies(data.results);
  currentPageElement.innerText = currentPage;
});

prevButton.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage--;
    const query = searchInput.value || defaultQuery;
    const data = await fetchMovies(query, currentPage);
    displayMovies(data.results);
    currentPageElement.innerText = currentPage;
  }
});

nextButton.addEventListener("click", async () => {
  currentPage++;
  const query = searchInput.value || defaultQuery;
  const data = await fetchMovies(query, currentPage);
  displayMovies(data.results);
  currentPageElement.innerText = currentPage;
});

// Initial load with default query
window.onload = async () => {
  console.log("Window already load");
  const query = defaultQuery;
  currentPage = 1;
  const data = await fetchMovies(query, currentPage);
  displayMovies(data.results);
  currentPageElement.innerText = currentPage;
};
