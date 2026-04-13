# Documentación Técnica - SAE SaeSoft (Tres de Febrero)

Este software ha sido diseñado para digitalizar el proceso de remitos y control del Servicio Alimentario Escolar de Tres de Febrero.

## Stack Tecnológico
- **Framework:** Next.js 15+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **ORM:** Prisma
- **Base de Datos:** SQLite (para desarrollo)
- **Autenticación:** NextAuth.js v5

## Estructura de Usuarios y Roles
1. **ADMIN:** Acceso total. Gestión de usuarios y asignación de proveedores a escuelas.
2. **STAFF (Administrativo):** Gestión de menús, aprobación de solicitudes de cupos y reclamos, y control de remitos.
3. **PROVIDER (Proveedor):** Visualización de escuelas a cargo, cupos asignados, menú semanal con gramajes y creación de remitos digitales.
4. **SCHOOL (Escuela):** Recepción y firma digital de remitos, solicitud de cambios de cupo y carga de reclamos.

## Funcionalidades Clave
- **Firma Digital:** Proceso simplificado de aceptación en escuelas que registra la fecha y el usuario.
- **Flujo de Cupos:** Las escuelas solicitan cambios, el administrativo aprueba y la base de datos se actualiza automáticamente, notificando al proveedor.
- **Remitos Digitales:** Estandarizados para una carga rápida por parte del proveedor.

## Configuración de Desarrollo Local
1. `npm install`
2. `npx prisma generate`
3. `npx prisma db push`
4. `npm run dev`

## Emulación en Google Colab
Para facilitar las pruebas sin necesidad de instalar nada localmente, se ha incluido el archivo `SaeSoft_Colab.ipynb`.
1. Sube los archivos del proyecto a una carpeta en Google Drive o clónalo directamente en Colab.
2. Abre `SaeSoft_Colab.ipynb` en Google Colab.
3. Ejecuta las celdas en orden. El sistema te proporcionará un enlace público de `localtunnel` para acceder a la aplicación.

**Credenciales Iniciales:**
- **Usuario:** admin
- **Contraseña:** admin123
