import faker from 'faker';
faker.locale = 'pt_BR';

const makePlan = (amount = 1, data = {}) => {
  const result = new Array(amount).fill(0).map(item => {
    return {
      name: faker.lorem.word(),
      period: faker.arrayElement(['mês', 'ano']),
      price: faker.finance.amount(5, 10, 2),
      status: faker.arrayElement([true, false]),
      ...data,
    };
  });

  return amount === 1 ? result[0] : result;
};

const makeUser = (amount = 1, data = {}) => {
  const result = new Array(amount).fill(0).map(item => {
    return {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...data,
    };
  });

  return amount === 1 ? result[0] : result;
};

export { makeUser, makePlan };
