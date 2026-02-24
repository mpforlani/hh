const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = `src/front/uploads/`
//Direcciones
const { errorMonitor } = require('connect-mongo');
const Acumulador = require(`../models/Acumulador`)
const { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, version } = require(`./funcionesBack`)

let baseDeDatos = require(`./baseDeDatos`);

const { updateMany } = require('../models/Testing');

router.get('/marketp', (req, res) => {
    res.render('inicio/market');
});
router.post('/postDoble', async (req, res) => {
    try {
        delete req.body._id

        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let keys = Object.keys(req.body);

        let enviar = { ...req.body }

        let newPost = new dataBase(enviar)

        for (let x = 0; x < keys.length; x++) {

            let nameSplit = keys[x].split(" ");

            if (nameSplit.length > 1) {

                newPost[nameSplit[0]] = newPost[nameSplit[0]] || new Object
                newPost[nameSplit[0]][nameSplit[1]] = req.body[keys[x]]

            } else {

                newPost[keys[x]] = req.body[keys[x]]
            }
        }
        newPost.username = req.user._id;
        newPost.habilitado = true;

        let newDateDoble = await newPost.save();

        res.json({
            mensaje: `El grupo de seguridad fue registrado con exito`,
            posteo: newDateDoble
        });

    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
})
router.put('/putDoble', async (req, res) => {
    try {
        let { _id } = req.body

        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let keys = Object.keys(req.body);

        let grupoDeSeguridad = new Object

        for (let x = 0; x < keys.length; x++) {

            let nameSplit = keys[x].split(" ");

            if (nameSplit.length > 1) {

                grupoDeSeguridad[nameSplit[0]] = grupoDeSeguridad[nameSplit[0]] || new Object
                grupoDeSeguridad[nameSplit[0]][nameSplit[1]] = req.body[keys[x]]

            } else {

                grupoDeSeguridad[keys[x]] = req.body[keys[x]]
            }
        }
        grupoDeSeguridad.username = req.user._id

        let groupAct = await dataBase.findByIdAndUpdate(_id,
            { $set: grupoDeSeguridad });


        res.json({
            mensaje: `El grupo de seguridad fue actualizado con exito`,
            posteo: groupAct
        });

    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
})
router.get('/get', async (req, res) => {
    try {

        let filtro = JSON.parse(req.query.filtros || `{}`)

        let sortt = sortObject(req.query.sort)

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let data = await dataBase.find(filtro).limit(parseFloat(req.query.limite) || "").sort(sortt)

        res.json(data);
    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.get('/getUnWind', async (req, res) => {
    try {

        let coleccionPlanchar = JSON.parse(req?.query?.componentes || "[]")

        let con = req.query.key

        let objetoAdd = plancharObjeto(coleccionPlanchar, con)

        let filtro = JSON.parse(req.query.filtros || `{}`)

        delete filtro.componentes
        delete filtro.unwind

        let sortt = sortObject(req.query.sort)
        let dataBase = baseDeDatos[capitalize(req.query.base)]

        let fechaObj = new Object

        if (filtro?.fecha?.desde != undefined) {
            fechaObj = {
                fecha: {
                    $gte: new Date(filtro?.fecha?.desde),
                    $lte: new Date(filtro?.fecha?.hasta),
                }
            }
            delete filtro.fecha
        } else if (filtro?.fecha != undefined) {
            fechaObj = {
                fecha: {
                    $gte: new Date(filtro?.fecha?.$gte),
                    $lte: new Date(filtro?.fecha?.$lte),
                }
            }
            delete filtro.fecha
        }
        let dataUnWind = await dataBase.aggregate([

            { $unwind: { path: `$${con}`, includeArrayIndex: `_idColeccionUnWind` } },
            {
                $addFields:
                    objetoAdd
            },
            {
                $addFields: {
                    [con]: [`$${con}`],
                }
            },
            {
                $match: {
                    ...fechaObj,
                    ...filtro
                }
            },
            {
                $sort: sortt || { _id: 1 }
            },
        ])

        res.json(dataUnWind);

    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.get('/getUnWindGroup', async (req, res) => {
    try {

        let coleccionPlanchar = JSON.parse(req.query.componentes)
        let con = req.query.key

        let objetoAdd = plancharObjeto(coleccionPlanchar, con)

        let filtro = JSON.parse(req.query.filtros || `{}`)

        delete filtro.componentes
        delete filtro.unwind

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let objetoGroup = JSON.parse(req.query.objetoGroup)

        let fechaObj = {
            fecha: {
                $gte: new Date(filtro?.fecha?.desde),
                $lte: new Date(filtro?.fecha?.hasta),
            }
        }

        delete filtro.fecha

        let dataUnWind = await dataBase.aggregate([
            { $unwind: { path: `$${con}`, includeArrayIndex: `_idColeccionUnWind` } },
            {
                $addFields:
                    objetoAdd
            },
            {
                $match: fechaObj
            },
            {

                ...objetoGroup

            },

        ])

        res.json(dataUnWind);

    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.get('/getLast', async (req, res) => {//Este lo utilizo para obtener el último de cada tipo según atributo, ejemplo en tipo de cambio cuando quiero saber el actual
    try {

        let dataBase = baseDeDatos[capitalize(req.query.base)]

        let idRegistro = req.query.identificador

        let dataLast = await dataBase.aggregate([
            //Ordenar los documentos por nombre y por fecha en orden descendente
            { $sort: { [req.query.group]: 1, [req.query.ord]: -1 } },
            //Agrupar por el campo "name" y tomar el primer documento de cada grupo (ya que están ordenados en orden descendente por fecha)
            {
                $group: {
                    _id: `$${idRegistro}`,
                    registro: { $first: "$$ROOT" },
                }
            },

        ]);

        res.json(dataLast)

    } catch (error) {
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.post('/post', async (req, res) => {
    try {
        let enviar = req.body

        delete enviar._id

        let key = req.body[req.body.key] || ""
        let mostrar = req.body.mostrar || ""

        let newP = await makeObjects(Object.keys(enviar), enviar, req.user, capitalize(req.query.base), req.files || {})

        let newPost = await newP.save();

        res.json({
            mensaje: `El item ${key} ${mostrar} fue creado con exito`,
            posteo: newPost
        });

    } catch (error) {
        console.log(req.query.base)
        console.log(error)
        res.json(error);
    }
});
router.put('/put', async (req, res) => {
    try {
        let { _id } = req.body

        let unsetear = JSON.parse(req?.body?.unset || "{}")
        let enviar = { ...req.body }
        delete enviar.unset

        let mostrar = req.body.mostrar || ""

        req.body.username = req.user._id
        delete enviar._id

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let update = updateObjects(enviar, req.user, req.files)

        let elementoPush = version[req.query.vers || "si"](req.body)

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $inc: { "version": 1 },
            $push: { "historia": elementoPush },
            $set: update,
            $unset: unsetear,

        });

        let posteAct = { ...update }

        posteAct.historia = updt.historia
        posteAct.historia.push(elementoPush)

        let key = updt[req.body.key] || ""
        res.json({
            mensaje: `El item ${key} ${mostrar} fue actualizado con exito`,
            posteo: posteAct,//aca va todo lo que postie efectivamente
            actualizado: updt,//este es actualizado Anterior
            postActual: Object.assign(updt || {}, posteAct || {}),
            _id
        });


    } catch (error) {
        console.log(req.query.base)
        console.log(error)
        res.json(error);
    }
});
router.put('/putValoresArray', async (req, res) => {
    try {
        let { _id } = req.body
        let enviar = req.body

        delete enviar._id
        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let objetoData = new Object

        for (let y = 0; y < Object.values(enviar.array || []).length; y++) {

            for (let x = 0; x < Object.values(enviar.atributosArray || []).length; x++) {

                objetoData[Object.keys(enviar.atributosArray)[x] + "." + enviar.array[y]] = Object.values(enviar.atributosArray)?.[x]?.[y] || Object.values(enviar.atributosArray)?.[x]?.[0]// Esto es porque muchas veces se pasan un valor para todos los array ejemplo en lo que es aprobación y rechazo desde aprobar
            }
        }
        for (let a = 0; a < Object.values(enviar.arrays || []).length; a++) {
            for (let y = 0; y < Object.values(enviar.arrays[a].arrayCompuesto || []).length; y++) {//Este solo lo uso para guardar lo acumulado en el origen, cuando envio un formulario
                for (let x = 0; x < Object.values(enviar.arrays[a].atributosArrayCompuesto).length; x++) {

                    objetoData[Object.keys(enviar.arrays[a].atributosArrayCompuesto)[x] + "." + enviar.arrays[a].arrayCompuesto[y]] = Object.values(enviar.arrays[a].atributosArrayCompuesto)[x][0]
                }
            }
        }

        for (let x = 0; x < Object.values(enviar.atributosCabecera || []).length; x++) {

            objetoData[Object.keys(enviar.atributosCabecera)[x]] = Object.values(enviar.atributosCabecera)[x]
        }

        for (let x = 0; x < Object.values(enviar.referencias || []).length; x++) {

            let indice = Object.keys(enviar.referencias)[x]
            let valores = Object.values(enviar.referencias)[x]

            for (let y = 0; y < Object.values(valores).length; y++) {

                objetoData[`referencias.${indice}.${Object.keys(valores)[y]}`] = Object.values(valores)[y]
            }
        }

        let updt = await dataBase.findByIdAndUpdate(_id, {

            $set: objetoData,
        });

        res.json({
            mensaje: `El item fue actualizado con exito`,
            posteo: objetoData,
            actualizado: updt,
            _id
        });


    } catch (error) {
        console.error(error);
        res.json(error);
    }
})///
router.put('/putDeleteOrigen', async (req, res) => {
    try {
        let { _id } = req.body
        let objetoData = JSON.parse(req.body.modificaciones)

        let idColec = objetoData?.atributoEnColec.idColec
        let valorAnterior = objetoData?.atributoEnColec.valorAnterior

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let elementoPush = version[req.query.vers || "si"](req.body)
        let datosColec = new Object

        let registroEliminar = new Object
        registroEliminar[`referencias.${req.body.type}.${req.body.entidad}${req.body.idEliminar}`] = 1

        for (let x = 0; x < idColec?.length; x++) {
            datosColec[`${req.body?.atributoColec}.${idColec?.[x]}`] = valorAnterior?.[x]

        }

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $inc: { "version": 1 },
            $push: { "historia": elementoPush },
            $unset: registroEliminar,
            $set: datosColec
        });

        res.json({
            mensaje: `El item fue actualizado con exito`,
            actualizado: updt,//este es actualizado Anterior
            _id
        });


    } catch (error) {
        console.log(req.query.base)
        console.log(error)
        res.json(error);
    }
});
router.delete('/deshabilitar', async (req, res) => {

    let { id, habilitado } = req.body;

    const newPaisHab = ({
        habilitado
    });

    let desh = await baseDeDatos[capitalize(req.query.base)].findByIdAndUpdate(id, newPaisHab);

    res.json({ desh });
})
router.delete('/delete', async (req, res) => {
    try {
        let { _id } = req.body;

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let deleteRegistro = await dataBase.findByIdAndDelete(_id);

        let archivoAdjunto = deleteRegistro.filename

        for (let x = 0; x < archivoAdjunto?.length; x++) {

            let archivo = `${path}${archivoAdjunto[x]} `

            fs.unlink(archivo, (err) => {
                if (err) {
                    console.error(`Error al eliminar el archivo: ${err} `);
                }
            });
        }

        res.json({
            deleteRegistro
        });
    } catch (error) {
        console.error(error);
        res.json(error);
    }
});
router.get('/acumulador', async (req, res) => {

    let id = new Object

    for (let x = 0; x < Object.values(req.query).length; x++) {

        id[Object.keys(req.query)[x]] = `$${Object.values(req.query)[x]} `
    }

    let anoFiltro = req.query.anoFiltro
    let mesFiltro = req.query.mesFiltro

    delete id.mesFiltro
    delete id.anoFiltro

    const saldoTotal = await Acumulador.aggregate([
        {
            $match: {
                name: req.query.name,
                $or: [
                    { ano: { $lt: parseFloat(anoFiltro) } },
                    {
                        $and: [{
                            ano: { $eq: parseFloat(anoFiltro) }
                        }, {
                            mes: { $lt: parseFloat(mesFiltro) }
                        }]
                    }
                ]
            }
        },
        {
            $group: {
                _id: id,
                nombre: { $first: "$nombre" },
                mes: { $first: "$mes" },
                ano: { $first: "$ano" },
                moneda: { $first: "$moneda" },
                importe: { $sum: `$importe` },
                importeArs: { $sum: `$importeArs` },
                importeUsd: { $sum: `$importeUsd` },

            }

        }])

    res.json(saldoTotal);
})
router.put('/putAcumulador', async (req, res) => {
    try {

        let enviar = req.body;
        delete enviar._id;

        // Encuentra y actualiza el documento usando el modelo "Usuario"
        let update = {
            $inc: enviar.atributosNoRequeridos, // Incrementa el saldo en 800 si el registro existe
            $setOnInsert: enviar.agrupadores, // Establece los atributos y el saldo si el registro no existe
            $set: {
                username: req.user._id,
                date: enviar.date,
            },
        };
        let options = { upsert: true }; // Opción "upsert" establecida en true para crear el registro si no existe
        let filter = enviar.agrupadores; // Filtro de búsqueda por los atributos nombre, mes y ano

        let updt = await Acumulador.updateOne(filter, update, options);

        res.json({
            mensaje: `El item fue actualizado con éxito`,
            posteo: enviar,
            actualizado: updt,

        });
    } catch (error) {
        console.log("Acumulador")
        console.error(error);
        res.json(error);
    }
});
////Reportes
router.put('/putReporte', async (req, res) => {
    try {
        let { _id } = req.body
        let enviar = { ...req.body }

        delete enviar._id

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let update = updateObjects(enviar.info, req.user, req.files)

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $set: {
                [`infoReportes.${req.query.reporte}`]: enviar.reporte,
                ...enviar.unwindo,
                ...update
            }
        });

        let posteAct = { ...update }

        let key = updt[req.body.key] || ""
        res.json({
            mensaje: `El reporte fue actualizado con exito`,
            posteo: posteAct,//aca va todo lo que postie efectivamente
            actualizado: updt,//este es actualizado Anterior

            _id
        });
    } catch (error) {
        console.log(req.query.base)
        console.log(error)
        res.json(error);
    }
});
module.exports = router;