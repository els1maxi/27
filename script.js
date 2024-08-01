document.addEventListener("DOMContentLoaded", () => {
    // Weather 
    const weatherList = document.getElementById("weatherList");
    const getMinTemp = document.getElementById("getMin");
    const getMaxTemp = document.getElementById("getMax");
    const getAvgTemp = document.getElementById("getAvg"); 

    const Weather = (function() {
        const weatherForecast = {
            Monday: 30,
            Tuesday: 28,
            Wednesday: 29,
            Thursday: 32,
            Friday: 34,
            Saturday: 30,
            Sunday: 31,
        };

        return {
            getAverageTemperature: function() {
                const temperatures = Object.values(weatherForecast);
                const sum = temperatures.reduce((acc, cur) => acc + cur, 0);
                return parseFloat((sum / temperatures.length).toFixed());
            },

            getMaxTemperature: function() {
                return Math.max(...Object.values(weatherForecast));
            },

            getMinTemperature: function() {
                return Math.min(...Object.values(weatherForecast));
            },

            toString: function() {
                const shortDays = Object.keys(weatherForecast).map(day => day.slice(0, 3));
                return `(${shortDays.join(" - ")})`;
            },

            valueOf: function() {
                return this.getAverageTemperature();
            },

            renderWeatherList: function() {
                const keys = Object.keys(weatherForecast);
                const lastKeyIndex = keys.length - 1;

                weatherList.innerHTML = ''; 
                for (const [index, day] of Object.entries(keys)) {
                    const temperature = weatherForecast[day];
                    const listItem = document.createElement("li");
                    listItem.classList.add("weather-item");
                    if (index != lastKeyIndex) {
                        listItem.classList.add("border-right");
                    }
                    listItem.innerHTML = `
                        <span>${day.slice(0, 3)}</span>
                        <span class="text-2xl">${temperature}°C</span>
                    `;
                    weatherList.appendChild(listItem);
                }
            }
        };
    })();

    Weather.renderWeatherList();
    getMinTemp.addEventListener("click", () => alert(Weather.getMinTemperature()));
    getMaxTemp.addEventListener("click", () => alert(Weather.getMaxTemperature()));
    getAvgTemp.addEventListener("click", () => alert(Weather.getAverageTemperature())); 
   
    // Library 
    const bookTitleInput = document.getElementById("bookTitle");
    const bookAuthorInput = document.getElementById("bookAuthor");
    const bookYearInput = document.getElementById("bookYear");
    const addBookBtn = document.getElementById("addBook");
    const listAvailableBooksBtn = document.getElementById("listAvailableBooks");
    const findBooksByAuthorBtn = document.getElementById("findBooksByAuthor");
    const bookList = document.getElementById("bookList");

    function Book(title, author, year) {
        return {
            title: title,
            author: author,
            year: year,
            available: true,
            ratings: [],
            borrowedBy: [],
            addRating: function(user, rating) {
                if (this.borrowedBy.includes(user.id) && rating >= 1 && rating <= 5) {
                    this.ratings.push({ userId: user.id, rating: rating });
                }
            },
            getAverageRating: function() {
                if (this.ratings.length === 0) return 0;
                const totalRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                return totalRating / this.ratings.length;
            }
        };
    }

    function Library() {
        return {
            books: [],
            addBook: function(book) {
                this.books.push(book);
            },
            removeBook: function(book) {
                const index = this.books.indexOf(book);
                if (index !== -1) {
                    this.books.splice(index, 1);
                }
            },
            findBooksByAuthor: function(author) {
                return this.books.filter(book => book.author === author);
            },
            listAvailableBooks: function() {
                return this.books.filter(book => book.available);
            },
            borrowBook: function(title) {
                const availableBook = this.books.find(book => book.title === title && book.available);
                if (availableBook) {
                    availableBook.available = false;
                    return availableBook;
                }
                return null;
            },
            returnBook: function(title) {
                const book = this.books.find(book => book.title === title && !book.available);
                if (book) {
                    book.available = true;
                }
            }
        };
    }

    function User(name) {
        return {
            id: Math.floor(Math.random() * 1000),
            name: name,
            borrowBook: function(title, library) {
                return library.borrowBook(title);
            },
            returnBook: function(title, library) {
                library.returnBook(title);
            }
        };
    }

    const myLibrary = Library();

    addBookBtn.addEventListener("click", () => {
        const title = bookTitleInput.value;
        const author = bookAuthorInput.value;
        const year = parseInt(bookYearInput.value, 10);

        if (title && author && year) {
            const newBook = Book(title, author, year);
            myLibrary.addBook(newBook);
            bookTitleInput.value = '';
            bookAuthorInput.value = '';
            bookYearInput.value = '';
            alert("Book added successfully!");
        } else {
            alert("Please fill out all fields.");
        }
    });

    listAvailableBooksBtn.addEventListener("click", () => {
        bookList.innerHTML = '';
        const availableBooks = myLibrary.listAvailableBooks();
        availableBooks.forEach(book => {
            const listItem = document.createElement("li");
            listItem.textContent = `${book.title} by ${book.author} (${book.year})`;
            bookList.appendChild(listItem);
        });
    });

    findBooksByAuthorBtn.addEventListener("click", () => {
        const author = prompt("Enter author name:");
        if (author) {
            bookList.innerHTML = '';
            const booksByAuthor = myLibrary.findBooksByAuthor(author);
            booksByAuthor.forEach(book => {
                const listItem = document.createElement("li");
                listItem.textContent = `${book.title} (${book.year}) - ${book.available ? "Available" : "Borrowed"}`;
                bookList.appendChild(listItem);
            });
        }
    });
});