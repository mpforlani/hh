const funcionesInicioPage = () => {//Ojo si borro esta función cada vez que cierro una pestana va tirar error

}
funcionesInicioPage()
tipoDeCambioDefault = ""//ESto es utiliza para que en el file MonedasTotales.js en la funcion totalesBaseYMoneda, donde se d


let tareasProgramadasLocal = {}

let modulosLocales = {

    configInvent: { ...modulosTotales.configInvent },
    empresa: { ...modulosTotales.empresa },
    numeradores: { ...modulosTotales.numeradores },
    testing: { ...modulosTotales.testing },
    tareasProgramadas: { ...modulosTotales.tareasProgramadas },
    emails: { ...modulosTotales.emails },
    acumuladores: { ...modulosTotales.acumuladores }
}
console.log(modulosLocales)