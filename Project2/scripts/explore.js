
/* BOOK FILTERING */

// Get the filter elements
const filterForm = document.getElementById("book-filter");
const exploreLayout = document.querySelector(".explore-layout");
const resultsContainer = document.getElementById("filter-book-container");
const noResults = document.getElementById("no-results");
const allBooks = document.querySelectorAll(".explore-book-card");

// Apply selected filters
filterForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get selected filters
    const selectedGenres = Array.from(
        filterForm.querySelectorAll('input[name="genre"]:checked')
    ).map(input => input.value);

    const selectedFormats = Array.from(
        filterForm.querySelectorAll('input[name="format"]:checked')
    ).map(input => input.value);

    const selectedTypes = Array.from(
        filterForm.querySelectorAll('input[name="type"]:checked')
    ).map(input => input.value);

    const selectedReading = Array.from(
        filterForm.querySelectorAll('input[name="reading"]:checked')
    ).map(input => input.value);

    // Clear previous results
    resultsContainer.innerHTML = "";
    let matchingBooks = 0;

    // Check every book
    allBooks.forEach(function(book) {

        const bookGenre = book.dataset.genre;
        const bookFormats = (book.dataset.format || "").split(" ");
        const bookType = book.dataset.type;
        const bookReading = (book.dataset.reading || "").split(" ");

        // Check genre
        const genreMatch =
            selectedGenres.length === 0 ||
            selectedGenres.includes(bookGenre);

        // Check format
        const formatMatch =
            selectedFormats.length === 0 ||
            selectedFormats.some(format => bookFormats.includes(format));
            
        // Check book type
        const typeMatch =
            selectedTypes.length === 0 ||
            selectedTypes.some(type =>
            type.toLowerCase().replace("-", "") ===
            bookType.toLowerCase().replace("-", ""));

        // Check reading preferences
        const readingMatch =
            selectedReading.length === 0 ||
            selectedReading.some(type => bookReading.includes(type));

        // Display matching books
        if (genreMatch && formatMatch && typeMatch && readingMatch) 
        {
            resultsContainer.appendChild(book.cloneNode(true));
            matchingBooks++;
        }
    });

    // Display filtered results
    exploreLayout.classList.add("filtering");

    // Display message if no books match
    noResults.hidden = matchingBooks !== 0;

    // Move page to filtered results
    document.getElementById("filter-results").scrollIntoView({
        behavior: "smooth", block: "start"});
});


// Clear filters and restore original books
filterForm.addEventListener("reset", function() {

    exploreLayout.classList.remove("filtering");
    resultsContainer.innerHTML = "";
    noResults.hidden = true;

});


// Reset filters when selecting a genre
document.querySelectorAll(".genre-links a").forEach(function(link) {

    link.addEventListener("click", function() {
        filterForm.reset();
    });

});


/* BOOK SEARCH */

// Get the search query from the URL
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("query");

// Stop if the user did not search for anything
if (searchQuery && searchQuery.trim() !== "") {

    // Get all book cards from the Explore page
    const bookCards = document.querySelectorAll(".explore-book-card");

    // Create a message area
    const searchMessage = document.createElement("div");
    searchMessage.classList.add("search-message");

    const exploreHeader = document.querySelector(".explore-header");

    // Place the message below the Explore header
    exploreHeader.insertAdjacentElement("afterend", searchMessage);

    // Format the search text
    const searchText = searchQuery.trim().toLowerCase();

    var matchingBook = null;

    // First, look for an exact book title
    bookCards.forEach(function(card) {

        const title = card.querySelector("h3");

        if (title && title.textContent.trim().toLowerCase() === searchText) {
            matchingBook = card;
        }

    });

    // If no exact match exists, look for a partial title match
    if (!matchingBook) {

        bookCards.forEach(function(card) {

            const title = card.querySelector("h3");

            if (!matchingBook && title &&
                title.textContent.toLowerCase().includes(searchText)) {

                matchingBook = card;

            }

        });

    }

    // If a matching book is found
    if (matchingBook) {

        searchMessage.textContent = "Showing results for: " + searchQuery;

        // Make sure the original genre sections are visible
        exploreLayout.classList.remove("filtering");

        // Highlight the matching book
        matchingBook.classList.add("search-highlight");

        // Scroll to the matching book
        matchingBook.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

    // If no matching book is found
    else {

        searchMessage.textContent =
            'Book Not Found: We couldn\'t find "' + searchQuery +
            '". Try searching for another book!';

        searchMessage.classList.add("search-not-found");

    }

}
