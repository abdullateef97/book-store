import { createSimpleLogger, STANDARD_LEVELS } from 'simple-node-logger';

const log = createSimpleLogger();

const logLevel: STANDARD_LEVELS = <STANDARD_LEVELS>process.env.LOG_LEVEL || <STANDARD_LEVELS>'debug';

log.setLevel(logLevel);

export default log;