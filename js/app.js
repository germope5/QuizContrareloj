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
    const opcionesRespuesta = document.getElementsByName('respuestas'); // Cambiado a 'respuestas'
    let respuestaSeleccionada;

    opcionesRespuesta.forEach(opcion => {
        if (opcion.checked) {
            respuestaSeleccionada = opcion.value;
        }
    });

    // Convertir la respuesta correcta a cadena
    const respuestaCorrecta = preguntasActuales[preguntaActualIndex].correcta.toString(); // Convertido a cadena

    // Asignar puntos según la respuesta y mostrar feedback
    const esCorrecta = respuestaSeleccionada === respuestaCorrecta;
    
    if(esCorrecta) {
        puntos += 10;
    }

    mostrarFeedback(esCorrecta);

    // Retrasar la navegación a la siguiente pregunta
    setTimeout(() => {
        // Incrementar el índice de la pregunta actual
        preguntaActualIndex++;

        // Mostrar la siguiente pregunta o la puntuación final si no hay más preguntas
        if (preguntaActualIndex < preguntasActuales.length) {
            mostrarPreguntaActual(preguntasActuales[preguntaActualIndex]);
        } else {
            mostrarPuntuacionFinal();
        }
    }, 2000); // Retraso de 2 segundos antes de mostrar la siguiente pregunta
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

    // Obtener la respuesta correcta como número
    const respuestaCorrectaNumero = Number(preguntasActuales[preguntaActualIndex].correcta);

    // Obtener la respuesta seleccionada como número
    const opcionesRespuesta = document.getElementsByName('respuesta');
    let respuestaSeleccionadaNumero;

    opcionesRespuesta.forEach(opcion => {
        if (opcion.checked) {
            respuestaSeleccionadaNumero = Number(opcion.value);
        }
    });

    // Mostrar la respuesta correcta
    const respuestaCorrecta = document.createElement('p');
    respuestaCorrecta.textContent = `La respuesta correcta era: ${String.fromCharCode(65 + respuestaCorrectaNumero)}`;
    contenedorFeedback.appendChild(respuestaCorrecta);

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

    // Botón para regresar a la selección de temática
    const regresarBtn = document.createElement('button');
    regresarBtn.textContent = 'Regresar a la Selección de Temática';
    regresarBtn.addEventListener('click', regresarSeleccionTematica);
    contenedorPuntuacionFinal.appendChild(regresarBtn);

    // Limpiar contenido anterior y agregar la puntuación final
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    appContainer.appendChild(contenedorPuntuacionFinal);
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