
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

const limiter = rateLimit({
    windowMS: 10 * 60 * 1000,   //10min
    max: 50
})

app.use(limiter)
app.set('trust proxy', 1)

//Set static folder
app.use(express.static('public'))

app.use('/api', require('./routes/index'))
app.use(cors())

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))