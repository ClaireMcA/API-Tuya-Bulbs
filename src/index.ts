import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const port = 3000

import { TuyaContext  } from '@tuya/tuya-connector-nodejs';

// The context is handled by the tuya-connector-nodejs library. 
// It is making a secure connection to the tuya api using the access and secret keys I have provided
const context = new TuyaContext({
    baseUrl: 'https://openapi.tuyaeu.com',
    accessKey: process.env.ACCESS_KEY as string,
    secretKey: process.env.SECRET_KEY as string,
});

const lamp1 = process.env.LAMP1_ID as string;
const lamp2 = process.env.LAMP2_ID as string;

app.post('/off', (req, res) => {
    context.request({
        // This is the tuya endpoint that commands should be sent to for a given device (lamp1 in this case).
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        // This is the command that I am sending. It changes lamp 1 to off (false)
        body: {
            "commands": [{"code": "switch_led", "value": false }]
        }
        }).then(result => {
        // Once I have recieved the result, log it in the console and send the right status code.
            console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
        // This is an error message so I know which request didn't work and what it was trying to do.
            res.status(500).send(result.msg);
        }
    });
        // Do that same but for lamp 2.
        context.request({
            path: `/v1.0/iot-03/devices/${lamp1}/commands`,
            method: 'POST',
            body: {
            // Turn lamp 2 off (false)
                "commands": [{"code": "switch_led", "value": false }]
            }
            }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send(result.msg);
            }
    });
});


// The on endpoint is similar but the command sent is true not false.
app.post('/on', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        // Turn lamp 1 on (true)
        body: {
            "commands": [{"code": "switch_led", "value": true }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
        // Turn lamp 2 on (true)
            "commands": [{"code": "switch_led", "value": true }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});


// This was a fun command that gets both devices to flicker twice
app.post('/flickering', (req, res) => {
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
            // Make sure lamp1 is on then decrease to min brightness
            "commands": [
                {"code": "switch_led", "value": true }, 
                {"code": "bright_value_v2", "value": 100 }, 
            ]
        }
    }).then(result => {
        context.request({
            path: `/v1.0/iot-03/devices/${lamp1}/commands`,
            method: 'POST',
            body: {
                // Increase to max brightness for lamp 1
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(result => {
            context.request({
                path: `/v1.0/iot-03/devices/${lamp1}/commands`,
                method: 'POST',
                body: {
                    // Decrease to min brightness for lamp 1
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(result => {
                context.request({
                    path: `/v1.0/iot-03/devices/${lamp1}/commands`,
                    method: 'POST',
                    body: {
                        // Increase to max brightness for lamp 1
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
                        ]
                    }
                }).then(result => {
                    console.log(result)
                    if (result.success) {
                        res.status(201).send();
                    } else {
                        res.status(500).send(result.msg);
                    }
                });    
            });
        });
    });
    
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
            // Decrease to min brightness for lamp 2
            "commands": [
                {"code": "switch_led", "value": true }, 
                {"code": "bright_value_v2", "value": 100 }, 
            ]
        }
    }).then(result => {
        context.request({
            path: `/v1.0/iot-03/devices/${lamp2}/commands`,
            method: 'POST',
            body: {
                // Increase to max brightness for lamp 2
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(result => {
            context.request({
                path: `/v1.0/iot-03/devices/${lamp2}/commands`,
                method: 'POST',
                body: {
                    // Decrease to min brightness for lamp 2
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(result => {
                context.request({
                    path: `/v1.0/iot-03/devices/${lamp2}/commands`,
                    method: 'POST',
                    body: {
                        // Increase to max brightness for lamp 2
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
                        ]
                    }
                }).then(result => {
                    console.log(result)
                    if (result.success) {
                        res.status(201).send();
                    } else {
                        res.status(500).send(result.msg);
                    }
                });    
            });
        });
    });
});

app.post('/colour/:colourVal', (req, res) => {
    var colourVal:number;
    // Check the posts colourVal input for keywords, otherwise treat as a number
    if (req.params.colourVal == "warm"){
        colourVal = 100;
    } else if (req.params.colourVal == "warmwhite") {
        colourVal = 500;
    } else if (req.params.colourVal == "white") {
        colourVal = 1000;
    } else {
        colourVal = parseInt(req.params.colourVal);   
    }
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
        // Change the colour temperature on Lamp 1 to inputted value
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
    context.request({
        path: `/v1.0/iot-03/devices/${lamp2}/commands`,
        method: 'POST',
        body: {
        // Change the colour temperature on Lamp 2 to inputted value
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});

app.post('/bright/:brightVal', (req, res) => {
    var brightVal:number;
    // Check the posts brightVal input for keywords, otherwise treat as a number
    if (req.params.brightVal == "low"){
        brightVal = 100;
    } else if (req.params.brightVal == "mid") {
        brightVal = 500;
    } else if (req.params.brightVal == "high") {
        brightVal = 1000;
    } else {
        brightVal = parseInt(req.params.brightVal);   
    }
    context.request({
        path: `/v1.0/iot-03/devices/${lamp1}/commands`,
        method: 'POST',
        body: {
        // Change the brightness on Lamp 1 to inputted value
            "commands": [{"code": "bright_value_v2", "value": brightVal }]
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
        // Change the brightness on Lamp 2 to inputted value
            "commands": [{"code": "bright_value_v2", "value": brightVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});

app.post('/:deviceId', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    // Request the current status of that bulb (is it on or off)
    context.request({
        path: `/v1.0/iot-03/devices/${id}/status`,
        method: 'GET'
    }).then(response => {
        // This is sorting through the response to find the key value pair that has the status of the lightbulb, 
        // and assigning the value to a variable
        const switchStatus = (response.result as any[]).find(result => result.code === 'switch_led')?.value
        context.request({
            path: `/v1.0/iot-03/devices/${id}/commands`,
            method: 'POST',
            body: {
                // This sets the value to the opposite of the current value
                "commands": [{"code": "switch_led", "value": !switchStatus }]
            }
          }).then(result => {
            console.log(result)
            if (result.success) {
                res.status(201).send();
            } else {
                res.status(500).send(result.msg);
            }
          });
    });
});

app.post('/:deviceId/off', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
        // Change the switch status for that buld to off (false)
            "commands": [{"code": "switch_led", "value": false }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});

app.post('/:deviceId/on', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
   
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
        // Change the switch status for that buld to on (true)
            "commands": [{"code": "switch_led", "value": true }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});

app.post('/:deviceId/flicker', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };

    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
        // Make sure selected lamp is on then decrease to min brightness
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
            // Increase to max brightness
                "commands": [
                    {"code": "bright_value_v2", "value": 1000 }, 
                ]
            }
        }).then(data => {
            context.request({
                path: `/v1.0/iot-03/devices/${id}/commands`,
                method: 'POST',
                body: {
                // Decrease to min brightness
                    "commands": [
                        {"code": "bright_value_v2", "value": 100 }, 
                    ]
                }
            }).then(data => {
                context.request({
                    path: `/v1.0/iot-03/devices/${id}/commands`,
                    method: 'POST',
                    body: {
                    // Increase to max brightness
                        "commands": [
                            {"code": "bright_value_v2", "value": 1000 }, 
                        ]
                    }
                }).then(result => {
                    console.log(result)
                    if (result.success) {
                        res.status(201).send();
                    } else {
                        res.status(500).send(result.msg);
                    }
                });    
            });
        });
    });
});

app.post('/:deviceId/colour/:colourVal', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    // Check the input colourVal for keywords, otherwise treat as a number
    var colourVal;
    if (req.params.colourVal == "warm"){
        colourVal = 100;
    } else if (req.params.colourVal == "warmwhite") {
        colourVal = 500;
    } else if (req.params.colourVal == "white") {
        colourVal = 1000;
    } else {
        colourVal = parseInt(req.params.colourVal);   
    }
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
        // Change the colour temperature of selected bulb to inputted value
            "commands": [{"code": "temp_value_v2", "value": colourVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
        }
    });
});

app.post('/:deviceId/bright/:brightVal', (req, res) => {
    // Check the input against keywords to see which lightbulb has been requested, send back an error if it is not found.
    // Put the id into a variable to use.
    var id:string = "";
    if (req.params.deviceId == "lamp1") {
        id = lamp1;
    } else if (req.params.deviceId == "lamp2") {
        id = lamp2;
    } else {
        res.status(500).send('Device does not exist');
    };
    // Check the input brightVal for keywords, otherwise treat as a number
    var brightVal;
    if (req.params.brightVal == "low"){
        brightVal = 100;
    } else if (req.params.brightVal == "high") {
        brightVal = 1000;
    } else {
        brightVal = parseInt(req.params.brightVal);   
    }
    context.request({
        path: `/v1.0/iot-03/devices/${id}/commands`,
        method: 'POST',
        body: {
            // Change the brightness of selected bulb to inputted value
            "commands": [{"code": "bright_value_v2", "value": brightVal }]
        }
        }).then(result => {
        console.log(result)
        if (result.success) {
            res.status(201).send();
        } else {
            res.status(500).send(result.msg);
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