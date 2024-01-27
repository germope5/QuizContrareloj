// Lógica de la aplicación

document.addEventListener('DOMContentLoaded', function () {
    // Lógica inicial
});

let preguntasActuales = []; // Array para almacenar las preguntas cargadas
let preguntaActualIndex = 0; // Índice de la pregunta actual
let tiempoRestante = 30; // Tiempo inicial para responder cada pregunta
let temporizador; // Variable para almacenar el temporizador
let puntos = 0;

function iniciarJuego() {
    const tematicaSeleccionada = document.getElementById('tematicas').value;

    // Agrega aquí la lógica para cargar las preguntas según la temática seleccionada
    if (tematicaSeleccionada === 'spiderman') {
        cargarPreguntas("preguntasSpiderman.json");
    } else if (tematicaSeleccionada === 'civilwar') {
        cargarPreguntas("preguntasCW.json");
    } else if (tematicaSeleccionada === 'avengers') {
        cargarPreguntas("preguntasAvengers.json");
    }

    // Otras lógicas necesarias...
}

function cargarPreguntas(archivo) {
    fetch(archivo)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo ${archivo}`);
            }
            return response.json();
        })
        .then(data => {
            // Almacena las preguntas y muestra la primera
            preguntasActuales = data;
            mostrarPreguntaActual();
        })
        .catch(error => {
            console.error(`Error al cargar el archivo ${archivo}: ${error.message}`);
        });
}

function mostrarPreguntaActual() {
    const pregunta = preguntasActuales[preguntaActualIndex];

    if (pregunta) {
        // Limpiar tiempo restante al mostrar nueva pregunta
        tiempoRestante = 30;

        const contenedorPreguntas = document.createElement('div');
        contenedorPreguntas.id = 'preguntas-container';

        const preguntaElement = document.createElement('div');
        preguntaElement.className = 'pregunta';

        // Añadir texto a la pregunta
        const preguntaTexto = document.createElement('p');
        preguntaTexto.textContent = `${preguntaActualIndex + 1}. ${pregunta.pregunta}`;
        preguntaElement.appendChild(preguntaTexto);

    // Añadir opciones de respuesta como elementos input tipo radio
const opcionesRespuesta = document.createElement('div');
opcionesRespuesta.id = 'respuestas-container';
pregunta.respuestas.forEach((respuesta, i) => {
    const opcion = document.createElement('div');

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'respuestas'; // Cambiado a 'respuestas' para agrupar los radio buttons
    radioInput.value = i; // Asigna el valor de la opción al índice
    radioInput.id = `opcion${i}`; // Asigna un id único para el input
    opcion.appendChild(radioInput);

    const label = document.createElement('label');
    label.textContent = `${String.fromCharCode(65 + i)}. ${respuesta}`;
    label.htmlFor = `opcion${i}`; // Asigna el id del input al atributo htmlFor del label
    opcion.appendChild(label);

    opcionesRespuesta.appendChild(opcion);
});
preguntaElement.appendChild(opcionesRespuesta);

        // Mostrar tiempo restante
        const tiempoRestanteElement = document.createElement('p');
        tiempoRestanteElement.id = 'tiempo-restante';
        tiempoRestanteElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
        preguntaElement.appendChild(tiempoRestanteElement);

        // Botón para pasar a la siguiente pregunta
        const siguienteBtn = document.createElement('button');
        siguienteBtn.textContent = 'Siguiente Pregunta';
        siguienteBtn.addEventListener('click', siguientePregunta);
        preguntaElement.appendChild(siguienteBtn);

        contenedorPreguntas.appendChild(preguntaElement);

        //Limpiar contenido anterior y agregar las nuevas preguntas
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(contenedorPreguntas);

        // Iniciar temporizador
        iniciarTemporizador();
    } else {
        // Si no hay más preguntas, mostrar puntuación final
        mostrarPuntuacionFinal();
    }
}

function iniciarTemporizador() {
    temporizador = setInterval(function () {
        tiempoRestante--;

        // Actualizar el elemento de tiempo restante en la pantalla
        const tiempoRestanteElement = document.getElementById('tiempo-restante');
        if (tiempoRestanteElement) {
            tiempoRestanteElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
        }

        if (tiempoRestante <= 0) {
            // Si el tiempo se agota, pasar a la siguiente pregunta automáticamente
            clearInterval(temporizador);
            siguientePregunta();
        }
    }, 1000); // Actualizar cada segundo
}

function siguientePregunta() {
    // Limpiar temporizador al pasar a la siguiente pregunta
    clearInterval(temporizador);

    // Obtener la respuesta seleccionada
    const opcionesRespuesta = document.getElementsByName('respuestas');
    let respuestaSeleccionada;

    opcionesRespuesta.forEach(opcion => {
        if (opcion.checked) {
            respuestaSeleccionada = opcion.value;
        }
    });

    // Obtener la respuesta correcta y el tiempo restante
    const preguntaActual = preguntasActuales[preguntaActualIndex];
    const respuestaCorrecta = preguntaActual.correcta;
    const segundosRestantes = tiempoRestante;

    // Calcular los puntos asignados según la nueva lógica
    const esCorrecta = respuestaSeleccionada === respuestaCorrecta.toString();
    const puntosAsignados = esCorrecta ? Math.max(segundosRestantes, 0) : 0;

    // Actualizar la puntuación total
    puntos += puntosAsignados;

    // Mostrar feedback y continuar con la lógica original
    mostrarFeedback(esCorrecta);

    setTimeout(() => {
        preguntaActualIndex++;

        if (preguntaActualIndex < preguntasActuales.length) {
            mostrarPreguntaActual(preguntasActuales[preguntaActualIndex]);
        } else {
            mostrarPuntuacionFinal(); // Llamar a mostrarPuntuacionFinal después de la última pregunta
        }
    }, 2000);
}


function mostrarFeedback(esCorrecta) {
    const contenedorFeedback = document.createElement('div');
    contenedorFeedback.className = 'feedback';

    const mensajeFeedback = document.createElement('p');

    if (esCorrecta) {
        mensajeFeedback.textContent = '¡Respuesta correcta!';
        mensajeFeedback.className = 'correcto';
    } else {
        mensajeFeedback.textContent = 'Respuesta incorrecta';
        mensajeFeedback.className = 'incorrecto';
    }

    contenedorFeedback.appendChild(mensajeFeedback);

    // Obtener la respuesta correcta
    const respuestaCorrecta = preguntasActuales[preguntaActualIndex].correcta;

    // Obtener la respuesta seleccionada
    const opcionesRespuesta = document.getElementsByName('respuestas');
    let respuestaSeleccionada;

    opcionesRespuesta.forEach(opcion => {
        if (opcion.checked) {
            respuestaSeleccionada = opcion.value;
        }
    });

    // Convertir la respuesta seleccionada a cadena
    const respuestaSeleccionadaCadena = respuestaSeleccionada.toString();

    // Mostrar la respuesta correcta
    const respuestaCorrectaElement = document.createElement('p');
    respuestaCorrectaElement.textContent = `La respuesta correcta era: ${String.fromCharCode(65 + parseInt(respuestaCorrecta))}`;
    contenedorFeedback.appendChild(respuestaCorrectaElement);

    // Limpiar contenido anterior y agregar el feedback
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    appContainer.appendChild(contenedorFeedback);
}





function mostrarPuntuacionFinal() {
    // Calcular la puntuación final del jugador
    const puntuacionFinal = puntos;

    // Crear el contenedor de la puntuación final
    const contenedorPuntuacionFinal = document.createElement('div');
    contenedorPuntuacionFinal.id = 'puntuacion-final';

    // Crear elemento para mostrar la puntuación final
    const puntuacionFinalElement = document.createElement('p');
    puntuacionFinalElement.textContent = `¡Puntuación Final: ${puntuacionFinal} puntos!`;
    contenedorPuntuacionFinal.appendChild(puntuacionFinalElement);

    // Input para el nombre del jugador
    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.placeholder = 'Ingresa tu nombre';
    contenedorPuntuacionFinal.appendChild(nombreInput);

    // Botón para guardar la puntuación
    const guardarBtn = document.createElement('button');
    guardarBtn.textContent = 'Guardar Puntuación';
    guardarBtn.addEventListener('click', () => {
        const nombreJugador = nombreInput.value;
        if (nombreJugador.trim() !== '') {
            // Guardar la puntuación con el nombre
            guardarPuntuacion(nombreJugador, puntuacionFinal);

            // Mostrar la pantalla de ranking
            mostrarRanking();
        } else {
            alert('Ingresa tu nombre para guardar la puntuación.');
        }
    });
    contenedorPuntuacionFinal.appendChild(guardarBtn);

    // Limpiar contenido anterior y agregar la puntuación final
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    appContainer.appendChild(contenedorPuntuacionFinal);
}

function guardarPuntuacion(nombre, puntuacion) {
    // Aquí debes implementar la lógica para guardar la puntuación de forma persistente
    // Puedes utilizar almacenamiento local (localStorage) o una base de datos, dependiendo de tus necesidades
    // Ejemplo utilizando localStorage:
    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];
    puntuacionesGuardadas.push({ nombre, puntuacion });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesGuardadas));
}

function mostrarRanking() {
    // Implementa la lógica para mostrar la pantalla de ranking
    // Puedes obtener las puntuaciones guardadas y ordenarlas antes de mostrarlas
    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('puntuaciones')) || [];

    // Ordenar las puntuaciones de mayor a menor
    const puntuacionesOrdenadas = puntuacionesGuardadas.sort((a, b) => b.puntuacion - a.puntuacion);

    // Crear el contenedor de la pantalla de ranking
    const contenedorRanking = document.createElement('div');
    contenedorRanking.id = 'ranking';

    // Crear elemento para mostrar el ranking
    const rankingElement = document.createElement('div');
    rankingElement.className = 'ranking';

    // Encabezado del ranking
    const encabezadoRanking = document.createElement('h2');
    encabezadoRanking.textContent = 'Ranking de Puntuaciones';
    rankingElement.appendChild(encabezadoRanking);

    // Lista de puntuaciones
    const listaPuntuaciones = document.createElement('ul');
    puntuacionesOrdenadas.forEach((puntuacion, index) => {
        const itemPuntuacion = document.createElement('li');
        itemPuntuacion.textContent = `${index + 1}. ${puntuacion.nombre}: ${puntuacion.puntuacion} puntos`;
        listaPuntuaciones.appendChild(itemPuntuacion);
    });
    rankingElement.appendChild(listaPuntuaciones);

    // Botón para regresar a la selección de temática
    const regresarBtn = document.createElement('button');
    regresarBtn.textContent = 'Regresar a la Selección de Temática';
    regresarBtn.addEventListener('click', regresarSeleccionTematica);
    rankingElement.appendChild(regresarBtn);

    contenedorRanking.appendChild(rankingElement);

    // Limpiar contenido anterior y agregar la pantalla de ranking
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    appContainer.appendChild(contenedorRanking);
}

function regresarSeleccionTematica() {
    // Redirigir a la pantalla de selección de temática
    window.location.reload();
}

function consultarRanking() {
    // Agrega aquí la lógica para consultar el ranking
    // Por ejemplo, puedes cambiar la visibilidad de las secciones y mostrar la tabla de puntuaciones
    console.log("Consultar Ranking");
}