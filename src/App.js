import React from "react";
import * as BooksAPI from "./BooksAPI";
import BookShelf from "./BookShelf";
import Search from "./Search";

import { Route, Link } from "react-router-dom";
import "./App.css";

class BooksApp extends React.Component {
  state = {
    books: [],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
  };

  componentDidMount() {
    BooksAPI.getAll().then(b => {
      this.setState(() => ({ books: b }));
    });
  }


  onUpdateCategory(id, category){
    BooksAPI.update({id : id}, category)
    .then(b => {
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
            <Search/>
            }
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
                    name={"Currently Reading"}
                    books={this.state.books.filter(
                      b => b.shelf === "currentlyReading"
                    )}
                  />
                  <BookShelf
                    name={"Want to Read"}
                    books={this.state.books.filter(
                      b => b.shelf === "wantToRead"
                    )}
                  />
                  <BookShelf
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
