// api/registrar.js

import { writeFile, existsSync, readFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import xlsx from 'xlsx';

const writeFileAsync = promisify(writeFile);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, pais, telefono } = req.body;

  if (!nombre || !pais || !telefono) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Asignar grupo aleatorio
  const grupo = Math.random() < 0.5 ? 'tratamiento' : 'control';

  const nuevoRegistro = {
    Fecha: new Date().toLocaleString(),
    Nombre: nombre.trim(),
    País: pais.trim(),
    Teléfono: telefono.trim(),
    Grupo: grupo
  };

  const filePath = path.resolve('./', 'registros.xlsx');

  let workbook;
  let worksheet;
  let datos = [];

  if (existsSync(filePath)) {
    const buffer = readFileSync(filePath);
    workbook = xlsx.read(buffer, { type: 'buffer' });
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    datos = xlsx.utils.sheet_to_json(worksheet);
  } else {
    workbook = xlsx.utils.book_new();
  }

  datos.push(nuevoRegistro);
  const nuevaHoja = xlsx.utils.json_to_sheet(datos);
  xlsx.utils.book_append_sheet(workbook, nuevaHoja, 'Registros');

  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await writeFileAsync(filePath, buffer);

  return res.status(200).json({ success: true, grupo });
}
