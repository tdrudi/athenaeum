const db = require("../db");
const ExpressError = require("../../expressError");

class Series{
 
    //Get all series
    static async all() {
        const result = await db.query(`
            SELECT id, name 
            FROM series 
            ORDER BY name;
        `);
        return result.rows;
    }

    //Get books by series
    static async get(id) {
        const seriesResult = await db.query(`
            SELECT id, name 
            FROM series 
            WHERE id = $1;`, [id]);

        const series = seriesResult.rows[0];

        if (!series) {
            throw new ExpressError(`No series found: ${id}`, 404);
        }

        // Fetch all books belonging to this series using the junction table, ordered by index
        const booksResult = await db.query(`
            SELECT b.id, b.title, b.status, b.sprayed_edges, b.signed, bs.series_index
            FROM books b
            JOIN book_series bs ON b.id = bs.book_id
            WHERE bs.series_id = $1
            ORDER BY bs.series_index ASC NULLS LAST, b.title;`, [id]);

        series.books = booksResult.rows;

        return series;
    }

    //Create new series
    static async create({ name }) {
        if (!name) {
            throw new ExpressError("Series name is required", 400);
        }

        const result = await db.query(`
            INSERT INTO series (name)
            VALUES ($1)
            RETURNING id, name;`, [name]);

        return result.rows[0];
    }

    //Add book to series
    static async addBook(seriesId,bookId, index) {
        const result = await db.query(`
            INSERT INTO book_series (series_id, book_id, series_index)
            VALUES ($1, $2, $3)
            RETURNING series_id, book_id, series_index;`,
            [seriesId, bookId, index]);

        return result.rows[0];
    }

    //Removd book from series
    static async removeBook(seriesId, bookId) {
        const result = await db.query(`
            DELETE FROM series
            WHERE id = $1 AND book_id = $2
            RETURNING id`,
            [seriesId, bookId]);
        
        return result.rows[0];
    }

    //Get series by author
    static async getByAuthor(id) {
        const authorCheck = await db.query(`SELECT id FROM authors WHERE id = $1`, [id]);
        if (authorCheck.rows.length === 0) {
            throw new ExpressError(`No such author: ${id}`, 404);
        }

        const result = await db.query(`
            SELECT DISTINCT s.id, s.name
            FROM series s
            JOIN book_series bs ON s.id = bs.series_id
            JOIN book_authors ba ON bs.book_id = ba.book_id
            WHERE ba.author_id = $1
            ORDER BY s.name;`, [id]);

        return result.rows;
    }

    //Edit series details
    static async update(id, name) {
        const result = await db.query(`
            UPDATE series
            SET name = $2 
            WHERE id = $1
            RETURNING id, name`, [id, name]);
        
        if (result.rows.length === 0) {
            throw new ExpressError(`No such series: ${id}`, 404);
        }
        return result.rows[0];
    }

    //Delete series
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM series 
            WHERE id = $1
            RETURNING id`, [id]);

        if (result.rows.length === 0) {
            throw new ExpressError(`No series found: ${id}`, 404);
        }

        return { message: "Series deleted" };
    }
}

module.exports = Series;