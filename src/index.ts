import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const port = 3000
//const port = 5000;

import { TuyaContext  } from '@tuya/tuya-connector-nodejs';


const context = new TuyaContext({
    baseUrl: 'https://openapi.tuyaeu.com',
    accessKey: process.env.ACCESS_KEY as string,
    secretKey: process.env.SECRET_KEY as string,
});

const diningId = 'bf904933cd7fe73d01um4a';
const loungeId = 'bf95ded55281d65df26rdf';
const lamp1 = 'bf2fc926b7ae87152aa3nr';
const lamp2 = 'bf7064b28946b3e363semq';

// app.get('/', (req, res) => {
//   res.status(200).send(['data'])
// })

app.post('/off', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "switch_led", "value": false }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not switch lamp1 off');
        }
    });
        context.request({
            path: `/v1.0/iot-03/devices/${lamp1}/commands`,
            method: 'POST',
            body: {
                "commands": [{"code": "switch_led", "value": false }]
            }
            }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send('Could not switch lamp2 off');
            }
    });
});

app.post('/on', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "switch_led", "value": true }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not switch lamp1 off');
        }
    });
        context.request({
            path: `/v1.0/iot-03/devices/${lamp2}/commands`,
            method: 'POST',
            body: {
                "commands": [{"code": "switch_led", "value": true }]
            }
            }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send('Could not switch lamp2 off');
            }
    });
});

app.post('/flickering', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
            "commands": [
                {"code": "switch_led", "value": true }, 
                {"code": "temp_value_v2", "value": 100 },
                {"code": "bright_value_v2", "value": 100 }, 
            ]
        }
    }).then(data => {
        context.request({
            path: `/v1.0/iot-03/devices/${lamp1}/commands`,
            method: 'POST',
            body: {
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(data => {
            context.request({
                path: `/v1.0/iot-03/devices/${lamp1}/commands`,
                method: 'POST',
                body: {
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(data => {
                context.request({
                    path: `/v1.0/iot-03/devices/${lamp1}/commands`,
                    method: 'POST',
                    body: {
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
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
    
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
            "commands": [
                {"code": "switch_led", "value": true }, 
                {"code": "bright_value_v2", "value": 100 }, 
            ]
        }
    }).then(data => {
        context.request({
            path: `/v1.0/iot-03/devices/${lamp2}/commands`,
            method: 'POST',
            body: {
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(data => {
            context.request({
                path: `/v1.0/iot-03/devices/${lamp2}/commands`,
                method: 'POST',
                body: {
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(data => {
                context.request({
                    path: `/v1.0/iot-03/devices/${lamp2}/commands`,
                    method: 'POST',
                    body: {
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
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
});


app.post('/:deviceId', (req, res) => {
    const bulb = req.params.deviceId;
    var id:string = "";
    if (bulb == "lamp1") {
        id = lamp1;
    } else if (bulb == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/status`,
        method: 'GET'
    }).then(data => {
        const switchStatus = (data.result as any[]).find(result => result.code === 'switch_led')?.value
        context.request({
            path: `/v1.0/iot-03/devices/${id}/commands`,
            method: 'POST',
            body: {
                "commands": [{"code": "switch_led", "value": !switchStatus }]
            }
          }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send('Could not switch ' + bulb);
            }
          });
    });
});


app.post('/:deviceId/off', (req, res) => {
    const bulb = req.params.deviceId;
    var id:string = "";
    if (bulb == "lamp1") {
        id = lamp1;
    } else if (bulb == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "switch_led", "value": false }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not switch ' + bulb + ' off');
        }
    });
});

app.post('/:deviceId/on', (req, res) => {
    const bulb = req.params.deviceId;
    var id:string = "";
    if (bulb == "lamp1") {
        id = lamp1;
    } else if (bulb == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "switch_led", "value": true }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not switch ' + bulb + ' on');
        }
    });
});


app.post('/:deviceId/flicker', (req, res) => {
    const bulb = req.params.deviceId;
    var id:string = "";
    if (bulb == "lamp1") {
        id = lamp1;
    } else if (bulb == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
            "commands": [
                {"code": "switch_led", "value": true }, 
                {"code": "bright_value_v2", "value": 100 }, 
            ]
        }
    }).then(data => {
        context.request({
            path: `/v1.0/iot-03/devices/${id}/commands`,
            method: 'POST',
            body: {
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(data => {
            context.request({
                path: `/v1.0/iot-03/devices/${id}/commands`,
                method: 'POST',
                body: {
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(data => {
                context.request({
                    path: `/v1.0/iot-03/devices/${id}/commands`,
                    method: 'POST',
                    body: {
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
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
});

app.post('/colour/:colourVal', (req, res) => {
    //const bulb = req.params.deviceId;
    var colourVal;
    if (req.params.colourVal == "warm"){
        colourVal = 100;
    } else if (req.params.colourVal == "cool") {
        colourVal = 1000;
    } else {
        colourVal = parseInt(req.params.colourVal);   
    }
    // var id:string = "";
    // if (bulb == "lamp1") {
    //     id = lamp1;
    // } else if (bulb == "lamp2") {
    //     id = lamp2;
    // } else {
    //     res.status(500).send('Device does not exist');
    // };
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not change lamp1');
        }
    });
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not change lamp2');
        }
    });
});


app.post('/:deviceId/colour/:colourVal', (req, res) => {
    const bulb = req.params.deviceId;
    var colourVal;
    if (req.params.colourVal == "warm"){
        colourVal = 100;
    } else if (req.params.colourVal == "cool") {
        colourVal = 1000;
    } else {
        colourVal = parseInt(req.params.colourVal);   
    }
    var id:string = "";
    if (bulb == "lamp1") {
        id = lamp1;
    } else if (bulb == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send('Could not switch ' + bulb + ' off');
        }
    });
});

app.get("/", (req, res) => {
    res.send("Tuya Bulb Custom API");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = app;