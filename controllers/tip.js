const Sequelize = require("sequelize");
const {models} = require("../models");


// Autoload the tip with id equals to :tipId
exports.load = (req, res, next, tipId) => {
    models.tip.findByPk(tipId)
    .then(tip => {
        if (tip) {
            req.tip = tip;
            next();
        } else {
            next(new Error('There is no tip with tipId=' + tipId));
        }
    })
    .catch(error => next(error));
};


// MW - No se pueden crear mas de 50 tips por quiz
exports.limitPerQuiz = (req, res, next) => {

    const LIMIT_PER_QUIZ = 50;

    let countOptions = {
        where: {
            quizId: req.quiz.id
        }
    };

    models.tip.count(countOptions)
    .then(count => {
        if (count < LIMIT_PER_QUIZ) {
            next();
        } else {
            req.flash('error', `Maximun ${LIMIT_PER_QUIZ} tips (accepted and non accepted) per quiz.`);
            res.redirect('back');
        }
    });
};


// POST /quizzes/:quizId/tips
exports.create = (req, res, next) => {
    
    const authorId= req.session.user && req.session.user.id || '0';
    const tip = models.tip.build(
        {
            text: req.body.text,
            quizId: req.quiz.id,
            authorId
        });

    tip.save()
    .then(tip => {
        req.flash('success', 'Tip created successfully.');
        res.redirect("back");
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.redirect("back");
    })
    .catch(error => {
        req.flash('error', 'Error creating the new tip: ' + error.message);
        next(error);
    });
};


// GET /quizzes/:quizId/tips/:tipId/accept
exports.accept = (req, res, next) => {

    const {tip} = req;

    tip.accepted = true;

    tip.save(["accepted"])
    .then(tip => {
        req.flash('success', 'Tip accepted successfully.');
        res.redirect('/quizzes/' + req.params.quizId);
    })
    .catch(error => {
        req.flash('error', 'Error accepting the tip: ' + error.message);
        next(error);
    });
};


// DELETE /quizzes/:quizId/tips/:tipId
exports.destroy = (req, res, next) => {

    req.tip.destroy()
    .then(() => {
        req.flash('success', 'tip deleted successfully.');
        res.redirect('/quizzes/' + req.params.quizId);
    })
    .catch(error => next(error));
};

// GET /quizzes/:quizId(\\d+)/tips/:tipId(\\d+)/edit
exports.edit = (req, res, next) => {
    const {tip,quiz} = req;

    res.render('tips/edit', {tip,quiz});

};

// PUT /quizzes/:quizId(\\d+)/tips/:tipId(\\d+)
exports.update = (req, res, next) => {

    const {tip, body} = req;

    tip.text= body.text;
    tip.accepted = false;

    tip.save({fields: ["accepted", "text"]})
    .then(quiz => {
        req.flash('success', 'Tip edited successfully.');
        res.redirect('/quizzes/' + req.params.quizId);
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('tips/edit', {tip});
    })
    .catch(error => {
        req.flash('error', 'Error editing the tip: ' + error.message);
        next(error);
    });

};

exports.adminOrAuthorRequired = (req, res, next) => {

    const isAdmin  = !!req.session.user.isAdmin;
    const isAuthor = req.tip.authorId === req.session.user.id;

    if (isAdmin || isAuthor) {
        next();
    } else {
        console.log('Prohibited operation: The logged in user is not the author of the tip, nor an administrator.');
        res.send(403);
    }
};