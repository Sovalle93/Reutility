const reviewSchemas = require('./reviewSchema');
const alertaSchemas = require('./alertaSchema');
const userSchemas = require('./userSchema');
const plazaSchemas = require('./plazaSchema');

module.exports = {
    ...reviewSchemas,
    ...alertaSchemas,
    ...userSchemas,
    ...plazaSchemas
};