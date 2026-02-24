let baseDeDatosApp = require(`../../controladores/baseDeDatosApp`)

const baseDeDat = {
    //Logistica
    CotizacionesLogistica: require("../models/home/logistica/Cotizaciones"),
    OperacionesLogistica: require("../models/home/logistica/Operaciones"),
    CertificadosLogistica: require("../models/home/logistica/CertificadosLogistica"),
    GastoDestino: require("../models/marketPlace/logistica/GastosDestino"),
    Transbordo: require("../models/marketPlace/direcciones/Ciudad"),
    DestinoSbc: require("../models/marketPlace/direcciones/Ciudad"),
    UnidadesMedida: require("../models/marketPlace/logistica/UnidadesMedidas"),
    TipoOperacion: require("../models/marketPlace/logistica/TipoOperacion"),
    TipoTransporte: require("../models/marketPlace/logistica/TipoTransporte"),
    TipoCarga: require("../models/marketPlace/logistica/TipoCarga"),
    TipoContenedor: require("../models/marketPlace/logistica/TipoContenedor"),
    TamanoContenedor: require("../models/marketPlace/logistica/TamanoContenedor"),
    //CRM 
    Error: require("../models/home/crm/Error"),
    Requerimiento: require("../models/home/crm/Requerimiento"),
    Tarea: require("../models/marketPlace/procesos/Tarea"),
    EstadoProceso: require("../models/marketPlace/procesos/EstadoProceso"),
    Criticidad: require("../models/marketPlace/procesos/Criticidad"),
    //Tesoreria
    PagosRealizados: require("../models/home/tesoreria/PagosRealizados"),
    AnticipoFinanciero: require("../models/home/tesoreria/AnticipoFinanciero"),
    PagosRealizadosRubroColeccion: require("../models/home/tesoreria/PagosRealizadosRubroColeccion"),
    Transferencia: require("../models/home/operacionFinanciera/Transferencia"),
    PrestamosEmpresas: require("../models/home/tesoreria/PrestamosEmpresas"),
    LiquidacionMoneda: require("../models/home/tesoreria/LiquidacionMoneda"),
    ChequesTercero: require("../models/home/tesoreria/ChequesTercero"),
    DepositoCheques: require("../models/home/tesoreria/DepositoCheques"),
    SaldosBancos: require("../models/home/tesoreria/SaldosBancos"),
    SaldosCajas: require("../models/home/tesoreria/SaldosCajas"),
    //Cobros
    FacturasEmitidas: require("../models/home/cobranzas/FacturasEmitidas"),
    CobrosRecibidos: require("../models/home/cobranzas/CobrosRecibidos"),
    CobrosRecibidosRubroColeccion: require("../models/home/cobranzas/CobrosRecibidosRubroColeccion"),
    //Pagos
    Proveedor: require("../models/marketPlace/terceros/Proveedor"),
    RubroPagos: require("../models/marketPlace/pagos/RubrosPagos"),
    SubRubroPagos: require("../models/marketPlace/pagos/SubRubroPagos"),
    AgrupadorRubrosPago: require("../models/marketPlace/pagos/AgrupadorRubroPagos"),
    //Indices
    TipoCambio: require("../models/home/indices/TipoDeCambio"),
    //usuarios
    User: require("../models/marketPlace/User"),
    GrupoSeguridad: require("../models/marketPlace/seguridad/Grupo"),
    SeguridadAtributo: require("../models/marketPlace/seguridad/SeguridadAtributo"),
    //Empresa
    Empresa: require("../models/marketPlace/Empresa"),
    EmpresaDos: require("../models/marketPlace/Empresa"),
    //Terceros
    Cliente: require("../models/marketPlace/terceros/Cliente"),
    Despachante: require("../models/marketPlace/terceros/Despachante"),
    ItemVenta: require("../models/marketPlace/terceros/ItemVentas"),
    RubroVentas: require("../models/marketPlace/terceros/RubroVentas"),
    //Financieros
    CondicionImpositiva: require("../models/marketPlace/financiero/CondicionImpositiva"),
    Moneda: require("../models/marketPlace/financiero/Moneda"),
    MonedaComp: require("../models/marketPlace/financiero/Moneda"),
    MonedaColec: require("../models/marketPlace/financiero/Moneda"),
    MonedaTipoPago: require("../models/marketPlace/financiero/Moneda"),
    ImpuestoDefinicion: require("../models/marketPlace/financiero/ImpuestoDefinicion"),
    AgrupadorImpuesto: require("../models/marketPlace/financiero/AgrupadorImpuesto"),
    TipoPago: require("../models/marketPlace/financiero/TipoPagos"),
    TipoPagoDestino: require("../models/marketPlace/financiero/TipoPagos"),
    TipoPagoColeccion: require("../models/marketPlace/financiero/TipoPagos"),
    TipoComprobante: require("../models/marketPlace/financiero/TipoComprobante"),
    CuentasBancarias: require("../models/marketPlace/financiero/CuentaBancaria"),
    Bancos: require("../models//marketPlace/financiero/Bancos"),
    BancoDestino: require("../models//marketPlace/financiero/Bancos"),
    ItemsBancos: require("../models/marketPlace/financiero/ItemsBancos"),
    ItemsCajas: require("../models/marketPlace/financiero/ItemsCajas"),
    TipoItems: require("../models/marketPlace/financiero/TipoItems"),
    Cajas: require("../models/marketPlace/financiero/Cajas"),
    //Direcciones
    Pais: require("../models/marketPlace/direcciones/Pais"),
    Provincia: require("../models/marketPlace/direcciones/Provincia"),
    Ciudad: require("../models/marketPlace/direcciones/Ciudad"),

    //Numerador
    Numerador: require('../models/Numerador'),
    //Acumulador
    Acumulador: require('../models/Acumulador'),
    Testing: require('../models/Testing'),
}


const baseDeDatos = Object.assign(baseDeDat, baseDeDatosApp)
module.exports = baseDeDatos
