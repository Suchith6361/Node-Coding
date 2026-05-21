import Joi from "joi";

const signupSchema= Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(5).required(),
    role:Joi.string().valid("admin","manager").required()
})

export default signupSchema;