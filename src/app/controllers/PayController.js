import PagarMe from '@lib/PagarMe';
import Subscription from '@models/Subscription';
import User from '@models/User';
import Plan from '@models/Plan';
import Order from '@models/Order';
import SubscriptionService from '@services/SubscriptionService';

class PayController {
  async store(req, res) {
    /***
     *
     *  DEPOIS CRIAR UM REGRA DE TENTATIVA DE CADASTRO DE CARTÃO
     *  3x em 5 MINUTOS
     */
    const {
      plan,
      card_number,
      card_holder_name,
      card_expiration_date,
      card_cvv,
    } = req.body;

    /**
     *  Check user
     */

    const user = await User.findById(req.userId);
    // if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user) return res.sendError('User not found', 400);

    /**
     *  Verifica se o user já não tem uma assinatura contratada
     */
    const subscription = await Subscription.findOne({
      user: user._id,
      status: { $ne: 'canceled' },
    });

    /**
     *  Verifica se já não existe um assinatura ativa
     */
    if (subscription)
      // return res.status(400).json({
      //   message:
      //     'Você já tem uma assinatura ativa. Não é necessário realizar a assinatura mais de uma vez.',
      // });
      return res.sendError(
        'Você já tem uma assinatura ativa. Não é necessário realizar a assinatura mais de uma vez.',
        400
      );

    const creditCard = await PagarMe.createCard({
      user: user._id,
      card_number,
      card_holder_name,
      card_expiration_date,
      card_cvv,
    });

    if (!creditCard)
      // return res.status(400).json({
      //   error: 'Cartão inválido, verifique os dados e tente assinar novamente.',
      // });
      return res.sendError(
        'Cartão inválido, verifique os dados e tente assinar novamente.',
        400
      );

    const plandb = await Plan.findById(plan);
    // if (!plandb) return res.status(401).json({ error: 'Plan not found' });
    if (!plandb) return res.sendError('Plan not found', 400);

    const txPagarMe = await PagarMe.transaction({
      amount: plandb.price,
      card_hash: creditCard.hash,
    });

    if (!txPagarMe)
      // return res.status(400).json({
      //   error:
      //     'Ops! Transação não realizada, você pode tentar com um novo cartão',
      // });
      return res.sendError(
        'Ops! Transação não realizada, você pode tentar com um novo cartão',
        400
      );

    const newSubscription = await SubscriptionService.create(
      user._id,
      plan,
      creditCard
    );

    const order = await Order.create({
      user: user._id,
      card: creditCard._id,
      subscription: newSubscription._id,
      transaction: txPagarMe.tid,
      amount: plandb.price,
      status: 'active',
    });

    return res.status(201).json(order);
  }
}

export default new PayController();
