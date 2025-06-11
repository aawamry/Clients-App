import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createClientsTable } from './queries.js';

class ClientsDatabase {
	constructor() {
		this.db = null;
		this.dbPath = this.getDBPath(); // Set database file path
		console.log('🔧 Constructor: DB Path set to', this.dbPath);
	}

	// -------------------------- Get Absolute DB Path --------------------------
	getDBPath() {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const fullPath = path.join(__dirname, 'clients_database.db');
		console.log('📁 Resolved DB file path:', fullPath);
		return fullPath;
	}

	// -------------------------- Initialize Database Connection --------------------------
	async init() {
		if (!this.db) {
			sqlite3.verbose(); // Enable verbose logging
			console.log('🔌 Initializing DB connection...');
			this.db = await open({
				filename: this.dbPath,
				driver: sqlite3.Database
			});
			console.log('✅ DB connection established');
		}
	}

	// -------------------------- Create Table if Not Exists --------------------------
	async createTable() {
		const db = await ClientsDatabase.getInstance();
		console.log('🧱 Attempting to create Clients table...');
		await this.db.run(createClientsTable());
		console.log('✅ Clients table created or already exists.');
	}

	// -------------------------- Backup Database --------------------------
	async backup(backupFolder = './backups') {
		try {
			await fs.mkdir(backupFolder, { recursive: true });

			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const fileName = `backup-${timestamp}.db`;
			const backupPath = path.join(backupFolder, fileName);

			await fs.copyFile(this.dbPath, backupPath);

			console.log(`✅ Database backup created at ${backupPath}`);
			return backupPath;
		} catch (error) {
			console.error('❌ Failed to back up database:', error);
			throw error;
		}
	}

	// -------------------------- Get Singleton DB Instance --------------------------
	static async getInstance() {
		if (!this.instance) {
			console.log('🆕 Creating new ClientsDatabase instance...');
			this.instance = new ClientsDatabase();
			await this.instance.init();
			await this.instance.createTable();
			console.log('📦 DB instance is ready for use.');
		} else {
			console.log('📦 Using existing DB instance.');
		}
		return this.instance;
	}
}

// -------------------------- Export Singleton DB Instance --------------------------
export default ClientsDatabase;
