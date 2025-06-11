import ClientsDatabase from '../data/data.js';

const db = await ClientsDatabase.getInstance();
await db.backup();
console.log('✅ Backup completed successfully.');