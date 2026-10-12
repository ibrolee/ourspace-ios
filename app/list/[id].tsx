import React,{useCallback,useEffect,useState} from 'react';
import {Alert,Pressable,Text,TextInput,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Page,s} from '../../src/components';
import {C} from '../../src/theme';
import {useOurSpace,type FamilyListItem} from '../../src/OurSpaceContext';
export default function ListDetails(){
 const {id}=useLocalSearchParams<{id:string}>();
 const {lists,listItems,addListItem,toggleListItem,removeListItem,remove}=useOurSpace();
 const [items,setItems]=useState<FamilyListItem[]>([]),[title,setTitle]=useState('');
 const list=lists.find(x=>x.id===id);
 const refresh=useCallback(async()=>{if(id)setItems(await listItems(id));},[id,listItems]);
 useEffect(()=>{void refresh();},[refresh,lists]);
 return <Page><Pressable onPress={()=>router.back()}><Ionicons name="arrow-back" color={C.green} size={26}/></Pressable><Text style={s.h1}>{list?.title??'Shopping list'}</Text><Text style={s.body}>Tick things off as you go, even without internet.</Text>
 <View style={[s.card,{gap:12}]}><TextInput placeholder="Add an item..." value={title} onChangeText={setTitle} maxLength={130} style={s.input}/><Pressable onPress={async()=>{try{await addListItem(id,title);setTitle('');await refresh();}catch(e){Alert.alert('Could not add item',String(e));}}} style={{backgroundColor:C.green,padding:15,borderRadius:16}}><Text style={{color:'white',fontWeight:'800',textAlign:'center'}}>Add item</Text></Pressable></View>
 {items.map(x=><View key={x.id} style={[s.card,s.row,{gap:12}]}><Pressable onPress={()=>void toggleListItem(x.id)}><Ionicons name={x.done?'checkmark-circle':'ellipse-outline'} size={27} color={C.green}/></Pressable><Text style={[s.h3,{flex:1},x.done?{textDecorationLine:'line-through',color:C.muted}:null]}>{x.title}</Text><Pressable onPress={()=>void removeListItem(x.id)}><Ionicons name="trash-outline" color="#AE675B" size={20}/></Pressable></View>)}
 <Pressable onPress={()=>Alert.alert('Delete this list?',undefined,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await remove('list',id);router.replace('/plans');}}])} style={{padding:15,alignItems:'center'}}><Text style={{color:'#A65C50'}}>Delete list</Text></Pressable></Page>;
}
