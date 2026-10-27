import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));let failed=false;
for(const file of readdirSync(path.join(root,'dist'))){
 if(file.endsWith('.js')){const result=spawnSync(process.execPath,['--check',path.join(root,'dist',file)],{encoding:'utf8'});if(result.status){console.error(result.stderr);failed=true;}}
 if(file.endsWith('.html')){const html=readFileSync(path.join(root,'dist',file),'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){const ref=match[1];if(/^(https?:|mailto:|tel:)/.test(ref))continue;if(!existsSync(path.join(root,'dist',ref))){console.error(`${file}: fichier manquant ${ref}`);failed=true;}}if(!html.includes('lang="fr"')){console.error(`${file}: langue manquante`);failed=true;}}
}
if(failed)process.exitCode=1;else console.log('Syntaxe JavaScript, pages françaises et liens locaux : OK');
