import logger from '@lib/Logger';

export default async (req, res, next) => {
  res.sendError = function(message, status = 500) {
    logger.error({
      message,
      status,
      // date: new Date()
    });

    return this.status(status).send({
      error: message,
    });
  };

  next();
};
