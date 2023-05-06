# Tuya Bulb API
This api was developed to communicate with Arlec bulbs. To make use of it, you must have a Tuya IoT account, and at least 1 arlec bulb, but it has been designed for two.

## Set Up

To set up, clone this repository and install dependancies with `npm install`.
Populate the .env file with your access keys and bulb ids.
Then run the api with `npm run start`.

## Endpoints

All the endpoints that were made as part of this project can be found below:

#### Switch
`/:deviceId`
Toggles the bulb. (If the light is on, it will turn it off. If it is off, it will turn it on.)

#### Off

`/off`
Switches both bulbs off

`/:deviceId/off`
Switches the selected bulb off

#### On

`/on`
Switches both bulbs on

`/:deviceId/on`
Switches only the selected bulb on

#### Flicker

`/flicker`
Makes both bulbs to flicker twice

`/:deviceId/flicker`
Flickers the selected bulb twice

#### Colour Temperature

For colour temperature adjustments, values can be between 100 and 1000, or the keywords 'warm', 'warmwhite' or 'white'


`/colour/:colourVal`
Adjusts the colour temperature of both bulbs.

`/:deviceId/colour/:colourVal`
Adjusts the colour temperature of the selected bulb.

#### Brightness

For brightness adjustments, values can be between 100 and 1000, or the keywords 'low', 'mid' or 'high'


`/bright/:brightVal`
Adjusts the brightness of both bulbs.

`/:deviceId/bright/:brightVal`
Adjusts the brightness of the selected bulb.

