const db = require("../db");
const ExpressError = require("../../expressError");

class Author{

    //Get all authors
    static async all() {
        const result = await db.query(`
            SELECT id, name 
            FROM authors 
            ORDER BY name;`);
        return result.rows;
    }

    //Get author by id
    static async get(id) {
        const result = await db.query(`
            SELECT id, name
            FROM authors
            WHERE id = $1`,[id]);

        if (!result.rows[0]) {
            throw new ExpressError(`No such author: ${id}`, 404);
        }
        
        return result.rows[0];
    }

    //Get all books by author
    static async getBooks(id) {
        const author = await Author.get(id);

        if (!author) {
             throw new ExpressError(`No such author: ${id}`, 404);
        }

        const books = await db.query(`
            SELECT b.id, b.title, b.status, b.sprayed_edges, b.signed
            FROM books b
            JOIN book_authors ba ON b.id = ba.book_id
            WHERE ba.author_id = $1
            ORDER BY b.title;`, [id]);
        authorBooks = { author: author, books: books.rows };
        return authorBooks;
    }

    //Create new author
    static async create(name) {
        if (!name) {
            throw new ExpressError("Author name is required", 400);
        }
        const result = await db.query(`
            INSERT INTO authors(name)
            VALUES ($1)
            RETURNING id, name 
            `, [name]);        
        return result.rows[0];
    }

    //Update an author
    static async update(id, name) {
        const result = await db.query(`
            UPDATE authors
            SET name = $2 
            WHERE id = $1
            RETURNING id, name`, [id, name]);
        return result.rows[0];

    }

    //Delete author
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM authors WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No such author: ${id}`, 404);
        }

        return { message: "Author deleted" };
    }
}

module.exports = Author;