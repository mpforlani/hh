let baseDeDatos = require(`./baseDeDatos`)
let baseDeDatosApp = require(`../../controladores/baseDeDatosApp`)

const capitalize = function (word) {
    return word[0].toUpperCase() + word.slice(1);
}
const construirHistoria = (newUpdate) => {

    return {
        descripción: newUpdate.descripcionEnvio,
        fecha: newUpdate.date || new Date(Date.now()),
        user: newUpdate.username,
        modificaciones: JSON.parse(newUpdate.modificaciones)
    }
}

const version = {
    no: (newUpdate) => { },
    si: construirHistoria
}
const makeObjects = (keys, body, user, baseDat, files) => {

    delete keys._id;
    let pathAdjunto = []
    let originalNameAdjunto = []
    let pathAdjuntoColec = []
    let originalNameAdjuntoColec = []

    let dataBase = baseDeDatos[baseDat] || baseDeDatosApp[baseDat]

    let newPost = new dataBase({ ...body })

    newPost.version = 0
    newPost.username = user._id

    for (let x = 0; x < files?.adjunto?.length; x++) {

        pathAdjunto.push('/uploads/' + files.adjunto[x].filename)
        originalNameAdjunto.push(files.adjunto[x].originalname)
        newPost["path"] = pathAdjunto
        newPost["originalname"] = originalNameAdjunto
    }


    for (let x = 0; x < files?.adjuntoColec?.length; x++) {

        pathAdjuntoColec.push('/uploads/' + files.adjuntoColec[x].filename)
        originalNameAdjuntoColec.push(files.adjuntoColec[x].originalname)

        newPost["pathColec"] = pathAdjuntoColec
        newPost["originalnameColec"] = originalNameAdjuntoColec
    }

    newPost.historia = [
        {
            descripción: "Creación",
            fecha: newPost.date,
            user: newPost.username
        }
    ]

    return newPost
}
const updateObjects = (body, user, files) => {

    body.username = user._id

    for (let x = 0; x < files?.adjunto?.length; x++) {

        body.path = body.path || []
        body.originalname = body.originalname || []
        body.path[Math.max(0, body.path.length - x - 1)] = '/uploads/' + files.adjunto[x].filename
        body.originalname[Math.max(0, body.originalname.length - x - 1)] = files.adjunto[x].originalname
    }

    for (let x = 0; x < files?.adjuntoColec?.length; x++) {

        body.pathColec = body.path || []
        body.originalnameColec = body.originalname || []
        body.path[Math.max(0, body.path.length - x - 1)] = '/uploads/' + files.adjunto[x].filename
        body.originalname[Math.max(0, body.originalname.length - x - 1)] = files.adjunto[x].originalname
    }

    for (let x = 0; x < Object.values(body.referencias || []).length; x++) {

        let indice = Object.keys(body.referencias)[x]
        let valores = Object.values(body.referencias)[x]

        for (let y = 0; y < Object.values(valores).length; y++) {

            body[`referencias.${indice}.${Object.keys(valores)[y]}`] = Object.values(valores)[y]
        }
    }
    delete body.referencias
    delete body.modificaciones

    return body
}

const sortObject = (sort) => {

    let sortObjeto = new Object

    if (sort != undefined) {

        let sortSplit = sort.split(`:`)

        sortObjeto[sortSplit[0]] = sortSplit[1]
    } else {
        sortObjeto = undefined

    }

    return sortObjeto
}
const plancharObjeto = (coleccion, key) => {//Lo que hace esta funcion es si el unWind del elemento,pone todos los valores de la coleccion
    //para ese unwind, es decir, si tengo itemVenta: [Flete, Seguro], valor [100,200] el comportamiento natural de un wind es:
    //itemVenta: Flete, valor [100, 200], con esta funcion logro: Flete, valor [100]

    let index = coleccion?.indexOf(key)
    delete coleccion[index]

    let objeto = new Object

    for (let x = 0; x < coleccion.length; x++) {

        objeto[coleccion[x]] = { $arrayElemAt: [`$${coleccion[x]}`, `$_idColeccionUnWind`] }
    }

    return objeto
}

module.exports = { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, version }