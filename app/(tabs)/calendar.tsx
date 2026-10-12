import React from 'react';
import {Alert,Pressable,Text,View} from 'react-native';
import {Page,AddButton,Empty,SectionTitle,RoundIcon,friendlyDate,s} from '../../src/components';
import {C} from '../../src/theme';
import {useOurSpace} from '../../src/OurSpaceContext';
export default function Calendar(){
 const {events,remove}=useOurSpace();
 const upcoming=events.filter(x=>new Date(x.starts_at)>=new Date());
 const past=events.filter(x=>new Date(x.starts_at)<new Date());
 const display=(items:typeof events)=>items.map(event=><View key={event.id} style={[s.card,{gap:7}]}><View style={[s.row,{gap:12}]}><RoundIcon name="calendar-outline"/><View style={{flex:1,gap:4}}><Text style={s.h3}>{event.title}</Text><Text style={s.small}>{friendlyDate(event.starts_at,{weekday:'long',month:'short',day:'numeric',year:'numeric'})}</Text></View><Pressable accessibilityLabel="Delete event" onPress={()=>Alert.alert('Delete event?','This cannot be undone.',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>void remove('event',event.id)}])}><Text style={{color:'#A45346'}}>Remove</Text></Pressable></View>{event.note?<Text style={s.body}>{event.note}</Text>:null}<Text style={s.small}>{event.visibility==='private'?'Only me':'For family (on this phone)'}</Text></View>);
 return <Page><Text style={s.h1}>Family calendar</Text><Text style={s.body}>Make time for moments that matter, big or small.</Text><AddButton kind="event"/><SectionTitle title="Coming up"/>{upcoming.length?display(upcoming):<Empty icon="calendar-outline" title="Nothing scheduled" message="Add birthdays, celebrations and plans to your family calendar."/>}{past.length?<><SectionTitle title="Past events"/>{display(past)}</>:null}</Page>;
}
