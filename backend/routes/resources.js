const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { verifyToken, requireResourceProvider } = require('../middleware/auth');

// Create a new resource (Resource Provider only)
router.post('/', verifyToken, requireResourceProvider, resourceController.createResource);

// Get all resources (public)
router.get('/', resourceController.getAllResources);

// Get single resource by ID (public)
router.get('/:id', resourceController.getResourceById);

// Update resource (Resource Provider only)
router.put('/:id', verifyToken, requireResourceProvider, resourceController.updateResource);

// Delete resource (Resource Provider only)
router.delete('/:id', verifyToken, requireResourceProvider, resourceController.deleteResource);

module.exports = router;
