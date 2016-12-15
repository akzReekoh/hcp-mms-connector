# Connector Plugin Seed

[![Build Status](https://travis-ci.org/Reekoh/hcp-mms-connectorsvg)](https://travis-ci.org/Reekoh/hcp-mms-connector)
![Dependencies](https://img.shields.io/david/Reekoh/hcp-mms-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/hcp-mms-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

##Description

Connects a Reekoh Instance to SAP-HCP's MMS API Service.

## Configuration

1. Host - The SAP-HCP Host to send data to.
2. Username - The SAP-HCP account Username.
3. Password -  The SAP-HCP Password.
4. Message Type - The Message Type(ID) to use.

These parameters are then injected to the plugin from the platform.

## Sample input data
```
//single input
{
    timestamp: timestamp,
    data: JSON.stringify({
        temp: 20
    })
}
```

OR
```
bulk input
[
    {
        timestamp: timestamp,
            data: JSON.stringify({
                temp: 20
            })
    },
    {
        timestamp: timestamp,
            data: JSON.stringify({
                temp: 20
            })
    }
]