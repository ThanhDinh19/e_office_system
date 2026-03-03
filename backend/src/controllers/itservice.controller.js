const { sequelize, ItService } = require('../models');

const addITService = async (req, res) => {
    try {
        const {
            code,
            name,
            service_group,
            description,
            target_object,
            is_active
        } = req.body;

        if (!code || !name || !service_group || !description || !target_object) {
            return res.status(400).json({ message: 'missing information' });
        }

        const itservice = await ItService.create({
            code,
            name,
            service_group,
            description,
            target_object,
            is_active
        });

        return res.status(201).json({
            message: 'IT services created successfully',
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add it services", success: false});
    }
}

const getITService = async (req, res) => {
    try {
        const itservices = await ItService.findAll();
        return res.json(itservices);
    } catch (err) {
        return res.status(500).json({ message: "Failed to get the it services" })
    }
}

const editITService = async (req, res) => {
    try {

        const { id } = req.params;

        const itservice = await ItService.findByPk(id);


        if (!itservice) {
            return res.status(404).json({ message: 'Found not the IT service' })
        }

        const {
            code,
            name,
            service_group,
            description,
            target_object,
            is_active
        } = req.body;

        if (!code || !name || !service_group || !target_object) {
            return res.status(400).json({ message: 'missing information' });
        }

        await itservice.update({
            code: code,
            name: name,
            service_group: service_group,
            description: description,
            target_object: target_object,
            is_active: is_active
        })

        return res.json({ success: true });

    } catch (err) {
        return res.status(500).json({ message: 'Failed to edit' })
    }
}

const deleteITService = async (req, res) => {
  try {
    const { id } = req.params;

    const itservice = await ItService.findByPk(id);

    if (!itservice) {
      return res.status(404).json({
        success: false,
        message: 'IT service not found',
      });
    }

    await itservice.destroy();

    return res.status(200).json({
      success: true,
      message: 'Delete IT service successfully',
      data: {
        id,
        code: itservice.code,
        name: itservice.name,
      },
    });

  } catch (error) {
    console.error('Delete IT service error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete IT service',
    });
  }
};

module.exports = {
    addITService,
    getITService,
    editITService,
    deleteITService,
}