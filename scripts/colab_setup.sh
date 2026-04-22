#!/bin/bash
set -e
echo "🚀 Iniciando configuración de SaeSoft 3F..."

# 1. Instalación de Node.js 22 (Requerido por Prisma 7.7+)
echo "📦 Verificando/Instalando Node.js 22..."
if ! command -v node &> /dev/null || [[ $(node -v) != v22* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
node -v

# 2. Instalación de dependencias
echo "📥 Instalando dependencias de Node.js..."
# Resolvemos conflictos de Git/package-lock si existen
npm install --no-audit --no-fund || npm install --no-audit --no-fund --force

# 3. Configuración de .env
echo "📝 Configurando variables de entorno..."
# Generar un secret aleatorio si no existe uno
RANDOM_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# Usamos ruta absoluta para la base de datos para evitar errores 500
ABS_DB_PATH=$(pwd)/dev.db
# Limpiamos posibles espacios en blanco en la ruta
ABS_DB_PATH=$(echo $ABS_DB_PATH | xargs)

cat <<EOF > .env
DATABASE_URL="file:$ABS_DB_PATH"
AUTH_SECRET="$RANDOM_SECRET"
AUTH_TRUST_HOST="true"
EOF

# 4. Preparación de Base de Datos
echo "🗄️ Configurando base de datos Prisma (v7+)..."
export DATABASE_URL="file:$ABS_DB_PATH"

npx --yes prisma generate
npx --yes prisma db push --accept-data-loss

# 5. Seed de datos
echo "🌱 Cargando datos iniciales (admin/admin123)..."
chmod 666 dev.db || true
node prisma/seed.ts

# 6. Build para Producción
echo "🏗️ Compilando para producción..."
rm -rf .next
if npm run build; then
    echo "✅ Configuración finalizada correctamente."
else
    echo "❌ ERROR: La compilación falló."
    exit 1
fi
