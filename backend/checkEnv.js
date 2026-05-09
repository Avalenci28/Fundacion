const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

async function checkEnvFiles() {
  console.log('🔍 BUSCANDO ARCHIVOS .env EN EL PROYECTO...\n');

  const projectRoot = path.resolve(__dirname);
  const targetEnvPath = path.resolve(__dirname, '.env');

  try {
    // 1. Buscar todos los .env en el proyecto (recursivo)
    const findEnvFiles = async (dir) => {
      let envFiles = [];
      try {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory()) {
            envFiles = envFiles.concat(await findEnvFiles(fullPath));
          } else if (item.match(/^\.env/)) {
            envFiles.push(fullPath);
          }
        }
      } catch (err) {
        // Ignorar permisos denegados
      }
      return envFiles;
    };

    const allEnvFiles = await findEnvFiles(projectRoot);
    
    // 2. Listar todos los .env encontrados
    console.log('📁 ARCHIVOS .env ENCONTRADOS:');
    if (allEnvFiles.length === 0) {
      console.log('  🚫 Ningún archivo .env encontrado');
    } else {
      allEnvFiles.forEach((envPath, index) => {
        console.log(`  ${index + 1}. ${envPath}`);
      });
    }
    console.log('');

    // 3. Verificar .env target
    let targetEnvContent = 'NO ENCONTRADO';
    try {
      const data = await fs.readFile(targetEnvPath, 'utf8');
      targetEnvContent = data.trim();
      console.log('🎯 .env CARGADO POR dotenv (backend/.env):');
      console.log('```\n' + targetEnvContent + '\n```');
    } catch (err) {
      console.log('🎯 backend/.env:', targetEnvContent);
    }
    console.log('');

    // 4. Advertencia múltiples .env
    if (allEnvFiles.length > 1) {
      console.log('⚠️  ADVERTENCIA: Hay múltiples archivos .env, elimina o renombra los que no uses');
      console.log('   dotenv.config({ path: __dirname + "/.env" }) solo lee backend/.env\n');
    } else if (allEnvFiles.length === 1) {
      console.log('✅ Solo un .env encontrado - Configuración correcta\n');
    }

    // 5. Verificar variables PostgreSQL/Supabase cargadas
    console.log('🔍 VARIABLES CARGADAS:');
    console.log('PGHOST:', process.env.PGHOST || '🚫 NO DEFINIDO');
    
    if (process.env.PGHOST) {
      console.log('✅ .env PostgreSQL cargado correctamente');
    } else {
      console.log('❌ PGHOST no encontrado en backend/.env');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkEnvFiles();
