import Wallet from '@models/Wallet';
import { Types } from 'mongoose';

class WalletController {
  async index(req, res) {
    const { q = '', page = 1, perPage = 10 } = req.query;
    const user = new Types.ObjectId(req.userId);
    const search = new RegExp(q, 'gi');

    // const [{ total }] = await Wallet.aggregate([
    //   {
    //     $match: { user, name: { $regex: search } },
    //   },
    // ]).count('total');

    const total = await Wallet.count({ user, name: { $regex: search } });

    const wallets = await Wallet.aggregate([
      {
        $match: { user, name: { $regex: search } },
      },
    ])
      .project({
        name: 1,
        status: 1,
      })
      .sort({
        name: 1,
      })
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage));

    const lastPage = Math.ceil(total / perPage);

    return res.json({
      page: Number(page),
      perPage: Number(perPage),
      total,
      lastPage,
      data: wallets,
    });
  }

  async show(req, res) {
    const wallet = await Wallet.findById(req.params._id);

    return res.json(wallet);
  }

  async store(req, res) {
    const { name, status } = req.body;
    const user = new Types.ObjectId(req.userId);

    const wallet = await Wallet.create({ name, status, user });

    return res.status(201).json(wallet);
  }

  async update(req, res) {
    const _id = req.params._id;
    const { name, status } = req.body;

    const wallet = await Wallet.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          status,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(wallet);
  }

  async destroy(req, res) {
    const _id = req.params._id;
    await Wallet.findOneAndRemove({ _id });

    return res.status(204).send();
  }
}

export default new WalletController();
