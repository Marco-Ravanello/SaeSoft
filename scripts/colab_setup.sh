#!/bin/bash
set -e
echo "🚀 Iniciando configuración de SaeSoft 3F..."

# 1. Instalación de Node.js 20 si no existe
if ! command -v node &> /dev/null || [[ $(node -v) != v20* ]]; then
    echo "📦 Instalando Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &> /dev/null
    sudo apt-get install -y nodejs &> /dev/null
fi

# 2. Instalación de dependencias
echo "📥 Instalando dependencias de Node.js..."
npm install

# 3. Configuración de .env
echo "📝 Configurando variables de entorno..."
# Generar un secret aleatorio si no existe uno
RANDOM_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
cat <<EOF > .env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="$RANDOM_SECRET"
AUTH_TRUST_HOST="true"
EOF

# 4. Preparación de Base de Datos
echo "🗄️ Configurando base de datos Prisma..."
npx --yes prisma generate
npx --yes prisma db push --accept-data-loss

# 5. Seed de datos
echo "🌱 Cargando datos iniciales..."
npx --yes ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 6. Build para Producción
echo "🏗️ Compilando aplicación para producción (esto agiliza el uso del software)..."
npm run build

echo "✅ Configuración finalizada correctamente."
