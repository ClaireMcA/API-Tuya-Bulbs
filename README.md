### Tuya Bulb API
This api was developed to communicate with Arlec bulbs. To make use of it, you must have a Tuya IoT account, and at least 1 arlec bulb, but it has been designed for two.

# Set Up

To set up, clone this repository and install dependancies with
    npm install

Populate the .env file with your access keys and bulb ids. 

Then run the api with
    npm run start

# Endpoints

All the endpoints that were made as part of this project can be found below:

    //This endpoint will toggle the switch. (If the light is on, it will turn it off. If it is off, it will turn it on.)
    post '/:deviceId'
    
    // This endpoint will switch both devices off
    post '/off'

    // This endpoint switches only the selected endpoint off
    post '/:deviceId/off'


    // This endpoint will switch both devices on
    post '/on'

    // This endpoint switches only the selected endpoint on
    post '/:deviceId/on'


    // This was a fun endpoint that gets both devices to flicker twice
    post '/flickering'

    // This flickers the selected device twice
    post '/:deviceId/flicker'

For colour temperature adjustments, values can be between 100 and 1000, or the keywords 'warm', 'warmwhite' or 'white'
    // This enpoint will adjust the colour temperature of both bulbs.
    post '/colour/:colourVal'

    // This enpoint allows you to adjust the colour temperature of both bulbs.
    post '/:deviceId/colour/:colourVal'

For brightness adjustments, values can be between 100 and 1000, or the keywords 'low', 'mid' or 'high'
    // This enpoint will adjust the brightness of both bulbs.
    post '/bright/:brightVal'

    // This enpoint allows you to adjust the brightness of both bulbs.
    post '/:deviceId/bright/:brightVal'

