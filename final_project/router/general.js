const express = require('express');
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Add middleware to parse JSON request bodies
public_users.use(express.json());

// Implementation of the registration process
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Please provide both username and password."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  // Assuming books is an object
  const booksArray = Object.values(books);
  // Filter the books array to find books whose isbn matches the extracted isbn parameter
  const filtered_books = booksArray.filter(book => book.isbn === isbn);
  // Check if any books were found
  if (filtered_books.length > 0) {
    // Send the filtered_books array as the response to the client
    res.send(filtered_books);
  } else {
    // Send a 404 Not Found response if no books were found
    res.status(404).json({ message: 'No books found for the given isbn.' });
  }
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Extract the author parameter from the request URL
  const author = req.params.author;
  // Assuming books is an object
  const booksArray = Object.values(books);
  // Filter the books array to find books whose author matches the extracted author parameter
  const filtered_books = booksArray.filter(book => book.author === author);
  // Check if any books were found
  if (filtered_books.length > 0) {
    // Send the filtered_books array as the response to the client
    res.send(filtered_books);
  } else {
    // Send a 404 Not Found response if no books were found
    res.status(404).json({ message: 'No books found for the given author.' });
  }
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Extract the title parameter from the request URL
  const title = req.params.title;
  // Assuming books is an object
  const booksArray = Object.values(books);
  // Filter the books array to find books whose title matches the extracted  parameter
  const filtered_books = booksArray.filter(book => book.title === title);
  // Check if any books were found
  if (filtered_books.length > 0) {
    // Send the filtered_books array as the response to the client
    res.send(filtered_books);
  } else {
    // Send a 404 Not Found response if no books were found
    res.status(404).json({ message: 'No books found for the given title.' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  // Assuming books is an object
  const booksArray = Object.values(books);
  // Filter the books array to find books whose isbn matches the extracted  parameter
  const filtered_books = booksArray.filter(book => book.isbn === isbn);
  // Check if any books were found
  if (filtered_books.length >= 0) {
    // Send the filtered_books array as the response to the client
    res.send(filtered_books);
  } else {
    // Send a 404 Not Found response if no books were found
    res.status(404).json({ message: 'No books found for the given isbn.' });
  }
});


module.exports.general = public_users;
