const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'production'

// Basic JSON body parser middleware
app.use(express.json())
// ------------------------------------------------------
// ------------------------------------------------------

// Structured logging utility for better log management
const log = (level, message, meta ={}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
    }))
}