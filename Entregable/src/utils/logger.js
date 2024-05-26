import { format } from "bytes";
import winston from "winston";

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
        },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'cyan'
    }
}

const logger = winston.createLogger({
    levels: customLevelOpt.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({color: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'warning',
            filename:'./warning.log',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            level: 'error',
            filename:'./errors.log',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            level: 'fatal',
            filename:'./fatal.log',
            format: winston.format.simple()
        })
    ]
})

export const addLoger = (req,res,next) => {
    req.logger = logger
    req.logger.info(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}
