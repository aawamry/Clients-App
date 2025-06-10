import ClientsDatabase from '../data/data.js';
import {
	getAllQuery,
	getByFieldQuery,
	insertClientQuery,
	updateClientQuery,
	deleteClientQuery
} from '../data/queries.js';

class ClientsModel {
	constructor(
		id,
		firstName,
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
		email,
		created_at,
        updated_at
	) {
		this.id = id;
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.companyName = companyName;
		this.address = address;
		this.region = region;
		this.city = city;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.phone = phone;
		this.email = email;
		this.created_at = created_at;
        this.updated_at = updated_at;
	}
	static async getAllModel() {
		console.log('📥 getAllModel called');
		const dbInstance = await ClientsDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const clients = await dbInstance.db.all(getAllQuery('clients')); // Fetch all clients
		console.log('📄 Retrieved clients from DB:', clients.length);

		// Map raw DB rows to model instances
		return clients.map(
			(client) =>
				new ClientsModel(
					client.id,
					client.firstName,
					client.middleName,
					client.lastName,
					client.companyName,
					client.address,
					client.region,
					client.city,
					client.nationality,
					client.dateOfBirth,
					client.gender,
					client.phone,
					client.email,
					client.created_at,
                    client.updated_at
				)
		);
	}

	static async getByFieldModel(field, value) {
		console.log(`🔍 getByFieldModel called with field: ${field}, value: ${value}`);
		const dbInstance = await ClientsDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const allowedFields = [
			'id',
			'firstName',
			'lastName',
			'companyName',
			'region',
			'city',
			'dateOfBirth',
			'gender',
			'phone',
			'email'
		];

		if (!allowedFields.includes(field)) {
			console.error(`❌ Field ${field} is not allowed for searching.`);
			throw new Error(`Field ${field} is not allowed for searching.`);
		}

		const clients = await dbInstance.db.all(getByFieldQuery('clients', field), [`%${value}%`]); // Fetch clients by field
		console.log('📄 Retrieved matching clients:', clients.length);

		return clients.map(
			(client) =>
				new ClientsModel(
					client.id,
					client.firstName,
					client.middleName,
					client.lastName,
					client.companyName,
					client.address,
					client.region,
					client.city,
					client.nationality,
					client.dateOfBirth,
					client.gender,
					client.phone,
					client.email,
					client.created_at,
                    client.updated_at
				)
		);
	}

	static async addClientModel(
		firstName,
		middleName,
		lastName,
		companyName,
		address,
		region,
		city,
		nationality,
		dateOfBirth,
		gender,
		phone = [],
		email,
		created_at,
        updated_at
	) {
		console.log('➕ addClientsModel called with:', {
			firstName,
			lastName,
			companyName,
			phone,
			city,
            email,
		});

		const dbInstance = await ClientsDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const phoneString = Array.isArray(phone) ? phone.join(',') : phone;

		const result = await dbInstance.db.run(insertClientQuery('clients'), [
			firstName,
			middleName,
			lastName,
			companyName,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			phoneString,
			email,
			created_at,
            updated_at
		]);

		console.log('📤 Insert result:', result);

		if (result.changes > 0) {
			console.log('✅ Client added with ID:', result.lastID);
			return new ClientsModel(
				result.lastID,
				firstName,
				middleName,
				lastName,
				companyName,
				address,
				region,
				city,
				nationality,
				dateOfBirth,
				gender,
				phoneString,
				email,
				created_at,
                updated_at
			);
		} else {
			console.warn('⚠️ No Client was added.');
			return null;
		}
	}

	static async updateClientModel(
		id,
		firstName,
		middleName,
		lastName,
		companyName,
		address = '',
		region = '',
		city,
		nationality,
		dateOfBirth,
		gender,
		phone = [],
		email
	) {
		const dbInstance = await ClientsDatabase.getInstance();
		const phoneArray = Array.isArray(phone) ? phone : [phone];
		const phoneString = phoneArray.join(',');

		console.log('🔄 Updating client in DB with ID:', id);
		console.log('🔄 Update parameters:', [
			firstName,
			middleName,
			lastName,
			companyName,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			phoneString,
			email,
			id
		]);

		try {
			const result = await dbInstance.db.run(updateClientQuery('clients'), [
				firstName,
				middleName,
				lastName,
				companyName,
				address,
				region,
				city,
				nationality,
				dateOfBirth,
				gender,
				phoneString,
				email,
				id
			]);

			console.log('🔄 DB update completed:', result);

			// Note: depending on sqlite3 version, 'changes' may be on result or this.changes in callback
			// If changes property is missing, you may need to confirm your sqlite3 version or wrapper

			if (result.changes && result.changes > 0) {
				return new ClientsModel(
					firstName,
					middleName,
					lastName,
					companyName,
					address,
					region,
					city,
					nationality,
					dateOfBirth,
					gender,
					phoneString,
					email
				);
			}
		} catch (error) {
			console.error('Error updating client:', error);
			throw error;
		}

		return null;
	}

	static async deleteClientModel(id) {
		const dbInstance = await ClientsDatabase.getInstance(); // Get database instance
		await dbInstance.db.run(deleteClientQuery('clients'), [id]); // Delete client by ID
		return { message: `Client ${id} Deleted Successfully` };
	}
}

export default ClientsModel;
// This code defines a ClientsModel class that interacts with a clients database.
// It provides methods to get all clients, get clients by a specific field, add a new client, update an existing client, and delete a client.
// The class uses a singleton pattern to ensure only one instance of the database connection is used.
// The methods return instances of ClientsModel, which encapsulate client data and provide a structured way to interact with the database.
