'use strict';

var platform = require('./platform'),
	isPlainObject = require('lodash.isplainobject'),
    isEmpty = require('lodash.isempty'),
    get = require('lodash.get'),
    isArray = require('lodash.isarray'),
	request = require('request'),
    async = require('async'),
    config;

let sendData = (data, callback) => {
    let device = data.rkh_device_info.device || data.device;

    delete data.rkh_device_info;
    delete data.device;

    request.post({
        url: `https://${config.host}/com.sap.iotservices.mms/v1/api/http/data/${device}`,
        json: {
            mode: 'sync',
            messageType: config.message_type,
            messages: [data]
        },
        auth: {
            user: config.username,
            pass: config.password
        }
    }, (error, response, body) => {
        if(!error){
            platform.log(JSON.stringify({
                title: 'SAP-HCP message sent.',
                data: data
            }));
        }

        callback(error);
    });
};

platform.on('data', function (data) {
    if(isPlainObject(data)){
        sendData(data, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else if(isArray(data)){
        async.each(data, (datum, done) => {
            sendData(datum, done);
        }, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
});

platform.once('close', function () {
	platform.notifyClose();
});

platform.once('ready', function (options) {
    config = options;

	platform.notifyReady();
	platform.log('SAP-HCP Connector has been initialized.');
});