const request = require('supertest');
const path = require("path");
const fs = require('fs');
const app = require('../../app');
const db = require('../../db');
const Series = require('../../models/series');
const Book = require("../../models/books");


beforeAll(async () => {
    try {
        const schemaPath = path.join(__dirname, "../../schema.sql");
        const seedPath = path.join(__dirname, "../../seed.sql");
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const seed = fs.readFileSync(seedPath, 'utf8');
        await db.query(schema);
        await db.query(seed);
    } catch (err) {
        console.error('Error setting up test database:', err.message);
    }
});

afterAll(async () => {
    await db.end();
});

describe("Series Model Test Suite", () => {

    test("Series.all() returns all seeded series", async () => {
        const seriesList = await Series.all();
        expect(seriesList.length).toBeGreaterThan(0);
        expect(seriesList[0]).toHaveProperty("name");
    });

    test("Series.get(id) returns a series and its associated books ordered by series_index when ID exists", async () => {
        const series = await Series.create({ name: "Crescent City" });
        const book1 = await Book.create({ title: "House of Earth and Blood", author_name: "Sarah J Maas" });
        const book2 = await Book.create({ title: "House of Sky and Breath", author_name: "Sarah J Maas" });

        await Series.addBook(series.id, book2.id, 2);
        await Series.addBook(series.id, book1.id, 1);

        const fetchedSeries = await Series.get(series.id);
        expect(fetchedSeries).toBeDefined();
        expect(fetchedSeries.id).toBe(series.id);
        expect(fetchedSeries.name).toBe("Crescent City");
        expect(fetchedSeries.books.length).toBe(2);
        
        // Verify sorting order by series_index
        expect(fetchedSeries.books[0].series_index).toBe(1);
        expect(fetchedSeries.books[1].series_index).toBe(2);
    });

    test("Series.get(id) throws a 404 ExpressError when series ID does not exist", async () => {
        await expect(Series.get(99999)).rejects.toThrow("No series found: 99999");
    });

    test("Series.create() successfully creates and returns a new series", async () => {
        const newSeries = await Series.create({ name: "The Empyrean" });
        expect(newSeries.id).toBeDefined();
        expect(newSeries.name).toBe("The Empyrean");
    });

    test("Series.create() throws a 400 ExpressError if name is missing", async () => {
        await expect(Series.create({})).rejects.toThrow("Series name is required");
    });

    test("Series.addBook() successfully links a book to a series with a series index", async () => {
        const series = await Series.create({ name: "Test Series" });
        const book = await Book.create({ title: "Test Series Book", author_name: "Test Author" });

        const link = await Series.addBook(series.id, book.id, 1);
        expect(link.series_id).toBe(series.id);
        expect(link.book_id).toBe(book.id);
        expect(link.series_index).toBe(1);
    });

    test("Series.delete(id) deletes a series successfully", async () => {
        const series = await Series.create({ name: "Series To Delete" });
        
        const res = await Series.delete(series.id);
        expect(res).toEqual({ message: "Series deleted" });

        // Verify it's gone
        await expect(Series.get(series.id)).rejects.toThrow(`No series found: ${series.id}`);
    });

    test("Series.delete(id) throws 404 if series ID does not exist", async () => {
        await expect(Series.delete(99999)).rejects.toThrow("No series found: 99999");
    });

});