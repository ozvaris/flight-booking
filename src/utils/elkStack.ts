import * as winston from 'winston';
// import { LogstashTransport } from 'winston-logstash/lib/winston-logstash-latest';
const LogstashTransport = require("winston-logstash/lib/winston-logstash-latest");

// Logstash transport ekleyin
const logger = winston.createLogger({
  transports: [
    new LogstashTransport({
      port: 5044,
      host: process.env.LOGSTASH_HOST, // Docker Compose kullanıyorsanız, Logstash servis adı burada "logstash" olabilir.
      max_connect_retries: -1, // Bağlantıyı sürekli yeniden denemesi için
    })
  ]
});

// logger'ı dışa aktar
export default logger;

