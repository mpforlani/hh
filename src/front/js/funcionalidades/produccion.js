let variablesInicialesProduccion = {

    productosCompuestosHelados: {
        atributos: {
            names: [
                NS("numerador"),

                TF("descripcionCompleto"),
                adjunto,
            ],
            titulos: [`Numero`, "Obrservaciones", `Adjunto`],
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,

        },
        formInd: {
            inputRenglones: [6, `compuesto`, 3, 6],

        },

        key: "numerador",
        pest: `Productos Compuestos`,
        pestIndividual: `Ingresar PC`,
        accion: `productosCompuestosHelados`,
        empresa: true,
        multimoneda: true,
        type: "transaccion",
    },
}