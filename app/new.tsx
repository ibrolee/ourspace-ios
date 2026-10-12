import React,{useState} from 'react';
import {Alert,Pressable,ScrollView,Switch,Text,TextInput,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useOurSpace,type Kind,type Visibility} from '../src/OurSpaceContext';
import {C} from '../src/theme';
import {s} from '../src/components';
const names:Kind[]=['event','task','memory','goal','list'];
export default function CreateItem(){
 const params=useLocalSearchParams<{kind?:string}>();
 const kind=names.includes(params.kind as Kind)?params.kind as Kind:'event';
 const {create}=useOurSpace();
 const [title,setTitle]=useState(''),[note,setNote]=useState(''),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[time,setTime]=useState('18:00'),[visibility,setVisibility]=useState<Visibility>('private'),[saving,setSaving]=useState(false);
 const needsDate=kind==='event'||kind==='task';
 const save=async()=>{if(saving)return;setSaving(true);try{
  const at=needsDate?new Date(date+'T'+time+':00'):new Date();
  if(Number.isNaN(at.getTime()))throw Error('Enter a valid date (YYYY-MM-DD) and time (HH:MM).');
  await create(kind,title,note,at,visibility);router.back();
 }catch(e){Alert.alert('Unable to save',String(e));}finally{setSaving(false);}};
 return <SafeAreaView style={{flex:1,backgroundColor:C.cream}} edges={['top','bottom']}><ScrollView contentContainerStyle={{padding:24,gap:17}}>
 <Pressable onPress={()=>router.back()} style={{alignSelf:'flex-start',padding:8}}><Ionicons name="close" size={27} color={C.ink}/></Pressable>
 <Text style={s.h1}>New {kind}</Text><Text style={s.body}>Create something meaningful for your family space.</Text>
 <Text style={s.h3}>Title</Text><TextInput autoFocus placeholder={'Name your '+kind} value={title} onChangeText={setTitle} maxLength={130} style={s.input}/>
 {kind!=='list'?<><Text style={s.h3}>{kind==='memory'?'Your story':'Notes (optional)'}</Text><TextInput multiline value={note} onChangeText={setNote} maxLength={2000} placeholder="Add a little more detail..." textAlignVertical="top" style={[s.input,{height:114}]}/></>:null}
 {needsDate?<><Text style={s.h3}>Date · YYYY-MM-DD</Text><TextInput value={date} onChangeText={setDate} autoCapitalize="none" placeholder="2026-10-12" style={s.input}/><Text style={s.h3}>Time · 24-hour HH:MM</Text><TextInput value={time} onChangeText={setTime} placeholder="18:00" style={s.input}/></>:null}
 <View style={[s.card,s.row,{justifyContent:'space-between',gap:12}]}><View style={{flex:1,gap:5}}><Text style={s.h3}>For family</Text><Text style={s.small}>Labels a future shared item. It is still saved only on this iPhone.</Text></View><Switch value={visibility==='family'} onValueChange={v=>setVisibility(v?'family':'private')} trackColor={{true:C.green}}/></View>
 <Pressable disabled={saving} onPress={()=>void save()} style={{backgroundColor:C.green,padding:18,borderRadius:17,alignItems:'center',opacity:saving?.65:1}}><Text style={{color:'white',fontWeight:'800'}}>Save {kind}</Text></Pressable>
 </ScrollView></SafeAreaView>;
}
