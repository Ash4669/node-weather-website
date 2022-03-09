import path from 'path'
import {fileURLToPath} from 'url'
import express from 'express'
import hbs from 'hbs'
import geocode from './utils/geocode.js'
import forecast from './utils/forecast.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebard engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ashley'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Ashley'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Ashley',
        helpText: "You're on your own"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (forecastError, forecastData) => {
            if (forecastError) {
                return res.send({
                    error: forecastError
                })
            }

            res.send(
                {
                    forecast: forecastData, 
                    location: location,
                    address: req.query.address
                }
            )
        })
    })
})

app.get('/product', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ashley',
        message: "404, page not found. You'll never get the help you need"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ashley',
        message: '404, page not found. There are no memes here'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})