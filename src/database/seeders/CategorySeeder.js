import Category from '../../app/models/Category';

class CategorySeeder {
  async run() {
    console.log('Truncate collection categories');
    await Category.remove({});
    const categories = [
      { name: 'Salário', type: 'income' },
      { name: 'Investimento', type: 'income' },
      { name: 'Empréstimo', type: 'income' },
      { name: 'Outras receitas', type: 'income' },
      { name: 'Alimentação', type: 'expense' },
      { name: 'Aluguel', type: 'expense' },
      { name: 'Compras', type: 'expense' },
      { name: 'Educação', type: 'expense' },
      { name: 'Entretenimento', type: 'expense' },
      { name: 'Impostos e taxas', type: 'expense' },
      { name: 'Saúde', type: 'expense' },
      { name: 'Serviços', type: 'expense' },
      { name: 'Viagen', type: 'expense' },
      { name: 'Outras despesas', type: 'expense' },
    ];
    await Category.insertMany(categories);
    console.log('Populate collection categories');
  }
}

export default new CategorySeeder();
