// Script helper para reemplazar todas las rutas
import { readFileSync, writeFileSync } from 'fs';

const filePath = './supabase/functions/server/index.tsx';
let content = readFileSync(filePath, 'utf-8');

// Reemplazar TODAS las ocurrencias de '/make-server-25b11ac0/' con '/'
content = content.replaceAll("'/make-server-25b11ac0/", "'/");

writeFileSync(filePath, content, 'utf-8');
console.log('✅ Todas las rutas actualizadas');
