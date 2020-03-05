import Invoice from '@models/Invoice';
import Category from '@models/Category';
import mongoose from 'mongoose';

class InvoiceController {
  async index(req, res) {
    const invoices = await Invoice.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(req.userId) },
      },
    ]);

    return res.json(invoices);
  }

  async store(req, res) {
    const {
      wallet,
      category,
      description,
      note,
      value,
      due_at,
      enrollments,
      enrollments_of,
      status,
    } = req.body;

    const categorydb = await Category.findById(category);
    if (!categorydb)
      return res.status(400).json({ error: 'Category not found' });

    const invoice = await Invoice.create({
      user: req.userId,
      wallet,
      category,
      type: categorydb.type,
      description,
      note,
      value,
      due_at,
      enrollments,
      enrollments_of,
      status,
    });

    return res.status(201).json(invoice);
  }

  async update(req, res) {
    const {
      wallet,
      category,
      description,
      note,
      value,
      due_at,
      enrollments,
      enrollments_of,
      status,
    } = req.body;

    const categorydb = await Category.findById(category);
    if (!categorydb)
      // return res.status(400).json({ error: 'Category not found' });
      return res.sendError('Category not found', 400);

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          wallet,
          category,
          type: categorydb.type,
          description,
          note,
          value,
          due_at,
          status,
        },
      },
      { new: true }
    );

    return res.status(200).json(invoice);
  }

  async update(req, res) {
    await Invoice.findByIdAndRemove(req.params.id);

    return res.status(204).send();
  }
}

export default new InvoiceController();
