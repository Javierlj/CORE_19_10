"use strict";

const Sequelize = require("sequelize");
const {models} = require("../models");

const paginate = require('../helpers/paginate').paginate;
const authentication = require('../helpers/authentication');

// Autoload the user with id equals to :userId
exports.load = (req, res, next, userId) => {

    models.user.findByPk(userId, {include:[
        {model: models.user,
            as:"Followers"
        },
        {model: models.user,
            as: "Followed" 
        }
    ]})
    .then(user => {
        if (user) {
            req.user = user;
            next();
        } else {
            req.flash('error', 'There is no user with id=' + userId + '.');
            throw new Error('No exist userId=' + userId);
        }
    })
    .catch(error => next(error));
};


// GET /users
exports.index = (req, res, next) => {

    models.user.count()
    .then(count => {

        // Pagination:

        const items_per_page = 10;

        // The page to show is given in the query
        const pageno = parseInt(req.query.pageno) || 1;

        // Create a String with the HTMl used to render the pagination buttons.
        // This String is added to a local variable of res, which is used into the application layout file.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        const findOptions = {
            offset: items_per_page * (pageno - 1),
            limit: items_per_page,
            order: [['points','DESC'],['username']]
        };

        return models.user.findAll(findOptions);
    })
    .then(users => {
        res.render('users/index', {users});
    })
    .catch(error => next(error));
};

// GET /users/:userId
exports.show = (req, res, next) => {

    const {user} = req;
    let following= false;
    user.getFollowers()
    .then(followers=>{
        user.getFollowers({where: {id: req.session.user.id}})
        .then(follower => {
            if (follower.length > 0) {
                following = true;
            }
            user.getFollowed()
            .then(followed=>{
                res.render('users/show', {user,followers,following,followed});
            })
        })
    })
    .catch(error=>next(error));
    

    
};


// GET /users/new
exports.new = (req, res, next) => {

    const user = {
        username: "",
        password: ""
    };

    res.render('users/new', {user});
};


// POST /users
exports.create = (req, res, next) => {

    const {username, password} = req.body;
    let points= 0;
    const user = models.user.build({
        username,
        password,
        points
    });

    // Create the token field:
    user.token = authentication.createToken();

    // Save into the data base
    user.save({fields: ["username", 'token', "password", "salt"]})
    .then(user => { // Render the users page
        req.flash('success', 'User created successfully.');
        if (req.session.user) {
            res.redirect('/users/' + user.id);
        } else {
            res.redirect('/session'); // Redirection to the login page
        }
    })
    .catch(Sequelize.UniqueConstraintError, error => {
        req.flash('error', `User "${username}" already exists.`);
        res.render('users/new', {user});
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('users/new', {user});
    })
    .catch(error => next(error));
};


// GET /users/:userId/edit
exports.edit = (req, res, next) => {

    const {user} = req;

    res.render('users/edit', {user});
};


// PUT /users/:userId
exports.update = (req, res, next) => {

    const {user, body} = req;

    // user.username  = body.user.username; // edition not allowed

    let fields_to_update = [];

    // ¿Cambio el password?
    if (req.body.password) {
        console.log('Updating password');
        user.password = body.password;
        fields_to_update.push('salt');
        fields_to_update.push('password');
    }

    user.save({fields: fields_to_update})
    .then(user => {
        req.flash('success', 'User updated successfully.');
        res.redirect('/users/' + user.id);
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('users/edit', {user});
    })
    .catch(error => next(error));
};


// DELETE /users/:userId
exports.destroy = (req, res, next) => {

    req.user.destroy()
    .then(() => {

        // Deleting logged user.
        if (req.session.user && req.session.user.id === req.user.id) {
            // Close the user session
            delete req.session.user;
        }

        req.flash('success', 'User deleted successfully.');
        res.redirect('/goback');
    })
    .catch(error => next(error));
};


//-----------------------------------------------------------


// PUT /users/:id/token
// Create a saves a new user access token.
exports.createToken = function (req, res, next) {

    req.user.token = authentication.createToken();

    req.user.save({fields: ["token"]})
    .then(function (user) {
        req.flash('success', 'User Access Token created successfully.');
        res.redirect('/users/' + user.id);
    })
    .catch(error => next(error));
};

//-----------------------------------------------------------
