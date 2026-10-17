const fs = require('fs');
const path = require("path");
const db = require('../../db');
const Author = require('../../models/authors');
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

describe("Author Model Test", () => {
    test("Author.all() returns all seeded authors", async () => {
        const authors = await Author.all();
        expect(authors.length).toBeGreaterThan(0);
        expect(authors[0]).toHaveProperty("name");
    });

    test("Author.get(id) returns an author and their written books array when ID exists", async () => {
        const authors = await Author.all();
        const author = await Author.get(authors[0].id);
        expect(author).toBeDefined();
        expect(author.id).toBe(authors[0].id);
        expect(author).toHaveProperty("name");
    });

    test("Author.get(id) throws a 404 ExpressError when author ID does not exist", async () => {
        await expect(Author.get(99999)).rejects.toThrow("No such author: 99999");

    });

    test("Author.create() successfully creates and returns a new author", async () => {
        const newAuthor = await Author.create("J Bree");
        expect(newAuthor.id).toBeDefined();
        expect(newAuthor.name).toBe("J Bree");
    });

    test("Author.create() throws a 400 ExpressError if name is missing", async () => {
        await expect(Author.create()).rejects.toThrow("Author name is required");
    });

    test("Author.getBooks(id) returns an author and books when ID exists", async () => {
        const newBook = await Book.create({ title: "Test Book 1", author_name: "Test Author" });
        const author = await db.query(
            `SELECT id FROM authors WHERE name = $1`, 
            ["Test Author"]);
        const authorBooks = await Author.getBooks(author.rows[0].id);

        expect(authorBooks).toBeDefined();
        expect(authorBooks.author.id).toBe(newBook.id);
        expect(authorBooks.author.author_name).toBe(newBook.author_name);
        expect(Array.isArray(authorBooks.books)).toBe(true);
        expect(authorBooks.books.length).toBeGreaterThan(0);
        expect(authorBooks.books[0].title).toBe(newBook.title);
    });
    
    test("Throws a 404 ExpressError when the author ID does not exist", async () => {
        await expect(Author.getBooks(9999)).rejects.toThrow(
            `No such author: ${9999}`
        );
    });

    test("Author.delete(id) deletes an author successfully", async () => {
        const author = await Author.create("Author To Delete");
        const res = await Author.delete(author.id);
        expect(res).toEqual({ message: "Author deleted" });
        await expect(Author.get(author.id)).rejects.toThrow(`No such author: ${author.id}`);
    });

    test("Author.delete(id) throws 404 if author ID does not exist", async () => {
        await expect(Author.delete(99999)).rejects.toThrow("No such author: 99999");
    });
});
