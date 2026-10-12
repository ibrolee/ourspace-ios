import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const app=read('app.json').expo;const pkg=read('package.json');const eas=read('eas.json');
test('iOS-only app',()=>assert.deepEqual(app.platforms,['ios']));
test('independent data stack',()=>assert.equal(JSON.stringify(pkg).toLowerCase().includes('firebase')||JSON.stringify(pkg).toLowerCase().includes('supabase'),false));
test('SQLCipher requested in native prebuild',()=>assert.equal(app.plugins.some(p=>Array.isArray(p)&&p[0]==='expo-sqlite'&&p[1]?.useSQLCipher),true));
test('Xcode 27 scene support',()=>assert.equal(app.plugins.some(p=>Array.isArray(p)&&p[0]==='expo-build-properties'&&p[1]?.ios?.enableSceneSupport),true));
test('standalone internal preview',()=>{assert.equal(eas.build.preview.distribution,'internal');assert.equal(eas.build.preview.developmentClient,undefined)});
