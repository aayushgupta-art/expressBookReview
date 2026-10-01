const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].author === author) {
      matchingBooks.push({
        "isbn": key,
        "author": books[key].author,
        "title": books[key].title,
        "reviews": books[key].reviews
      });
    }
  }
  return res.status(200).json(matchingBooks);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].title === title) {
      matchingBooks.push({
        "isbn": key,
        "author": books[key].author,
        "title": books[key].title,
        "reviews": books[key].reviews
      });
    }
  }
  return res.status(200).json(matchingBooks);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
