import RegisterService from '@services/RegisterService';
import Plan from '@models/Plan';

class RegisterController {
  async store(req, res) {
    const { name, email, password, link } = req.body;

    /**
     *  Busca o Plano Free na criação da conta.
     */
    const plan = await Plan.findOneAndUpdate(
      { name: 'Free', status: true },
      { name: 'Free', status: true },
      { upsert: true, useFindAndModify: false, new: true }
    );

    if (!plan) return res.sendError('Plan Not Found', 400);

    const user = await RegisterService.create({
      name,
      email,
      password,
      link,
      plan,
    });
    return res.status(201).json(user);
  }
}

export default new RegisterController();
