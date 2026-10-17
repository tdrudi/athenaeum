
const db = require("../db");
const ExpressError = require("../../expressError");
const Author = require("./authors");


class Book {

    //Get all books
    static async all() {
        const result = await db.query(`SELECT id, isbn, title, status, sprayed_edges, signed, is_wishlist, page_count
            FROM books
            ORDER BY id`);
         if (result.rows.length === 0) {
            throw new ExpressError(`Books not found.`, 404);
        }
        return result.rows;
    }

    //Get book by id, if no book throw 404
    static async get(id) {
        const result = await db.query(
            `SELECT id, isbn, title, status, sprayed_edges, signed, is_wishlist, page_count 
             FROM books 
             WHERE id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
                throw new ExpressError(`Book not found.`, 404);
            }
        return result.rows[0];
    }

    //Create new book
    static async create({ isbn, title, status, sprayed_edges, page_count, signed, is_wishlist, author_name }) {
        const result = await db.query(
            `INSERT INTO books (isbn, title, status, page_count, sprayed_edges, signed, is_wishlist)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, isbn, title, page_count, status, sprayed_edges, signed, is_wishlist`,
            [isbn,
             title,
             status || 'Unread',
             page_count, 
             sprayed_edges || false,
             signed || false,
             is_wishlist || false]);

        const book = result.rows[0];
        
        let authorRes = await db.query(`
            SELECT id, name 
            FROM authors
            WHERE name = $1`,
            [author_name]);
        let author = authorRes.rows[0];            
        
        if (!author) {
            author = await Author.create(author_name);
        }
        
        await db.query(
                `INSERT INTO book_authors (book_id, author_id)
                VALUES ($1, $2)`, [book.id, author.id]);
            book.author = author;
            return book;
    }

    //Update book details
    static async update(id, { title, status, sprayed_edges, signed, is_wishlist, page_count }){
        const result = await db.query(`
            UPDATE books 
            SET title = $2, status = $3, sprayed_edges = $4, signed = $5, is_wishlist = $6, page_count = $7
            WHERE id = $1
            RETURNING id, isbn, title, status, sprayed_edges, signed, is_wishlist, page_count`,
            [id, title, status, sprayed_edges, signed, is_wishlist, page_count, ]);
        
         if (result.rows.length === 0) {
            throw new ExpressError(`Book not found.`, 404);
        }
        return result.rows[0];
    }


    //Delete book by id
    static async delete(id) {
        const result = await db.query(`DELETE FROM books WHERE id = $1 RETURNING id`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Book not found.`, 404);
        }
        return { message: "Book deleted" };
    }

};

module.exports = Book;