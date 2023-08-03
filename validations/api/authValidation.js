const Joi = require('joi');

const authValidation = (data)=>{
    try {
        const schema = Joi.object().keys({
            first_name:Joi.string().min(2).max(100).required().messages({
                "string.base":`Please give data in json!`,
                "string.min":`First name should have atleast 2 characters!`,
                "string.max":`First name cannot exceed more than 100 characters!`,
                "string.empty":`Please enter first name!`
            }),
            email:Joi.string().email().max(100).required().messages({
                "string.base":`Please give data in json!`,
                "string.email":`Please enter email in proper format!`,
                "string.max":`Email cannot exceed more than 100 characters!`,
                "string.empty":`Please enter email!`
            }),
            password:Joi.string().required().messages({
                "string.base":`Please give data in json!`,
                "string.empty":`Please enter password!` 
            }),
        });
        
        const result = schema.validate(data);
        // console.log(result.error.details);
        return result;
    } catch (error) {
        return result.status(400).json({error:error.message});
    }
}

module.exports = {authValidation}