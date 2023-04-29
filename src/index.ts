require('dotenv').config();
import express from 'express';
const app = express()
const port = 3000

import { TuyaContext  } from '@tuya/tuya-connector-nodejs';

const context = new TuyaContext({
    baseUrl: 'https://openapi.tuyaeu.com',
    accessKey: '',
    secretKey: '',
});

const diningId = 'bf904933cd7fe73d01um4a';
const loungeId = 'bf95ded55281d65df26rdf';

// app.get('/', (req, res) => {
//   res.status(200).send(['data'])
// })


app.post('/dining/flicker', (req, res) => {
    // const id = req.params.deviceId;
    const id = diningId;
        context.request({
            path: `/v1.0/iot-03/devices/${id}/commands`,
            method: 'POST',
            body: {
                "commands": [
                    // {"code": "switch_led", "value": false }, 
                    {"code": "switch_led", "value": true }, 
                    // {"code": "bright_value_v2", "value": 100 }, 
                    {"code": "bright_value_v2", "value": 100 }, 
                    // {"code": "colour_data_v2", "value": 100 }
                ]
            }
        }).then(data => {
            // console.log(result);
            context.request({
                path: `/v1.0/iot-03/devices/${id}/commands`,
                method: 'POST',
                body: {
                    "commands": [
                        // {"code": "switch_led", "value": false }, 
                        // {"code": "switch_led", "value": true }, 
                        {"code": "bright_value_v2", "value": 1000 }, 
                        // {"code": "colour_data_v2", "value": 100 }
                    ]
                }
            }).then(data => {
                // console.log(result);
                context.request({
                    path: `/v1.0/iot-03/devices/${id}/commands`,
                    method: 'POST',
                    body: {
                        "commands": [
                            // {"code": "switch_led", "value": false }, 
                            // {"code": "countdown", "value": 2 },
                            // {"code": "switch_led", "value": true }, 
                            {"code": "bright_value_v2", "value": 100 }, 
                            // {"code": "colour_data_v2", "value": 100 }
                        ]
                    }
                }).then(data => {
                    // console.log(result);
                    context.request({
                        path: `/v1.0/iot-03/devices/${id}/commands`,
                        method: 'POST',
                        body: {
                            "commands": [
                                // {"code": "switch_led", "value": false }, 
                                // {"code": "countdown", "value": 2 },
                                // {"code": "switch_led", "value": true }, 
                                {"code": "bright_value_v2", "value": 1000 }, 
                                // {"code": "colour_data_v2", "value": 100 }
                            ]
                        }
                    }).then(result => {
                        console.log(result)
                        if (result.success) {
                            res.status(201).send();
                        } else {
                            res.status(500).send('TUYA failure');
                        }
                    });    
                });
            });
        });
    // });
});

app.post('/lounge', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${loungeId}/status`,
        method: 'GET'
    }).then(data => {
        const switchStatus = (data.result as any[]).find(result => result.code === 'switch_led')?.value
        context.request({
            path: `/v1.0/iot-03/devices/${loungeId}/commands`,
            method: 'POST',
            body: {
                "commands": [{"code": "switch_led", "value": !switchStatus }]
            }
          }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send('TUYA failure');
            }
          });
    });
});

app.post('/lounge/', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${loungeId}/status`,
        method: 'GET'
    }).then(data => {
        const switchStatus = (data.result as any[]).find(result => result.code === 'switch_led')?.value
        context.request({
            path: `/v1.0/iot-03/devices/${loungeId}/commands`,
            method: 'POST',
            body: {
                "commands": [{"code": "switch_led", "value": !switchStatus }]
            }
          }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send('TUYA failure');
            }
          });
    });
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = app;