import Subscription from '@models/Subscription';
import SubscriptionService from '@services/SubscriptionService';

class SubscriptionsController {
  async index(req, res) {
    const subscriptions = await Subscription.find({})
      .populate('user', ['name', 'email'])
      .populate('plan', ['name', 'price'])
      .populate('card', ['brand', 'last_digits']);

    return res.json(subscriptions);
  }

  async store(req, res) {
    const { plan, card } = req.body;
    const subscription = await SubscriptionService.create(
      req.body.user,
      plan,
      card
    );
    return res.status(201).json(subscription);
  }
}

export default new SubscriptionsController();
