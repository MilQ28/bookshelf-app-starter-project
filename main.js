const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

function generateId() {
  return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function renderBooks(booksToRender = books) {
  const incompleteBookList = document.querySelector("#incompleteBookList");
  const completeBookList = document.querySelector("#completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of booksToRender) {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.classList.add("book-item");

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = book.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", () => editBook(book.id));

    buttonContainer.append(toggleButton, deleteButton, editButton);
    bookElement.append(title, author, year, buttonContainer);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

function addBook(event) {
  event.preventDefault();
  const title = document.querySelector("#bookFormTitle").value.trim();
  const author = document.querySelector("#bookFormAuthor").value.trim();
  const year = parseInt(document.querySelector("#bookFormYear").value);
  const isComplete = document.querySelector("#bookFormIsComplete").checked;
  const id = generateId();
  const newBook = createBookObject(id, title, author, year, isComplete);
  books.push(newBook);
  saveData();
  renderBooks();
  document.querySelector("#bookForm").reset();
}

function deleteBook(bookId) {
  const confirmDelete = confirm("Apakah kamu yakin ingin menghapus buku ini?");
  if (!confirmDelete) return;
  books = books.filter((book) => book.id !== bookId);
  saveData();
  renderBooks();
}

function toggleBookStatus(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveData();
  renderBooks();
}

function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;
  const newTitle = prompt("Ubah judul:", book.title);
  const newAuthor = prompt("Ubah penulis:", book.author);
  const newYear = prompt("Ubah tahun:", book.year);
  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = parseInt(newYear);
    saveData();
    renderBooks();
  }
}

function searchBook(event) {
  event.preventDefault();
  const searchInput = document
    .querySelector("#searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchInput)
  );
  renderBooks(filteredBooks);
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderBooks();
  const bookForm = document.querySelector("#bookForm");
  const searchForm = document.querySelector("#searchBook");
  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBook);
  const checkbox = document.querySelector("#bookFormIsComplete");
  const submitBtn = document.querySelector("#bookFormSubmit span");
  checkbox.addEventListener("change", () => {
    submitBtn.textContent = checkbox.checked
      ? "Selesai dibaca"
      : "Belum selesai dibaca";
  });
});
