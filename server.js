const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'production'

// Basic JSON body parser middleware
app.use(express.json())
// ------------------------------------------------------
// ------------------------------------------------------

// Structured logging utility for better log management
const log = (level, message, meta = {}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,    
        ...meta
    }))
}

// Middleware to log incoming requests
app.use((req, res, next) => {
    log('info', 'Incoming request', { method: req.method, url: req.url })
    next()
})


// Example route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the Production-Grade DevOps Showcase API!',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    })
})

app.get("/healthz", () => {
    
})


// Error handling middleware
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found',
        timestamp: new Date().toISOString()
    })
})


// Start the server
const server = app.listen(PORT, () => {
    log('info', `Server is running on port ${PORT} in ${NODE_ENV} mode`)
})


