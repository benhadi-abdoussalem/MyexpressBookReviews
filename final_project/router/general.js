const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [{ "username": "abd", "password": "123" }];

const authenticatedUsers = (req, res, next) => {
  const accessToken = req.headers['authorization'];
  if (accessToken) {
    jwt.verify(accessToken, 'access', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'User not authenticated, Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ message: 'User not logged in, No token provided' });
  }
};

const isValid = (username) => {
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0;
};

const authenticatedUser = (username, password) => {
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
};

regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = accessToken;
    return res.status(200).send('User successfully logged in');
  } else {
    return res.status(208).json({ message: 'Invalid Login. Check username and password' });
  }
});

regd_users.put('/auth/review/:isbn', authenticatedUsers, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send('Review successfully posted');
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

regd_users.delete('/auth/review/:isbn', authenticatedUsers, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res.status(200).send('Review successfully deleted');
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;