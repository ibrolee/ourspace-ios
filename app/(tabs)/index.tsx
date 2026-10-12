import React from 'react';
import {Pressable,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import {C} from '../../src/theme';
import {Page,RoundIcon,SectionTitle,DemoNotice,friendlyDate,s} from '../../src/components';
import {useOurSpace,type Kind} from '../../src/OurSpaceContext';
export default function Home(){
 const {displayName,events,tasks,memories}=useOurSpace();
 const upcoming=events.filter(e=>new Date(e.starts_at)>=new Date()).slice(0,3);
 const pending=tasks.filter(t=>!t.done);
 const hour=new Date().getHours(),greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
 const quick:{kind:Kind;label:string;icon:React.ComponentProps<typeof Ionicons>['name'];bg:string}[]=[{kind:'event',label:'Event',icon:'calendar-outline',bg:C.pale},{kind:'task',label:'Task',icon:'checkmark-circle-outline',bg:C.orange},{kind:'memory',label:'Memory',icon:'camera-outline',bg:C.blush},{kind:'goal',label:'Goal',icon:'flag-outline',bg:C.lilac}];
 return <Page>
 <View style={[s.row,{justifyContent:'space-between'}]}><View style={[s.row,{gap:10}]}><RoundIcon name="heart" bg={C.green} color={C.gold}/><View><Text style={{fontSize:20,color:C.green,fontWeight:'900'}}>OurSpace</Text><Text style={s.small}>Your family's little corner</Text></View></View><Pressable onPress={()=>router.push('/settings')}><Ionicons name="settings-outline" size={24} color={C.green}/></Pressable></View>
 <View style={{gap:5}}><Text style={[s.small,{letterSpacing:1.5,fontWeight:'800'}]}>{new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</Text><Text style={s.h1}>{greeting}, {displayName} ☀️</Text><Text style={s.body}>Small moments, shared with the people who matter.</Text></View>
 <LinearGradient colors={['#193D36','#356657']} style={{borderRadius:27,padding:22,gap:14,minHeight:190}}><Text style={{color:C.gold,fontWeight:'900',fontSize:12,letterSpacing:1.5}}>OUR NEXT BIG MOMENT</Text><Text style={{color:'white',fontSize:27,fontWeight:'800'}}>{upcoming[0]?.title??'Make a new memory'}</Text><Text style={{color:'#DDECE3'}}>{upcoming[0]?friendlyDate(upcoming[0].starts_at):'Create a family event to begin.'}</Text><Pressable onPress={()=>router.push({pathname:'/new',params:{kind:'event'}})}><Text style={{color:C.gold,fontWeight:'800'}}>Plan something special  →</Text></Pressable></LinearGradient>
 <SectionTitle title="Quick actions"/>
 <View style={[s.row,{gap:8,justifyContent:'space-around'}]}>{quick.map(q=><Pressable key={q.kind} onPress={()=>router.push({pathname:'/new',params:{kind:q.kind}})} style={{alignItems:'center',gap:7}}><RoundIcon name={q.icon} bg={q.bg}/><Text style={{fontSize:12,fontWeight:'800',color:C.ink}}>{q.label}</Text></Pressable>)}</View>
 <SectionTitle title="Coming up" action="Calendar" onPress={()=>router.push('/calendar')}/>
 {upcoming.length?upcoming.map(e=><View key={e.id} style={[s.card,s.row,{gap:12}]}><RoundIcon name="calendar-outline"/><View style={{flex:1}}><Text style={s.h3}>{e.title}</Text><Text style={s.small}>{friendlyDate(e.starts_at)}</Text></View></View>):<Text style={s.body}>No events yet. Start with a family celebration.</Text>}
 <SectionTitle title="Our little world"/>
 <View style={[s.row,{gap:12}]}><Pressable onPress={()=>router.push('/plans')} style={[s.card,{flex:1,gap:8}]}><RoundIcon name="checkbox-outline" bg={C.orange}/><Text style={[s.h1,{fontSize:28}]}>{pending.length}</Text><Text style={s.small}>Things to do</Text></Pressable><Pressable onPress={()=>router.push('/memories')} style={[s.card,{flex:1,gap:8}]}><RoundIcon name="images-outline" bg={C.blush}/><Text style={[s.h1,{fontSize:28}]}>{memories.length}</Text><Text style={s.small}>Moments saved</Text></Pressable></View><DemoNotice/>
 </Page>;
}
