import type { SQLiteDatabase } from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const KEY_NAME='ourspace.databaseKey.v1';
export async function initDb(db:SQLiteDatabase){
 let key=await SecureStore.getItemAsync(KEY_NAME);
 if(!key){
  const bytes=await Crypto.getRandomBytesAsync(32);
  key=Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');
  await SecureStore.setItemAsync(KEY_NAME,key,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
 }
 if(!/^[a-f0-9]{64}$/.test(key))throw new Error('Invalid encryption key');
 await db.execAsync("PRAGMA key = '"+key+"';");
 const cipher=await db.getFirstAsync<{cipher_version?:string}>('PRAGMA cipher_version;');
 if(!cipher?.cipher_version)throw new Error('This native build is missing SQLCipher. Your family data will not be stored in plaintext.');
 await db.getFirstAsync('SELECT count(*) AS count FROM sqlite_master');
 await db.execAsync(`
 PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS app_meta(key TEXT PRIMARY KEY NOT NULL,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,starts_at TEXT NOT NULL,note TEXT NOT NULL DEFAULT '',visibility TEXT NOT NULL DEFAULT 'private',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,due_at TEXT NOT NULL,done INTEGER NOT NULL DEFAULT 0,visibility TEXT NOT NULL DEFAULT 'private',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS memories(id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,note TEXT NOT NULL DEFAULT '',icon TEXT NOT NULL DEFAULT 'heart',visibility TEXT NOT NULL DEFAULT 'private',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS goals(id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,note TEXT NOT NULL DEFAULT '',progress INTEGER NOT NULL DEFAULT 0,visibility TEXT NOT NULL DEFAULT 'private',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS lists(id TEXT PRIMARY KEY NOT NULL,title TEXT NOT NULL,visibility TEXT NOT NULL DEFAULT 'private',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS list_items(id TEXT PRIMARY KEY NOT NULL,list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,title TEXT NOT NULL,done INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS family_members(id TEXT PRIMARY KEY NOT NULL,name TEXT NOT NULL,relationship TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_items_list ON list_items(list_id);
 INSERT OR IGNORE INTO app_meta(key,value) VALUES('display_name','You');
 INSERT OR IGNORE INTO app_meta(key,value) VALUES('family_name','Our Family');
 `);
}
