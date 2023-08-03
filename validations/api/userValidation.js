const Joi = require('joi');

const userValidation = (data)=>{
    
    try {
        const schema = Joi.object().keys({
            first_name:Joi.string().min(2).max(100).required().messages({
                "string.base":`Please give data in json!`,
                "string.min":`First name should have atleast 2 characters!`,
                "string.max":`First name cannot exceed more than 100 characters!`,
                "string.empty":`Please enter first name!`
            }),
            postal_code:Joi.string().length(6).pattern(/^[0-9]+$/).messages({
                "string.base":`Please give data in json!`,
                "string.length":`Postal code should be 6 digits only!`,
                "string.pattern":`Postal code should have numeric values only!`,
                "string.empty":`Please enter postal code!`
            }),
            country:Joi.string().min(2).max(100).messages({
                "string.base":`Please give data in json!`,
                "string.min":`Country name should have atleast 2 characters!`,
                "string.max":`Country name should not exceed more than 100 characters!`,
                "string.empty":`Please enter country name!`
            }),
            about_me:Joi.string().min(2).max(100).messages({
                "string.base":`Please give data in json!`,
                "string.min":`Your description should have atleast 2 characters!`,
                "string.max":`Your description should not exceed more than 100 characters!`,
                "string.empty":`Please enter your small description!`
            }),
            image:Joi.string().required().messages({
                "string.base":`Please give data in json!`,
                "string.empty":`Please upload your image!`
            })
        });
        
        const result = schema.validate(data);
        // console.log(result.error.details);
        return result;
    } catch (error) {
        return result.status(400).json({error:error.message});
    }
    
    
}
module.exports = {userValidation}