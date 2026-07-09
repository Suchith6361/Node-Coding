import rateLimit from 'express-rate-limit';

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes
    max:5,

    message:{
        status: 429,    
          message: "Too many requests. Try again after 15 minutes."
    }
})

export default limiter;