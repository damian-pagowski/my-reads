import React, { Component } from "react";
import Book from "./Book";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";

class Search extends Component {
  state = {
    books: [],
  };

  search = query => {
    BooksAPI.search(query).then(b => {
      this.setState(() => ({ books: b }));
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
              onChange={event => this.search(event.target.value)} // TODO remove
              type="text"
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
