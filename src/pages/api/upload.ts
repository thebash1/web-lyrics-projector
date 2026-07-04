import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  // read the user that ngrok inject on header 
  const username = request.headers.get('x-user-name');

  if (!username) {
    return new Response(
      JSON.stringify({ error: 'Acceso denegado: Usuario no identificado por el proxy.' }), 
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se envió ningún archivo.' }), { status: 400 });
    }

    // dynamically define the directory path based on the user
    // his will save the file to: ./uploads/user01/file.mp3 (for example)
    const uploadDir = path.join(process.cwd(), 'uploads', username);
    
    // search if exist the folder and if not create it
    await fs.mkdir(uploadDir, { recursive: true });

    // write files on folder assign for user with session active 
    const filePath = path.join(uploadDir, file.name);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return new Response(
      JSON.stringify({ message: `Archivo subido con éxito a la carpeta de ${username}` }), 
      { status: 200 }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno al guardar el archivo.' }), { status: 500 });
  }
};
