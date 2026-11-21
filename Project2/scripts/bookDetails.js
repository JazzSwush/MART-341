
// Get the book ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

// Get the HTML elements
const bookDetails = document.getElementById("book-details");
const bookNotFound = document.getElementById("book-not-found");
const synopsisSection = document.getElementById("book-synopsis-section");

// Load the book information
fetch("data/books.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load book information.");
        }

        return response.json();
    })
    .then(books => {

        // Find the book that matches the URL ID
        const book = books.find(book => book.id === bookId);

        // Check if the book exists
        if (!book) {
            bookNotFound.hidden = false;
            return;
        }

        // Display the book details
        document.getElementById("book-cover").src = book.cover;
        document.getElementById("book-cover").alt = book.title + " book cover";
        document.getElementById("book-genre").textContent = book.genre || "";
        document.getElementById("book-title").textContent = book.title;
        document.getElementById("book-author").textContent = "By " + book.author;
        document.getElementById("book-description").textContent = book.description || "";

        // Display additional information
        document.getElementById("book-pages").textContent = book.pages || "Not available";
        document.getElementById("book-published").textContent = book.published || "Not available";
        document.getElementById("book-publisher").textContent = book.publisher || "Not available";
        document.getElementById("book-rating").textContent = book.rating || "Not available";
        document.getElementById("book-type").textContent = book.type || "Not available";

        // Display available formats
        document.getElementById("book-formats").textContent =
            book.format && book.format.length > 0
                ? book.format.map(format => {
                    return format.charAt(0).toUpperCase() + format.slice(1);
                }).join(", ")
                : "Not available";

        // Display the synopsis
        document.getElementById("book-synopsis").textContent =
            book.synopsis || "A synopsis for this book has not been added yet.";

        // Update the browser tab title
        document.title = book.title + " | Novel Nook";

        // Show the book information
        bookDetails.hidden = false;
        synopsisSection.hidden = false;
    })
    .catch(error => {
        console.error("Error loading book:", error);
        bookNotFound.hidden = false;
        bookNotFound.querySelector("p").textContent =
            "We couldn't load the book information. Please check your books.json file and try again.";
    });
