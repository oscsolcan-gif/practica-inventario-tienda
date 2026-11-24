// ============================================================ //
// PRÁCTICA 1.3.10 - GESTIÓN DE UNA TIENDA DE PRODUCTOS         //
// Enunciado: 1.3.10-practica-inventario-tienda.md              //
// Los resultados salen por la consola del navegador (F12).     //
//                                                              //
// El enunciado pide 5 funciones:                               //
//   1. Mostrar todos los productos disponibles                 //
//   2. Añadir un producto nuevo al inventario                  //
//   3. Actualizar la cantidad de un producto existente         //
//   4. Calcular el total de ventas de una compra               //
//   5. Eliminar los productos agotados                         //
// ============================================================ //

// Inventario de partida (el del enunciado).
// Cada producto es un objeto con nombre, cantidad en stock y precio por unidad.
let inventario = [
    { nombre: "Manzana", cantidad: 50, precio: 0.5 },
    { nombre: "Plátano", cantidad: 30, precio: 0.3 },
    { nombre: "Naranja", cantidad: 20, precio: 0.7 },
];


// =========== función 0 (auxiliar): buscar un producto por nombre ================== //

/**
 * Busca un producto del inventario por su nombre, sin distinguir
 * mayúsculas de minúsculas ("manzana" encuentra "Manzana").
 * Las otras funciones la usan para no repetir el mismo find().
 * @param {string} nombre - Nombre del producto que buscamos.
 * @returns {{nombre: string, cantidad: number, precio: number}|undefined}
 *          El producto, o undefined si no está en el inventario.
 */
function buscarProducto(nombre) {

    return inventario.find(function (producto) {
        return producto.nombre.toLowerCase() === nombre.toLowerCase();
    });
}


// =========== función 1: mostrar productos disponibles ================== //

/**
 * Muestra en la consola los productos disponibles, uno por línea.
 * "Disponible" = que quede stock (cantidad mayor que 0). Los agotados
 * no se muestran, aunque sigan en el inventario hasta que se eliminen.
 * @returns {void}
 */
function mostrarProductos() {

    console.log("--- Productos disponibles ---");
    let hayAlguno = false;

    for (let producto of inventario) {
        if (producto.cantidad > 0) {
            console.log(`${producto.nombre}: ${producto.cantidad} unidades a ${producto.precio} euros`);
            hayAlguno = true;
        }
    }

    if (!hayAlguno) {
        console.log("No hay productos disponibles.");
    }
}


// =========== función 2: añadir un producto nuevo ================== //

/**
 * Añade un producto nuevo al final del inventario.
 * No lo añade si el nombre está vacío, si ya existe (para eso está
 * actualizarCantidad) o si la cantidad o el precio no son válidos.
 * @param {string} nombre - Nombre del producto.
 * @param {number} cantidad - Unidades en stock (0 o más).
 * @param {number} precio - Precio por unidad (mayor que 0).
 * @returns {string} Mensaje con lo que ha pasado.
 */
function anadirProducto(nombre, cantidad, precio) {

    if (typeof nombre !== "string" || nombre === "") {
        return "No se añade: falta el nombre del producto.";
    }
    if (buscarProducto(nombre)) {
        return `No se añade: ${nombre} ya está en el inventario (usa actualizarCantidad).`;
    }
    if (typeof cantidad !== "number" || isNaN(cantidad) || cantidad < 0 || cantidad % 1 !== 0) {
        return "No se añade: la cantidad tiene que ser un número entero de 0 o más.";
    }
    if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
        return "No se añade: el precio tiene que ser un número mayor que 0.";
    }

    inventario.push({ nombre: nombre, cantidad: cantidad, precio: precio });
    return `${nombre} añadido al inventario.`;
}


// =========== función 3: actualizar la cantidad ================== //

/**
 * Cambia la cantidad en stock de un producto que ya existe.
 * La cantidad nueva REEMPLAZA a la anterior (no se suma).
 * @param {string} nombre - Nombre del producto.
 * @param {number} nuevaCantidad - Unidades que quedan ahora (0 o más).
 * @returns {string} Mensaje con lo que ha pasado.
 */
function actualizarCantidad(nombre, nuevaCantidad) {

    let producto = buscarProducto(nombre);

    if (!producto) {
        return `No se actualiza: ${nombre} no está en el inventario.`;
    }
    if (typeof nuevaCantidad !== "number" || isNaN(nuevaCantidad) || nuevaCantidad < 0 || nuevaCantidad % 1 !== 0) {
        return "No se actualiza: la cantidad tiene que ser un número entero de 0 o más.";
    }

    producto.cantidad = nuevaCantidad;
    return `${producto.nombre}: ahora hay ${nuevaCantidad} unidades.`;
}


// =========== función 4: total de una compra ================== //

// {A_CONFIRMAR}: el enunciado dice "calcular el total de ventas si un cliente
// compra múltiples productos" pero no dice cómo se le pasa la compra a la función
// ni si hay que descontar el stock. Decisión tomada aquí:
//   - la compra es un array de objetos { nombre, cantidad }
//   - solo se calcula el total, NO se toca el stock
//   - los productos que no existen o que no tienen stock suficiente se avisan
//     por consola y no se cuentan

/**
 * Calcula cuánto tiene que pagar un cliente por una compra de varios productos.
 * Para cada línea: precio del inventario x cantidad comprada.
 * @param {{nombre: string, cantidad: number}[]} compra - Lo que quiere comprar el cliente.
 * @returns {number} Total en euros, redondeado a 2 decimales (0 si no se puede vender nada).
 */
function calcularTotalVentas(compra) {

    let total = 0;

    for (let linea of compra) {
        let producto = buscarProducto(linea.nombre);

        if (!producto) {
            console.log(`Aviso: ${linea.nombre} no está en el inventario, no se cuenta.`);
        } else if (linea.cantidad <= 0 || linea.cantidad % 1 !== 0 || isNaN(linea.cantidad)) {
            console.log(`Aviso: cantidad no válida para ${linea.nombre}, no se cuenta.`);
        } else if (linea.cantidad > producto.cantidad) {
            console.log(`Aviso: de ${producto.nombre} solo quedan ${producto.cantidad}, no se cuenta.`);
        } else {
            total = total + producto.precio * linea.cantidad;
        }
    }

    // Los decimales de JavaScript pueden salir con muchos ceros (0.1 + 0.2),
    // así que redondeamos a céntimos.
    return Math.round(total * 100) / 100;
}


// =========== función 5: eliminar agotados ================== //

/**
 * Quita del inventario los productos agotados (cantidad 0).
 * Se queda con los que tienen stock usando filter() y sustituye el inventario.
 * @returns {number} Cuántos productos se han eliminado.
 */
function eliminarAgotados() {

    let antes = inventario.length;
    inventario = inventario.filter(function (producto) {
        return producto.cantidad > 0;
    });
    return antes - inventario.length;
}


// ============================================================ //
// PRUEBAS EN LA CONSOLA (de menos a más)                       //
// ============================================================ //

console.log("== 1. Mostrar productos ==");
mostrarProductos();

console.log("== 2. Añadir producto ==");
console.log(anadirProducto("Pera", 15, 0.8));     // añadido
console.log(anadirProducto("pera", 5, 0.8));      // ya existe (da igual la mayúscula)
console.log(anadirProducto("", 5, 1));            // sin nombre
console.log(anadirProducto("Kiwi", -2, 1));       // cantidad negativa
console.log(anadirProducto("Kiwi", 4, 0));        // precio 0
mostrarProductos();

console.log("== 3. Actualizar cantidad ==");
console.log(actualizarCantidad("Manzana", 45));   // de 50 a 45
console.log(actualizarCantidad("Sandía", 10));    // no existe
console.log(actualizarCantidad("Naranja", -1));   // cantidad no válida
console.log(actualizarCantidad("Plátano", 0));    // lo dejamos agotado para el paso 5

console.log("== 4. Total de una compra ==");
// 3 manzanas (1.5) + 2 naranjas (1.4) = 2.9
console.log(calcularTotalVentas([
    { nombre: "Manzana", cantidad: 3 },
    { nombre: "Naranja", cantidad: 2 },
]));
console.log(calcularTotalVentas([]));                                     // compra vacía: 0
console.log(calcularTotalVentas([{ nombre: "Sandía", cantidad: 1 }]));    // no existe: 0
console.log(calcularTotalVentas([{ nombre: "Naranja", cantidad: 21 }]));  // más de las que hay: 0
console.log(calcularTotalVentas([{ nombre: "Naranja", cantidad: 20 }]));  // justo todas las que hay: 14

console.log("== 5. Eliminar agotados ==");
console.log(`Eliminados: ${eliminarAgotados()}`);   // 1 (el Plátano)
mostrarProductos();
console.log(`Eliminados: ${eliminarAgotados()}`);   // 0 (ya no queda ninguno agotado)
