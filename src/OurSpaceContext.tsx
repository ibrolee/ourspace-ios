import React,{createContext,useCallback,useContext,useEffect,useState} from 'react';
import {useSQLiteContext} from 'expo-sqlite';
export type Visibility='family'|'private';
export type Kind='event'|'task'|'memory'|'goal'|'list';
export type FamilyEvent={id:string;title:string;starts_at:string;note:string;visibility:Visibility;created_at:string};
export type FamilyTask={id:string;title:string;due_at:string;done:number;visibility:Visibility;created_at:string};
export type FamilyMemory={id:string;title:string;note:string;icon:string;visibility:Visibility;created_at:string};
export type FamilyGoal={id:string;title:string;note:string;progress:number;visibility:Visibility;created_at:string};
export type FamilyList={id:string;title:string;visibility:Visibility;created_at:string;total:number;completed:number};
export type FamilyListItem={id:string;list_id:string;title:string;done:number;created_at:string};
export type FamilyMember={id:string;name:string;relationship:string;created_at:string};
type State={
 events:FamilyEvent[];tasks:FamilyTask[];memories:FamilyMemory[];goals:FamilyGoal[];lists:FamilyList[];members:FamilyMember[];
 displayName:string;familyName:string;onboarded:boolean;loading:boolean;error:string;
 refresh:()=>Promise<void>;create:(kind:Kind,title:string,note:string,date:Date,visibility:Visibility)=>Promise<void>;
 toggleTask:(id:string)=>Promise<void>;setGoalProgress:(id:string,p:number)=>Promise<void>;
 listItems:(id:string)=>Promise<FamilyListItem[]>;addListItem:(id:string,title:string)=>Promise<void>;
 toggleListItem:(id:string)=>Promise<void>;removeListItem:(id:string)=>Promise<void>;
 saveProfile:(name:string,family:string)=>Promise<void>;finishSetup:(name:string,family:string)=>Promise<void>;
 addMember:(name:string,relationship:string)=>Promise<void>;removeMember:(id:string)=>Promise<void>;
 remove:(kind:Kind,id:string)=>Promise<void>;
};
const Context=createContext<State|null>(null);
const newId=()=>new Date().getTime()+'-'+Math.random().toString(36).slice(2);
export function OurSpaceProvider({children}:{children:React.ReactNode}){
 const db=useSQLiteContext();
 const [events,setEvents]=useState<FamilyEvent[]>([]);
 const [tasks,setTasks]=useState<FamilyTask[]>([]);
 const [memories,setMemories]=useState<FamilyMemory[]>([]);
 const [goals,setGoals]=useState<FamilyGoal[]>([]);
 const [lists,setLists]=useState<FamilyList[]>([]);
 const [members,setMembers]=useState<FamilyMember[]>([]);
 const [displayName,setDisplayName]=useState('You'),[familyName,setFamilyName]=useState('Our Family');
 const [onboarded,setOnboarded]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const refresh=useCallback(async()=>{
   const [e,t,m,g,l,p,f]=await Promise.all([
     db.getAllAsync<FamilyEvent>('SELECT * FROM events ORDER BY starts_at ASC'),
     db.getAllAsync<FamilyTask>('SELECT * FROM tasks ORDER BY done, due_at ASC'),
     db.getAllAsync<FamilyMemory>('SELECT * FROM memories ORDER BY created_at DESC'),
     db.getAllAsync<FamilyGoal>('SELECT * FROM goals ORDER BY created_at DESC'),
     db.getAllAsync<FamilyList>(`SELECT lists.*,(SELECT COUNT(*) FROM list_items WHERE list_id=lists.id) total,(SELECT COUNT(*) FROM list_items WHERE list_id=lists.id AND done=1) completed FROM lists ORDER BY created_at DESC`),
     db.getAllAsync<{key:string;value:string}>('SELECT key,value FROM app_meta'),
     db.getAllAsync<FamilyMember>('SELECT * FROM family_members ORDER BY created_at ASC')
   ]);
   setEvents(e);setTasks(t);setMemories(m);setGoals(g);setLists(l);setMembers(f);
   setDisplayName(p.find(x=>x.key==='display_name')?.value??'You');
   setFamilyName(p.find(x=>x.key==='family_name')?.value??'Our Family');
   setOnboarded(p.some(x=>x.key==='setup_complete'&&x.value==='yes'));
   setLoading(false);setError('');
 },[db]);
 useEffect(()=>{refresh().catch(e=>{setError(String(e));setLoading(false);});},[refresh]);
 const create=async(kind:Kind,title:string,note:string,date:Date,visibility:Visibility)=>{
   if(!title.trim())throw Error('Enter a title');
   const id=newId(),now=new Date().toISOString(),value=title.trim().slice(0,130),details=note.trim().slice(0,2000);
   if(kind==='event') await db.runAsync('INSERT INTO events(id,title,starts_at,note,visibility,created_at) VALUES(?,?,?,?,?,?)',id,value,date.toISOString(),details,visibility,now);
   if(kind==='task') await db.runAsync('INSERT INTO tasks(id,title,due_at,done,visibility,created_at) VALUES(?,?,?,?,?,?)',id,value,date.toISOString(),0,visibility,now);
   if(kind==='memory')await db.runAsync('INSERT INTO memories(id,title,note,icon,visibility,created_at) VALUES(?,?,?,?,?,?)',id,value,details,'heart',visibility,now);
   if(kind==='goal')await db.runAsync('INSERT INTO goals(id,title,note,progress,visibility,created_at) VALUES(?,?,?,?,?,?)',id,value,details,0,visibility,now);
   if(kind==='list')await db.runAsync('INSERT INTO lists(id,title,visibility,created_at) VALUES(?,?,?,?)',id,value,visibility,now);
   await refresh();
 };
 const toggleTask=async(id:string)=>{await db.runAsync('UPDATE tasks SET done=1-done WHERE id=?',id);await refresh();};
 const setGoalProgress=async(id:string,p:number)=>{await db.runAsync('UPDATE goals SET progress=? WHERE id=?',Math.min(100,Math.max(0,Math.round(p))),id);await refresh();};
 const listItems=useCallback((id:string)=>db.getAllAsync<FamilyListItem>('SELECT * FROM list_items WHERE list_id=? ORDER BY done, created_at ASC',id),[db]);
 const addListItem=async(id:string,title:string)=>{if(!title.trim())throw Error('Enter item name');await db.runAsync('INSERT INTO list_items(id,list_id,title,done,created_at) VALUES(?,?,?,?,?)',newId(),id,title.trim().slice(0,130),0,new Date().toISOString());await refresh();};
 const toggleListItem=async(id:string)=>{await db.runAsync('UPDATE list_items SET done=1-done WHERE id=?',id);await refresh();};
 const removeListItem=async(id:string)=>{await db.runAsync('DELETE FROM list_items WHERE id=?',id);await refresh();};
 const saveProfile=async(name:string,family:string)=>{
  if(!name.trim()||!family.trim())throw Error('Name and family name are required');
  await db.withTransactionAsync(async()=>{
   await db.runAsync('INSERT OR REPLACE INTO app_meta(key,value) VALUES(?,?)','display_name',name.trim().slice(0,60));
   await db.runAsync('INSERT OR REPLACE INTO app_meta(key,value) VALUES(?,?)','family_name',family.trim().slice(0,60));
  });await refresh();
 };
 const finishSetup=async(name:string,family:string)=>{await saveProfile(name,family);await db.runAsync('INSERT OR REPLACE INTO app_meta(key,value) VALUES(?,?)','setup_complete','yes');await refresh();};
 const addMember=async(name:string,relationship:string)=>{
  if(!name.trim()||!relationship.trim())throw Error('Name and relationship required');
  if(members.length>=15)throw Error('Maximum of 15 local profiles');
  await db.runAsync('INSERT INTO family_members(id,name,relationship,created_at) VALUES(?,?,?,?)',newId(),name.trim().slice(0,60),relationship.trim().slice(0,50),new Date().toISOString());await refresh();
 };
 const removeMember=async(id:string)=>{await db.runAsync('DELETE FROM family_members WHERE id=?',id);await refresh();};
 const remove=async(kind:Kind,id:string)=>{
  const table={event:'events',task:'tasks',memory:'memories',goal:'goals',list:'lists'}[kind];
  await db.runAsync('DELETE FROM '+table+' WHERE id=?',id);await refresh();
 };
 return <Context.Provider value={{events,tasks,memories,goals,lists,members,displayName,familyName,onboarded,loading,error,refresh,create,toggleTask,setGoalProgress,listItems,addListItem,toggleListItem,removeListItem,saveProfile,finishSetup,addMember,removeMember,remove}}>{children}</Context.Provider>;
}
export function useOurSpace(){const value=useContext(Context);if(!value)throw Error('Missing OurSpaceProvider');return value;}
