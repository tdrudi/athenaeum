const db = require("../db");
const ExpressError = require("../../expressError");

class Tag{
    //Get all tags
    static async all() {
        const result = await db.query(`
            SELECT id, name 
            FROM tags 
            ORDER BY name;
        `);
        return result.rows;
    }
    
    //Get tag by id (with books)
    static async get(id) {
        const tagResult = await db.query(`
            SELECT id, name 
            FROM tags 
            WHERE id = $1;
        `, [id]);

        if (!tagResult.rows[0]) {
            throw new ExpressError(`No such tag: ${id}`, 404);
        }

        // Fetch all books belonging to this tag using the junction table
        const booksResult = await db.query(`
            SELECT b.id, b.title, b.status, b.sprayed_edges, b.signed
            FROM books b
            JOIN book_tags bt ON b.id = bt.book_id
            WHERE bt.tag_id = $1
            ORDER BY b.title;
        `, [id]);

       return {
            tagId: tagResult.rows[0].id,
            name: tagResult.rows[0].name,
            books: booksResult.rows
        };
    }

    //Create tag
    static async create(name) {
        if (!name || name === '') {
            throw new ExpressError("Tag name is required", 400);
        }

        const result = await db.query(`
            INSERT INTO tags (name)
            VALUES ($1)
            RETURNING id, name;
        `, [name]);
        return result.rows[0];
    }

    //Upate tag
    static async update(id, name) {
          const result = await db.query(`
            UPDATE tags
            SET name = $2
            WHERE id = $1
            RETURNING id, name;
        `, [id, name]);
        return result.rows[0];
    }



    //Add tag to book
    static async addBook(tagId, bookId) {
        const result = await db.query(`
            INSERT INTO book_tags (tag_id, book_id)
            VALUES ($1, $2)
            RETURNING tag_id, book_id;
        `, [tagId, bookId]);

        return result.rows[0];
    }

    //Remove tag from book
    static async removeBook(tagId, bookId) {
        const result = await db.query(`
            DELETE FROM book_tags 
            WHERE tag_id = $1 AND book_id = $2 
            RETURNING tag_id, book_id;
        `, [tagId, bookId]);

        if (result.rows.length === 0) {
            throw new ExpressError(`Tag not found for book.`, 404);
        }

        return { message: "Tag removed from book." };
    }

    //Delete tag
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM tags WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No such tag: ${id}`, 404);
        }

        return { message: "Tag deleted." };
    }
}

module.exports = Tag;