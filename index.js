// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');

// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// client.on('qr', qr => {
//     console.log('📱 Escanea este QR con tu WhatsApp:');
//     qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('✅ Cliente listo!');

//     const numero = '50687284141'; // sin el +
//     const chatId = `${numero}@c.us`;

//     client.sendMessage(chatId, 'Hola desde whatsapp-web.js 🤖')
//         .then(() => {
//             console.log('📤 Mensaje enviado!');
//         })
//         .catch(err => {
//             console.error('❌ Error al enviar mensaje:', err);
//         });
// });

// client.initialize();


/////////////////////////////


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');

// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// const preguntas = [
//     "P1. ¿Qué tan seguro te sientes en tu comunidad del 1 al 10?",
//     "P2. ¿Has sido víctima de algún delito en el último año?",
//     "P3. ¿Qué opinas sobre el aumento del patrullaje en tu zona?",
//     "P4. ¿Aceptarías mayor presencia militar si mejora la seguridad?"
// ];

// const estados = {};  // Guardará el progreso de cada usuario

// client.on('qr', qr => {
//     console.log('📱 Escanea este QR:');
//     require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('✅ Bot listo y esperando mensajes');

//     // Puedes iniciar la encuesta enviando la primera pregunta automáticamente
//     const numero = '50687284141';
//     const chatId = `${numero}@c.us`;

//     estados[chatId] = {
//         indice: 0,
//         respuestas: []
//     };

//     client.sendMessage(chatId, preguntas[0]);
// });

// client.on('message', message => {
//     const chatId = message.from;

//     // Ignora mensajes si no son de un número en seguimiento
//     if (!estados[chatId]) return;

//     const estado = estados[chatId];

//     // Guarda la respuesta anterior
//     estado.respuestas.push(message.body);

//     // Avanza a la siguiente pregunta
//     estado.indice++;

//     if (estado.indice < preguntas.length) {
//         // Enviar la siguiente pregunta
//         client.sendMessage(chatId, preguntas[estado.indice]);
//     } else {
//         // Encuesta finalizada
//         client.sendMessage(chatId, '✅ ¡Gracias por completar la encuesta!');

//         // Guardar resultados en archivo
//         const resultado = {
//             numero: chatId,
//             respuestas: estado.respuestas
//         };

//         const log = JSON.stringify(resultado, null, 2);
//         fs.appendFileSync('encuestas.json', log + ',\n');

//         // Eliminar del estado
//         delete estados[chatId];
//     }
// });

// client.initialize();


/////////////////////


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');

// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// // Preguntas base sin nombre (lo agregamos después)
// const preguntasBase = [
//     "¿Qué tan seguro te sientes en tu comunidad del 1 al 10?",
//     "¿Has sido víctima de algún delito en el último año?",
//     "¿Qué opinas sobre el aumento del patrullaje en tu zona?",
//     "¿Aceptarías mayor presencia militar si mejora la seguridad?"
// ];

// // Mapeo de números con nombres
// const contactos = {
//     '50688741295': 'Jeffrey',
//     '50687284141': 'Tatiana',
//     '50670066087': 'Mariana'
// };

// // Estados por usuario
// const estados = {};
// let respuestasGlobales = {};

// const archivo = 'encuestas.json';
// if (fs.existsSync(archivo)) {
//     const datosPrevios = fs.readFileSync(archivo, 'utf-8');
//     respuestasGlobales = JSON.parse(datosPrevios || '{}');
// }

// client.on('qr', qr => {
//     console.log('📱 Escanea este QR:');
//     require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', async () => {
//     console.log('✅ Bot listo y enviando preguntas...');

//     for (const numero in contactos) {
//         const nombre = contactos[numero];
//         const chatId = `${numero}@c.us`;

//         estados[chatId] = {
//             indice: 0,
//             respuestas: [],
//             nombre: nombre
//         };

//         const preguntaPersonalizada = `P1. ${nombre}, ${preguntasBase[0]}`;
//         await client.sendMessage(chatId, preguntaPersonalizada);
//         console.log(`📤 Pregunta 1 enviada a ${nombre}`);
//     }
// });

// client.on('message', message => {
//     const chatId = message.from;
//     const estado = estados[chatId];
//     if (!estado) return;

//     // Guardar respuesta
//     estado.respuestas.push(message.body);
//     estado.indice++;

//     if (estado.indice < preguntasBase.length) {
//         const preguntaNum = estado.indice + 1;
//         const texto = `P${preguntaNum}. ${estado.nombre}, ${preguntasBase[estado.indice]}`;
//         client.sendMessage(chatId, texto);
//     } else {
//         client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);

//         // Guardar resultado
//         respuestasGlobales[chatId] = {
//             nombre: estado.nombre,
//             respuestas: estado.respuestas
//         };

//         fs.writeFileSync(archivo, JSON.stringify(respuestasGlobales, null, 2));
//         delete estados[chatId];
//     }
// });


// client.initialize();




//////////////////////


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');
// const XLSX = require('xlsx');

// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// const preguntasBase = [
//     "¿Qué tan seguro te sientes en tu comunidad del 1 al 10?",
//     "¿Has sido víctima de algún delito en el último año?",
//     "¿Qué opinas sobre el aumento del patrullaje en tu zona?",
//     "¿Aceptarías mayor presencia militar si mejora la seguridad?"
// ];

// const contactos = {
//     // '50688741295': 'Jeffrey',
//     '50687284141': 'Tatiana',
//     // '50670066087': 'Mariana'
// };

// const estados = {};
// let respuestasGlobales = {};

// const timestamp = generarTimestamp();
// const archivoJSON = `encuestas_${timestamp}.json`;
// const archivoExcel = `encuestas_${timestamp}.xlsx`;

// // Leer archivo JSON si existe
// if (fs.existsSync(archivoJSON)) {
//     try {
//         const datosPrevios = fs.readFileSync(archivoJSON, 'utf-8');
//         respuestasGlobales = JSON.parse(datosPrevios || '{}');
//     } catch {
//         console.warn('⚠️ Archivo JSON dañado, comenzando desde cero.');
//         respuestasGlobales = {};
//     }
// }

// client.on('qr', qr => {
//     console.log('📱 Escanea este QR:');
//     require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', async () => {
//     console.log('✅ Bot listo y enviando preguntas...');

//     for (const numero in contactos) {
//         const nombre = contactos[numero];
//         const chatId = `${numero}@c.us`;

//         estados[chatId] = {
//             indice: 0,
//             respuestas: [],
//             nombre: nombre
//         };

//         const preguntaPersonalizada = `P1. ${nombre}, ${preguntasBase[0]}`;
//         await client.sendMessage(chatId, preguntaPersonalizada);
//         console.log(`📤 Pregunta 1 enviada a ${nombre}`);
//     }
// });

// client.on('message', message => {
//     const chatId = message.from;
//     const estado = estados[chatId];
//     if (!estado) return;

//     const respuesta = message.body.trim();
//     estado.respuestas.push(respuesta);
//     const preguntaRespondida = preguntasBase[estado.indice];

//     // Guardar en JSON y Excel inmediatamente
//     respuestasGlobales[chatId] = {
//         nombre: estado.nombre,
//         respuestas: estado.respuestas
//     };
//     guardarJSON();
//     guardarExcel();

//     estado.indice++;

//     if (estado.indice < preguntasBase.length) {
//         setTimeout(() => {
//             const preguntaNum = estado.indice + 1;
//             const texto = `P${preguntaNum}. ${estado.nombre}, ${preguntasBase[estado.indice]}`;
//             client.sendMessage(chatId, texto);
//         }, 2500); // Espera de 2.5 segundos
//     } else {
//         client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);
//         delete estados[chatId];
//     }
// });

// function generarTimestamp() {
//     const now = new Date();
//     const fecha = now.toISOString().split('T')[0]; // yyyy-mm-dd
//     const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // hh-mm-ss
//     return `${fecha}_${hora}`;
// }

// function guardarJSON() {
//     fs.writeFileSync(archivoJSON, JSON.stringify(respuestasGlobales, null, 2));
// }

// function guardarExcel() {
//     const datos = [];

//     for (const chatId in respuestasGlobales) {
//         const registro = respuestasGlobales[chatId];
//         const fila = {
//             Nombre: registro.nombre,
//             Teléfono: chatId.replace('@c.us', '')
//         };

//         preguntasBase.forEach((pregunta, i) => {
//             fila[`P${i + 1}`] = registro.respuestas[i] || '';
//         });

//         datos.push(fila);
//     }

//     const hoja = XLSX.utils.json_to_sheet(datos);
//     const libro = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(libro, hoja, 'Encuestas');
//     XLSX.writeFile(libro, archivoExcel);
// }

// client.initialize();


//////////////////////////////


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');
// const XLSX = require('xlsx');

// const client = new Client({ authStrategy: new LocalAuth() });

// const preguntasGenerales = [
//   "¿Cuántos años tiene?",
//   "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
//   "¿En qué Estado vive?",
//   "Por favor escriba el nombre de su municipio",
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

// const contactos = {
// //   '50688741295': { nombre: 'Jeffrey', grupo: 'control' },
// //   '50687284141': { nombre: 'Tatiana', grupo: 'control' },
// //   '50670066087': { nombre: 'Mariana', grupo: 'tratamiento' }
//   '5215573567119': { nombre: 'Daniel', grupo: 'tratamiento' },
//   // '5215554032953': { nombre: 'Elisa', grupo: 'tratamiento' },
//   '50670600922': { nombre: 'Andres', grupo: 'tratamiento' }

// };

// const estados = {};
// let respuestasGlobales = {};

// function generarTimestamp() {
//   const now = new Date();
//   const fecha = now.toISOString().split('T')[0];
//   const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//   return `${fecha}_${hora}`;
// }

// const timestamp = generarTimestamp();
// const archivoJSON = `encuestas_${timestamp}.json`;
// const archivoExcel = `encuestas_${timestamp}.xlsx`;

// client.on('qr', qr => {
//   console.log('📱 Escanea este QR:');
//   require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', async () => {
//   console.log('✅ Bot listo y enviando preguntas...');

//   for (const numero in contactos) {
//     const { nombre, grupo } = contactos[numero];
//     const chatId = `${numero}@c.us`;

//     const variantes8 = [...preguntasGrupo[grupo]["8_variantes"]];
//     const orden8 = variantes8.map((texto, index) => ({ index, texto }));

//     // Mezclar las preguntas 8
//     for (let i = orden8.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [orden8[i], orden8[j]] = [orden8[j], orden8[i]];
//     }

//     estados[chatId] = {
//       indice: 0,
//       respuestas: [],
//       nombre,
//       grupo,
//       ordenP8: orden8
//     };

//     const preguntaInicial = `P1. ${nombre}, ${preguntasGenerales[0]}`;
//     await client.sendMessage(chatId, preguntaInicial);
//     console.log(`📤 Pregunta 1 enviada a ${nombre}`);
//   }
// });

// function validarRespuesta(indice, texto) {
//   const num = parseInt(texto);
//   if ([1].includes(indice)) return [1, 2, 3].includes(num);
//   if ([4].includes(indice)) return [1, 2, 3, 4, 5, 99].includes(num);
//   if ([5].includes(indice)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
//   if ([6, 7, 8, 9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
//   return true; // otras preguntas: texto libre
// }

// client.on('message', message => {
//   const chatId = message.from;
//   const estado = estados[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;
//   if (!validarRespuesta(i, respuesta)) {
//     client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
//     return;
//   }

//   estado.respuestas.push(respuesta);
//   estado.indice++;

//   if (estado.indice < preguntasGenerales.length) {
//     const pregunta = `P${estado.indice + 1}. ${estado.nombre}, ${preguntasGenerales[estado.indice]}`;
//     setTimeout(() => client.sendMessage(chatId, pregunta), 2500);

//   } else if (estado.indice === preguntasGenerales.length) {
//     const pregunta7 = preguntasGrupo[estado.grupo][7];
//     const texto = `P7. ${estado.nombre}, ${pregunta7}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);

//   } else if (estado.indice >= preguntasGenerales.length + 1 && estado.indice <= preguntasGenerales.length + 3) {
//     const index8 = estado.indice - (preguntasGenerales.length + 1);
//     const pNum = estado.indice + 1;
//     const texto = `P${pNum}. ${estado.nombre}, ${estado.ordenP8[index8].texto}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);

//   } else {
//     client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);

//     const respuestasOrdenadas = Array(3).fill('');
//     estado.ordenP8.forEach((opcion, idx) => {
//       respuestasOrdenadas[opcion.index] = estado.respuestas[preguntasGenerales.length + 1 + idx];
//     });

//     respuestasGlobales[chatId] = {
//       nombre: estado.nombre,
//       grupo: estado.grupo,
//       respuestas: estado.respuestas.slice(0, preguntasGenerales.length + 1),
//       p8: respuestasOrdenadas
//     };

//     guardarJSON();
//     guardarExcel();

//     delete estados[chatId];
//   }
// });

// function guardarJSON() {
//   fs.writeFileSync(archivoJSON, JSON.stringify(respuestasGlobales, null, 2));
// }

// function guardarExcel() {
//   const datos = [];

//   for (const chatId in respuestasGlobales) {
//     const registro = respuestasGlobales[chatId];
//     const fila = {
//       Nombre: registro.nombre,
//       Telefono: chatId.replace('@c.us', ''),
//       Grupo: registro.grupo
//     };

//     preguntasGenerales.forEach((_, i) => {
//       fila[`P${i + 1}`] = registro.respuestas[i] || '';
//     });

//     fila['P7'] = registro.respuestas[preguntasGenerales.length] || '';
//     fila['P8.A'] = registro.p8[0] || '';
//     fila['P8.B'] = registro.p8[1] || '';
//     fila['P8.C'] = registro.p8[2] || '';

//     datos.push(fila);
//   }

//   const hoja = XLSX.utils.json_to_sheet(datos);
//   const libro = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(libro, hoja, 'Encuestas');
//   XLSX.writeFile(libro, archivoExcel);
// }

// client.initialize();




////////////////////////////////////7


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');
// const XLSX = require('xlsx');

// const client = new Client({ authStrategy: new LocalAuth() });

// // Cargar estados y municipios desde Excel
// const workbook = XLSX.readFile('Estados-Municipios.xlsx');
// const sheet = workbook.Sheets[workbook.SheetNames[0]];
// const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// const estadoMunicipios = {};
// for (let row = 1; row < data.length; row++) {
//   const estado = data[row][0];
//   const municipio = data[row][1];
//   if (!estado || !municipio) continue;
//   if (!estadoMunicipios[estado]) estadoMunicipios[estado] = [];
//   estadoMunicipios[estado].push(municipio);
// }

// const listaEstados = Object.keys(estadoMunicipios);

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

// const contactos = {
// //   '50688741295': { nombre: 'Jeffrey', grupo: 'control' },
// //   '50687284141': { nombre: 'Tatiana', grupo: 'control' },
// //   '50670066087': { nombre: 'Mariana', grupo: 'tratamiento' }
//   // '5215573567119': { nombre: 'Daniel', grupo: 'tratamiento' },
//   // '5215554032953': { nombre: 'Elisa', grupo: 'tratamiento' },
//   '50670600922': { nombre: 'Andres', grupo: 'tratamiento' }

// };

// const estados = {};
// let respuestasGlobales = {};

// function generarTimestamp() {
//   const now = new Date();
//   const fecha = now.toISOString().split('T')[0];
//   const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//   return `${fecha}_${hora}`;
// }

// const timestamp = generarTimestamp();
// const archivoJSON = `encuestas_${timestamp}.json`;
// const archivoExcel = `encuestas_${timestamp}.xlsx`;

// client.on('qr', qr => {
//   console.log('📱 Escanea este QR:');
//   require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', async () => {
//   console.log('✅ Bot listo y enviando preguntas...');

//   let delay = 0;
//   for (const numero in contactos) {
//     const { nombre, grupo } = contactos[numero];
//     const chatId = `${numero}@c.us`;

//     const variantes8 = [...preguntasGrupo[grupo]["8_variantes"]];
//     const orden8 = variantes8.map((texto, index) => ({ index, texto }));
//     for (let i = orden8.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [orden8[i], orden8[j]] = [orden8[j], orden8[i]];
//     }

//     estados[chatId] = {
//       indice: 0,
//       respuestas: [],
//       nombre,
//       grupo,
//       ordenP8: orden8,
//       estadoSeleccionado: '',
//       municipios: []
//     };

//     setTimeout(async () => {
//       const preguntaInicial = `P1. ${nombre}, ${preguntasGenerales[0]}`;
//       await client.sendMessage(chatId, preguntaInicial);
//       console.log(`📤 Pregunta 1 enviada a ${nombre}`);
//     }, delay);

//     delay += 2000;
//   }
// });

// function validarRespuesta(indice, texto, estado = {}) {
//   const num = parseInt(texto);
//   if ([1].includes(indice)) return [1, 2, 3].includes(num);
//   if ([4].includes(indice)) return [1, 2, 3, 4, 5, 99].includes(num);
//   if ([5].includes(indice)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
//   if ([6, 7, 8, 9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
//   if (indice === 2) return num >= 1 && num <= listaEstados.length;
//   if (indice === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
//   return true;
// }

// client.on('message', message => {
//   const chatId = message.from;
//   const estado = estados[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;

//   if (!validarRespuesta(i, respuesta, estado)) {
//     client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
//     return;
//   }

//   if (i === 2) {
//     const index = parseInt(respuesta);
//     estado.estadoSeleccionado = listaEstados[index - 1];
//     estado.municipios = estadoMunicipios[estado.estadoSeleccionado];
//     estado.respuestas.push(estado.estadoSeleccionado);
//   } else if (i === 3) {
//     const index = parseInt(respuesta);
//     const municipio = estado.municipios[index - 1];
//     estado.respuestas.push(municipio);
//   } else {
//     estado.respuestas.push(respuesta);
//   }

//   estado.indice++;

//   if (estado.indice === 2) {
//     let texto = `P3. ${estado.nombre}, escoja el estado de México en el que vive:\n`;
//     listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice === 3) {
//     let texto = `P4. ${estado.nombre}, seleccione el municipio donde vive:\n`;
//     estado.municipios.forEach((m, idx) => texto += `${idx + 1}) ${m}\n`);
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice < preguntasGenerales.length) {
//     const pregunta = `P${estado.indice + 1}. ${estado.nombre}, ${preguntasGenerales[estado.indice]}`;
//     setTimeout(() => client.sendMessage(chatId, pregunta), 2500);
//   } else if (estado.indice === preguntasGenerales.length) {
//     const pregunta7 = preguntasGrupo[estado.grupo][7];
//     const texto = `P7. ${estado.nombre}, ${pregunta7}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice >= preguntasGenerales.length + 1 && estado.indice <= preguntasGenerales.length + 3) {
//     const index8 = estado.indice - (preguntasGenerales.length + 1);
//     const pNum = estado.indice + 1;
//     const texto = `P${pNum}. ${estado.nombre}, ${estado.ordenP8[index8].texto}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else {
//     client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);

//     const respuestasOrdenadas = Array(3).fill('');
//     estado.ordenP8.forEach((opcion, idx) => {
//       respuestasOrdenadas[opcion.index] = estado.respuestas[preguntasGenerales.length + 1 + idx];
//     });

//     respuestasGlobales[chatId] = {
//       nombre: estado.nombre,
//       grupo: estado.grupo,
//       respuestas: estado.respuestas.slice(0, preguntasGenerales.length + 1),
//       p8: respuestasOrdenadas
//     };

//     guardarJSON();
//     guardarExcel();

//     delete estados[chatId];
//   }
// });

// function guardarJSON() {
//   fs.writeFileSync(archivoJSON, JSON.stringify(respuestasGlobales, null, 2));
// }

// function guardarExcel() {
//   const datos = [];

//   for (const chatId in respuestasGlobales) {
//     const registro = respuestasGlobales[chatId];
//     const fila = {
//       Nombre: registro.nombre,
//       Telefono: chatId.replace('@c.us', ''),
//       Grupo: registro.grupo
//     };

//     preguntasGenerales.forEach((_, i) => {
//       fila[`P${i + 1}`] = registro.respuestas[i] || '';
//     });

//     fila['P7'] = registro.respuestas[preguntasGenerales.length] || '';
//     fila['P8.A'] = registro.p8[0] || '';
//     fila['P8.B'] = registro.p8[1] || '';
//     fila['P8.C'] = registro.p8[2] || '';

//     datos.push(fila);
//   }

//   const hoja = XLSX.utils.json_to_sheet(datos);
//   const libro = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(libro, hoja, 'Encuestas');
//   XLSX.writeFile(libro, archivoExcel);
// }

// client.initialize();





///////////


// const { Client, LocalAuth } = require('whatsapp-web.js');
// const fs = require('fs');
// const XLSX = require('xlsx');

// const client = new Client({ authStrategy: new LocalAuth() });

// // Cargar estados y municipios desde Excel
// const workbook = XLSX.readFile('Estados-Municipios.xlsx');
// const sheet = workbook.Sheets[workbook.SheetNames[0]];
// const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// const estadoMunicipios = {};
// for (let row = 1; row < data.length; row++) {
//   const estado = String(data[row][0]).trim();
//   const municipio = String(data[row][1]).trim();
//   if (!estado || !municipio) continue;
//   if (!estadoMunicipios[estado]) estadoMunicipios[estado] = [];
//   estadoMunicipios[estado].push(municipio);
// }

// const listaEstados = Object.keys(estadoMunicipios);

// const preguntasGenerales = [
//   "¿Cuántos años tiene? Debe tener entre 18 y 100 años para responder esta encuesta.",
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

// const contactos = {
// //   '50688741295': { nombre: 'Jeffrey', grupo: 'control' },
// //   '50687284141': { nombre: 'Tatiana', grupo: 'control' },
// //   '50670066087': { nombre: 'Mariana', grupo: 'tratamiento' }
//   // '5215573567119': { nombre: 'Daniel', grupo: 'tratamiento' },
//   // '5215554032953': { nombre: 'Elisa', grupo: 'tratamiento' },
//   '50670600922': { nombre: 'Andres', grupo: 'tratamiento' }

// };


// const estados = {};
// let respuestasGlobales = {};

// function generarTimestamp() {
//   const now = new Date();
//   const fecha = now.toISOString().split('T')[0];
//   const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
//   return `${fecha}_${hora}`;
// }

// const timestamp = generarTimestamp();
// const archivoJSON = `encuestas_${timestamp}.json`;
// const archivoExcel = `encuestas_${timestamp}.xlsx`;

// client.on('qr', qr => {
//   console.log('📱 Escanea este QR:');
//   require('qrcode-terminal').generate(qr, { small: true });
// });

// client.on('ready', async () => {
//   console.log('✅ Bot listo y enviando preguntas...');

//   let delay = 0;
//   for (const numero in contactos) {
//     const { nombre, grupo } = contactos[numero];
//     const chatId = `${numero}@c.us`;

//     const variantes8 = [...preguntasGrupo[grupo]["8_variantes"]];
//     const orden8 = variantes8.map((texto, index) => ({ index, texto }));
//     for (let i = orden8.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [orden8[i], orden8[j]] = [orden8[j], orden8[i]];
//     }

//     estados[chatId] = {
//       indice: 0,
//       respuestas: [],
//       nombre,
//       grupo,
//       ordenP8: orden8,
//       estadoSeleccionado: '',
//       municipios: []
//     };

//     setTimeout(async () => {
//       const preguntaInicial = `P1. ${nombre}, ${preguntasGenerales[0]}`;
//       await client.sendMessage(chatId, preguntaInicial);
//       console.log(`📤 Pregunta 1 enviada a ${nombre}`);
//     }, delay);

//     delay += 2000;
//   }
// });

// function validarRespuesta(indice, texto, estado = {}) {
//   const num = parseInt(texto);
//   if ([0].includes(indice)) return !isNaN(num) && num >= 18 && num <= 100;
//   if ([1].includes(indice)) return [1, 2, 3].includes(num);
//   if ([4].includes(indice)) return [1, 2, 3, 4, 5, 99].includes(num);
//   if ([5].includes(indice)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
//   if ([6, 7, 8, 9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
//   if (indice === 2) return num >= 1 && num <= listaEstados.length;
//   if (indice === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
//   return true;
// }

// client.on('message', message => {
//   const chatId = message.from;
//   const estado = estados[chatId];
//   if (!estado) return;

//   const respuesta = message.body.trim();
//   const i = estado.indice;

//   if (!validarRespuesta(i, respuesta, estado)) {
//     client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
//     return;
//   }

//   if (i === 2) {
//     const index = parseInt(respuesta);
//     estado.estadoSeleccionado = listaEstados[index - 1];
//     estado.municipios = estadoMunicipios[estado.estadoSeleccionado] || [];
//     estado.respuestas.push(estado.estadoSeleccionado);
//   } else if (i === 3) {
//     const index = parseInt(respuesta);
//     const municipio = estado.municipios[index - 1];
//     estado.respuestas.push(municipio);
//   } else {
//     estado.respuestas.push(respuesta);
//   }

//   estado.indice++;

//   if (estado.indice === 2) {
//     let texto = `P3. ${estado.nombre}, escoja el estado de México en el que vive:\n`;
//     listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice === 3) {
//     let texto = `P4. ${estado.nombre}, seleccione el municipio donde vive:\n`;
//     estado.municipios.forEach((m, idx) => texto += `${idx + 1}) ${m}\n`);
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice < preguntasGenerales.length) {
//     const pregunta = `P${estado.indice + 1}. ${estado.nombre}, ${preguntasGenerales[estado.indice]}`;
//     setTimeout(() => client.sendMessage(chatId, pregunta), 2500);
//   } else if (estado.indice === preguntasGenerales.length) {
//     const pregunta7 = preguntasGrupo[estado.grupo][7];
//     const texto = `P7. ${estado.nombre}, ${pregunta7}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else if (estado.indice >= preguntasGenerales.length + 1 && estado.indice <= preguntasGenerales.length + 3) {
//     const index8 = estado.indice - (preguntasGenerales.length + 1);
//     const pNum = estado.indice + 1;
//     const texto = `P${pNum}. ${estado.nombre}, ${estado.ordenP8[index8].texto}`;
//     setTimeout(() => client.sendMessage(chatId, texto), 2500);
//   } else {
//     client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);

//     const respuestasOrdenadas = Array(3).fill('');
//     estado.ordenP8.forEach((opcion, idx) => {
//       respuestasOrdenadas[opcion.index] = estado.respuestas[preguntasGenerales.length + 1 + idx];
//     });

//     respuestasGlobales[chatId] = {
//       nombre: estado.nombre,
//       grupo: estado.grupo,
//       respuestas: estado.respuestas.slice(0, preguntasGenerales.length + 1),
//       p8: respuestasOrdenadas
//     };

//     guardarJSON();
//     guardarExcel();

//     delete estados[chatId];
//   }
// });

// function guardarJSON() {
//   fs.writeFileSync(archivoJSON, JSON.stringify(respuestasGlobales, null, 2));
// }

// function guardarExcel() {
//   const datos = [];

//   for (const chatId in respuestasGlobales) {
//     const registro = respuestasGlobales[chatId];
//     const fila = {
//       Nombre: registro.nombre,
//       Telefono: chatId.replace('@c.us', ''),
//       Grupo: registro.grupo
//     };

//     preguntasGenerales.forEach((_, i) => {
//       fila[`P${i + 1}`] = registro.respuestas[i] || '';
//     });

//     fila['P7'] = registro.respuestas[preguntasGenerales.length] || '';
//     fila['P8.A'] = registro.p8[0] || '';
//     fila['P8.B'] = registro.p8[1] || '';
//     fila['P8.C'] = registro.p8[2] || '';

//     datos.push(fila);
//   }

//   const hoja = XLSX.utils.json_to_sheet(datos);
//   const libro = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(libro, hoja, 'Encuestas');
//   XLSX.writeFile(libro, archivoExcel);
// }

// client.initialize();

///
////
///

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const XLSX = require('xlsx');

const client = new Client({ authStrategy: new LocalAuth() });

// Cargar estados y municipios desde Excel
const workbook = XLSX.readFile('Estados-Municipios.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const estadoMunicipios = {};
for (let row = 1; row < data.length; row++) {
  const estado = String(data[row][0]).trim();
  const municipio = String(data[row][1]).trim();
  if (!estado || !municipio) continue;
  if (!estadoMunicipios[estado]) estadoMunicipios[estado] = [];
  estadoMunicipios[estado].push(municipio);
}

const listaEstados = Object.keys(estadoMunicipios);

const preguntasGenerales = [
  "¿Cuántos años tiene?",
  "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
  "Escoja el estado de México en el que vive:",
  "Seleccione el municipio donde vive:",
  "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC",
  "¿Hasta qué año aprobó en la escuela?\n1) Ninguno\n2) Preescolar\n3) Primaria\n4) Secundaria\n5) Carrera técnica con secundaria terminada\n6) Normal básica\n7) Preparatoria o bachillerato\n8) Carrera técnica con preparatoria\n9) Licenciatura o profesional\n10) Maestría o doctorado\n99) NC"
];

const preguntasGrupo = {
  tratamiento: {
    7: "El gobierno de Estados Unidos ha amenazado con imponer nuevos aranceles a México, los cuales afectarían mucho la economía de nuestro país, a menos que México acepte negociar un nuevo acuerdo de seguridad. En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
    "8_variantes": [
      "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
      "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir que Estados Unidos use drones para vigilar a los carteles mexicanos?",
      "¿Y qué tan en contra o a favor estaría de que una de las condiciones de dicho acuerdo fuera que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
    ]
  },
  control: {
    7: "En una escala de 0 al 10 (siendo 0 totalmente en contra y 10 totalmente a favor) ¿Qué tan en contra o a favor está de que México negocie un acuerdo de seguridad con Estados Unidos?",
    "8_variantes": [
      "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a extraditar los narcotraficantes más buscados, es decir enviarlos a Estados Unidos?",
      "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir que Estados Unidos use drones para atacar a los carteles mexicanos?",
      "¿Y qué tan en contra o a favor estaría de que se negocie un acuerdo en el que México se comprometa a permitir la entrada de tropas estadounidenses en territorio mexicano para asegurar la frontera?"
    ]
  }
};

const contactos = {
//   '50688741295': { nombre: 'Jeffrey', grupo: 'control' },
//   '50687284141': { nombre: 'Tatiana', grupo: 'control' },
//   '50670066087': { nombre: 'Mariana', grupo: 'tratamiento' }
  // '5215573567119': { nombre: 'Daniel', grupo: 'tratamiento' },
  // '5215554032953': { nombre: 'Elisa', grupo: 'tratamiento' },
  '50670600922': { nombre: 'Andres', grupo: 'tratamiento' }

};

const estados = {};
let respuestasGlobales = {};

function generarTimestamp() {
  const now = new Date();
  const fecha = now.toISOString().split('T')[0];
  const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${fecha}_${hora}`;
}

const timestamp = generarTimestamp();
const archivoJSON = `encuestas_${timestamp}.json`;
const archivoExcel = `encuestas_${timestamp}.xlsx`;

client.on('qr', qr => {
  console.log('📱 Escanea este QR:');
  require('qrcode-terminal').generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ Bot listo y enviando introducción...');

  let delay = 0;
  for (const numero in contactos) {
    const { nombre, grupo } = contactos[numero];
    const chatId = `${numero}@c.us`;

    const variantes8 = [...preguntasGrupo[grupo]["8_variantes"]];
    const orden8 = variantes8.map((texto, index) => ({ index, texto }));
    for (let i = orden8.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orden8[i], orden8[j]] = [orden8[j], orden8[i]];
    }

    estados[chatId] = {
      indice: -1,
      respuestas: [],
      nombre,
      grupo,
      ordenP8: orden8,
      estadoSeleccionado: '',
      municipios: []
    };

    setTimeout(async () => {
      const intro = `Hola ${nombre}, bienvenido a la encuesta realizada por Otrera. A continuación se presenta un total de ${preguntasGenerales.length + 4} preguntas que deberá responder como se indica. Si desea regresar a una pregunta anterior y cambiar su respuesta, escriba el mensaje "Regresar". ${nombre}, cuando desee comenzar la encuesta, por favor digite la palabra "Comenzar" o la letra "C" a continuación:`;
      await client.sendMessage(chatId, intro);
    }, delay);

    delay += 2000;
  }
});

client.on('message', message => {
  const chatId = message.from;
  const estado = estados[chatId];
  if (!estado) return;

  const respuesta = message.body.trim();

  if (estado.indice === -1) {
    if (/^comenzar$/i.test(respuesta) || /^c$/i.test(respuesta)) {
      estado.indice = 0;
    } else {
      client.sendMessage(chatId, `Por favor escriba "Comenzar" o "C" para iniciar la encuesta.`);
      return;
    }
  } else if (/^regresar$/i.test(respuesta)) {
    if (estado.indice > 0) {
      estado.indice--;
      estado.respuestas.pop();
    } else {
      client.sendMessage(chatId, `Ya estás en la primera pregunta.`);
      return;
    }
  } else {
    const i = estado.indice;
    if (!validarRespuesta(i, respuesta, estado)) {
      client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
      return;
    }

    if (i === 2) {
      const index = parseInt(respuesta);
      estado.estadoSeleccionado = listaEstados[index - 1];
      estado.municipios = estadoMunicipios[estado.estadoSeleccionado];
      estado.respuestas.push(estado.estadoSeleccionado);
    } else if (i === 3) {
      const index = parseInt(respuesta);
      const municipio = estado.municipios[index - 1];
      estado.respuestas.push(municipio);
    } else {
      estado.respuestas.push(respuesta);
    }

    estado.indice++;
  }

  const i = estado.indice;
  if (i === 2) {
    let texto = `P3. ${estado.nombre}, escoja el estado de México en el que vive:\n`;
    listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (i === 3) {
    let texto = `P4. ${estado.nombre}, seleccione el municipio donde vive:\n`;
    estado.municipios.forEach((m, idx) => texto += `${idx + 1}) ${m}\n`);
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (i < preguntasGenerales.length) {
    const pregunta = `P${i + 1}. ${estado.nombre}, ${preguntasGenerales[i]}`;
    setTimeout(() => client.sendMessage(chatId, pregunta), 2500);
  } else if (i === preguntasGenerales.length) {
    const pregunta7 = preguntasGrupo[estado.grupo][7];
    const texto = `P7. ${estado.nombre}, ${pregunta7}`;
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (i >= preguntasGenerales.length + 1 && i <= preguntasGenerales.length + 3) {
    const index8 = i - (preguntasGenerales.length + 1);
    const pNum = i + 1;
    const texto = `P${pNum}. ${estado.nombre}, ${estado.ordenP8[index8].texto}`;
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else {
    client.sendMessage(chatId, `✅ ¡Gracias ${estado.nombre} por completar la encuesta!`);

    const respuestasOrdenadas = Array(3).fill('');
    estado.ordenP8.forEach((opcion, idx) => {
      respuestasOrdenadas[opcion.index] = estado.respuestas[preguntasGenerales.length + 1 + idx];
    });

    respuestasGlobales[chatId] = {
      nombre: estado.nombre,
      grupo: estado.grupo,
      respuestas: estado.respuestas.slice(0, preguntasGenerales.length + 1),
      p8: respuestasOrdenadas
    };

    guardarJSON();
    guardarExcel();

    delete estados[chatId];
  }
});

function validarRespuesta(indice, texto, estado = {}) {
  const num = parseInt(texto);
  if ([1].includes(indice)) return [1, 2, 3].includes(num);
  if ([4].includes(indice)) return [1, 2, 3, 4, 5, 99].includes(num);
  if ([5].includes(indice)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
  if ([6, 7, 8, 9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
  if (indice === 2) return num >= 1 && num <= listaEstados.length;
  if (indice === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
  return true;
}

function guardarJSON() {
  fs.writeFileSync(archivoJSON, JSON.stringify(respuestasGlobales, null, 2));
}

function guardarExcel() {
  const datos = [];

  for (const chatId in respuestasGlobales) {
    const registro = respuestasGlobales[chatId];
    const fila = {
      Nombre: registro.nombre,
      Telefono: chatId.replace('@c.us', ''),
      Grupo: registro.grupo
    };

    preguntasGenerales.forEach((_, i) => {
      fila[`P${i + 1}`] = registro.respuestas[i] || '';
    });

    fila['P7'] = registro.respuestas[preguntasGenerales.length] || '';
    fila['P8.A'] = registro.p8[0] || '';
    fila['P8.B'] = registro.p8[1] || '';
    fila['P8.C'] = registro.p8[2] || '';

    datos.push(fila);
  }

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Encuestas');
  XLSX.writeFile(libro, archivoExcel);
}

client.initialize();
