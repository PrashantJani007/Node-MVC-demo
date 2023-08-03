const Joi = require('joi');

const blogValidation = (data)=>{

    const schema = Joi.object().keys({

        id:Joi.optional().allow(''),
        title:Joi.string().min(3).max(100).pattern(/\D+/).required().messages({
            "string.base":`Title should have alphabets only!`,
            "string.min":`Title should have atleast 3 characters!`,
            "string.max":`Title should not exceed more than 100 characters!`,
            "string.pattern":`Title cannot have only numbers!`,
            "string.empty":`Please enter title!`
        }),
        category:Joi.array().items(Joi.number()).required(),
        tag:Joi.array().items(Joi.number()).required(),
        description:Joi.string().required().messages({
            "string.base":`Please enter description!`,
            "string.empty":`Please enter description!`,
        }),
        image:Joi.string().optional().allow('')
    });

    const result = schema.validate(data);
    return result;
}

module.exports = {blogValidation}