import React, { Component } from "react";
import Book from "./Book";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import _ from "lodash";

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.debouncedOnChange = _.debounce(
      this.debouncedOnChange.bind(this),
      500
    );
  }

  debouncedOnChange(query) {
    this.search(query);
  }

  state = {
    query: "",
    books: [],
  };

  onSearch(query) {
    const cleanedQuery = query.replace(/[^0-9a-zA-Z_ ]/g, "");
    this.setState(() => ({ query: cleanedQuery }));

    const keywords = cleanedQuery.split(/(\s+)/);
    this.debouncedOnChange(keywords);
  }
  search = keywords => {
    let results = [];
    keywords.forEach(query => {
      BooksAPI.search(query).then(b => {
        if (b && !b.hasOwnProperty("error")) {
          results.push(...b);
        }
        this.setState(() => ({ books: results }));
      });
    });

  };

  render() {
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
            {this.state.books &&
              this.state.books.map(book =>
                <Book
                  onUpdateCategory={this.props.onUpdateCategory}
                  book={book}
                />
              )}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
