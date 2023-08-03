const Joi = require('joi');

const locationValidation = (data)=>{
    
    const schema = Joi.object().keys({
        
        name:Joi.string().min(2).max(100).required().messages({
            "string.base":`Please give data in json!`,
            "string.min":`Name should have atleast 2 characters!`,
            "string.max":`Name cannot exceed more than 100 characters!`,
            "string.empty":`Please enter Name!`
        }),

        address:Joi.string().min(2).max(100).required().messages({
            "string.base":`Please give data in json!`,
            "string.min":`Station Address should have atleast 2 characters!`,
            "string.max":`Station Address cannot exceed more than 100 characters!`,
            "string.empty":`Please enter Station Address!`
        }),
        details:Joi.string().min(2).max(100).required().messages({
            "string.base":`Please give data in json!`,
            "string.min":`Station Details should have atleast 2 characters!`,
            "string.max":`Station Details cannot exceed more than 100 characters!`,
            "string.empty":`Please enter Station Details!`
        }),
        hours:Joi.number().integer().greater(0).less(24).required({
            "number.base":`Please give hours in number format!`,
            "number.min":`Hours value should be greater than 0!`,
            "number.max":`Hours value should be less than 24!`,
            "any.required":`Please enter hours!`
        }),
        price:Joi.string()
        // .pattern(/^\d+\.\d{0,2}$/)
        .required().messages({
            "string.base":`Please give data in json!`,
            // "string.pattern":`Price should be in numbers only with upto 2 decimal digits!`,
            "string.empty":`Please enter price!`
        }),
        phone_number:Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
            "string.base":`Please give data in json!`,
            "string.length":`Phone number length should be 10 digits only!`,
            "string.pattern":`Please enter phone number in numbers only!`,
            "string.empty":`Please enter phone number!`
        }),
        clearance_meter:Joi.string().pattern(/^\d+\.\d{0,2}$/).required().messages({
            "string.base":`Please give data in json!`,
            "string.pattern":`Clearance meter should have floating value upto 2 decimal digits!`,
            "string.empty":`Please enter Clearance meter!`
        }),
        parking_level:Joi.number().integer().greater(0).less(10).required().messages({
            "number.base":`Please give data in json!`,
            "number.integer":`Parking level should not have decimal value!`,
            "number.greater":`Parking level should be greater than 0 only!`,
            "number.less":`Parking level should be less than 10 only!`,
            "any.required":`Please enter parking level!`
        }),
        is_open:Joi.boolean().required().messages({
            "boolean.base":`Only yes or no is accepted for location open/active!`,
            "boolean.empty":`Please select charging location open/active option!`
        }),
        is_full_time:Joi.boolean().required().messages({
            "boolean.base":`Only yes or no is accepted for 24/7 open option!`,
            "boolean.empty":`Please select option for 24/7 open or not!`
        }),
        restricted_access:Joi.boolean().required().messages({
            "boolean.base":`Only yes or no is accepted for restricted access!`,
            "boolean.empty":`Please select option for restricted access!`
        }),
        payment_required:Joi.boolean().required().messages({
            "boolean.base":`Only yes or no is accepted for payment required option!`,
            "boolean.empty":`Please select option for payment required option!`
        }),
        plug_id:Joi.array().items(Joi.number()).required(),
        network_id:Joi.array().items(Joi.number()).required(),
        amenity_id:Joi.array().items(Joi.number()).required(),
        parking_attribute_id:Joi.array().items(Joi.number()).required(),
        latitude:Joi.number().precision(10).required().messages({
            "number.base":`Please enter numeric value`,
            "number.unsafe":`Decimal digits up 10 digits are allowed for latitude!`,
            "any.required":`Please provide latitude!`
        }),
        longitude:Joi.number().precision(10).required().messages({
            "number.base":`Please enter numeric value`,
            "number.unsafe":`Decimal digits up 10 digits are allowed for longitude!`,
            "any.required":`Please provide longitude!`
        }),
        
    }).unknown();
    const result = schema.validate(data);
    // console.log(result.error);
    return result;
}
module.exports = {locationValidation}