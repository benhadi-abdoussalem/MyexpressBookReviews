const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Basic checks
  if (!username || typeof username !== 'string') {
    return false;
  }

  // Length check
  if (username.length < 4 || username.length > 20) {
    return false;
  }

  // Character check
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return false;
  }

  return true;
};


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if   
 //user exists (replace with your validation logic)
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password'   
 });
  }

  // Validate password (replace with your comparison logic)
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate JWT token on successful login
  const token = jwt.sign({ userId: user.id }, 'your_secret_key');

  res.status(200).json({ message: 'Login successful', token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
