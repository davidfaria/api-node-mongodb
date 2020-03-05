import { Types } from 'mongoose';
import User from '@models/User';
import SessionRespository from '@repositories/SessionRepository';
import SessionService from '@services/SessionService';
import { generateBcryptHash } from '@helpers/hash';

import RegisterService from '@services/RegisterService';

class UserController {
  async index(req, res) {
    const users = await User.find({}, { __v: 0, password: 0 }).populate(
      'file',
      ['name', 'type', 'url']
    );

    return res.json(users);
  }

  async store(req, res) {
    const { name, email, password } = req.body;
    const user = await RegisterService.create({ name, email, password });
    return res.status(201).json(user);
  }

  async update(req, res) {
    const _id = req.userId;
    const { name, password } = req.body;
    const file = new Types.ObjectId(req.body.file);

    let data = {};
    if (password) {
      const hash = await generateBcryptHash(password, 8);
      data = { name, password: hash, file };
    } else {
      data = { name, file };
    }

    await User.findByIdAndUpdate(
      _id,
      {
        $set: { ...data },
      },
      { new: true, useFindAndModify: false }
    );

    const user = await SessionRespository.findOne({ _id });

    /**
     * Remove token
     */
    const { user: userSession } = SessionService.getUserSession(user);
    return res.json(userSession);
  }

  async destroy(req, res) {
    const { _id } = req.params;
    const user = await User.findById(_id);
    if (!user) return res.sendError('User not found', 400);

    await user.remove();

    return res.status(204).send();
  }
}

export default new UserController();
