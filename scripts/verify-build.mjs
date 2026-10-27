import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distAssets = join(process.cwd(), 'dist', 'assets');
const MARKER = 'ED-Dev';

if (!existsSync(distAssets)) {
  console.error('❌ dist/assets no existe. Ejecuta build primero.');
  process.exit(1);
}

const files = readdirSync(distAssets).filter(f => f.endsWith('.js'));
let found = false;

for (const file of files) {
  const content = readFileSync(join(distAssets, file), 'utf8');
  if (content.includes(MARKER)) {
    found = true;
    console.log(`✅ Marcador "${MARKER}" encontrado en ${file}`);
    break;
  }
}

if (!found) {
  console.error(`❌ Marcador "${MARKER}" NO encontrado en dist/assets/*.js`);
  console.error('Build incompleto o firma ED-Dev ausente.');
  process.exit(1);
}

console.log('Verificación post-build OK');
