import React,{useCallback,useEffect,useRef,useState} from 'react';
import {ActivityIndicator,AppState,Pressable,Text,TextInput,View} from 'react-native';
import {Stack} from 'expo-router';
import {SQLiteProvider} from 'expo-sqlite';
import {StatusBar} from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import {OurSpaceProvider,useOurSpace} from '../src/OurSpaceContext';
import {initDb} from '../src/db';
import {C} from '../src/theme';
function Gate(){
 const {loading,error,onboarded,finishSetup}=useOurSpace();
 const [unlocked,setUnlocked]=useState(false),[checking,setChecking]=useState(true),[name,setName]=useState(''),[family,setFamily]=useState(''),[formError,setFormError]=useState('');
 const inProgress=useRef(false);
 const authenticate=useCallback(async()=>{
  if(inProgress.current)return;inProgress.current=true;setChecking(true);
  try{
   const setting=await SecureStore.getItemAsync('ourspace.appLock.enabled');
   if(setting!=='yes'){setUnlocked(true);return;}
   const res=await LocalAuthentication.authenticateAsync({promptMessage:'Unlock OurSpace',fallbackLabel:'Use passcode'});
   setUnlocked(res.success);
  }catch{setUnlocked(false);}finally{inProgress.current=false;setChecking(false);}
 },[]);
 useEffect(()=>{void authenticate();let previous=AppState.currentState;const l=AppState.addEventListener('change',next=>{
  if(next==='background'){setUnlocked(false);setChecking(true);}
  if(next==='active'&&previous!=='active')void authenticate();
  previous=next;
 });return()=>l.remove();},[authenticate]);
 const overlay=loading||!!error||!unlocked||!onboarded;
 return <View style={{flex:1,backgroundColor:C.cream}}>
  <StatusBar style="dark"/>
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.cream}}}>
   <Stack.Screen name="(tabs)"/>
   <Stack.Screen name="new" options={{presentation:'modal'}}/>
   <Stack.Screen name="settings"/>
   <Stack.Screen name="list/[id]"/>
  </Stack>
  {overlay?<View accessibilityViewIsModal style={{position:'absolute',top:0,bottom:0,left:0,right:0,zIndex:20,backgroundColor:C.cream,padding:28,justifyContent:'center',gap:16}}>
   {loading||checking?<ActivityIndicator color={C.green} size="large"/>:error?<><Text style={{fontSize:22,color:'#943D34',fontWeight:'800'}}>Unable to open private database</Text><Text selectable style={{color:C.ink}}>{error}</Text></>:!unlocked?<><Text style={{fontSize:30,color:C.green,fontWeight:'900'}}>OurSpace is locked</Text><Text style={{color:C.muted}}>Use Face ID or your device passcode to unlock.</Text><Pressable onPress={()=>void authenticate()} style={{backgroundColor:C.green,padding:17,borderRadius:18}}><Text style={{color:'white',textAlign:'center',fontWeight:'800'}}>Unlock</Text></Pressable></>:<><Text style={{fontSize:34,color:C.green,fontWeight:'900'}}>Welcome to OurSpace</Text><Text style={{color:C.muted,lineHeight:23}}>A little closer, wherever life takes us. Create your private family space on this iPhone.</Text><Text style={{fontWeight:'700',color:C.ink}}>Your first name</Text><TextInput placeholder="Your name" value={name} onChangeText={setName} maxLength={60} style={{backgroundColor:'white',borderRadius:15,padding:17,fontSize:17}}/><Text style={{fontWeight:'700',color:C.ink}}>Family space name</Text><TextInput placeholder="Our Family" value={family} onChangeText={setFamily} maxLength={60} style={{backgroundColor:'white',borderRadius:15,padding:17,fontSize:17}}/><Text style={{fontSize:12,lineHeight:19,color:C.muted}}>Your data remains on this device. Profiles are not accounts or invitations. A private server will be required for sharing later.</Text>{formError?<Text style={{color:'#AB3E34'}}>{formError}</Text>:null}<Pressable onPress={()=>finishSetup(name,family).catch(e=>setFormError(String(e)))} style={{backgroundColor:C.green,padding:18,borderRadius:17}}><Text style={{color:'white',fontWeight:'800',textAlign:'center'}}>Create my space</Text></Pressable></>}
  </View>:null}
 </View>;
}
export default function RootLayout(){return <SQLiteProvider databaseName="ourspace-private-v1.db" onInit={initDb}><OurSpaceProvider><Gate/></OurSpaceProvider></SQLiteProvider>;}
