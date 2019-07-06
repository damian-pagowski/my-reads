import React, { Component } from 'react'
import default_book from "./img/book.png"

class Book extends Component {
  change (event) {
    const value = event.target.value
    this.props.onUpdateCategory(this.props.book, value)
  }

  render () {
    const book = this.props.book
    return (
      <li key={book.id}>
        <div className='book'>
          <div className='book-top'>
            <div
              className='book-cover'
              style={{
                  width: 128,
                  height: 193,
                  backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : default_book})`
              }}
            />
            <div className='book-shelf-changer'>
              <select onChange={this.change.bind(this)}>
                <option value='move' disabled selected>
                  Move to...
                </option>
                <option value='currentlyReading'>Currently Reading</option>
                <option value='wantToRead'>Want to Read</option>
                <option value='read'>Read</option>
                <option value='none'>None</option>
              </select>
            </div>
          </div>
          <div className='book-title'>
            {book.title}
          </div>
          {book.authors &&
            book.authors.map(author =>
              <div className='book-authors'>
                {author}
              </div>
            )}
        </div>
      </li>
    )
  }
}

export default Book
