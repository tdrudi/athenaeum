DROP TABLE IF EXISTS book_lists CASCADE;
DROP TABLE IF EXISTS book_tags CASCADE;
DROP TABLE IF EXISTS book_series CASCADE;
DROP TABLE IF EXISTS book_genres CASCADE;
DROP TABLE IF EXISTS book_authors CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS books CASCADE;


-- Main Books Table --
CREATE TABLE books(
id SERIAL PRIMARY KEY,
isbn VARCHAR(13) UNIQUE,
title VARCHAR NOT NULL,
page_count INT,
cover_image TEXT,
status VARCHAR DEFAULT 'Unread',
is_wishlist BOOLEAN DEFAULT false,
sprayed_edges BOOLEAN DEFAULT false,
signed BOOLEAN DEFAULT false,
spine_color VARCHAR(7),
spine_height_px INT DEFAULT 200,
spine_width_px INT DEFAULT 35,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entity Tables --
CREATE TABLE authors(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE genres(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE series(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE lists(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-Many Relation Tables --
CREATE TABLE book_authors(
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_genres(
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE book_series(
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    series_id INT REFERENCES series(id) ON DELETE CASCADE,
    series_index INT,
    PRIMARY KEY(book_id, series_id)
);

CREATE TABLE book_tags(
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY(book_id, tag_id)
);

CREATE TABLE book_lists(
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    list_id INT REFERENCES lists(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, list_id)
);