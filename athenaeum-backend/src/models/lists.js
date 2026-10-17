const db = require("../db");
const ExpressError = require("../../expressError");

class List{
    //Get all lists
    static async all() {
        const result = await db.query(`
            SELECT id, name, description, is_private, created_at, updated_at 
            FROM lists 
            ORDER BY name;`);
        return result.rows;
    }

    //Get list by id
    static async get(id) {
        const listResult = await db.query(`
            SELECT id, name, description, is_private, created_at, updated_at 
            FROM lists 
            WHERE id = $1;`, [id]);

        const list = listResult.rows[0];

        if (!list) {
            throw new ExpressError(`No such list: ${id}`, 404);
        }

        // Fetch all books belonging to this list using the junction table
        const booksResult = await db.query(`
            SELECT b.id, b.title, b.status, b.sprayed_edges, b.signed
            FROM books b
            JOIN book_lists bl ON b.id = bl.book_id
            WHERE bl.list_id = $1
            ORDER BY b.title;`, [id]);

        list.books = booksResult.rows;

        return list;
    }

    //Create new list
    static async create({ name, description, is_private }) {
    if(!name) {
            throw new ExpressError("List name is required", 400);
        }

        const result = await db.query(`
            INSERT INTO lists (name, description, is_private)
            VALUES ($1, $2, $3)
            RETURNING id, name, description, is_private, created_at, updated_at;`,
            [name, description || null, is_private || false]);

        return result.rows[0];
    }

    //Update list details
    static async update(id, { name, description, is_private }) {
        const result = await db.query(`
            UPDATE lists
            SET name = $2, description = $3, is_private = $4
            WHERE id = $1
            RETURNING id, name, description`, [id, name, description, is_private]);
        return result.rows[0];
    }

    //Add book to list
    static async addBook(listId, bookId) {
        const result = await db.query(`
            INSERT INTO book_lists (list_id, book_id)
            VALUES ($1, $2)
            RETURNING list_id, book_id;`,
            [listId, bookId]);

        return result.rows[0];
    }

    //Remove book from list
    static async removeBook(listId, bookId) {
        const result = await db.query(`
            DELETE FROM book_lists 
            WHERE list_id = $1 AND book_id = $2 
            RETURNING list_id, book_id;`,
            [listId, bookId]);

        if (result.rows.length === 0) {
            throw new ExpressError(`Book ${bookId} not found in list ${listId}`, 404);
        }
    
        return { message: "Book removed from list" };
    }

    //Delete list
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM lists 
            WHERE id = $1
            RETURNING id`, [id]);

        if (result.rows.length === 0) {
            throw new ExpressError(`No such list: ${id}`, 404);
        }
        return { message: "List deleted" };
    }
}

module.exports = List;