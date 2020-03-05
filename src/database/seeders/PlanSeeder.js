import Plan from '../../app/models/Plan';

class PlanSeeder {
  async run() {
    console.log('Truncate collection plans');
    await Plan.remove({});
    const plans = [
      {
        name: 'Free',
        period: 'ano',
        price: 0,
      },
      {
        name: 'Pro',
        period: 'mês',
        price: 5.0,
      },
      {
        name: 'Pro',
        period: 'ano',
        price: 50.0,
      },
    ];
    await Plan.insertMany(plans);
    console.log('Populate collection plans');
  }
}

export default new PlanSeeder();
