//17.10 (p. 18)

const winston = require('winston');
const { NODE_ENV } = require('./config')

//set up winston
const logger = winston.createLogger({
    level: 'info', //info means winston will log everything with a severity of info & greater
    format: winston.format.json(),
    transports: [
      //the logs will be stored in a file named info.log in json format
      new winston.transports.File({ filename: 'info.log' })
    ]
});

if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
}


module.exports = logger;


/* Notes
https://github.com/winstonjs/winston

winston is designed to be a simple and universal logging library with support for multiple transports. 
A transport is essentially a storage device for your logs. 
Each winston logger can have multiple transports (see: Transports) configured at different levels (see: Logging levels). 
For example, one may want error logs to be stored in a persistent remote location (like a database), 
but all logs output to the console or a local file.

winston aims to decouple parts of the logging process to make it more flexible and extensible. 
Attention is given to supporting flexibility in log formatting (see: Formats) & levels 
(see: Using custom logging levels), and ensuring those APIs decoupled from the implementation 
of transport logging (i.e. how the logs are stored / indexed, see: Adding Custom Transports) 
to the API that they exposed to the programmer.

*/