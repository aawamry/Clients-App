import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import ClientsModel from '../models/models.js';

class ClientsController {
	// 🧾 Controller to list all Clients or search by field
	async listClientsController(req, res) {
		try {
			const { field, value } = req.query; // Get query parameters
			let clients = [];

			console.log('📥 listClientsController called with:', { field, value });

			if (field && value) {
				// If search field and value provided
				clients = await ClientsModel.getByFieldModel(field, value);
				console.log('🔍 Filtered clients found:', clients.length);
			} else {
				// Return all Clients
				clients = await ClientsModel.getAllModel();
				console.log('📋 Total clients found:', clients.length);
			}

			res.render('clientslist', { clients, title: 'Clients List' });
		} catch (error) {
			console.error('❌ Error in listClientsController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// ➕ Controller to add a recruited client
	async addClientController(req, res) {
		try {
			console.log('📥 addClientController request body:', req.body);

			const {
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
				email
			} = req.body;

			// Validate required fields
			if (
				!firstName ||
				!lastName ||
				!companyName ||
				!address ||
				!region ||
				!city ||
                !phone
			) {
				console.warn('⚠️ Missing required fields');
				return res.status(400).json({ error: 'Missing required fields.' });
			}

			// Ensure phone is always an array
			const phoneArray = Array.isArray(phone) ? phone : [phone];
			console.log('📞 Phone numbers formatted:', phoneArray);

			const client = await ClientsModel.addClientModel(
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
				phoneArray,
				email
			);

			console.log('✅ New client added:', client?.id);
			res.status(201).redirect('/clients');
		} catch (error) {
			console.error('❌ Error in addClientController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// 👁️ Controller to view a specific recruited client by ID
	async viewClientController(req, res) {
		try {
			const { id } = req.params;
			console.log('👁️ Fetching client with ID:', id);

			const client = await ClientsModel.getByFieldModel('id', id);

			if (!client || client.length === 0) {
				console.warn('⚠️ Client not found with ID:', id);
				return res.status(404).json({ error: 'Client not found.' });
			}

			res.render('clientview', {
				title: 'Client Details',
				client: client[0]
			});
		} catch (error) {
			console.error('❌ Error in viewClientController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// 🔄 Controller to update client data
	async updateClientController(req, res) {
		try {
			const { id } = req.params;
			console.log('📝 Received update request for client ID:', id);

			const {
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
				email
			} = req.body;

			const phoneArray = Array.isArray(phone) ? phone : [phone];

			console.log('📝 Update fields:', {
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
				phoneArray,
				email
			});

			const updatedClient = await ClientsModel.updateClientModel(
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
				phoneArray,
				email
			);

			if (!updatedClient) {
				console.warn(`⚠️ No client found to update with ID: ${id}`);
				return res.status(404).json({ error: 'Client not found.' });
			}

			console.log('✅ Client updated with ID:', id);
			console.time('response-time');
			res.redirect('/clients');
			console.timeEnd('response-time');
		} catch (error) {
			console.error('❌ Error updating client:', error.message);
			res.status(500).send('Error updating client: ' + error.message);
		}
	}

	// ❌ Controller to delete a client
	async deleteClientController(req, res) {
		try {
			const { id } = req.params;
			console.log('🗑️ Attempting to delete client with ID:', id);

			const deletedClient = await ClientsModel.deleteClientModel(id);

			if (!deletedClient) {
				console.warn('⚠️ Client not found for deletion with ID:', id);
				return res.status(404).json({ error: 'Client not found.' });
			}

			console.log('✅ Client deleted successfully with ID:', id);
			res.status(200).redirect('/clients');
		} catch (error) {
			console.error('❌ Error deleting client:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	async downloadCSVController(req, res) {
		try {
			console.log('📥 Starting CSV export process...');
			// Fetch all recruited clients
			const clients = await ClientsModel.getAllModel();
			console.log(`📋 Retrieved ${clients.length} clients from database.`);

			// Check if clients exist
			if (!clients || clients.length === 0) {
				console.log('⚠️ No recruited clients found to export.');
				return res.status(404).json({ error: 'No clients found to export.' });
			}

			// Ensure exports directory exists
			if (!fs.existsSync('exports')) {
				fs.mkdirSync('exports');
				console.log('📁 "exports" directory created.');
			} else {
				console.log('📁 "exports" directory already exists.');
			}

			// Setup CSV writer
			const csvWriter = createObjectCsvWriter({
				path: 'exports/clients.csv',
				header: [
					{ id: 'id', title: 'ID' },
					{ id: 'firstName', title: 'First Name' },
					{ id: 'middleName', title: 'Middle Name' },
					{ id: 'lastName', title: 'Last Name' },
					{ id: 'companyName', title: 'Company' },
					{ id: 'address', title: 'Address' },
					{ id: 'region', title: 'Region' },
					{ id: 'city', title: 'City' },
					{ id: 'nationality', title: 'Nationality' },
					{ id: 'dateOfBirth', title: 'Date of Birth' },
					{ id: 'gender', title: 'Gender' },
					{ id: 'phone', title: 'Phone' },
					{ id: 'email', title: 'Email' },
					{ id: 'created_at', title: 'Created At' },
					{ id: 'updated_at', title: 'Updated At' }
				]
			});

			console.log('📝 Writing records to CSV file...');
			await csvWriter.writeRecords(clients);
			console.log('✅ CSV file written successfully at "exports/clients.csv"');

			// Send the CSV file for download
			console.log('📤 Sending CSV file to client...');
			res.download('exports/clients.csv', 'clients.csv', (err) => {
				if (err) {
					console.error('❌ Error sending CSV file:', err.message);
					return res.status(500).send('Error sending CSV file');
				}
				console.log('🚀 CSV file sent successfully.');
			});
		} catch (error) {
			console.error('❌ Error generating CSV:', error.message);
			res.status(500).send('Failed to generate CSV');
		}
	}

	async analyticsController(req, res) {
		try {
			console.log('📊 [AnalyticsController] Called');

			const clients = await ClientsModel.getAllModel();
			console.log(`✅ [AnalyticsController] Retrieved ${clients.length} clients`);

			const genderCounts = {};
			const cityCounts = {};
			const regionCounts = {};

			clients.forEach((client) => {
				genderCounts[client.gender] = (genderCounts[client.gender] || 0) + 1;
				cityCounts[client.city] = (cityCounts[client.city] || 0) + 1;
				regionCounts[client.role] = (regionCounts[client.region] || 0) + 1;
			});

			console.log('🧮 Gender Counts:', genderCounts);
			console.log('🧮 City Counts:', cityCounts);
			console.log('🧮 Region Counts:', regionCounts);

			res.render('analytics', {
				title: 'Clients Data Analytics',
				totalClients: clients.length,
				genderCounts,
				cityCounts,
				regionCounts
			});
		} catch (error) {
			console.error('❌ [AnalyticsController] Error:', error);
			res.status(500).send('Error loading analytics');
		}
	}
}

export default new ClientsController();
