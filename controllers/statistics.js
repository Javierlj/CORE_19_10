const Sequelize = require("sequelize");
const {models} = require("../models");

exports.index= (req, res, next) => {
    let userNumber= models.user.count();
    let quizNumber= models.quiz.count();
    let tipsNumber= models.tip.count();
    
    Promise.all([userNumber,quizNumber,tipsNumber])
    .then(values=>{
        res.render('statistics',{values});
    })
    .catch(error => next(error));
}