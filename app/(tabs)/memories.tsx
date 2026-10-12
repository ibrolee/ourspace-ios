import React from 'react';
import {Alert,Pressable,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Page,AddButton,Empty,SectionTitle,friendlyDate,s} from '../../src/components';
import {C} from '../../src/theme';
import {useOurSpace} from '../../src/OurSpaceContext';
export default function Memories(){
 const {memories,remove}=useOurSpace();
 return <Page><Text style={s.h1}>Our memories</Text><Text style={s.body}>A home for the stories that make your family unique.</Text><AddButton kind="memory"/><SectionTitle title="Memory timeline"/>
 {memories.length?memories.map(m=><View key={m.id} style={[s.card,{gap:12}]}><View style={{backgroundColor:C.blush,height:95,borderRadius:16,alignItems:'center',justifyContent:'center'}}><Ionicons name="heart" color={C.green} size={38}/></View><View style={[s.row,{justifyContent:'space-between'}]}><Text style={[s.h3,{flex:1}]}>{m.title}</Text><Pressable onPress={()=>Alert.alert('Remove this memory?',undefined,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>void remove('memory',m.id)}])}><Ionicons name="trash-outline" color="#A76556" size={19}/></Pressable></View>{m.note?<Text style={s.body}>{m.note}</Text>:null}<Text style={s.small}>{friendlyDate(m.created_at)} · {m.visibility==='private'?'Only me':'Family (local)'}</Text></View>):<Empty icon="images-outline" title="Your story starts here" message="Save your first memory or family milestone."/>}
 <Text style={s.small}>Photo albums, video uploads and cross-device sharing will be added only after a secure media backend is deployed.</Text>
 </Page>;
}
