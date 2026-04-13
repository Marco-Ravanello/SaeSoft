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
1. Abre Google Colab y sube el archivo `SaeSoft_Colab.ipynb`.
2. Si los archivos del proyecto no están en Colab, usa la **Celda 0** del notebook para clonar el repositorio.
3. Ejecuta la **Celda 1** (Instalación). Si pide confirmar la instalación de Prisma, el comando `-y` debería evitar el bloqueo, pero estate atento a los logs.
4. Ejecuta la **Celda 2** (Servidor). Copia la dirección IP que aparece y pégala en la página de `localtunnel` que se abrirá al hacer clic en el enlace generado.

**Credenciales Iniciales:**
- **Usuario:** admin
- **Contraseña:** admin123
