const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'production'

// Basic JSON body parser middleware
app.use(express.json())


