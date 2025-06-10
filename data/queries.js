export const createClientsTable = () => `CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    middleName TEXT,
    lastName TEXT NOT NULL,
    companyName TEXT NOT NULL,
    address TEXT,
    region TEXT,
    city TEXT,
    nationality TEXT,
    dateOfBirth TEXT,
    gender TEXT,
    phone TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
export const getAllQuery = (table) => `SELECT * FROM ${table}`;
export const getByFieldQuery = (table, field) => `SELECT * FROM ${table} WHERE ${field} LIKE ?`;
export const insertClientQuery = (table) =>
	`INSERT INTO ${table} (firstName, 
                            middleName, 
                            lastName, 
                            companyName, 
                            address, 
                            region, 
                            city, 
                            nationality, 
                            dateOfBirth, 
                            gender, 
                            phone, 
                            email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
export const updateClientQuery = (table) =>
	`UPDATE ${table} SET firstName = ?, 
                         middleName = ?, 
                         lastName = ?, 
                         companyName = ?, 
                         address = ?, 
                         region = ?, 
                         city = ?, 
                         nationality = ?, 
                         dateOfBirth = ?, 
                         gender = ?, 
                         phone = ?, 
                         email = ? WHERE id = ?`;
export const deleteClientQuery = (table) => `DELETE FROM ${table} WHERE id = ?`;
