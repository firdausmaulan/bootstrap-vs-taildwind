// core/api.js

// Define the base URL for the API
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = ""; // Replace with your actual TMDB Bearer token

// Function to handle HTTP GET requests
async function httpGet(endpoint, params = {}) {
  try {
    const urlParams = new URLSearchParams(params);
    const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // rethrow the error to be handled by the calling code
  }
}

// Function to handle HTTP POST requests (optional if you need it)
async function httpPost(endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error; // rethrow the error to be handled by the calling code
  }
}

// Export functions for use in other modules
export { httpGet, httpPost };
