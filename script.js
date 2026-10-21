
const books = [
    {
        id: 1,
        title: "Java Programming",
        author: "Herbert Schildt",
        category: "Programming",
        price: 499,
        color: "green",
        image: "https://placehold.co/240x320/254b3b/ffffff?text=JAVA%0APROGRAMMING"
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        price: 599,
        color: "dark",
        image: "https://placehold.co/240x320/253746/ffffff?text=CLEAN%0ACODE"
    },
    {
        id: 3,
        title: "Python Basics",
        author: "Programming Guide",
        category: "Programming",
        price: 399,
        color: "blue",
        image: "https://placehold.co/240x320/36648b/ffffff?text=PYTHON%0ABASICS"
    },
    {
        id: 4,
        title: "The Silent Forest",
        author: "A. Sharma",
        category: "Fiction",
        price: 299,
        color: "orange",
        image: "https://placehold.co/240x320/bb754a/ffffff?text=THE%20SILENT%0AFOREST"
    },
    {
        id: 5,
        title: "The Great Journey",
        author: "R. Mehta",
        category: "Fiction",
        price: 349,
        color: "purple",
        image: "https://placehold.co/240x320/695276/ffffff?text=THE%20GREAT%0AJOURNEY"
    },
    {
        id: 6,
        title: "Mathematics Made Easy",
        author: "Student Edition",
        category: "Education",
        price: 250,
        color: "blue",
        image: "https://placehold.co/240x320/367a87/ffffff?text=MATHEMATICS"
    },
    {
        id: 7,
        title: "Computer Networks",
        author: "Academic Edition",
        category: "Education",
        price: 450,
        color: "green",
        image: "https://placehold.co/240x320/37624d/ffffff?text=COMPUTER%0ANETWORKS"
    },
    {
        id: 8,
        title: "Think and Grow",
        author: "Personal Growth",
        category: "Business",
        price: 320,
        color: "orange",
        image: "https://placehold.co/240x320/c96e42/ffffff?text=THINK%20AND%0AGROW"
    },
    {
        id: 9,
        title: "Business Strategy",
        author: "Management Guide",
        category: "Business",
        price: 550,
        color: "dark",
        image: "https://placehold.co/240x320/293e48/ffffff?text=BUSINESS%0ASTRATEGY"
    },
    {
        id: 10,
        title: "Web Development",
        author: "HTML CSS JavaScript",
        category: "Programming",
        price: 425,
        color: "purple",
        image: "https://placehold.co/240x320/695276/ffffff?text=WEB%0ADEVELOPMENT"
    },
    {
        id: 11,
        title: "The Mystery House",
        author: "K. Desai",
        category: "Fiction",
        price: 275,
        color: "dark",
        image: "https://placehold.co/240x320/303b35/ffffff?text=MYSTERY%0AHOUSE"
    },
    {
        id: 12,
        title: "Artificial Intelligence",
        author: "Technology Series",
        category: "Education",
        price: 650,
        color: "blue",
        image: "https://placehold.co/240x320/36648b/ffffff?text=ARTIFICIAL%0AINTELLIGENCE"
    }
];

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const noResults = document.getElementById("noResults");
const resultsInfo = document.getElementById("resultsInfo");
const categoryButtons = document.querySelectorAll(".category-btn");

let selectedCategory = "All";
let searchTerm = "";

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem("pageTurnCart") || "[]");

        if (!Array.isArray(saved)) return [];

        return saved.filter(item =>
            item &&
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            books.some(book => book.id === item.id)
        );
    } catch (error) {
        return [];
    }
}

let cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem("pageTurnCart", JSON.stringify(cart));
    } catch (error) {
        alert("Cart could not be saved in this browser.");
    }
}

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function renderBooks() {
    const filteredBooks = books.filter(book => {
        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        const searchable = (book.title + " " + book.author + " " + book.category)
            .toLowerCase();

        return matchesCategory && searchable.includes(searchTerm);
    });

    bookGrid.innerHTML = filteredBooks.map(book => `
        <article class="book-card">
            <div class="book-cover-art">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
            </div>

            <div class="book-info">
                <span class="book-category">${book.category}</span>
                <h3>${book.title}</h3>
                <p class="book-author">By ${book.author}</p>

                <div class="book-bottom">
                    <span class="book-price">${formatPrice(book.price)}</span>
                </div>

                <button class="add-cart-btn" data-add="${book.id}">
                    + Add to Cart
                </button>
            </div>
        </article>
    `).join("");

    noResults.hidden = filteredBooks.length > 0;
    resultsInfo.textContent = `${filteredBooks.length} book(s) found`;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById("cartCount");

    if (countElement) {
        countElement.textContent = count;
    }
}

function addToCart(bookId) {
    const existing = cart.find(item => item.id === bookId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: bookId, quantity: 1 });
    }

    saveCart();
    updateCartCount();
}

searchInput.addEventListener("input", function() {
    searchTerm = this.value.trim().toLowerCase();
    renderBooks();
});

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchTerm = searchInput.value.trim().toLowerCase();
    renderBooks();
});

categoryButtons.forEach(button => {
    button.addEventListener("click", function() {
        selectedCategory = this.dataset.category;

        categoryButtons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        renderBooks();
    });
});

document.addEventListener("click", function(event) {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));

        const originalText = addButton.textContent;
        addButton.textContent = "✓ Added to Cart";

        setTimeout(() => {
            if (addButton.isConnected) {
                addButton.textContent = originalText;
            }
        }, 900);
    }
});

renderBooks();
updateCartCount();
