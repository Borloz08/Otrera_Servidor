const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Ruta del archivo de credenciales descargado desde Google Cloud
const CREDENTIALS_PATH = path.join(__dirname, 'whatsapp-otrera-8c8fc9174669.json');

// ID de la hoja de cálculo 
const SPREADSHEET_ID = '1mTQPJBOCKFo6UuDzBauqQpvW5faoQK_mcgxlK529mIM';

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function escribirUsuario({ nombre, pais, telefono }) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const numeroNormalizado = normalizarNumero(pais, telefono);
  const sheetName = 'Hoja 1';

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A2:C`,
  });

  const filas = data.values || [];
  const index = filas.findIndex(row => row[2] === numeroNormalizado);

  const fila = [nombre, pais, numeroNormalizado];

  if (index >= 0) {
    // Si ya existe, actualizar
    const range = `${sheetName}!A${index + 2}:C${index + 2}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [fila] },
    });
  } else {
    // Si no existe, agregar
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:C`,
      valueInputOption: 'RAW',
      requestBody: { values: [fila] },
    });
  }

  return numeroNormalizado;
}

function normalizarNumero(pais, numero) {
  const codigos = { 'Costa Rica': '506', 'México': '521' };
  numero = numero.replace(/[^0-9]/g, '');
  if (!numero.startsWith(codigos[pais])) {
    return codigos[pais] + numero;
  }
  return numero;
}

module.exports = { escribirUsuario };