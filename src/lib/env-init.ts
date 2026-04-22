// Utility for absolute path resolution that works in Edge (mocked) and Node
export function getAbsolutePath(relativePath: string): string {
    // Si estamos en el navegador o runtime sin process/path
    if (typeof process === 'undefined' || !process.cwd) {
        return relativePath;
    }

    // Solo usamos 'path' si estamos en Node
    try {
        const path = require('path');
        return path.resolve(process.cwd(), relativePath);
    } catch (e) {
        return relativePath;
    }
}

export function initEnv() {
  if (typeof process === 'undefined') return;

  let url = process.env.DATABASE_URL;

  if (!url || String(url).includes("undefined") || String(url).trim() === "") {
    const absPath = getAbsolutePath('dev.db');
    url = `file:${absPath}`;
    process.env.DATABASE_URL = url;
  } else if (url.startsWith('file:./')) {
    const absPath = getAbsolutePath(url.replace('file:./', ''));
    url = `file:${absPath}`;
    process.env.DATABASE_URL = url;
  }
}

// No ejecutar automáticamente para evitar problemas en Edge
// initEnv()
