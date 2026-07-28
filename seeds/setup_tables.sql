/* 
This is the setup for the "users" and "tasks" tables in the database.
*/

CREATE TABLE users 
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE tasks
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    task TEXT NOT NULL,
    task_status TEXT NOT NULL
);