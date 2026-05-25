// Global Error Handler Middleware

const errorHandler = (err, req, res, next) => {

    res.status(500).json({
        success: false,
        error: err.message||"Server Error",
    });

};

export default errorHandler;