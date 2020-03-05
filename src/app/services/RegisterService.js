import Queue from '@lib/Queue';
import RegistrationMail from '@jobs/RegistrationMail';
import Mail from '@models/Mail';

import User from '@models/User';
import Wallet from '@models/Wallet';

class RegisterService {
  async create({ name, email, password, link, plan }) {
    let user;

    /** se já existir o usuário na base retorna o mesmo */
    user = await User.findOne({ email }, { password: 0, __v: 0 });

    if (user)
      return {
        exists: true,
        user,
      };

    /**
     *  Caso não exista o usuario na base continue o processo de criação
     */
    user = await User.create({
      name,
      email,
      password,
      plan: plan._id,
    });

    /**
     *  Cria a Carteira Default
     */
    await Wallet.create({
      user: user._id,
      name: 'Minha Carteira',
      status: true,
    });

    /**
     * Remove o password para retornar o user criado
     */
    const { password: pwd, ...userCreated } = user.toObject();

    Queue.add(RegistrationMail.key, { dataMail: { name, email, link } });

    Mail.create({
      flag: 'RegistrationMail',
      from: process.env.MAIL_FROM,
      to: email,
      subject: '[LARAWORK] - Confirmação de cadastro',
    });

    return { exists: false, user: { name, email, link } };
  }
}

export default new RegisterService();
