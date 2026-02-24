const express = require('express');
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const morgan = require(`morgan`);
const path = require('path');
const multer = require(`multer`)

const User = require("../models/marketPlace/User");
const { rawListeners } = require('../models/marketPlace/User');
const { LocalStorage } = require('node-localstorage');
const Storage = new LocalStorage('../lib/storage');
const { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, version } = require(`./funcionesBack`)

router.get('/', async (req, res) => {
    const user = await User.findOne();

    res.render('login');
});

router.get('/marketp/signup', (req, res) => {
    res.render('inicio/signup');
});
router.post("/users/register", async (req, res) => {
    let errors = [];

    let { name, surname, username, email, grupoSegurdiad, password, password2 } = req.body;

    if (!name || !email || !username || !surname || !password || !password2) {
        errors.push({ message: "Complete todos los campos" });
    }

    if (password.length < 6) {
        errors.push({ text: "La contraseña debe ser al menos de 6 caracteres" });
    }

    if (password !== password2) {
        errors.push({ text: "Las contraseñas no coinciden" });
    }

    if (errors.length > 0) {
        res.render("register", { errors, name, surname, usernameUser: username, grupoSegurdiad, email, password, password2 });
    } else {

        const emailUser = await User.findOne({ email: email });
        const usernameUser = await User.findOne({ usernameUser: username });

        if (emailUser) {
            req.flash("error_msg", "El email ya existe");
            res.redirect("/users/signup");
        } else if (usernameUser) {
            req.flash("error_msg", "El usuario ya existe");
            res.redirect("/users/signup");
        } else {

            const newUser = new User({ name, surname, usrnameUser: username, grupoSegurdiad, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Estas Registrado');
            res.redirect('/users/signin');
        }
    }
});
router.post("/users/post", async (req, res) => {
    try {

        let enviar = req.body
        delete enviar._id

        const key = req.body[req.body.key] || ""
        const mostrar = req.body.mostrar || ""

        let newP = await makeObjects(Object.keys(enviar), enviar, req.user, "User", req.files || {})

        newP.password = await newP.encryptPassword(enviar.password);
        let newPost = await newP.save();
        res.json({
            mensaje: `El Usuario ${key} ${mostrar} fue creado con exito`,
            posteo: newPost
        });

    } catch (error) {

        console.log("Creacion Usuario")
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.put(`/blanquearContrasena`, async (req, res) => {
    try {

        let user = { password: req.body.password }
        let _id = req.body._id
        let uset = new User()
        user.password = await uset.encryptPassword(req.body.password);
        let contrasena = await User.findByIdAndUpdate(_id, user);

        res.json({
            mensaje: `La contrasena fue blanqueada con exito`,
            blaqueado: contrasena,//este es actualizado Anterior
            _id
        });

    } catch (error) {
        console.log("Blanqueo Contrasena")
        console.log(req.query)
        console.log(error)
        res.json(error);
    }

})
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.redirect('/');
        });
    });
});
router.delete('/imagen', async (req, res) => {


    unlink(path.resolve(`./src/front` + req.body.adjunto))
})


module.exports = router;