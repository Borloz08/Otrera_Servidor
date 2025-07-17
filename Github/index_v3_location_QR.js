const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const XLSX = require('xlsx');

const client = new Client({ authStrategy: new LocalAuth() });

// Each QR code may be used by up to N_PHONES_PER_CODE unique phone numbers.
const N_PHONES_PER_CODE = 5;
const codigosFile = 'codigos.json';

function cargarCodigos() {
  try {
    return JSON.parse(fs.readFileSync(codigosFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function guardarCodigos() {
  fs.writeFileSync(codigosFile, JSON.stringify(codigosUsados, null, 2));
}

const codigosUsados = cargarCodigos();

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

const estadoCentros = {
  "Aguascalientes": [21.8853, -102.2916],
  "Baja California": [32.6245, -115.4523],
  "Baja California Sur": [24.1426, -110.3128],
  "Campeche": [19.845, -90.523],
  "Chiapas": [16.7524, -93.116],
  "Chihuahua": [28.632, -106.069],
  "Ciudad de México": [19.4326, -99.1332],
  "Coahuila": [25.4232, -101.0053],
@@ -163,54 +181,93 @@ client.on('ready', async () => {
      estadoSeleccionado: '',
      municipios: []
    };

    setTimeout(async () => {
      const preguntaInicial = `P1. ${nombre}, ${preguntasGenerales[0]}`;
      await client.sendMessage(chatId, preguntaInicial);
      console.log(`📤 Pregunta 1 enviada a ${nombre}`);
    }, delay);

    delay += 2000;
  }
});

function validarRespuesta(indice, texto, estado = {}) {
  const num = parseInt(texto);
  if ([0].includes(indice)) return !isNaN(num) && num >= 18 && num <= 100;
  if ([1].includes(indice)) return [1, 2, 3].includes(num);
  if ([4].includes(indice)) return [1, 2, 3, 4, 5, 99].includes(num);
  if ([5].includes(indice)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99].includes(num);
  if ([6, 7, 8, 9].includes(indice)) return !isNaN(num) && num >= 0 && num <= 10;
  if (indice === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
  return true;
}

client.on('message', message => {
client.on('message', async message => {
  const chatId = message.from;
  const estado = estados[chatId];
  if (!estado) return;
  let estado = estados[chatId];

  if (!estado) {
    const codigo = message.body.trim();
    const usados = codigosUsados[codigo] || [];
    if (!usados.includes(chatId) && usados.length >= N_PHONES_PER_CODE) {
      await client.sendMessage(chatId, '❌ Este código ya alcanzó el máximo de teléfonos permitidos.');
      return;
    }

    const contact = await message.getContact();
    const nombre = contact.pushname || contact.name || 'Participante';
    const grupo = Math.random() < 0.5 ? 'tratamiento' : 'control';

    const variantes8 = [...preguntasGrupo[grupo]["8_variantes"]];
    const orden8 = variantes8.map((texto, index) => ({ index, texto }));
    for (let i = orden8.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orden8[i], orden8[j]] = [orden8[j], orden8[i]];
    }

    estados[chatId] = {
      indice: 0,
      respuestas: [],
      nombre,
      grupo,
      ordenP8: orden8,
      estadoSeleccionado: '',
      municipios: [],
      codigo
    };

    if (!usados.includes(chatId)) {
      usados.push(chatId);
      codigosUsados[codigo] = usados;
      guardarCodigos();
    }

    await client.sendMessage(chatId, `P1. ${nombre}, ${preguntasGenerales[0]}`);
    return;
  }

  const respuesta = message.body.trim();
  const i = estado.indice;

  if (i !== 2 && !validarRespuesta(i, respuesta, estado)) {
    client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
    return;
  }

  if (i === 2) {
    if (message.type !== 'location' || !message.location) {
      client.sendMessage(chatId, '❌ Por favor envíe su ubicación usando la opción de compartir ubicación.');
      return;
    }
    const { latitude, longitude } = message.location;
    const estadoNombre = detectarEstadoPorUbicacion(latitude, longitude);
    if (!estadoNombre) {
      client.sendMessage(chatId, '❌ No se pudo determinar su estado. Intente enviando nuevamente su ubicación.');
      return;
    }
    estado.estadoSeleccionado = estadoNombre;
    estado.municipios = estadoMunicipios[estadoNombre] || [];
    estado.respuestas.push(estadoNombre);
  } else if (i === 3) {
    const index = parseInt(respuesta);
@@ -230,70 +287,72 @@ client.on('message', message => {
    estado.municipios.forEach((m, idx) => texto += `${idx + 1}) ${m}\n`);
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (estado.indice < preguntasGenerales.length) {
    const pregunta = `P${estado.indice + 1}. ${estado.nombre}, ${preguntasGenerales[estado.indice]}`;
    setTimeout(() => client.sendMessage(chatId, pregunta), 2500);
  } else if (estado.indice === preguntasGenerales.length) {
    const pregunta7 = preguntasGrupo[estado.grupo][7];
    const texto = `P7. ${estado.nombre}, ${pregunta7}`;
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (estado.indice >= preguntasGenerales.length + 1 && estado.indice <= preguntasGenerales.length + 3) {
    const index8 = estado.indice - (preguntasGenerales.length + 1);
    const pNum = estado.indice + 1;
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
      codigo: estado.codigo,
      respuestas: estado.respuestas.slice(0, preguntasGenerales.length + 1),
      p8: respuestasOrdenadas
    };

    guardarJSON();
    guardarExcel();

    delete estados[chatId];
  }
});

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
      Grupo: registro.grupo,
      Codigo: registro.codigo
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
