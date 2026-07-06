const logger = require('./logger');

class AsyncQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(job) {
    this.queue.push(job);
    logger.info(`Async job enqueued: ${job.name}`);
    this.process();
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const job = this.queue.shift();
    try {
      logger.info(`Processing async job: ${job.name}`);
      await job.handler();
      logger.info(`Async job completed: ${job.name}`);
    } catch (err) {
      logger.error(`Async job failed: ${job.name} - ${err.message}`);
    }

    this.processing = false;
    this.process();
  }
}

const asyncQueue = new AsyncQueue();

const simulateEmail = (to, subject, body) => {
  asyncQueue.enqueue({
    name: `Send Email to ${to}`,
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      logger.info(`Email sent to ${to} - Subject: ${subject}`);
      logger.info(`Email body: ${body}`);
    },
  });
};

module.exports = { asyncQueue, simulateEmail };
