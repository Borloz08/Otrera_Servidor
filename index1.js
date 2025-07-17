const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// Configuración del cliente de WhatsApp
const client = new Client({ authStrategy: new LocalAuth() });
const encuestas = {};

// --- Configuración de Google Sheets ---
const SHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';
const GOOGLE_CREDENTIALS = require('./whatsapp-otrera-8c8fc9174669.json');

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

async function guardarUsuario(nombre, pais, telefono) {
  const codigos = { 'Costa Rica': '506', 'México': '521' };
  const numero = telefono.replace(/\D/g, '');
  const telefonoFormateado = numero.startsWith(codigos[pais])
    ? numero
    : codigos[pais] + numero;

  const grupo = Math.random() < 0.5 ? 'control' : 'tratamiento';

  // Obtener todas las filas actuales
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Usuarios!A2:D',
  });

  const filas = res.data.values || [];
  const index = filas.findIndex(f => f[2] === telefonoFormateado);

  if (index !== -1) {
    // Sobrescribir
    filas[index] = [nombre, pais, telefonoFormateado, grupo];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Usuarios!A${index + 2}:D${index + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [filas[index]] }
    });
  } else {
    // Insertar
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Usuarios!A2:D',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[nombre, pais, telefonoFormateado, grupo]]
      }
    });
  }

  return { telefono: telefonoFormateado, grupo };
}

// --- Servidor Express ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/registrar', async (req, res) => {
  const { nombre, pais, telefono } = req.body;
  if (!nombre || !pais || !telefono) {
    return res.status(400).send('Faltan datos');
  }

  try {
    const { telefono: numero, grupo } = await guardarUsuario(nombre, pais, telefono);
    iniciarEncuesta(numero, nombre, grupo);
    res.send('Registrado y encuesta iniciada');
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).send('Error interno al registrar');
  }
});

const preguntasGenerales = [
  "¿Cuántos años tiene?",
  "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
  "¿Cuál es su estado civil?\n1) Soltero\n2) Casado\n3) Divorciado\n4) Viudo\n5) Cónyuge\n99) NC"
];

// Puedes extender preguntasGrupo si deseas usar lógica de tratamiento/control
function iniciarEncuesta(numero, nombre, grupo) {
  const chatId = `${numero}@c.us`;
  encuestas[chatId] = {
    nombre,
    grupo,
    indice: 0,
    respuestas: []
  };

  const saludo = `Hola ${nombre}, bienvenido a la encuesta realizada por Otrera.\nSe presentarán ${preguntasGenerales.length} preguntas. Si deseas regresar a una pregunta anterior escribe "Regresar".\n\nCuando desees comenzar, escribe "Comenzar" o "C"`;
  client.sendMessage(chatId, saludo);
}

// --- Bot de WhatsApp ---
client.on('message', async message => {
  const chatId = message.from;
  const estado = encuestas[chatId];
  if (!estado) return;

  const respuesta = message.body.trim();
  const i = estado.indice;

  if (i === 0 && /^(comenzar|c)$/i.test(respuesta)) {
    estado.indice = 1;
    client.sendMessage(chatId, `P1. ${preguntasGenerales[0]}`);
    return;
  }

  if (/^regresar$/i.test(respuesta)) {
    if (estado.indice > 1) {
      estado.indice--;
      estado.respuestas.pop();
      client.sendMessage(chatId, `P${estado.indice}. ${preguntasGenerales[estado.indice - 1]}`);
    } else {
      client.sendMessage(chatId, 'Ya estás en la primera pregunta.');
    }
    return;
  }

  if (i > 0 && i <= preguntasGenerales.length) {
    estado.respuestas.push(respuesta);
    estado.indice++;
    if (estado.indice <= preguntasGenerales.length) {
      client.sendMessage(chatId, `P${estado.indice}. ${preguntasGenerales[estado.indice - 1]}`);
    } else {
      client.sendMessage(chatId, '✅ ¡Gracias por completar la encuesta!');
      delete encuestas[chatId];
    }
  }
});

// --- Inicialización del bot y servidor ---
client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ Bot de WhatsApp listo'));
client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor web corriendo en http://localhost:${PORT}`);
});
