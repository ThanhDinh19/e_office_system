const {sequelize, Ticket, TicketAssignment, TicketPriority, Employee, TicketAttachment} = require('../models');
const { Op } = require('sequelize');

const createTicket = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      user_id,
      service_id,
      category,
      description,
      priority_id,
    } = req.body;

    // 1️⃣ Validate bắt buộc
    if (!user_id || !service_id || !category || !description) {
      await t.rollback();
      return res.status(400).json({
        message: 'user_id, service_id, category, description are required',
      });
    }

    // 2️⃣ Priority an toàn
    const priority = priority_id || 3;

    // 3️⃣ Tạo ticket
    const ticket = await Ticket.create(
      {
        user_id,
        service_id,
        category,
        description,
        priority_id: priority,
        status: 'open',
        current_level: 1,
      },
      { transaction: t }
    );

    // 4️⃣ Lưu attachments (nếu có)
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        ticket_id: ticket.id,
        file_name: file.originalname,
        file_path: file.path,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_by: user_id,
      }));

      await TicketAttachment.bulkCreate(attachments, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      message: 'Ticket created successfully',
      data: ticket,
    });

  } catch (err) {
    await t.rollback();
    console.error('Create ticket error:', err);
    return res.status(500).json({
      message: 'Failed to create ticket',
    });
  }
};

// lấy tất cả
const getTicket = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: TicketPriority,
          as: 'priority',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: TicketAssignment,
          as: 'assignments',
          attributes: [
            'id',
            'level',
            'sla_deadline',
            'assigned_at',
            'finished_at',
          ],
          include: [
            {
              model: Employee,
              as: 'support',
              attributes: ['id', 'full_name', 'email'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(tickets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to get tickets' });
  }
};

// lấy new ticket 
const getNewCount = async (req, res) => {
  try {
    const count = await Ticket.count({
      where: {
        status: 'open',
        current_level: 1,
      },
      include: [
        {
          model: TicketAssignment,
          as: 'assignments',
          required: false,
          where: {
            finished_at: null,
          },
        },
      ],
    });
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Failed to get new count',
    });
  }
};
// lấy những vé open, kiểm tra it đang rảnh, ưu tiên từ thấp đến cao, 

// lấy ticket theo id
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: TicketPriority,
          as: 'priority',
          attributes: ['id', 'code', 'name'],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.json(ticket);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to get ticket' });
  }
};



module.exports = {
    createTicket,
    getTicket,
    getTicketById,
    getNewCount,
}