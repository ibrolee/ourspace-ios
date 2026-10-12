import React,{useState} from 'react';
import {Alert,Pressable,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {Page,SectionTitle,RoundIcon,s} from '../../src/components';
import {C} from '../../src/theme';
import {useOurSpace} from '../../src/OurSpaceContext';
export default function Family(){
 const {familyName,members,addMember,removeMember,displayName}=useOurSpace();
 const [name,setName]=useState(''),[relationship,setRelationship]=useState(''),[error,setError]=useState('');
 async function submit(){try{await addMember(name,relationship);setName('');setRelationship('');setError('');}catch(e){setError(String(e));}}
 return <Page><Text style={s.h1}>Our family</Text><Text style={s.body}>Your own private corner of the world.</Text>
 <View style={{backgroundColor:C.green,borderRadius:28,padding:24,gap:13,alignItems:'center'}}><Ionicons name="people" size={46} color={C.gold}/><Text style={{fontSize:25,color:'white',fontWeight:'900'}}>{familyName}</Text><Text style={{color:'#D8E7DE',textAlign:'center'}}>Together in all the little ways that matter.</Text><Text style={{color:C.gold,fontSize:12,fontWeight:'800'}}>{members.length+1} local profile{members.length?'s':''}</Text></View>
 <SectionTitle title="Family profiles" action="Edit yours" onPress={()=>router.push('/settings')}/>
 <View style={[s.card,s.row,{gap:12}]}><RoundIcon name="person" bg={C.pale}/><View><Text style={s.h3}>{displayName}</Text><Text style={s.small}>You · This iPhone</Text></View></View>
 {members.map(m=><View key={m.id} style={[s.card,s.row,{gap:12}]}><RoundIcon name="person-outline" bg={C.blush}/><View style={{flex:1,gap:4}}><Text style={s.h3}>{m.name}</Text><Text style={s.small}>{m.relationship} · Local profile</Text></View><Pressable onPress={()=>Alert.alert('Remove profile?',undefined,[{text:'Cancel'},{text:'Remove',style:'destructive',onPress:()=>void removeMember(m.id)}])}><Ionicons name="trash-outline" size={20} color="#A76556"/></Pressable></View>)}
 <SectionTitle title="Add a family profile"/>
 <View style={[s.card,{gap:12}]}><TextInput value={name} onChangeText={setName} placeholder="Name" maxLength={60} style={s.input}/><TextInput value={relationship} onChangeText={setRelationship} placeholder="Relationship, e.g. Sister" maxLength={50} style={s.input}/>{error?<Text style={{color:'#AD3F35'}}>{error}</Text>:null}<Pressable onPress={()=>void submit()} style={{backgroundColor:C.green,padding:15,borderRadius:16}}><Text style={{color:'white',textAlign:'center',fontWeight:'800'}}>Add profile</Text></Pressable></View>
 <View style={[s.card,{backgroundColor:C.orange,gap:8}]}><Text style={s.h3}>Family accounts are coming later</Text><Text style={s.body}>Profiles here do not have passwords or invitations. Nobody else can access them on another phone. The private family server isn't deployed.</Text></View>
 </Page>;
}
