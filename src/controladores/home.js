const express = require('express');
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const morgan = require(`morgan`);
const path = require('path');
const multer = require(`multer`)
const { unlink } = require(`fs-extra`)

const User = require("../models/marketPlace/User");
const Session = require("../models/marketPlace/Session");

const Moneda = require("../models/marketPlace/financiero/Moneda");
//Clientes mainTree
const sessionValidador = require('../middleware/sessionValidador');


router.post("/users/login", passport.authenticate("local", {

    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true
}));

router.get('/home', sessionValidador, async (req, res) => {
    const userId = req.user._id;
    const regex = new RegExp(userId + "", 'i')
    await Session.find({ "session": { $regex: regex }, '_id': { $ne: req.sessionID } }).deleteMany().exec();

    res.cookie("myCookieName", req.user.name, {
        //  maxAge: 1000 * 60 * 7,//es en segundos
        //expires: new Date("2022-12-31"),
        httpOnly: true, //por defecti viene siempre en false, sirve para si pongo no puede ser accedida a travez del navegador pero si de peticiones
        secure: true, // solo se puede acceder cuando alguien visite de https
        sameSite: "strict",
    })

    res.render('homeLog',
        { userNombre: req.user.name, username: req.user.usernameUser, userPermisos: req.user.grupoSeguridad });

});
//Operaciones financieras
/*router.get('/proyeccionesCashFlow', async (req, res) => {

    let unidFidei = /./;

    if (req.query.filtro != "undefined") {

        unidFidei = req.query.filtro
    }

    if ((req.query.filtro == "Todos") || (req.query.filtro == "todos") || (req.query.filtro == "")) {

        unidFidei = /./;
    }

    const pcf = await ProyectadoCashDoble.aggregate([{

        $lookup: {
            from: "unidades",
            localField: "unidades",
            foreignField: "_id",
            as: "unidadesMv"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "username",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $match: {
            "unidadesMv.name": unidFidei,

        }
    },
    {
        $project: {
            id: 1,
            tabla: 1,
            unidades: "$unidadesMv.name",
            date: 1,
            username: "$user.username",

        }
    }
    ]);

    res.json(pcf);

});
router.post('/proyeccionesCashFlowDoble', async (req, res) => {

    let { unidades, username } = req.body

    let shcemaProyec = ["date", "username", "unidades", "id"]

    let keys = Object.keys(req.body);

    let newProyeccionesFlex = new ProyectadoCashDoble({});

    const usersFound = await User.find({ username: { $in: username } });
    const unidadesFound = await Unidades.find({ name: { $in: unidades } });
    newProyeccionesFlex.tabla = new Object


    for (let x = 0; x < Object.keys(req.body).length; x++) {

        if (shcemaProyec.includes(keys[x])) {

            newProyeccionesFlex[keys[x]] = req.body[keys[x]]
        } else {
            newProyeccionesFlex.tabla[keys[x]] = req.body[keys[x]]

        }
    }

    newProyeccionesFlex.username = usersFound.map((user) => user._id)
    newProyeccionesFlex.unidades = unidadesFound.map((unidad) => unidad._id)

    let proyectado = await newProyeccionesFlex.save();

});
router.put('/proyeccionesCashFlowDoble', async (req, res) => {

    let { tabla, date, unidades, username, id } = req.body

    let shcemaProyec = ["date", "username", "unidades", "id"]

    let keys = Object.keys(req.body);

    let newProyCashFlex = new Object;
    let tablaMof = new Object

    const usersFound = await User.find({ username: { $in: username } });
    const unidadesFound = await Unidades.find({ name: { $in: unidades } });

    for (let x = 0; x < Object.keys(req.body).length; x++) {

        if (shcemaProyec.includes(keys[x])) {

            newProyCashFlex[keys[x]] = req.body[keys[x]]
        } else {

            let proyectadoColec = await ProyectadoCashDoble.updateOne({ _id: id }, {
                $set: { ["tabla." + keys[x]]: req.body[keys[x]] }
            })

        }
    }
    newProyCashFlex.username = usersFound.map((user) => user._id)
    newProyCashFlex.unidades = unidadesFound.map((unidad) => unidad._id)

    let proyectadoc = await ProyectadoCashDoble.findOneAndUpdate({
        id,
    },
        newProyCashFlex);

    res.json({
        mensaje: `La proyeccion fue actualizada con exito`,
        posteo: proyectadoc
    });
});*/
router.get('/tipoCambioInHoy', async (req, res) => {

    let fechaHasta = req.query.fechaHasta

    var tipoCambioHoy = await TipoCambioIn.find({ fecha: { $lte: fechaHasta } }, { fecha: 1, tipoCambio: 1, tipoCambioAlternativo: 1, _id: 0 }).sort({ fecha: -1 }).limit(1);

    res.json(tipoCambioHoy);

});


module.exports = router;