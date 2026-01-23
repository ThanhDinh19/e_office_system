const { Department } = require('../models');

exports.getDepartments = async (req, res) => {
    try{
        const departments = await Department.findAll({
            attributes: ['id', 'name'],
            order: [['id', 'ASC']]
        });

        res.json(departments);
    }catch (err){
        res.status(500).json({messages: 'Failed to load departments'});
    }
}

