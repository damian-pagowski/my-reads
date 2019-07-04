import React from "react";
import * as BooksAPI from "./BooksAPI";
import BookShelf from "./BookShelf";
import Search from "./Search";

import { Route, Link } from "react-router-dom";
import "./App.css";

class BooksApp extends React.Component {
 
  state = {
    books: [],
    showSearchPage: false,
  };

  componentDidMount() {
    BooksAPI.getAll().then(b => {
      this.setState(() => ({ books: b }));
    });
  }

  updateBook = (bookToUpdate, newShelf) => {
    let booksCopy = [...this.state.books];
    const matchingBook = booksCopy.find(b => b.id === bookToUpdate.id);
    if (matchingBook) {
      matchingBook.shelf = newShelf;
    } else {
      bookToUpdate.shelf = newShelf;
      booksCopy = [bookToUpdate, ...booksCopy];
    }
    BooksAPI.update(bookToUpdate, newShelf).then(() =>
      this.setState({ books: booksCopy })
    );
  };

  onUpdateCategory(id, category) {
    BooksAPI.update({ id: id }, category).then(b => {
      this.setState(() => ({ books: b }));
    });
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/search"
          render={() =>
            <Search onUpdateCategory={this.updateBook.bind(this)} />}
        />

        <Route
          exact
          path="/"
          render={() =>
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf
                    key={"currentlyReading"}
                    onUpdateCategory={this.updateBook.bind(this)}
                    name={"Currently Reading"}
                    books={this.state.books.filter(
                      b => b.shelf === "currentlyReading"
                    )}
                  />
                  <BookShelf
                    key={"wantToRead"}
                    onUpdateCategory={this.updateBook.bind(this)}
                    name={"Want to Read"}
                    books={this.state.books.filter(
                      b => b.shelf === "wantToRead"
                    )}
                  />
                  <BookShelf
                    key={"read"}
                    onUpdateCategory={this.updateBook.bind(this)}
                    name={"Read"}
                    books={this.state.books.filter(b => b.shelf === "read")}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">
                  <button>Add a book</button>
                </Link>
              </div>
            </div>}
        />
      </div>
    );
  }
}

export default BooksApp;
