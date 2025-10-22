import pino from 'pino';
const logger = pino({ level: 'info' });

const startLogger = () => {
    logger.info('Server started');
    logger.error({ err: new Error('Oops') }, 'Something failed');
}

export default startLogger;