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
cat <<EOF > .env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="467ca6b9c63feb05a66756552793fd972094f1f3d8a35a76741f8e79f81872d7"
AUTH_TRUST_HOST="true"
EOF

# 4. Preparación de Base de Datos
echo "🗄️ Configurando base de datos Prisma..."
npx --yes prisma generate
npx --yes prisma db push --accept-data-loss

# 5. Seed de datos
echo "🌱 Cargando datos iniciales..."
npx --yes ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

echo "✅ Configuración finalizada correctamente."
