import { httpGet } from "../core/api.js"; // Import the httpGet function from core/api.js

let currentPage = 1;
let query = "Doraemon"; // Default search query

// Fetch movies from TMDB API
async function fetchMovies(page = 1, searchQuery = "Doraemon") {
  const endpoint = "/search/movie";
  const params = {
    query: searchQuery,
    page: page,
  };

  try {
    const data = await httpGet(endpoint, params);
    displayMovies(data.results);
    togglePaginationButtons(data);
    document.getElementById("current-page").textContent = currentPage;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to fetch movie details and update the modal
async function showMovieDetails(movieId) {
  try {
    const movie = await httpGet(`/movie/${movieId}`); // Fetch movie details
    document.getElementById("movieDetailModalLabel").innerText = movie.title;
    document.getElementById(
      "modalMovieImage"
    ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById("modalMovieOverview").innerText = movie.overview;
    document.getElementById(
      "modalMovieRating"
    ).innerText = `Rating: ${movie.vote_average}`;
    document.getElementById(
      "modalMovieReleaseDate"
    ).innerText = `Release Date: ${movie.release_date}`;

    // Show the modal
    const modal = new bootstrap.Modal(
      document.getElementById("movieDetailModal")
    );
    modal.show();
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Display movies on the page
function displayMovies(movies) {
  const moviesList = document.getElementById("movies-list");
  moviesList.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = `
      <div class="card movie-card" data-id="${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top movie-image" alt="${movie.title}">
        <div class="card-body">
          <h6 class="card-title">${movie.title}</h6>
        </div>
      </div>
    `;
    moviesList.insertAdjacentHTML("beforeend", movieCard);
  });

  // Add event listener to capture movie ID on click
  document.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      const movieId = card.getAttribute("data-id");
      await showMovieDetails(movieId); // Call the extracted function
    });
  });
}

// Handle search button click
document.getElementById("search-button").addEventListener("click", async () => {
  query = document.getElementById("search-input").value || "Doraemon";
  currentPage = 1;
  const data = await fetchMovies(currentPage, query);
  displayMovies(data.results);
  document.getElementById("current-page").textContent = currentPage;
  togglePaginationButtons(data);
});

// Handle pagination (next and prev buttons)
document.getElementById("next-button").addEventListener("click", async () => {
  currentPage++;
  const data = await fetchMovies(currentPage, query);
  displayMovies(data.results);
  document.getElementById("current-page").textContent = currentPage;
  togglePaginationButtons(data);
});

document.getElementById("prev-button").addEventListener("click", async () => {
  currentPage--;
  const data = await fetchMovies(currentPage, query);
  displayMovies(data.results);
  document.getElementById("current-page").textContent = currentPage;
  togglePaginationButtons(data);
});

// Enable/Disable Pagination Buttons
function togglePaginationButtons(data) {
  document.getElementById("prev-button").disabled = currentPage === 1;
  document.getElementById("next-button").disabled =
    !data.results.length || currentPage >= data.total_pages;
}

(async () => {
  const data = await fetchMovies();
  if (data && data.results) {
    displayMovies(data.results);
    togglePaginationButtons(data);
  } else {
    console.error("No results found in the API response");
  }
})();
