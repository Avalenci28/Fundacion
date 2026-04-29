const fs = require('fs').promises;
const path = require('path');

async function cleanEnvFiles() {
  console.log('🧹 LIMPIANDO ARCHIVOS .env DUPLICADOS...\n');

  const projectRoot = path.resolve(__dirname);
  const backendEnvPath = path.resolve(__dirname, '.env');
  
  let renamedCount = 0;

  try {
    // Función recursiva para buscar .env
    const findAndRenameEnv = async (dir) => {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          
          if (item.isDirectory()) {
            // Recursión en subdirectorios
            await findAndRenameEnv(fullPath);
          } else if (item.name.match(/^\.env/) && fullPath !== backendEnvPath) {
            // Renombrar .env duplicado (excepto backend/.env)
            const newPath = fullPath + '.old';
            
            await fs.rename(fullPath, newPath);
            renamedCount++;
            
            const relativePath = path.relative(projectRoot, fullPath);
            console.log(`⚠️ Se renombró un .env duplicado en ${relativePath} → .old`);
          }
        }
      } catch (err) {
        // Ignorar errores de permisos
      }
    };

    // Ejecutar limpieza
    await findAndRenameEnv(projectRoot);

    // Verificar backend/.env existe
    try {
      await fs.access(backendEnvPath);
      console.log(`✅ backend/.env está presente`);
    } catch {
      console.log('⚠️  ADVERTENCIA: No existe backend/.env - créalo');
    }

    // Resumen final
    if (renamedCount === 0) {
      console.log('\n✅ No se encontraron .env duplicados');
    } else {
      console.log(`\n✅ Se renombraron ${renamedCount} archivos .env duplicados`);
    }
    
    console.log('✅ Solo queda activo backend/.env');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanEnvFiles();
