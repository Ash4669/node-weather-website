import request from 'request'

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=4e658f9f0b4a4851f46908b1feb75181&query='
     + latitude + ',' + longitude + '&units=f'
    
    request({url, json: true}, (error, { body })=> {
        if (error) {
            callback('Unable to connect to the server.', undefined)
        } else if (body.error) {
            callback('Unable to find location. Please try again', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions + '. It is currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees out with humidity of ' + body.current.humidity + '%.' )
        }
    })
}

export default forecast