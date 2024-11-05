// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = '../data/tarifasCombustible.json';
let gastosJSONpath = '../data/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    gastosJSON.forEach(viaje => {
        const fecha = new Date(viaje.date);
        const anio = fecha.getFullYear();
        const precioViaje = viaje.precioViaje

        aniosArray[anio] += precioViaje;
        document.getElementById('gasto' + anio).innerText = Math.round(aniosArray[anio]*100)/100;
    });

}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    
    const anioViaje = fecha.getFullYear();

    for(const tarifa of tarifasJSON.tarifas) {
        if (tarifa.anio === anioViaje) {
            let precioKM = tarifa.vehiculos[tipoVehiculo.toLowerCase()];
            let precioViaje = precioKM * kilometros;

            const nuevoViaje = new gastosCombustible(tipoVehiculo, fecha, kilometros, precioViaje);
            document.getElementById('expense-list').innerText += nuevoViaje.convertToJSON();
    
            let gastoActual = parseFloat(document.getElementById('gasto' + anioViaje).innerText);
            let gastoTotal = Math.round((gastoActual + precioViaje)*100) / 100;
            document.getElementById('gasto' + anioViaje).innerText = gastoTotal;
            document.getElementById("fuel-form").reset();
        }

        
    }

}

