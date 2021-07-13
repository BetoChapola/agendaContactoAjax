// Llamamos al formulario por su id mediante querySelector de JS.
// Practicamente es instanciar un elemento HTML en una variable JS para su manipulación.
const formularioContactos = document.querySelector('#contacto');

// Llamamos al listado de contactos mediante su ID y el elemento <tbody>
// Estará listo para ser usado por la funcion insertarBD();
const listadoContactos = document.querySelector('#listado-contactos tbody');

// Llamamos al input del buscador:
const inputBuscador = document.querySelector('#buscar');


// ######################### L I S T E N E R S ###############################
// En cuanto se cargue el archivo se ejecuta la funcion que incluye todos los eventos:
eventListeners();

function eventListeners() {
    // Aquí se programan todos los eventos esperando a ser ejecutadas:

    // Cuando se envía un submit desde el formulario (CREAR o EDITAR) se ejecuta la función leerFormulario.
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar un contacto de la lista de contactos:
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
        // Buscador
        inputBuscador.addEventListener('input', buscarContactos);
    }

    numeroContactos();
}
// ###########################################################################


// ########################## FUNCIONES ############################
// Esta funcion (leerFormulario) atrapa todos los datos aue vienen desde el formulario. Basicamente los encapsula en un FormData()
// y los envía a otra función para su tratamiento con Ajax. Funciona tanto para CREAR o EDITAR
function leerFormulario(e) {
    e.preventDefault();
    // Leer los datos desde los inputs y guardarlos sus VALORES en una variables JS.
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // Utilizamos una funcion para mostrar las notificaciones dependiendo el evento.
        // la funcion recibe 2 parametros: ('texto a mostrar','clase a ejecutar').
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        // mostrarNotificacion('Contacto creado correctamente','correcto');

        // Pasamos la validacion mediante un FormData() guardandola en una variable JS;
        // https://developer.mozilla.org/es/docs/Web/API/FormData/Using_FormData_Objects
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre); // variable.append('llave',valor);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        // console.log(...infoContacto);
        // Toda la informacion que se encapsula en el FormData() sera enviada a otra funcion
        // para el tratamiento de los datos. El FormData() es una coleccion de arreglos.

        // Detectamos la accion que se ha capturado en el FormData (CREAR o EDITAR):
        if (accion === 'crear') {
            // Creamos un nuevo contacto
            // ejecutamos la funcion de insercion y enviamos como parametro el FormData()
            insertarBD(infoContacto);
            mostrarNotificacion('Insertado correctamente', 'correcto');
        } else {
            // Editar contacto
            // Leemos el ID:
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}
// ###################################################################



// ################# F U N C I O N E S --- C R U D ###################
function insertarBD(datos) {
    // Llamado a Ajax

    // 1) Crear el objeto XMLHttpRequest();
    const xhr = new XMLHttpRequest();

    // 2) Abrir la conexion al documento PHP que hace el tratamiento de los datos.
    // xhr.open([metodo],[ubicacion del archivo.php],[asincrono])
    // Recordar que cuando se usa el metodo POST los datos se envian "ocultos", por eso
    // no estan en la url.
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // 3) Pasar los datos
    xhr.onload = function () {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
            // https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
            // status 200 quiere decir que la respuesta del servidor es correcta, por lo tanto 
            // vamos a guardar esa respuesta en una variable JS y "parsearla" a un objeto JSON
            // ya que PHP trabaja con arrays y JS con objetos.
            const respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);

            // Insertar el nuevo contacto que se capturo.
            // Para eso crearemos elementos HTML de una tabla y les asignaremos clases.
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //Crear un contenedor para los botones:
            const contenedorAcciones = document.createElement('td');

            //Crear el icono de editar:
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            //Crear el enlace a editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //Agregarlo a padre
            contenedorAcciones.appendChild(btnEditar);

            //Crear el icono de eliminar:
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            //Crear el boton de eliminar:
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            //Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregarlo con los otros contacto en listado contactos
            listadoContactos.appendChild(nuevoContacto);

            //Resetear el form
            document.querySelector('form').reset();

             numeroContactos();

        }
    }

    // 4) Enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    // Llamado a Ajax
    // 1) Crear el objeto
    const xhr = new XMLHttpRequest();

    // 2) Abrir la conexion al archivo PHP
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // 3) Leer la respuesta del archivo PHP
    xhr.onload = function () {
        if (this.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);
            // console.log(respuesta);
            if (respuesta.respuesta === 'correcto') {
                mostrarNotificacion('Contacto actualizado.', 'correcto');
            } else {
                mostrarNotificacion('Hubo un error.', 'error');
            }
            // Redireccionar
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 4000);
        }
    }

    //  4) Eviar los datos
    xhr.send(datos);
}

function eliminarContacto(e) {
    // Verificamos que el elemento que seleccionamos mediante el evento (e) click contenga la clase "btn-borrar".
    // Recordemos que el icono de borrar se encuentra dentro de su padre <td>. Es probable que el usuario no presione
    // precisamentre el icono de borrar, sino un poco de su contorno. Entonces tenemos que contemplar el elemento <td>
    // y que al mismo tiempo tenga la clase "btn-borrar": e.target.parentElement.classList.contains('btn-borrar'). 
    // Regresa TRUE.
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        // Tomar el ID. Recordemos que el atributo data-id esta en el elemento padre button
        const id = e.target.parentElement.getAttribute('data-id');
        const respuesta = confirm('¿Deseas borrar el contacto?');

        if (respuesta) {
            // console.log('Si');
            // Llamado a Ajax

            // 1) Crear el objeto XMLHttpRequest();
            const xhr = new XMLHttpRequest();

            // 2) Abrir la conexion al documento PHP que hace el tratamiento de los datos.
            // En este caso usamos GET, por lo que tenemos que pasaremos los datos en la URL
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            // 3) Leer la respuesta PHP
            xhr.onload = function () {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);
                    console.log(resultado);
                    if (resultado.respuesta === 'correcto') {
                        // Eliminar el contacto del DOM
                        e.target.parentElement.parentElement.parentElement.remove();

                        // Mostrar notificacion
                        mostrarNotificacion('Contacto eliminado', 'correcto');
                        numeroContactos();
                    } else {
                        mostrarNotificacion('Hubo un error.', 'erorr');
                    }
                }
            }
            // 4) Enviar los datos
            xhr.send();
        }
    }
}
// ###################################################################


// ######################## B U S C A D O R ##########################
function buscarContactos(e) {
    //     // console.log(e.target.value);
    //     // Haremos uso de expresiones regulares RegEx(); "i" keys insentitive.
    const expresion = new RegExp(e.target.value, "i"),
        //         // en esta constante almacenaremos todos los elementos 'tbody tr', aqui es donde vamos a buscar nuestro registro
        regitros = document.querySelectorAll('tbody tr');

    //     // Lo recorremos y lo tratamos como un array
    regitros.forEach(registro => {
        //         // Los ocultamos todos cuando comencemos la busqueda.
        registro.style.display = 'none';

        // Una vez que comience a encontrar algun registro lo mostrará.
        // registro.childNodes[].textContent -> nos trae un array de un td que contiene:
        // "<tr>[0]|<td>[1]nombre|<td>[2]empresa|<td>[3]telefono|<td>[4]acciones"
        // console.log(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1);
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            // Cuando encontremos una coincidencia la mostramos
            registro.style.display = 'table-row';
        }
        numeroContactos();
    })
}

// // Muestra el numero de contactos
function numeroContactos() {
     const totalContactos = document.querySelectorAll('tbody tr')
           contenedorNumero = document.querySelector('.total-contactos span');

     let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });
    contenedorNumero.textContent = total;
 }
// ###################################################################


// ###################### NOTIFICACIONES EN PANTALLA #######################
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div'); //Creamos un elemento HTML y lo guardamos en una variable JS.
    notificacion.classList.add(clase, 'notificacion', 'sombra'); //Le añadimos las clases correspondientes (style.css)
    notificacion.textContent = mensaje; //Insertamos el mensaje.

    // Insertamos el div en el FORM antes del legend, con el mensaje que le enviamos:
    // insertBefore(que_se_inserta, donde_se_inserta);
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar notificacion
    setTimeout(() => {
        // Agragamos la clase visible para mostrar la notificacion
        notificacion.classList.add('visible');

        setTimeout(() => {
            // Retiramos del DOM la clase visible, pero tambien tenemos que remover el DIV
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000); //milisegundos
    }, 100); //milisegundos
}
// ###################################################################