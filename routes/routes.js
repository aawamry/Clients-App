import express from 'express';
import ClientsDatabase from '../data/data.js';
import ClientsController from '../controllers/controllers.js';
import ClientsModel from '../models/models.js';

class ClientsRoutes {
	constructor() {
		this.router = express.Router();
		this.tableName = 'clients';
		this.initRoutes();
	}

	async initRoutes() {
		this.db = await ClientsDatabase.getInstance('../data/clients_database.db');
		this.router.get('/add', (req, res) => {
			res.render('clientsform', {
				title: 'Add Client',
				client: {},
				formAction: '/clients/add',
				method: 'POST',
				backUrl: req.get('Referer') || '/clients'
			});
		});

		this.router.get('/:id/edit', async (req, res) => {
			try {
				const client = await ClientsModel.getByFieldModel('id', req.params.id);
				if (!client || client.length === 0) {
					return res.status(404).send({ error: 'Client not found.' });
				}
				res.render('clientsform', {
					title: 'Edit Client',
					client: client[0],
					formAction: `/clients/${req.params.id}?_method=PUT`,
					method: 'POST',
					backUrl: req.get('Referer') || '/clients'
				});
			} catch (error) {
				res.status(500).send('Error loading edit form: ' + error.message);
			}
		});

		this.router.get('/analytics', async (req, res) => {
			try {
				const clients = await ClientsModel.getAllModel();
				const totalClients = clients.length;
				const genderCounts = {};
				const cityCounts = {};
                const regionCounts = {};

				for (const client of clients) {
					genderCounts[client.gender] = (genderCounts[client.gender] || 0) + 1;
					cityCounts[client.city] = (cityCounts[client.city] || 0) + 1;
					regionCounts[client.role] = (regionCounts[client.role] || 0) + 1;
				}

				res.render('analytics', {
					title: 'Clients Data Analytics',
					totalClients,
					genderCounts,
					cityCounts,
					regionCounts
				});
			} catch (error) {
				console.error('Error generating analytics:', error.message);
				res.status(500).send('Error generating analytics');
			}
		});

		this.router.get('/', ClientsController.listClientsController);
		this.router.post('/add', ClientsController.addClientController);
		this.router.get('/export', ClientsController.downloadCSVController);
		this.router.get('/:id', ClientsController.viewClientController);
		this.router.put('/:id', ClientsController.updateClientController);
		this.router.delete('/:id', ClientsController.deleteClientController);
	}

	getRouter() {
		return this.router;
	}
}

export default new ClientsRoutes().getRouter();
