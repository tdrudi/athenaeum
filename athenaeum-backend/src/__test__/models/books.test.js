const request = require('supertest');
const fs = require('fs');
const path = require("path");
const app = require('../../app');
const db = require('../../db');
const Book = require('../../models/books');

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

describe('Book Model Tests', () => {
    test("Book.all() returns all seeded books", async () => {
        const books = await Book.all();
        expect(books.length).toBeGreaterThan(0);
        expect(books[0]).toHaveProperty("title");
    });

    test("Book.get(id) returns a single book or throws 404", async () => {
        const book = await Book.get(1);
        expect(book.id).toBe(1);

        await expect(Book.get(9999)).rejects.toThrow("Book not found.");
    });

    test("Book.get(id) throws a 404 ExpressError when book ID does not exist", async () => {
        await expect(Book.get(99999)).rejects.toThrow("Book not found.");
    });

    test("Book.create() successfully creates and returns a new book", async () => {
        const newBook = await Book.create({
            title: "The Way of Kings",
            status: "Unread",
            author_name: "Brandon Sanderson"
        });
        expect(newBook.id).toBeDefined();
        expect(newBook.title).toBe("The Way of Kings");
        expect(newBook.author).toBeDefined();
        expect(newBook.author.name).toBe("Brandon Sanderson");
    });

    test("Book.create() utilizes an existing author if author name already exists", async () => {
        const secondBook = await Book.create({
            title: "Words of Radiance",
            author_name: "Brandon Sanderson"
        });

        expect(secondBook.author.id).toBeDefined();
        expect(secondBook.author.name).toBe("Brandon Sanderson");
    });

    test("Book.delete(id) deletes a book successfully", async () => {
        const book = await Book.create({ title: "Book to Delete", author_name: "Author to Delete" });
        const res = await Book.delete(book.id);
        expect(res).toEqual({ message: "Book deleted" });
        await expect(Book.get(book.id)).rejects.toThrow(`Book not found.`);
    });

    test("Book.delete(id) throws 404 if book ID does not exist", async () => {
        await expect(Book.delete(99999)).rejects.toThrow("Book not found.");
    });

});
