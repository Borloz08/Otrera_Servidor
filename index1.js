// const { Client, LocalAuth } = require('whatsapp-web.js');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { google } = require('googleapis');
// const fs = require('fs');
// const qrcode = require('qrcode-terminal');

// // Configuración del cliente de WhatsApp
// const client = new Client({ authStrategy: new LocalAuth() });
// const encuestas = {};

// // --- Configuración de Google Sheets ---
// const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
// const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// const auth = new google.auth.GoogleAuth({
//   credentials: GOOGLE_CREDENTIALS,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets']
// });

// const sheets = google.sheets({ version: 'v4', auth });

// async function guardarUsuario(nombre, pais, telefono) {
//   const codigos = { 'Costa Rica': '506', 'México': '521' };
//   const numero = telefono.replace(/\D/g, '');
//   const telefonoFormateado = numero.startsWith(codigos[pais])
//     ? numero
//     : codigos[pais] + numero;

//   const grupo = Math.random() < 0.5 ? 'control' : 'tratamiento';

//   // Obtener todas las filas actuales
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: SHEET_ID,
//     range: 'Usuarios!A2:D',
//   });

//   const filas = res.data.values || [];
//   const index = filas.findIndex(f => f[2] === telefonoFormateado);

//   if (index !== -1) {
//     // Sobrescribir
//     filas[index] = [nombre, pais, telefonoFormateado, grupo];
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SHEET_ID,
//       range: `Usuarios!A${index + 2}:D${index + 2}`,
//       valueInputOption: 'RAW',
//       requestBody: { values: [filas[index]] }
//     });
//   } else {
//     // Insertar
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: SHEET_ID,
//       range: 'Usuarios!A2:D',
//       valueInputOption: 'RAW',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: {
//         values: [[nombre, pais, telefonoFormateado, grupo]]
//       }
//     });
//   }

//   return { telefono: telefonoFormateado, grupo };
// }

// // --- Servidor Express ---
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/registrar', async (req, res) => {
//   const { nombre, pais, telefono } = req.body;
//   if (!nombre || !pais || !telefono) {
//     return res.status(400).send('Faltan datos');
//   }

//   try {
//     const { telefono: numero, grupo } = await guardarUsuario(nombre, pais, telefono);
//     iniciarEncuesta(numero, nombre, grupo);
//     res.send('Registrado y encuesta iniciada');
//   } catch (err) {
//     console.error('Error al registrar:', err);
//     res.status(500).send('Error interno al registrar');
//   }
// });

// const preguntasGenerales = [
//   "¿Cuántos años tiene?",
//   "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
//   "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC"
// ];

// // Puedes extender preguntasGrupo si deseas usar lógica de tratamiento/control
// function iniciarEncuesta(numero, nombre, grupo) {
//   const chatId = `${numero}@c.us`;
//   encuestas[chatId] = {
//     nombre,
//     grupo,
//     indice: 0,
//     respuestas: []
//   };

//   const saludo = `Hola ${nombre}, bienvenido a la encuesta realizada por Otrera.\nSe presentarán ${preguntasGenerales.length} preguntas. Si deseas regresar a una pregunta anterior escribe "Regresar".\n\nCuando desees comenzar, escribe "Comenzar" o "C"`;
//   client.sendMessage(chatId, saludo);
// }

// // --- Bot de WhatsApp ---
// client.on('message', async message => {
//   const chatId = message.from;
//   const estado = encuestas[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;

//   if (i === 0 && /^(comenzar|c)$/i.test(respuesta)) {
//     estado.indice = 1;
//     client.sendMessage(chatId, `P1. ${preguntasGenerales[0]}`);
//     return;
//   }

//   if (/^regresar$/i.test(respuesta)) {
//     if (estado.indice > 1) {
//       estado.indice--;
//       estado.respuestas.pop();
//       client.sendMessage(chatId, `P${estado.indice}. ${preguntasGenerales[estado.indice - 1]}`);
//     } else {
//       client.sendMessage(chatId, 'Ya estás en la primera pregunta.');
//     }
//     return;
//   }

//   if (i > 0 && i <= preguntasGenerales.length) {
//     estado.respuestas.push(respuesta);
//     estado.indice++;
//     if (estado.indice <= preguntasGenerales.length) {
//       client.sendMessage(chatId, `P${estado.indice}. ${preguntasGenerales[estado.indice - 1]}`);
//     } else {
//       client.sendMessage(chatId, '✅ ¡Gracias por completar la encuesta!');
//       delete encuestas[chatId];
//     }
//   }
// });

// // --- Inicialización del bot y servidor ---
// client.on('qr', qr => qrcode.generate(qr, { small: true }));
// client.on('ready', () => console.log('✅ Bot de WhatsApp listo'));
// client.initialize();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🌐 Servidor web corriendo en http://localhost:${PORT}`);
// });



///////////////////////////////////////

// const { Client, LocalAuth } = require('whatsapp-web.js');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { google } = require('googleapis');
// const fs = require('fs');
// const qrcode = require('qrcode-terminal');

// // Configuración del cliente de WhatsApp
// const client = new Client({ authStrategy: new LocalAuth() });
// const encuestas = {};

// // --- Configuración de Google Sheets ---
// const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
// const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// const auth = new google.auth.GoogleAuth({
//   credentials: GOOGLE_CREDENTIALS,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets']
// });

// const sheets = google.sheets({ version: 'v4', auth });

// // --- Preguntas ---
// const preguntasGenerales = [
//   "¿Cuántos años tiene?",
//   "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
//   "Escoja el estado de México en el que vive:",
//   "Seleccione el municipio donde vive:",
//   "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC",
//   "¿Hasta qué año aprobó en la escuela?\n1) Ninguno\n2) Preescolar\n3) Primaria\n4) Secundaria\n5) Carrera técnica con secundaria terminada\n6) Normal básica\n7) Preparatoria o bachillerato\n8) Carrera técnica con preparatoria\n9) Licenciatura o profesional\n10) Maestría o doctorado\n99) NC"
// ];

// const preguntasGrupo = {
//   tratamiento: {
//     7: "El gobierno de Estados Unidos ha amenazado con imponer nuevos aranceles a México, los cuales afectarían mucho la economía de nuestro país, a menos que México acepte negociar un nuevo acuerdo de seguridad. En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir que Estados Unidos use drones para vigilar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   },
//   control: {
//     7: "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir que Estados Unidos use drones para atacar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   }
// };

// async function guardarUsuario(nombre, pais, telefono) {
//   const codigos = { 'Costa Rica': '506', 'México': '521' };
//   const numero = telefono.replace(/\D/g, '');
//   const telefonoFormateado = numero.startsWith(codigos[pais])
//     ? numero
//     : codigos[pais] + numero;

//   const grupo = Math.random() < 0.5 ? 'control' : 'tratamiento';

//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: SHEET_ID,
//     range: 'Usuarios!A2:D',
//   });

//   const filas = res.data.values || [];
//   const index = filas.findIndex(f => f[2] === telefonoFormateado);

//   if (index !== -1) {
//     filas[index] = [nombre, pais, telefonoFormateado, grupo];
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SHEET_ID,
//       range: `Usuarios!A${index + 2}:D${index + 2}`,
//       valueInputOption: 'RAW',
//       requestBody: { values: [filas[index]] }
//     });
//   } else {
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: SHEET_ID,
//       range: 'Usuarios!A2:D',
//       valueInputOption: 'RAW',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: {
//         values: [[nombre, pais, telefonoFormateado, grupo]]
//       }
//     });
//   }

//   return { telefono: telefonoFormateado, grupo };
// }

// async function iniciarEncuesta(numero, nombre, grupo) {
//   const chatId = `${numero}@c.us`;
//   const variantes = preguntasGrupo[grupo]["8_variantes"].slice();
//   const aleatorias = [];

//   for (let i = 0; i < 3; i++) {
//     const idx = Math.floor(Math.random() * variantes.length);
//     aleatorias.push(variantes.splice(idx, 1)[0]);
//   }

//   const preguntas = [
//     ...preguntasGenerales,
//     preguntasGrupo[grupo][7],
//     ...aleatorias
//   ];

//   encuestas[chatId] = {
//     nombre,
//     grupo,
//     indice: 0,
//     respuestas: [],
//     preguntas
//   };

//   const saludo = `Hola ${nombre}, bienvenido a la encuesta realizada por Otrera.\nSe presentarán ${preguntas.length} preguntas. Si deseas regresar a una pregunta anterior escribe "Regresar".\n\nCuando desees comenzar, escribe "Comenzar" o "C"`;

//   try {
//     // Asegura que esté conectado
//     const estado = await client.getState();
//     if (estado === 'CONNECTED') {
//       await client.sendMessage(chatId, saludo);
//     } else {
//       console.error('⚠️ Cliente de WhatsApp no está conectado aún');
//     }
//   } catch (err) {
//     console.error('❌ Error al enviar el primer mensaje de encuesta:', err);
//   }
// }


// async function guardarRespuestas(nombre, numero, grupo, respuestas) {
//   const fila = [nombre, numero, grupo, ...respuestas];
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SHEET_ID,
//     range: 'Respuestas!A2:Z',
//     valueInputOption: 'RAW',
//     insertDataOption: 'INSERT_ROWS',
//     requestBody: { values: [fila] }
//   });
// }

// // --- Servidor Express ---
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/registrar', async (req, res) => {
//   const { nombre, pais, telefono } = req.body;
//   if (!nombre || !pais || !telefono) {
//     return res.status(400).send('Faltan datos');
//   }

//   try {
//     const { telefono: numero, grupo } = await guardarUsuario(nombre, pais, telefono);
//     iniciarEncuesta(numero, nombre, grupo);
//     res.send('Registrado y encuesta iniciada');
//   } catch (err) {
//     console.error('Error al registrar:', err);
//     res.status(500).send('Error interno al registrar');
//   }
// });

// // --- Bot WhatsApp ---
// client.on('message', async message => {
//   const chatId = message.from;
//   const estado = encuestas[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;

//   if (i === 0 && /^(comenzar|c)$/i.test(respuesta)) {
//     estado.indice = 1;
//     client.sendMessage(chatId, `P1. ${estado.preguntas[0]}`);
//     return;
//   }

//   if (/^regresar$/i.test(respuesta)) {
//     if (estado.indice > 1) {
//       estado.indice--;
//       estado.respuestas.pop();
//       client.sendMessage(chatId, `P${estado.indice}. ${estado.preguntas[estado.indice - 1]}`);
//     } else {
//       client.sendMessage(chatId, 'Ya estás en la primera pregunta.');
//     }
//     return;
//   }

//   if (i > 0 && i <= estado.preguntas.length) {
//     estado.respuestas.push(respuesta);
//     estado.indice++;
//     if (estado.indice <= estado.preguntas.length) {
//       client.sendMessage(chatId, `P${estado.indice}. ${estado.preguntas[estado.indice - 1]}`);
//     } else {
//       client.sendMessage(chatId, '✅ ¡Gracias por completar la encuesta!');
//       await guardarRespuestas(estado.nombre, chatId.replace('@c.us', ''), estado.grupo, estado.respuestas);
//       delete encuestas[chatId];
//     }
//   }
// });

// // --- Inicialización ---
// client.on('qr', qr => qrcode.generate(qr, { small: true }));
// client.on('ready', () => console.log('✅ Bot de WhatsApp listo'));
// client.initialize();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🌐 Servidor web corriendo en http://localhost:${PORT}`);
// });




//////////////////////////////////////////////////////////////////////////////////////////////

// const { Client, LocalAuth } = require('whatsapp-web.js');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { google } = require('googleapis');
// const XLSX = require('xlsx');
// const fs = require('fs');
// const qrcode = require('qrcode-terminal');

// // === Leer Excel de Estados y Municipios ===
// const workbook = XLSX.readFile('Estados-Municipios.xlsx');
// const sheet = workbook.Sheets[workbook.SheetNames[0]];
// const estadosData = XLSX.utils.sheet_to_json(sheet);

// const estados = [...new Set(estadosData.map(e => e.Estado))].sort();
// const municipiosPorEstado = estados.reduce((acc, estado) => {
//   acc[estado] = estadosData
//     .filter(e => e.Estado === estado)
//     .map(e => e.Municipio);
//   return acc;
// }, {});

// // === Preguntas ===
// const preguntasBase = [
//   "¿Cuántos años tiene?",
//   "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
//   "Escoja el estado de México en el que vive:",
//   "Seleccione el municipio donde vive:",
//   "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC",
//   "¿Hasta qué año aprobó en la escuela?\n1) Ninguno\n2) Preescolar\n3) Primaria\n4) Secundaria\n5) Carrera técnica con secundaria terminada\n6) Normal básica\n7) Preparatoria o bachillerato\n8) Carrera técnica con preparatoria\n9) Licenciatura o profesional\n10) Maestría o doctorado\n99) NC"
// ];

// const preguntasGrupo = {
//   tratamiento: {
//     7: "El gobierno de Estados Unidos ha amenazado con imponer nuevos aranceles a México, los cuales afectarían mucho la economía de nuestro país, a menos que México acepte negociar un nuevo acuerdo de seguridad. En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir que Estados Unidos use drones para vigilar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   },
//   control: {
//     7: "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir que Estados Unidos use drones para atacar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   }
// };

// // === Validación de respuestas ===
// function validarRespuesta(pregunta, respuesta, estado) {
//   const resp = respuesta.trim().toLowerCase();

//   if (pregunta.includes("años tiene")) {
//     const n = parseInt(resp);
//     return !isNaN(n) && n > 0 && n < 120;
//   }

//   if (pregunta.includes("género")) {
//     return ['1', '2', '3'].includes(resp);
//   }

//   if (pregunta.includes("estado de México")) {
//     return estados.includes(respuesta.trim());
//   }

//   if (pregunta.includes("municipio")) {
//     const estadoSeleccionado = estado.respuestas[2];
//     return municipiosPorEstado[estadoSeleccionado]?.includes(respuesta.trim());
//   }

//   if (pregunta.includes("estado civil")) {
//     return ['1', '2', '3', '4', '5', '99'].includes(resp);
//   }

//   if (pregunta.includes("año aprobó en la escuela")) {
//     return ['1','2','3','4','5','6','7','8','9','10','99'].includes(resp);
//   }

//   if (pregunta.includes("escala de 0 al 10")) {
//     const n = parseInt(resp);
//     return !isNaN(n) && n >= 0 && n <= 10;
//   }

//   return true;
// }

// // === WhatsApp Client ===
// const client = new Client({ authStrategy: new LocalAuth() });
// const encuestas = {};

// // === Google Sheets ===
// const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
// const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// const auth = new google.auth.GoogleAuth({
//   credentials: GOOGLE_CREDENTIALS,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets']
// });
// const sheets = google.sheets({ version: 'v4', auth });

// async function guardarUsuario(nombre, pais, telefono) {
//   const codigos = { 'Costa Rica': '506', 'México': '521' };
//   const numero = telefono.replace(/\D/g, '');
//   const telefonoFormateado = numero.startsWith(codigos[pais])
//     ? numero
//     : codigos[pais] + numero;

//   const grupo = Math.random() < 0.5 ? 'control' : 'tratamiento';

//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: SHEET_ID,
//     range: 'Usuarios!A2:D',
//   });

//   const filas = res.data.values || [];
//   const index = filas.findIndex(f => f[2] === telefonoFormateado);

//   if (index !== -1) {
//     filas[index] = [nombre, pais, telefonoFormateado, grupo];
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SHEET_ID,
//       range: `Usuarios!A${index + 2}:D${index + 2}`,
//       valueInputOption: 'RAW',
//       requestBody: { values: [filas[index]] }
//     });
//   } else {
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: SHEET_ID,
//       range: 'Usuarios!A2:D',
//       valueInputOption: 'RAW',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: {
//         values: [[nombre, pais, telefonoFormateado, grupo]]
//       }
//     });
//   }

//   return { telefono: telefonoFormateado, grupo };
// }

// async function guardarRespuestas(nombre, telefono, grupo, respuestas) {
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SHEET_ID,
//     range: 'Respuestas!A2:E',
//     valueInputOption: 'RAW',
//     insertDataOption: 'INSERT_ROWS',
//     requestBody: {
//       values: [[nombre, telefono, grupo, ...respuestas]]
//     }
//   });
// }

// // === Iniciar Encuesta ===
// function iniciarEncuesta(numero, nombre, grupo) {
//   const chatId = `${numero}@c.us`;
//   const preguntasAleatorias = [
//     preguntasGrupo[grupo]["8_variantes"][Math.floor(Math.random() * 3)],
//     preguntasGrupo[grupo]["8_variantes"][Math.floor(Math.random() * 3)],
//     preguntasGrupo[grupo]["8_variantes"][Math.floor(Math.random() * 3)],
//   ];

//   const preguntas = [
//     ...preguntasBase,
//     preguntasGrupo[grupo][7],
//     ...preguntasAleatorias
//   ];

//   encuestas[chatId] = {
//     nombre,
//     grupo,
//     indice: 0,
//     respuestas: [],
//     preguntas
//   };

//   const saludo = `Hola ${nombre}, bienvenido a la encuesta realizada por Otrera.\nSe presentarán ${preguntas.length} preguntas. Si deseas regresar a una pregunta anterior escribe "Regresar".\n\nCuando desees comenzar, escribe "Comenzar" o "C"`;
//   client.sendMessage(chatId, saludo);
// }

// // === WhatsApp Message Handling ===
// client.on('message', async message => {
//   const chatId = message.from;
//   const estado = encuestas[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;
//   const preguntas = estado.preguntas;

//   if (i === 0 && /^(comenzar|c)$/i.test(respuesta)) {
//     estado.indice = 1;
//     client.sendMessage(chatId, `P1. ${preguntas[0]}`);
//     return;
//   }

//   if (/^regresar$/i.test(respuesta)) {
//     if (estado.indice > 1) {
//       estado.indice--;
//       estado.respuestas.pop();
//       client.sendMessage(chatId, `P${estado.indice}. ${preguntas[estado.indice - 1]}`);
//     } else {
//       client.sendMessage(chatId, 'Ya estás en la primera pregunta.');
//     }
//     return;
//   }

//   if (i > 0 && i <= preguntas.length) {
//     const preguntaActual = preguntas[i - 1];

//     if (!validarRespuesta(preguntaActual, respuesta, estado)) {
//       client.sendMessage(chatId, '❌ Respuesta inválida. Intenta de nuevo.');
//       return;
//     }

//     estado.respuestas.push(respuesta);
//     estado.indice++;

//     if (estado.indice <= preguntas.length) {
//       const sig = preguntas[estado.indice - 1];

//       if (sig.includes("estado de México")) {
//         client.sendMessage(chatId, `📍 Estados disponibles:\n${estados.join('\n')}`);
//       }

//       if (sig.includes("municipio")) {
//         const estadoSel = estado.respuestas[2];
//         const municipios = municipiosPorEstado[estadoSel] || [];
//         client.sendMessage(chatId, `🏙️ Municipios de ${estadoSel}:\n${municipios.join('\n')}`);
//       }

//       client.sendMessage(chatId, `P${estado.indice}. ${sig}`);
//     } else {
//       client.sendMessage(chatId, '✅ ¡Gracias por completar la encuesta!');
//       await guardarRespuestas(estado.nombre, chatId.split('@')[0], estado.grupo, estado.respuestas);
//       delete encuestas[chatId];
//     }
//   }
// });

// // === Express Server ===
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/registrar', async (req, res) => {
//   const { nombre, pais, telefono } = req.body;
//   if (!nombre || !pais || !telefono) {
//     return res.status(400).send('Faltan datos');
//   }

//   try {
//     const { telefono: numero, grupo } = await guardarUsuario(nombre, pais, telefono);
//     iniciarEncuesta(numero, nombre, grupo);
//     res.send('Registrado y encuesta iniciada');
//   } catch (err) {
//     console.error('Error al registrar:', err);
//     res.status(500).send('Error interno al registrar');
//   }
// });

// // === Inicialización ===
// client.on('qr', qr => qrcode.generate(qr, { small: true }));
// client.on('ready', () => console.log('✅ Bot de WhatsApp listo'));
// client.initialize();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🌐 Servidor web corriendo en http://localhost:${PORT}`);
// });


/////////////////////////////////////////////////////////////////////////////////////

// const { Client, LocalAuth } = require('whatsapp-web.js');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { google } = require('googleapis');
// const XLSX = require('xlsx');
// const fs = require('fs');
// const qrcode = require('qrcode-terminal');





// // ... (se mantiene toda la sección de imports)
// const xlsx = require('xlsx');
// const path = require('path');

// // Cargar estado-municipios
// const wb = xlsx.readFile(path.join(__dirname, 'Estados-Municipios.xlsx'));
// const sheet = wb.Sheets[wb.SheetNames[0]];
// const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
// const estadoMunicipios = {};
// for (let i = 1; i < data.length; i++) {
//   const [estado, municipio] = data[i];
//   if (!estadoMunicipios[estado]) estadoMunicipios[estado] = [];
//   estadoMunicipios[estado].push(municipio);
// }
// const listaEstados = Object.keys(estadoMunicipios);

// // Preguntas
// const preguntasGenerales = [
//   "¿Cuántos años tiene?",
//   "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
//   "Escoja el estado de México en el que vive:",
//   "Seleccione el municipio donde vive:",
//   "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC",
//   "¿Hasta qué año aprobó en la escuela?\n1) Ninguno\n2) Preescolar\n3) Primaria\n4) Secundaria\n5) Carrera técnica con secundaria terminada\n6) Normal básica\n7) Preparatoria o bachillerato\n8) Carrera técnica con preparatoria\n9) Licenciatura o profesional\n10) Maestría o doctorado\n99) NC"
// ];

// const preguntasGrupo = {
//   tratamiento: {
//     7: "El gobierno de Estados Unidos ha amenazado con imponer nuevos aranceles a México, los cuales afectarían mucho la economía de nuestro país, a menos que México acepte negociar un nuevo acuerdo de seguridad. En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir que Estados Unidos use drones para vigilar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   },
//   control: {
//     7: "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
//     "8_variantes": [
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir que Estados Unidos use drones para atacar a los carteles mexicanos?",
//       "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
//     ]
//   }
// };

// // Validación de respuestas
// function validarRespuesta(indice, texto, estado) {
//   const num = parseInt(texto);
//   if (indice === 1) return [1, 2, 3].includes(num);
//   if (indice === 4) return [1, 2, 3, 4, 5, 99].includes(num);
//   if (indice === 5) return [1,2,3,4,5,6,7,8,9,10,99].includes(num);
//   if ([6,7,8,9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
//   if (indice === 2) return num >= 1 && num <= listaEstados.length;
//   if (indice === 3) return estado?.municipios && num >= 1 && num <= estado.municipios.length;
//   return true;
// }

// // Guardar respuestas en Sheets
// async function guardarRespuestas(estado, chatId) {
//   const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
//   const timestamp = new Date().toISOString();
//   const fila = [
//     timestamp,
//     estado.nombre,
//     chatId.replace('@c.us', ''),
//     estado.grupo,
//     ...estado.respuestas.slice(0, 7)
//   ];

//   // Agrega respuestas de preguntas aleatorias en orden original
//   const ordenadas = Array(3).fill('');
//   estado.ordenP8.forEach((e, i) => {
//     const respuesta = estado.respuestas[7 + i];
//     ordenadas[e.index] = respuesta;
//   });
//   fila.push(...ordenadas);

//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SHEET_ID,
//     range: 'Respuestas!A1:M1',
//     valueInputOption: 'RAW',
//     insertDataOption: 'INSERT_ROWS',
//     requestBody: {
//       values: [fila]
//     }
//   });
// }

// // Evento mensaje
// client.on('message', async message => {
//   const chatId = message.from;
//   const estado = encuestas[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   if (estado.indice === -1) {
//     if (/^(comenzar|c)$/i.test(respuesta)) {
//       estado.indice = 0;
//     } else {
//       client.sendMessage(chatId, `Por favor escriba "Comenzar" o "C" para iniciar la encuesta.`);
//       return;
//     }
//   } else if (/^regresar$/i.test(respuesta)) {
//     if (estado.indice > 0) {
//       estado.indice--;
//       estado.respuestas.pop();
//     } else {
//       client.sendMessage(chatId, `Ya estás en la primera pregunta.`);
//       return;
//     }
//   } else {
//     if (!validarRespuesta(estado.indice, respuesta, estado)) {
//       client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
//       return;
//     }

//     // Estados y municipios
//     if (estado.indice === 2) {
//       const index = parseInt(respuesta);
//       estado.estadoSeleccionado = listaEstados[index - 1];
//       estado.municipios = estadoMunicipios[estado.estadoSeleccionado];
//       estado.respuestas.push(estado.estadoSeleccionado);
//     } else if (estado.indice === 3) {
//       const index = parseInt(respuesta);
//       estado.respuestas.push(estado.municipios[index - 1]);
//     } else {
//       estado.respuestas.push(respuesta);
//     }

//     estado.indice++;
//   }

//   const i = estado.indice;
//   if (i === 2) {
//     let texto = `P3. ${estado.nombre}, escoja el estado:\n`;
//     listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
//     client.sendMessage(chatId, texto);
//   } else if (i === 3) {
//     let texto = `P4. ${estado.nombre}, seleccione el municipio:\n`;
//     estado.municipios.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
//     client.sendMessage(chatId, texto);
//   } else if (i < preguntasGenerales.length) {
//     client.sendMessage(chatId, `P${i + 1}. ${estado.nombre}, ${preguntasGenerales[i]}`);
//   } else if (i === preguntasGenerales.length) {
//     const p7 = preguntasGrupo[estado.grupo][7];
//     client.sendMessage(chatId, `P7. ${estado.nombre}, ${p7}`);
//   } else if (i >= preguntasGenerales.length + 1 && i <= preguntasGenerales.length + 3) {
//     const i8 = i - (preguntasGenerales.length + 1);
//     const p = estado.ordenP8[i8];
//     client.sendMessage(chatId, `P${i + 1}. ${estado.nombre}, ${p.texto}`);
//   } else {
//     await guardarRespuestas(estado, chatId);
//     client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);
//     delete encuestas[chatId];
//   }
// });



///////////////////////////////////////////////////////


const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const XLSX = require('xlsx');
const { google } = require('googleapis');

// --- WhatsApp Bot ---
const client = new Client({ authStrategy: new LocalAuth() });
const encuestas = {};
const estados = {};
const respuestasGlobales = {};

const workbook = XLSX.readFile('./Estados-Municipios.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1);
const estadoMunicipios = {};
for (const [estado, municipio] of rows) {
  if (!estadoMunicipios[estado]) estadoMunicipios[estado] = [];
  estadoMunicipios[estado].push(municipio);
}
const listaEstados = Object.keys(estadoMunicipios);

// --- Preguntas ---
const preguntasGenerales = [
  "¿Cuántos años tiene? Indique su edad en números.",
  "Por favor indique el número que corresponde a la opción de su género\n1) Hombre\n2) Mujer\n3) Otro",
  "Indique el número que corresponde al estado de México en el que vive:",
  "Indique el número que corresponde al municipio donde vive:",
  "Por favor indique el número que corresponde a la opción de su estado civil:\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC",
  "Indique el número que corresponde a la opción del año hasta el que aprobó la escuela:\n1) Ninguno\n2) Preescolar\n3) Primaria\n4) Secundaria\n5) Carrera técnica con secundaria terminada\n6) Normal básica\n7) Preparatoria o bachillerato\n8) Carrera técnica con preparatoria\n9) Licenciatura o profesional\n10) Maestría o doctorado\n99) NC"
];

const preguntasGrupo = {
  tratamiento: {
    7: "El gobierno de Estados Unidos ha amenazado con imponer nuevos aranceles a México, los cuales afectarían mucho la economía de nuestro país, a menos que México acepte negociar un nuevo acuerdo de seguridad. En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
    "8_variantes": [
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir que Estados Unidos use drones para vigilar a los carteles mexicanos?",
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
    ]
  },
  control: {
    7: "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
    "8_variantes": [
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir que Estados Unidos use drones para atacar a los carteles mexicanos?",
      "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
    ]
  }
};

// --- Google Sheets Config ---
const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

async function guardarUsuario(nombre, pais, telefono) {
  const codigos = { 'Costa Rica': '506', 'México': '521' , 'Estados Unidos': '1' };
  const numero = telefono.replace(/\D/g, '');
  const telefonoFormateado = numero.startsWith(codigos[pais])
    ? numero
    : codigos[pais] + numero;

  const grupo = Math.random() < 0.5 ? 'control' : 'tratamiento';

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Usuarios!A2:D',
  });

  const filas = res.data.values || [];
  const index = filas.findIndex(f => f[2] === telefonoFormateado);

  if (index !== -1) {
    filas[index] = [nombre, pais, telefonoFormateado, grupo];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Usuarios!A${index + 2}:D${index + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [filas[index]] }
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Usuarios!A2:D',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [[nombre, pais, telefonoFormateado, grupo]] }
    });
  }

  return { telefono: telefonoFormateado, grupo };
}

async function guardarRespuesta(estado, chatId) {
  const timestamp = new Date().toLocaleString('es-MX');

  // Ordena las respuestas aleatorias por su índice original
  const respuestasOrdenadas = Array(3).fill('');
  estado.ordenP8.forEach(p => {
    respuestasOrdenadas[p.index] = p.respuesta || '';
  });

  // Construye la fila con las respuestas en orden esperado
  const fila = [
    timestamp,
    estado.nombre,
    chatId.replace('@c.us', ''),
    estado.grupo,
    ...estado.respuestas.slice(0, 7), // P1–P7
    ...respuestasOrdenadas             // P8.A, P8.B, P8.C
  ];


  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Respuestas!A1:O',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [fila] }
  });
}

// --- Validaciones ---
function validarRespuesta(i, texto, estado = {}) {
  const num = parseInt(texto);
  if ([0].includes(i)) return !isNaN(num) && num >= 18 && num <= 100;
  if ([1].includes(i)) return [1, 2, 3].includes(num);
  if ([4].includes(i)) return [1, 2, 3, 4, 5, 99].includes(num);
  if ([5].includes(i)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
  if ([6, 7, 8, 9].includes(i)) return !isNaN(num) && num >= 0 && num <= 10;
  if (i === 2) return num >= 1 && num <= listaEstados.length;
  if (i === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
  return true;
}

function iniciarEncuesta(numero, nombre, grupo) {
  const chatId = `${numero}@c.us`;
  const orden = preguntasGrupo[grupo]["8_variantes"]
    .map((texto, index) => ({ texto, index }))
    .sort(() => Math.random() - 0.5);

  estados[chatId] = {
    nombre,
    grupo,
    indice: -1,
    respuestas: [],
    ordenP8: orden
  };

  client.sendMessage(chatId, `Hola ${nombre}, bienvenido a la encuesta de Otrera. Se presentarán 10 preguntas. Escribe "Comenzar" o "C" para iniciar. Puedes escribir "Regresar" si deseas volver a una pregunta anterior.`);
}

// --- Servidor Express ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/registrar', async (req, res) => {
  const { nombre, pais, telefono } = req.body;
  if (!nombre || !pais || !telefono) return res.status(400).send('Faltan datos');

  try {
    const { telefono: numero, grupo } = await guardarUsuario(nombre, pais, telefono);
    iniciarEncuesta(numero, nombre, grupo);
    res.send('Registrado y encuesta iniciada');
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).send('Error interno al registrar');
  }
});

// --- Inicialización ---
client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', async () => {
  console.log('✅ Cliente de WhatsApp listo');

  client.on('message', async message => {
    const chatId = message.from;
    const estado = estados[chatId];
    if (!estado) return;

    const respuesta = message.body.trim();

    if (estado.indice === -1) {
      if (/^comenzar$|^c$/i.test(respuesta)) {
        estado.indice = 0;
      } else {
        return client.sendMessage(chatId, `Por favor escriba "Comenzar" o "C" para iniciar la encuesta.`);
      }
    } else if (/^regresar$/i.test(respuesta)) {
      if (estado.indice > 0) {
        estado.indice--;
        estado.respuestas.pop();
      } else {
        return client.sendMessage(chatId, `Ya estás en la primera pregunta.`);
      }
    } else {
      const i = estado.indice;
      if (!validarRespuesta(i, respuesta, estado)) {
        return client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda según lo solicitado.`);
      }

      if (i === 2) {
        const index = parseInt(respuesta);
        estado.estadoSeleccionado = listaEstados[index - 1];
        estado.municipios = estadoMunicipios[estado.estadoSeleccionado];
        estado.respuestas.push(estado.estadoSeleccionado);
      } else if (i === 3) {
        const index = parseInt(respuesta);
        estado.respuestas.push(estado.municipios[index - 1]);
      } else if (i >= 7 && i <= 9) {
        estado.ordenP8[i - 7].respuesta = respuesta;
      } else {
        estado.respuestas.push(respuesta);
      }

      estado.indice++;
    }

    const i = estado.indice;
    if (i === 2) {
      let texto = `P3. ${estado.nombre}, escoja el estado donde vive:\n`;
      listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
      return client.sendMessage(chatId, texto);
    } else if (i === 3) {
      let texto = `P4. ${estado.nombre}, seleccione el municipio donde vive:\n`;
      estado.municipios.forEach((m, idx) => texto += `${idx + 1}) ${m}\n`);
      return client.sendMessage(chatId, texto);
    } else if (i < preguntasGenerales.length) {
      return client.sendMessage(chatId, `P${i + 1}. ${estado.nombre}, ${preguntasGenerales[i]}`);
    } else if (i === preguntasGenerales.length) {
      return client.sendMessage(chatId, `P7. ${estado.nombre}, ${preguntasGrupo[estado.grupo][7]}`);
    } else if (i >= preguntasGenerales.length + 1 && i <= preguntasGenerales.length + 3) {
      const idx = i - preguntasGenerales.length - 1;
      return client.sendMessage(chatId, `P${i + 1}. ${estado.nombre}, ${estado.ordenP8[idx].texto}`);
    } else {
      await guardarRespuesta(estado, chatId);
      delete estados[chatId];
      return client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);
    }
  });
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor web corriendo en http://localhost:${PORT}`);
});
