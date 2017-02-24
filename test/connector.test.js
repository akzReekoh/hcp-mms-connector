'use strict'

const amqp = require('amqplib')

const HOST = 'iotmmsp1942340584trial.hanatrial.ondemand.com'
const USERNAME = 'p1942340584'
const PASSWORD = 'Feb?0593'
const MESSAGE_TYPE = 'c126341ac97f8875611e'

let _channel = null
let _conn = null
let app = null
let timestamp = Date.now()

describe('HCP MMS Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      host: HOST,
      username: USERNAME,
      password: PASSWORD,
      messageType: MESSAGE_TYPE
    })
    process.env.INPUT_PIPE = 'ip.hcpmms'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        timestamp: timestamp,
        data: JSON.stringify({
          temp: 20
        }),
        rkhDeviceInfo: {
          device: '9cbc4ef2-656c-4950-a584-cf6cd84ecb1f',
        }
      }

      _channel.sendToQueue('ip.hcpmms', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})

// 'use strict';
//
// const HOST = 'iotmmsp1942340584trial.hanatrial.ondemand.com',
//     USERNAME = 'p1942340584',
//     PASSWORD = 'Feb?0593',
//     MESSAGE_TYPE = 'c126341ac97f8875611e';
//
// var cp        = require('child_process'),
// 	should    = require('should'),
// 	timestamp = Date.now(),
// 	connector;
//
// describe('Connector', function () {
// 	this.slow(5000);
//
// 	after('terminate child process', function (done) {
// 		this.timeout(15000);
// 		setTimeout(function () {
// 			connector.kill('SIGKILL');
// 			done();
// 		}, 10000);
// 	});
//
// 	describe('#spawn', function () {
// 		it('should spawn a child process', function () {
// 			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
// 		});
// 	});
//
// 	describe('#handShake', function () {
// 		it('should notify the parent process when ready within 5 seconds', function (done) {
// 			this.timeout(5000);
//
// 			connector.on('message', function (message) {
// 				if (message.type === 'ready')
// 					done();
// 			});
//
// 			connector.send({
// 				type: 'ready',
// 				data: {
// 					options: {
// 						host: HOST,
//                         username: USERNAME,
//                         password: PASSWORD,
//                         message_type: MESSAGE_TYPE
// 					}
// 				}
// 			}, function (error) {
// 				should.ifError(error);
// 			});
// 		});
// 	});
//
// 	describe('#data', function (done) {
// 		it('should process the data', function () {
// 			connector.send({
// 				type: 'data',
// 				data: {
//                     timestamp: timestamp,
//                     data: JSON.stringify({
//                         temp: 20
//                     }),
//                     rkh_device_info: {
//                     	device: '9cbc4ef2-656c-4950-a584-cf6cd84ecb1f',
//                     }
// 				}
// 			}, done);
// 		});
// 	});
// });