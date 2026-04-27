"use strict";

const FormField = document.querySelector("#link-form");
const inputField = FormField.querySelector("input");

// The main async func that does the api request
async function shortenUrl(longUrl) {
  const apiEndpoint =
    "https://corsproxy.io?" +
    encodeURIComponent("https://cleanuri.com/api/v1/shorten");

  // Prepare data as URL-encoded, matching the -d flag in curl
  const params = new URLSearchParams();
  params.append("url", longUrl);

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: params, // Automatically sets 'Content-Type' to 'application/x-www-form-urlencoded'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shortened URL:", data.result_url);
    return data.result_url;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// This is the submit event handler
FormField.addEventListener("submit", async (e) => {
  e.preventDefault();

  const UrlValue = inputField.value;
  console.log(UrlValue);

  // You can pass in the UrlValue variable here but I used "https://google.com/" as an example
  const shortUrl = shortenUrl("https://google.com/"); // Passing the inputted url into this function. The function will return the shortened result
  console.log(shortUrl);
});
