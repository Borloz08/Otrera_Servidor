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

const estadoCentros = {
  "Aguascalientes": [21.8853, -102.2916],
  "Baja California": [32.6245, -115.4523],
  "Baja California Sur": [24.1426, -110.3128],
  "Campeche": [19.845, -90.523],
  "Chiapas": [16.7524, -93.116],
  "Chihuahua": [28.632, -106.069],
  "Ciudad de México": [19.4326, -99.1332],
  "Coahuila": [25.4232, -101.0053],
  "Colima": [19.2433, -103.7241],
  "Durango": [24.0277, -104.6532],
  "Estado de México": [19.2826, -99.6557],
  "Guanajuato": [21.019, -101.257],
  "Guerrero": [17.5506, -99.5058],
  "Hidalgo": [20.1011, -98.7591],
  "Jalisco": [20.6597, -103.3496],
  "Michoacán": [19.7008, -101.196],
  "Morelos": [18.9242, -99.2216],
  "Nayarit": [21.5058, -104.8956],
  "Nuevo León": [25.6866, -100.3161],
  "Oaxaca": [17.0732, -96.7266],
  "Puebla": [19.0413, -98.2062],
  "Querétaro": [20.5888, -100.3899],
  "Quintana Roo": [18.5248, -88.3058],
  "San Luis Potosí": [22.1564, -100.9855],
  "Sinaloa": [24.8091, -107.394],
  "Sonora": [29.0729, -110.9559],
  "Tabasco": [17.989, -92.929],
  "Tamaulipas": [23.7369, -99.1411],
  "Tlaxcala": [19.3139, -98.2407],
  "Veracruz": [19.5438, -96.9102],
  "Yucatán": [20.9674, -89.5926],
  "Zacatecas": [22.7709, -102.5832]
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function detectarEstadoPorUbicacion(lat, lon) {
  let mejor = null;
  let mejorDist = Infinity;
  for (const [estado, [elat, elon]] of Object.entries(estadoCentros)) {
    const d = haversine(lat, lon, elat, elon);
    if (d < mejorDist) {
      mejorDist = d;
      mejor = estado;
    }
  }
  return mejor;
}

const preguntasGenerales = [
  "¿Cuántos años tiene? Debe tener entre 18 y 100 años para responder esta encuesta.",
  "Por favor indique su género\n1) Hombre\n2) Mujer\n3) Otro",
  "Escoja el estado de México en el que vive:",
  "Comparta su ubicación actual para verificar su estado:",
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
@@ -98,86 +159,93 @@ client.on('ready', async () => {
      respuestas: [],
      nombre,
      grupo,
      ordenP8: orden8,
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
  if (indice === 2) return num >= 1 && num <= listaEstados.length;
  if (indice === 3 && estado.municipios) return num >= 1 && num <= estado.municipios.length;
  return true;
}

client.on('message', message => {
  const chatId = message.from;
  const estado = estados[chatId];
  if (!estado) return;

  const respuesta = message.body.trim();
  const i = estado.indice;

  if (!validarRespuesta(i, respuesta, estado)) {
  if (i !== 2 && !validarRespuesta(i, respuesta, estado)) {
    client.sendMessage(chatId, `❌ Respuesta inválida. Por favor responda con una opción válida.`);
    return;
  }

  if (i === 2) {
    const index = parseInt(respuesta);
    estado.estadoSeleccionado = listaEstados[index - 1];
    estado.municipios = estadoMunicipios[estado.estadoSeleccionado] || [];
    estado.respuestas.push(estado.estadoSeleccionado);
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
    const municipio = estado.municipios[index - 1];
    estado.respuestas.push(municipio);
  } else {
    estado.respuestas.push(respuesta);
  }

  estado.indice++;

  if (estado.indice === 2) {
    let texto = `P3. ${estado.nombre}, escoja el estado de México en el que vive:\n`;
    listaEstados.forEach((e, idx) => texto += `${idx + 1}) ${e}\n`);
    const texto = `P3. ${estado.nombre}, ${preguntasGenerales[2]}`;
    setTimeout(() => client.sendMessage(chatId, texto), 2500);
  } else if (estado.indice === 3) {
    let texto = `P4. ${estado.nombre}, seleccione el municipio donde vive:\n`;
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
