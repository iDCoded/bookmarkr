const { shell } = require("electron");

// Chromium Parser
const parser = new DOMParser();

// Get the elements
const linkSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-msg");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkUrl = document.querySelector(".new-link-url");
const newLinkSubmit = document.querySelector(".new-link-submit");
const clearStorageButton = document.querySelector(".clear-storage");

// Enable the Submit button if the URL is valid
newLinkUrl.addEventListener("keyup", () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = newLinkUrl.value;

  fetch(url)
    .then(validateResponse)
    .then((response) => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then((title) => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks)
    .catch((error) => handleError(error, url));
});

// Validate the response
const validateResponse = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(`Status Code of ${response.status} ${response.statusText}`);
};

// Handle the error (if any)
const handleError = (error, url) => {
  errorMessage.classList.add("notification");
  errorMessage.innerHTML =
    `There was an issue adding "${url}": "${error.message}"`.trim();
  // Clear the error message after 5 seconds.
  setTimeout(() => {
    errorMessage.innerHTML = null;
    errorMessage.classList.remove("notification");
  }, 5000);
};

// Parse the response
const parseResponse = (text) => {
  return parser.parseFromString(text, "text/html");
};

// Get the title
const findTitle = (nodes) => {
  return nodes.querySelector("title").innerText;
};

// Function to clear form.
function clearForm() {
  newLinkUrl.value = null;
}

// Store the link.
const storeLink = (title, url) => {
  localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
};

// Get the links
const getLinks = () => {
  return Object.keys(localStorage).map((key) =>
    JSON.parse(localStorage.getItem(key))
  );
};

const convertToElement = (link) => {
  return `
    <div class="link box">
    <h3>${link.title}</h3>
    <p>
    <a href="${link.url}">${link.url}</a>
    </p>
    </div>
    `;
};

const renderLinks = () => {
  const linkElements = getLinks().map(convertToElement).join("");
  linkSection.innerHTML = linkElements;
};

clearStorageButton.addEventListener("click", () => {
  localStorage.clear();
  linkSection.innerHTML = "";
});

linkSection.addEventListener("click", (event) => {
  if (event.target.href) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

renderLinks();
