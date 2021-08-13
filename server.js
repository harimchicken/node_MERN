require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express();

require('./config/database')


// routing
const usersRoute = require('./routes/users')
const profilesRoute = require('./routes/profile')
const postsRoute = require('./routes/posts')


// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


// Use Routes
app.use('/api/users', usersRoute)
app.use('/api/profile', profilesRoute)
app.use('/api/posts', postsRoute)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
