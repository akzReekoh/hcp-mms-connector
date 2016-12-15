'use strict';

const HOST = 'iotmmsp1942340584trial.hanatrial.ondemand.com',
    USERNAME = 'p1942340584',
    PASSWORD = 'Feb?0593',
    MESSAGE_TYPE = 'c126341ac97f8875611e';

var cp        = require('child_process'),
	should    = require('should'),
	timestamp = Date.now(),
	connector;

describe('Connector', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
		this.timeout(15000);
		setTimeout(function () {
			connector.kill('SIGKILL');
			done();
		}, 10000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						host: HOST,
                        username: USERNAME,
                        password: PASSWORD,
                        message_type: MESSAGE_TYPE
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
                    timestamp: timestamp,
                    data: JSON.stringify({
                        temp: 20
                    }),
                    rkh_device_info: {
                    	device: '9cbc4ef2-656c-4950-a584-cf6cd84ecb1f',
                    }
				}
			}, done);
		});
	});
});