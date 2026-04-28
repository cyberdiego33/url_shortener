"use strict";

const FormField = document.querySelector("#Url-form");
const inputField = FormField.querySelector("input");
const ErrorField = document.querySelector("#error-message");
const LinksContainer = document.querySelector("#Links-container");
const ShortenBtn = document.querySelector("#shorten-btn");
const spanText = ShortenBtn.querySelector("span");
const Spinner = document.querySelector("#Spinner");
const MenuButton = document.querySelector("#MenuButton");
const MobileNav = document.querySelector("#Mobile-nav");

const errorFunc = function () {
  ErrorField.textContent = "please add a link";
  inputField.classList.remove("placeholder:text-gray-600");
  inputField.classList.add(
    "placeholder:text-red-500",
    "border",
    "border-red-500",
  );
  setTimeout(() => {
    inputField.classList.add("placeholder:text-gray-600");
    inputField.classList.remove(
      "placeholder:text-red-500",
      "border",
      "border-red-500",
    );
    ErrorField.textContent = "";
  }, 2000);
};

const successFunc = function (mainLink, shortLink) {
  const htmlText = `
          <div
            class="bg-white p-2 rounded-md mb-2 md:flex md:justify-between md:items-center"
          >
            <p class="truncate mr-4">https://react-icons.github.io</p>
            <div class="divider my-2 h-0.5 bg-gray-950 md:hidden"></div>
            <div class="flex max-md:flex-col gap-2 md:items-center">
              <p class="text-blue-500 font-medium">
                https://cleanuri.com/5MAReG
              </p>
              <button
                class="copy-btn px-3 py-1 bg-blue-600 text-white rounded-md transition-colors hover:bg-blue-700 hover:cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>`;

  LinksContainer.insertAdjacentHTML("beforeend", htmlText);

  // 1. Grab the button we just added (it's the last one in the container)
  const allBtns = LinksContainer.querySelectorAll(".copy-btn");
  const lastBtn = allBtns[allBtns.length - 1];

  // 2. Add the click event listener
  lastBtn.addEventListener("click", function () {
    navigator.clipboard
      .writeText(shortLink)
      .then(() => {
        // 3. Visual feedback: Change button text briefly
        this.textContent = "Copied!";
        this.classList.replace("bg-blue-600", "bg-green-600");

        setTimeout(() => {
          this.textContent = "Copy";
          this.classList.replace("bg-green-600", "bg-blue-600");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  });
};

const loadingSpinner = function () {
  spanText.classList.toggle("hidden");
  Spinner.classList.toggle("hidden");
};

MenuButton.addEventListener("click", () => {
  MobileNav.classList.toggle("h-0");
  MobileNav.classList.toggle("py-6");
});

// The main async func that does the api request
async function shortenUrl(longUrl) {
  const apiEndpoint =
    "https://corsproxy.io?" +
    encodeURIComponent("https://cleanuri.com/api/v1/shorten");

  // Prepare data as URL-encoded, matching the -d flag in curl
  const params = new URLSearchParams();
  params.append("url", longUrl);

  try {
    loadingSpinner();
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: params, // Automatically sets 'Content-Type' to 'application/x-www-form-urlencoded'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    successFunc(longUrl, data.result_url);
    console.log("Shortened URL:", data.result_url);
    return data.result_url;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);

    errorFunc();
  } finally {
    loadingSpinner();
  }
}

// This is the submit event handler
FormField.addEventListener("submit", async (e) => {
  e.preventDefault();

  const UrlValue = inputField.value;
  console.log(UrlValue);
  inputField.value = "";

  if (UrlValue === "" || UrlValue.length < 15) {
    errorFunc();
    return;
  }
  // You can pass in the UrlValue variable here but I used "https://google.com/" as an example
  const shortUrl = shortenUrl(UrlValue); // Passing the inputted url into this function. The function will return the shortened result
  console.log(shortUrl);
});
