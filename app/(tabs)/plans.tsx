import React from 'react';
import {Alert,Pressable,Text,View} from 'react-native';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Page,SectionTitle,RoundIcon,AddButton,Empty,s} from '../../src/components';
import {C} from '../../src/theme';
import {useOurSpace} from '../../src/OurSpaceContext';
export default function Plans(){
 const {tasks,goals,lists,toggleTask,setGoalProgress,remove}=useOurSpace();
 return <Page><Text style={s.h1}>Family plans</Text><Text style={s.body}>A calmer way to manage tasks, shopping and goals.</Text>
 <AddButton kind="task"/>
 <SectionTitle title="To-dos" action="New task" onPress={()=>router.push({pathname:'/new',params:{kind:'task'}})}/>
 {tasks.length?tasks.map(t=><View key={t.id} style={[s.card,s.row,{gap:13}]}><Pressable accessibilityLabel={t.done?'Mark incomplete':'Mark complete'} onPress={()=>void toggleTask(t.id)}><Ionicons name={t.done?'checkmark-circle':'ellipse-outline'} color={t.done?C.green:C.muted} size={28}/></Pressable><View style={{flex:1,gap:4}}><Text style={[s.h3,t.done?{textDecorationLine:'line-through',color:C.muted}:null]}>{t.title}</Text><Text style={s.small}>{new Date(t.due_at).toLocaleDateString()} · {t.visibility==='private'?'Private':'Family'}</Text></View><Pressable onPress={()=>Alert.alert('Delete task?',undefined,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>void remove('task',t.id)}])}><Ionicons name="trash-outline" size={20} color="#A76556"/></Pressable></View>):<Empty icon="checkbox-outline" title="All clear" message="Add something you'd like to accomplish."/>}
 <SectionTitle title="Our goals" action="New goal" onPress={()=>router.push({pathname:'/new',params:{kind:'goal'}})}/>
 {goals.map(g=><View key={g.id} style={[s.card,{gap:12}]}><View style={[s.row,{justifyContent:'space-between'}]}><Text style={[s.h3,{flex:1}]}>{g.title}</Text><Text style={{fontWeight:'800',color:C.green}}>{g.progress}%</Text></View>{g.note?<Text style={s.body}>{g.note}</Text>:null}<View style={{height:9,backgroundColor:C.pale,borderRadius:20,overflow:'hidden'}}><View style={{backgroundColor:C.gold,height:9,width:g.progress+'%'}}/></View><View style={[s.row,{justifyContent:'space-between'}]}><Pressable onPress={()=>void setGoalProgress(g.id,g.progress-10)}><Text style={{color:C.green,fontWeight:'800'}}>− 10%</Text></Pressable><Pressable onPress={()=>void setGoalProgress(g.id,g.progress+10)}><Text style={{color:C.green,fontWeight:'800'}}>+ 10%</Text></Pressable><Pressable onPress={()=>Alert.alert('Delete goal?',undefined,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>void remove('goal',g.id)}])}><Text style={{color:'#A76556'}}>Delete</Text></Pressable></View></View>)}
 {!goals.length?<Text style={s.body}>Create a family goal to track your progress.</Text>:null}
 <SectionTitle title="Shopping & other lists" action="New list" onPress={()=>router.push({pathname:'/new',params:{kind:'list'}})}/>
 {lists.map(l=><Pressable key={l.id} onPress={()=>router.push({pathname:'/list/[id]',params:{id:l.id}})} style={[s.card,s.row,{gap:13}]}><RoundIcon name="list-outline" bg={C.orange}/><View style={{flex:1,gap:4}}><Text style={s.h3}>{l.title}</Text><Text style={s.small}>{l.completed} of {l.total} completed</Text></View><Ionicons name="chevron-forward" color={C.muted} size={20}/></Pressable>)}
 {!lists.length?<Text style={s.body}>Create a shopping list or packing checklist.</Text>:null}
 </Page>;
}
