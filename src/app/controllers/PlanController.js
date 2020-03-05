import Plan from '@models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.find({});

    return res.json(plans);
  }
  async store(req, res) {
    const { name, price, period, period_str } = req.body;

    const plan = await Plan.create({
      name,
      price,
      period,
      period_str,
    });

    return res.status(201).json(plan);
  }
}

export default new PlanController();
