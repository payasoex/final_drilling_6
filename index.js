const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bienvenido a Anime Server');
  } else if (pathname === '/list') {
    // Listar todos los animes
    const animeData = JSON.parse(fs.readFileSync('./anime.json', 'utf8'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(animeData));
  } else if (pathname === '/anime') {

// Leer un anime específico por id o nombre
    const animeData = JSON.parse(fs.readFileSync('./anime.json', 'utf8'));

// Obtener los parámetros de la URL
    const queryParams = parsedUrl.query;
    const animeId = queryParams.id;
    const animeName = queryParams.name;

    if (animeId) {
      const anime = animeData[animeId];
      if (anime) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(anime));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Anime no encontrado');
      }
    } else if (animeName) {
      const anime = Object.values(animeData).find(
        (anime) => anime.nombre.toLowerCase() === animeName.toLowerCase()
      );
      if (anime) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(anime));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Anime no encontrado');
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Solictud invalida');
    }
  } else if (pathname === '/create') {
    // Crear un nuevo anime
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const newAnime = JSON.parse(body);
          const animeData = JSON.parse(fs.readFileSync('./anime.json', 'utf8'));

// Generar un nuevo ID para el anime
          const newId = Object.keys(animeData).length + 1;
          newAnime.año = newAnime.año.toString(); // Convertir año a string

// Agregar el nuevo anime al objeto animeData
          animeData[newId] = newAnime;

// Guardar los datos actualizados en el archivo anime.json
          fs.writeFileSync('./anime.json', JSON.stringify(animeData, null, 2));

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newAnime));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('JSON data invalida');
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Metodo no permitido');
    }
  } else if (pathname === '/update') {
// Actualizar un anime existente
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const updatedAnime = JSON.parse(body);
          const animeData = JSON.parse(fs.readFileSync('./anime.json', 'utf8'));

          const animeId = updatedAnime.id;
          if (!animeId || !animeData[animeId]) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Anime no encontrado');
          } else {
            updatedAnime.año = updatedAnime.año.toString(); // Convertir año a string
            animeData[animeId] = updatedAnime;

// Guardar los datos actualizados en el archivo anime.json
            fs.writeFileSync('./anime.json', JSON.stringify(animeData, null, 2));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedAnime));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('JSON data invalida');
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Metodo no permitido');
    }
  } else if (pathname === '/delete') {
// Eliminar un anime existente
    if (req.method === 'DELETE') {
      const queryParams = parsedUrl.query;
      const animeId = queryParams.id;

      if (!animeId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      } else {
        const animeData = JSON.parse(fs.readFileSync('./anime.json', 'utf8'));

        if (!animeData[animeId]) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Anime no encontrado');
        } else {
          const deletedAnime = animeData[animeId];
          delete animeData[animeId];

// Guardar los datos actualizados en el archivo anime.json
          fs.writeFileSync('./anime.json', JSON.stringify(animeData, null, 2));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(deletedAnime));
        }
      }
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Metodo no permitido');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 No encontrado');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});


module.exports = server;