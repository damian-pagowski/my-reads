import React, { Component } from "react";
import { categories } from "./App";
import { Link } from "react-router-dom";
import BookShelf from "./BookShelf";
import Book from "./Book";

import * as BooksAPI from "./BooksAPI";
import _ from "lodash";
let that;

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.debouncedOnChange = _.debounce(this.debouncedOnChange.bind(this), 500);
    that = this;
  }

  state = {
    query: "",
    books: [],
    idToCategory: {},
  };

  componentDidMount = () => {
    const map = new Map();
    const booksCategorized = this.props.categorizedBooks.map(
      book => (map[book.id] = book.shelf)
    );
    this.setState({ idToCategory: booksCategorized });
  };

  debouncedOnChange = query => {
    this.search(query);
  };

  assignCategory = books => {
    return books.map(book => (book.shelf = "none"));
  };

  updateBook = (bookToUpdate, newShelf) => {
    const booksCopy = [...this.state.books];
    const matching = booksCopy.filter(book => book.id === bookToUpdate.id)[0];
    matching.shelf = newShelf;
    this.setState({ books: booksCopy });
    this.props.onUpdateCategory(bookToUpdate, newShelf);
  };

  onSearch = query => {
    const cleanedQuery = query.replace(/[^0-9a-zA-Z_ ]/g, "");
    this.setState(() => ({ query: cleanedQuery }));

    const keywords = cleanedQuery.split(/(\s+)/);
    this.debouncedOnChange(keywords);
  };

  search = keywords => {
    keywords.forEach(query => {
      BooksAPI.search(query).then(response => {
        if (response && !response.hasOwnProperty("error")) {
          const books = response.map(obj => ({
            ...obj,
            shelf: this.state.idToCategory[obj.id]
              ? this.state.idToCategory[obj.id]
              : "none",
          }));
          this.setState({ books: books });
        }
      });
    });
  };

  render = () => {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/">
            <button className="close-search">Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            <input
              onChange={event => this.onSearch(event.target.value)}
              type="text"
              value={this.state.query}
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.books.length > 0 &&
              this.state.books
                .filter(book => book.shelf === "none")
                .map(book2 =>
                  <Book book={book2} onUpdateCategory={that.updateBook} />
                )}
          </ol>

          {this.state.books.length > 0
            ? categories
                .filter(category => category.name !== "none")
                .map((category, index) =>
                  <BookShelf
                    key={index}
                    onUpdateCategory={this.updateBook}
                    name={category.display}
                    books={this.state.books.filter(
                      b => b.shelf === category.name
                    )}
                  />
                )
            : <h2 style={{ marginLeft: "2em" }}>No results...</h2>}
        </div>
      </div>
    );
  };
}

export default Search;
