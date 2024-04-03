/**
 * Escriba una aplicación cliente-servidor que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. La ruta donde se encuentra el fichero debe ser un parámetro pasado al cliente desde la línea de comandos.

Lleve a cabo el ejercicio anterior de las siguientes maneras:

    Haciendo uso del método pipe de un Stream para poder redirigir la salida de un comando (cat) hacia otro (wc).
    [OPCIONAL]: Sin hacer uso del método pipe, solamente creando los subprocesos necesarios de ambos comandos y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

Para lo anterior, se recomienda leer la documentación de Stream. Piense que la propiedad stdin de un objeto ChildProcess es un Stream de escritura, mientras que su propiedad stdout es un Stream de lectura, tal y como hemos visto en clase.

Por último, programe defensivamente, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su programa. Por ejemplo, ¿qué sucedería si indica desde la línea de comandos un fichero que no existe o una opción no válida?
Como entrega de esta tarea deberá indicar el enlace al repositorio GitHub con los ejercicios de evaluación solicitados.
 */

import net from 'net';
import {spawn} from 'child_process';
import fs from 'fs';

net.createServer((connection) => {
  console.log('A client has connected.');

  let fileName = '';
  connection.on('data', (dataChunk) => {

    fileName += dataChunk;

    const filePath = `/home/usuario/ejerciciosPE/p10/src/${fileName}`;
    if (!fs.existsSync(filePath)) {
      throw new Error('No se encuentra el archivo.')
    } else {
      const cat = spawn('cat', [filePath]);
      const wc = spawn('wc', ['-c']);
      cat.stdout.pipe(wc.stdin);
    
      let wcOutput = '';
      wc.stdout.on('data', (piece) => {
        wcOutput += piece;
      });
    
      wc.on('close', () => {
        connection.write(JSON.stringify(`"File": ${fileName}, "CharNum": ${wcOutput}`));
        connection.end();
      });
    }

  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
