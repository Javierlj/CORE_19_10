const Sequelize = require("sequelize");
const {models} = require("../models");

// GET /quizzes
exports.add = (req, res, next) => {
    req.user.addFollower(req.session.user.id)
    .then(() => { // Follows other user
        if(req.xhr){
            res.send(200);
        }else{
            res.sendStatus(415);
        }
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
};

exports.delete = (req, res, next) => {
    req.user.removeFollower(req.session.user.id)
    .then(() => { // Follows other user
        if(req.xhr){
            res.send(200);
        }else{
            res.sendStatus(415);
        }
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
};