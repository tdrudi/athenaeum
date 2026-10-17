const request = require('supertest');
const fs = require('fs');
const path = require("path");
const app = require('../../app');
const db = require('../../db');
const Genre = require('../../models/genres');
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

describe("Genre Model Test", () => {

    test("Genre.all() returns all seeded genres", async () => {
        const genres = await Genre.all();
        expect(genres.length).toBeGreaterThan(0);
        expect(genres[0]).toHaveProperty("name");
    });

    test("Genre.get(id) returns a genre and its associated books array when ID exists", async () => {
        // Assuming genre ID 1 exists in the seed data
        const genre = await Genre.get(1);
        expect(genre).toBeDefined();
        expect(genre.id).toBe(1);
        expect(genre).toHaveProperty("name");
        expect(genre).toHaveProperty("books");
        expect(Array.isArray(genre.books)).toBe(true);
    });

    test("Genre.get(id) throws a 404 ExpressError when genre ID does not exist", async () => {
        await expect(Genre.get(99999)).rejects.toThrow("Genre not found");
    });

    test("Genre.create() successfully creates and returns a new genre", async () => {
        const newGenre = await Genre.create({ name: "Test" });
        expect(newGenre.id).toBeDefined();
        expect(newGenre.name).toBe("Test");
    });

    test("Genre.create() throws a 400 ExpressError if name is missing", async () => {
        await expect(Genre.create({})).rejects.toThrow("Genre name is required");
    });

    test("Genre.add() successfully links a genre to a book via junction table", async () => {
        const genre = await Genre.create({ name: "Dark Academia" });
        const book = await Book.create({ title: "Nightshade", author_name: "Autumn Woods"});
        const link = await Genre.add(genre.id, book.id);
        expect(link.genre_id).toBe(genre.id);
        expect(link.book_id).toBe(book.id);
    });

    test("Genre.delete(id) deletes a genre successfully", async () => {
        const genre = await Genre.create({ name: "Genre To Delete" });
        
        const res = await Genre.delete(genre.id);
        expect(res).toEqual({ message: "Genre deleted" });

        await expect(Genre.get(genre.id)).rejects.toThrow(`Genre not found`);
    });

    test("Genre.delete(id) throws 404 if genre ID does not exist", async () => {
        await expect(Genre.delete(99999)).rejects.toThrow("Genre not found");
    });

});
