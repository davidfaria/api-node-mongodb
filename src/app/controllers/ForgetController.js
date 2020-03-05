import Queue from '@lib/Queue';
import ForgetPasswordMail from '@jobs/ForgetPasswordMail';
import SessionRepository from '@repositories/SessionRepository';
import SessionService from '@services/SessionService';
import Mail from '@models/Mail';
import User from '@models/User';

import { generateBcryptHash } from '@helpers/hash';

import { randomHash } from '@helpers/hash';

class ForgetlController {
  async store(req, res) {
    const { email } = req.body;

    const forget = randomHash();

    const user = await User.findOneAndUpdate(
      {
        email,
        status: { $ne: 'canceled' },
      },
      {
        $set: {
          forget,
          forgetAt: new Date(),
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (!user) return res.sendError('User not found', 401);

    const link = `${process.env.APP_URL_FRONTEND}/forgetPassword/${forget}`;

    // console.log('dataMail', { name: user.name, email, link });

    Queue.add(ForgetPasswordMail.key, {
      dataMail: { name: user.name, email, link },
    });

    Mail.create({
      flag: 'ForgetPasswordMail',
      from: process.env.MAIL_FROM,
      to: email,
      subject: '[LARAWORK] - Alteração de Senha',
    });

    return res.send();
  }

  async update(req, res) {
    const { forget, password } = req.body;

    const passwordUpdated = await generateBcryptHash(password);

    // console.log({ forget, passwordUpdated });

    const user = await User.findOneAndUpdate(
      {
        forget,
      },
      {
        $set: {
          forget: null,
          forgetAt: null,
          password: passwordUpdated,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (!user) return res.sendError('Token forget invalid', 400);

    const userFind = await SessionRepository.findOne({ _id: user._id });

    const userSession = SessionService.getUserSession(userFind);
    return res.json(userSession);
  }
}

export default new ForgetlController();
