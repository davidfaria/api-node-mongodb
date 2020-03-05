import { addMonths, addYears } from 'date-fns';
import Subscription from '@models/Subscription';
import Plan from '@models/Plan';

class SubscriptionService {
  async create(user, plan, card) {
    const plandb = await Plan.findById(plan);
    if (!plandb) return res.status(401).json({ error: 'Plan not found' });

    // let toDay = new Date(2020, 2, 29);
    let toDay = new Date();
    const started_at = toDay;
    const status = 'active';
    const pay_status = 'active';
    const last_charge = new Date();

    let due_day;
    let next_due;

    if (toDay.getDate() <= 28) {
      due_day = toDay.getDate();
    } else {
      /** Vai para o próximo */
      const nextDate = addMonths(toDay, 1);
      due_day = 5;
      toDay = new Date(nextDate.getFullYear(), nextDate.getMonth(), due_day);
    }

    if (plandb.period === 'mês') {
      next_due = addMonths(toDay, 1);
    } else if (plandb.period === 'ano') {
      next_due = addYears(toDay, 1);
    } else {
      return res.status(400).json({ error: 'Plan period inválid' });
    }

    const subscription = await Subscription.create({
      user,
      plan,
      card,
      status,
      pay_status,
      started_at,
      due_day,
      next_due,
      last_charge,
    });

    return subscription;
  }
}

export default new SubscriptionService();
