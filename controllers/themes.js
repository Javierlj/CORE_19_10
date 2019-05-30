const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {models} = require("../models");

exports.load = (req, res, next) => {
    models.theme.findAll()
    .then(themes=>{
        req.session.themes=themes;
        next();
    })
    .catch(error => next(error));
}