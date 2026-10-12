import React,{useEffect,useState} from 'react';
import {Alert,Pressable,Switch,Text,TextInput,View} from 'react-native';
import {router} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import {Page,s} from '../src/components';
import {C} from '../src/theme';
import {useOurSpace} from '../src/OurSpaceContext';
export default function Settings(){
 const {displayName,familyName,saveProfile}=useOurSpace();
 const [name,setName]=useState(displayName),[family,setFamily]=useState(familyName),[face,setFace]=useState(false);
 useEffect(()=>{SecureStore.getItemAsync('ourspace.appLock.enabled').then(v=>setFace(v==='yes')).catch(()=>{});},[]);
 const toggle=async(v:boolean)=>{try{if(v){const has=await LocalAuthentication.hasHardwareAsync(),enrolled=await LocalAuthentication.isEnrolledAsync();if(!has||!enrolled)throw Error('Face ID or a device passcode must be configured first.');const result=await LocalAuthentication.authenticateAsync({promptMessage:'Enable OurSpace app lock'});if(!result.success)return;}await SecureStore.setItemAsync('ourspace.appLock.enabled',v?'yes':'no');setFace(v);}catch(e){Alert.alert('Could not update app lock',String(e));}};
 return <Page><Pressable onPress={()=>router.back()}><Text style={{color:C.green,fontWeight:'800'}}>‹ Back</Text></Pressable><Text style={s.h1}>Settings</Text>
 <View style={[s.card,{gap:12}]}><Text style={s.h3}>Your name</Text><TextInput value={name} onChangeText={setName} maxLength={60} style={s.input}/><Text style={s.h3}>Family space name</Text><TextInput value={family} onChangeText={setFamily} maxLength={60} style={s.input}/><Pressable onPress={()=>saveProfile(name,family).then(()=>router.back()).catch(e=>Alert.alert('Unable to save',String(e)))} style={{backgroundColor:C.green,padding:16,borderRadius:16}}><Text style={{textAlign:'center',color:'white',fontWeight:'800'}}>Save changes</Text></Pressable></View>
 <View style={[s.card,s.row,{justifyContent:'space-between'}]}><View style={{flex:1,gap:5}}><Text style={s.h3}>Face ID / passcode lock</Text><Text style={s.small}>Require device authentication when opening OurSpace.</Text></View><Switch value={face} onValueChange={v=>void toggle(v)} trackColor={{true:C.green}}/></View>
 <View style={[s.card,{gap:9}]}><Text style={s.h3}>Privacy & synchronization</Text><Text style={s.body}>Your data is stored on this iPhone in a SQLCipher-encrypted database. It is not uploaded to an online account. Family profiles are local only until a separately secured private server is available.</Text></View>
 <Text style={s.small}>OurSpace 0.6 · iOS only · No Supabase or Firebase</Text></Page>;
}
