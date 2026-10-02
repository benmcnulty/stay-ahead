import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assets = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'application/javascript; charset=utf-8'],
};

/** Serve only the demonstration page and its assets on loopback. */
export function startPreview(port = Number(process.env.PORT || 4173)) {
  const server = createServer((request, response) => {
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end('Method not allowed');
      return;
    }
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    const asset = assets[pathname];
    if (!asset) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': asset[1] });
    response.end(readFileSync(join(root, 'src', asset[0])));
  });
  server.listen(port, '127.0.0.1');
  return server;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const server = startPreview();
  server.once('listening', () => {
    process.stdout.write(
      `Stay Ahead preview: http://127.0.0.1:${server.address().port}\n`
    );
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
}
