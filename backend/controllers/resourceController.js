const Resource = require('../models/Resource');

// Create a new resource (Resource Provider only)
const createResource = async (req, res) => {
  try {
    const { name, type, description, availability, price, location } = req.body;
    const provider_id = req.user.id;

    // Validate required fields
    if (!name || !type || !price || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, type, price, location'
      });
    }

    const resource = await Resource.create({
      name,
      type,
      description: description || '',
      availability: availability || 'available',
      price,
      location,
      provider_id
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create resource'
    });
  }
};

// Get all resources with optional filters
const getAllResources = async (req, res) => {
  try {
    const { location, type, provider_id } = req.query;

    const filters = {};
    if (location) filters.location = location;
    if (type) filters.type = type;
    if (provider_id) filters.provider_id = provider_id;

    const resources = await Resource.getAll(filters);

    res.status(200).json({
      success: true,
      message: 'Resources retrieved successfully',
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resources'
    });
  }
};

// Get single resource by ID
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.getById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource retrieved successfully',
      data: resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource'
    });
  }
};

// Update resource (Resource Provider only)
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const provider_id = req.user.id;
    const { name, type, description, availability, price, location } = req.body;

    // Check if resource exists and belongs to provider
    const resource = await Resource.getById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.provider_id !== provider_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own resources'
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (type !== undefined) updates.type = type;
    if (description !== undefined) updates.description = description;
    if (availability !== undefined) updates.availability = availability;
    if (price !== undefined) updates.price = price;
    if (location !== undefined) updates.location = location;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const updatedResource = await Resource.update(id, updates);

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update resource'
    });
  }
};

// Delete resource (Resource Provider only)
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const provider_id = req.user.id;

    // Check if resource exists and belongs to provider
    const resource = await Resource.getById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.provider_id !== provider_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own resources'
      });
    }

    await Resource.delete(id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource'
    });
  }
};

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource
};
