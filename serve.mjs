import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
};

const server = createServer(async (req, res) => {
  // Parse URL and strip query strings
  const { pathname } = parse(req.url);

  // Resolve file path
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = join(__dirname, 'index.html');
  } else {
    filePath = join(__dirname, pathname);
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const data = await readFile(filePath);
    // Cache static assets (CSS, JS, images) for 1 hour; HTML no-cache
    const cacheControl = ext === '.html' || ext === ''
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=3600';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  } catch {
    // 404 page
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — AVSDevOps</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
  <div>
    <div style="font-size:72px;font-weight:700;font-family:var(--font-display);color:rgb(var(--accent));margin-bottom:16px;">404</div>
    <h1 style="font-size:24px;margin-bottom:8px;">Page not found</h1>
    <p style="margin-bottom:24px;">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" class="btn btn-primary">Back to Home</a>
  </div>
  <script src="/js/main.js"></script>
</body>
</html>`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ AVSDevOps server running at http://localhost:${PORT}`);
  console.log(`  Pages: / /pages/curriculum.html /pages/stories.html /pages/instructor.html /pages/contact.html`);
});
