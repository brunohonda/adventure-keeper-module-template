import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const manifestPath = resolve(rootDir, 'module.json');

console.log('🔍 Validando manifesto module.json...');

if (!existsSync(manifestPath)) {
  console.error('❌ Erro: module.json não encontrado na raiz.');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
} catch (err) {
  console.error('❌ Erro ao parsear module.json como JSON:', err.message);
  process.exit(1);
}

// 1. Campos obrigatórios
const requiredFields = ['id', 'name', 'version', 'description', 'author', 'license', 'compatibility', 'defaultLocale'];
for (const field of requiredFields) {
  if (!manifest[field]) {
    console.error(`❌ Campo obrigatório ausente: "${field}"`);
    process.exit(1);
  }
}

// 2. Formato do ID com namespace (ex: community.meu-modulo)
const idRegex = /^[a-z0-9_-]+\.[a-z0-9_-]+(\.[a-z0-9_-]+)*$/;
if (!idRegex.test(manifest.id)) {
  console.error(`❌ ID inválido: "${manifest.id}". O ID deve seguir o padrão namespace.nome-modulo (ex: community.starter-module).`);
  process.exit(1);
}

// 3. Versão SemVer
const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;
if (!semverRegex.test(manifest.version)) {
  console.error(`❌ Versão SemVer inválida: "${manifest.version}". Use o formato X.Y.Z.`);
  process.exit(1);
}

// 4. Validar existência dos arquivos de schema referenciados
if (Array.isArray(manifest.entityExtensions)) {
  for (const ext of manifest.entityExtensions) {
    if (ext.schema) {
      const schemaFile = resolve(rootDir, ext.schema);
      if (!existsSync(schemaFile)) {
        console.error(`❌ Arquivo de schema não encontrado: ${ext.schema}`);
        process.exit(1);
      }
    }
  }
}

if (Array.isArray(manifest.campaignExtensions)) {
  for (const ext of manifest.campaignExtensions) {
    if (ext.schema) {
      const schemaFile = resolve(rootDir, ext.schema);
      if (!existsSync(schemaFile)) {
        console.error(`❌ Arquivo de schema de campanha não encontrado: ${ext.schema}`);
        process.exit(1);
      }
    }
  }
}

// 5. Validar existência dos arquivos de locale
if (manifest.defaultLocale) {
  const defaultLocaleFile = resolve(rootDir, `locales/${manifest.defaultLocale}.json`);
  if (!existsSync(defaultLocaleFile)) {
    console.error(`❌ Arquivo de locale padrão não encontrado: locales/${manifest.defaultLocale}.json`);
    process.exit(1);
  }
}

console.log('✅ module.json válido e em conformidade com as diretrizes do Adventure Keeper!');
