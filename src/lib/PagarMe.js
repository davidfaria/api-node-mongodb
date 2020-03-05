import pagarme from 'pagarme';
import Card from '../app/models/Card';
import { onlyNumber } from '../app/helpers/numberOnly';

class PagarMe {
  async createCard({
    user,
    card_number,
    card_holder_name,
    card_expiration_date,
    card_cvv,
  }) {
    //** Aplica o tratamento nos dados do cartão */
    const cardData = {
      card_number: onlyNumber(card_number),
      card_holder_name,
      card_expiration_date: onlyNumber(card_expiration_date),
      card_cvv: onlyNumber(card_cvv),
    };

    /**
     *  Inicializa o client do pagarme
     */
    await this.init();

    /**
     *  Faz a tentativa de criar um cartão
     */
    const createdCardPagarme = await this.client.cards.create(cardData);

    // {
    //   object: 'card',
    //   id: 'card_ck6jo60y20et5386f1yqptgjz',
    //   date_created: '2020-02-12T18:50:25.226Z',
    //   date_updated: '2020-02-12T18:50:25.513Z',
    //   brand: 'mastercard',
    //   holder_name: 'DAVID D FARIA',
    //   first_digits: '533190',
    //   last_digits: '1465',
    //   country: 'UNITED STATES',
    //   fingerprint: 'ck6jnkxig1nd70n21l1hcpg0h',
    //   customer: null,
    //   valid: true,
    //   expiration_date: '0121'
    // }

    /** Se não conseguir return null */
    if (!createdCardPagarme) throw new Error('Credit Card Invalid');

    /**
     *  Verifica se o Cartão já existe na base
     */
    let card = await Card.findOne({
      user,
      hash: createdCardPagarme.id,
    });

    // console.log('exists', card);

    if (card) {
      /** Se já existir atualiza o cvv */
      card.cvv = onlyNumber(card_cvv);
      await card.save();
    } else {
      /** Criar cratão na base */
      card = await Card.create({
        user,
        brand: createdCardPagarme.brand,
        last_digits: createdCardPagarme.last_digits,
        cvv: card_cvv,
        hash: createdCardPagarme.id,
      });
    }
    return card;
  }

  async transaction({ amount, card_hash }) {
    const tx = {
      payment_method: 'credit_card',
      amount: onlyNumber(amount),
      card_id: card_hash,
    };

    // console.log('tx', tx);
    /**
     *  Inicializa o client do pagarme
     */
    await this.init();
    const txPagarme = await this.client.transactions.create(tx);

    // console.log('tx', txPagarme);

    if (!txPagarme || txPagarme.status !== 'paid') {
      throw new Error('Transaction fail');
    }

    return txPagarme;
  }

  async init() {
    this.client = await pagarme.client.connect({
      api_key: process.env.PAGARME_KEY,
    });
  }
}

export default new PagarMe();
