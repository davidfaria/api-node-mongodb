// import { format, parseISO } from "date-fns";
// import pt from "date-fns/locale/pt";
import Mail from '@lib/Mail';

class ForgetPasswordMail {
  get key() {
    return 'ForgetPasswordMail';
  }

  async handle({ data }) {
    const { dataMail } = data;

    await Mail.sendMail({
      to: `${dataMail.name} <${dataMail.email}>`,
      subject: '[LARAWORK] - Alteração de Senha',
      template: 'forget_password',
      context: {
        name: dataMail.name,
        link: dataMail.link,
      },
      text: 'Alteração de Senha',
    });
  }
}

export default new ForgetPasswordMail();
