// Variables
const screen = document.querySelector("body");
const randomArticleItems = document.getElementsByClassName("random");
const rocket = document.getElementById("rocket");
const flames = document.getElementsByClassName("flame");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resetButton = document.getElementById("reset-button");
const resultList = document.getElementById("result-list");

// Random article & rocket
const takeOff = () => {
	screen.classList.toggle("shaking");
	rocket.classList.toggle("flying");
	for (let i = 0; i < flames.length; i++) {
		flames[i].classList.toggle("hidden");
	}
};

const openWiki = () =>
	window.open("https://en.wikipedia.org/wiki/Special:Random");

const randomWiki = () => {
	takeOff();
	setTimeout(openWiki, 1750);
	setTimeout(takeOff, 1800);
};

rocket.addEventListener("click", randomWiki);

// Search
const toggleList = () => {
	for (let i = 0; i < randomArticleItems.length; i++) {
		randomArticleItems[i].classList.toggle("hidden");
	}
	searchButton.classList.toggle("hidden");
	resetButton.classList.toggle("hidden");

	if (searchButton.classList.contains("hidden")) {
		screen.setAttribute(
			"style",
			"justify-content: flex-start; overflow-y: visible;"
		);
	} else {
		screen.setAttribute(
			"style",
			"justify-content: flex-end; overflow-y: hidden;"
		);
		searchInput.value = "";
		while (resultList.firstChild) {
			resultList.removeChild(resultList.firstChild);
		}
	}
};

const displayResult = (data) => {
	if (!data || !data.query || !data.query.pages || !resultList) return;

	while (resultList.firstChild) {
		resultList.removeChild(resultList.firstChild);
	}

	const fragment = document.createDocumentFragment();

	Object.values(data.query.pages).forEach((page) => {
		const result = document.createElement("div");
		const extract = page.extract.split(".");
		result.innerHTML = `
            <a id="result-link" href="https://en.wikipedia.org/?curid=${page.pageid
			}" target="_blank">
					<div class="result-item">
               	<h2>${page.title}</h2>
               	<p>${extract[0] + "."}</p>
					</div>
            </a>
				`;
		fragment.appendChild(result);
	});

	resultList.appendChild(fragment);
};

const searchWiki = async () => {
	if (!searchInput.value) return;

	try {
		await fetch(
			`https://en.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch=${searchInput.value}&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`,
			{ mode: "cors" }
		)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => {
				if (!rocket.classList.contains("hidden")) {
					toggleList();
				}
				displayResult(data);
			});
	} catch (err) {
		console.error(`Error: ${err}`);
	}
};

searchButton.addEventListener("click", searchWiki);
searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
		searchButton.click();
	}
});
resetButton.addEventListener("click", toggleList);