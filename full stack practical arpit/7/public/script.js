
// Get HTML elements
const searchForm = document.getElementById("searchForm");
const countryInput = document.getElementById("countryInput");

const resultsSection = document.getElementById("resultsSection");
const universityGrid = document.getElementById("universityGrid");

const countryName = document.getElementById("countryName");
const resultCount = document.getElementById("resultCount");
const errorMessage = document.getElementById("errorMessage");

// Listen for form submission
searchForm.addEventListener("submit", async function (event) {

// Prevent page refresh
    event.preventDefault();

// Get entered country
    const country = countryInput.value.trim();

if (!country) {
        return;
    }

// Show results section
    resultsSection.hidden = false;

// Clear previous results
    universityGrid.innerHTML = "";
    errorMessage.hidden = true;

    countryName.textContent = country;

    resultCount.textContent = "...";

// Show loading message
    universityGrid.textContent = "Loading universities...";

    try {



// Fetch university data from API
const response = await fetch(
    `/api/universities?country=${encodeURIComponent(country)}`
);

// Check API response
if (!response.ok) {
throw new Error("Unable to fetch university data.");
}

// Convert response into JSON
const universities = await response.json();

// Clear loading message
universityGrid.innerHTML = "";

// Update result count
resultCount.textContent = universities.length;

// Check if universities exist
if (universities.length === 0) {

throw new Error(
"No universities found. Please check the country spelling."
);

}

// Display every university
universities.forEach((university, index) => {

// Create card
const card = document.createElement("article");
card.className = "university-card";

// Card top
const cardTop = document.createElement("div");
cardTop.className = "card-top";

const number = document.createElement("span");
number.className = "card-number";
number.textContent = String(index + 1).padStart(2, "0");

const arrow = document.createElement("span");
arrow.className = "card-arrow";
arrow.textContent = "↗";

cardTop.append(number, arrow);

// University name
const heading = document.createElement("h3");
heading.textContent = university.name;

// Location
const location = document.createElement("div");
location.className = "card-location";

const locationLabel = document.createElement("span");
locationLabel.textContent = "LOCATION";

const state = document.createElement("p");
state.textContent =
university["state-province"] || "Location not specified";

location.append(locationLabel, state);

// Card footer
const footer = document.createElement("div");
footer.className = "card-footer";

const countryCode = document.createElement("span");
countryCode.textContent = university.alpha_two_code || "";

footer.appendChild(countryCode);

// University website links
(university.web_pages || []).forEach(url => {

const link = document.createElement("a");

link.href = url;
link.textContent = "VISIT WEBSITE ↗";
link.target = "_blank";
link.rel = "noopener noreferrer";

footer.appendChild(link);

});

// Add all elements to card
card.append(cardTop, heading, location, footer);

// Add card to webpage
universityGrid.appendChild(card);

});

} catch (error) {

// Display error
universityGrid.innerHTML = "";

errorMessage.textContent = error.message;
errorMessage.hidden = false;

resultCount.textContent = "0";

}

});
