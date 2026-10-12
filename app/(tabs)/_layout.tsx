import React from 'react';
import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {C} from '../../src/theme';
type Icon=React.ComponentProps<typeof Ionicons>['name'];
const names:Record<string,[Icon,Icon]>={index:['home','home-outline'],calendar:['calendar','calendar-outline'],plans:['checkbox','checkbox-outline'],memories:['images','images-outline'],family:['people','people-outline']};
export default function TabsLayout(){return <Tabs screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:C.green,tabBarInactiveTintColor:'#A0ADA3',tabBarStyle:{backgroundColor:C.white,borderTopColor:C.line,height:78,paddingTop:8,paddingBottom:18},tabBarLabelStyle:{fontSize:10,fontWeight:'700'},tabBarIcon:({focused,color})=><Ionicons name={(names[route.name]??names.index)[focused?0:1]} color={color} size={22}/>})}>
 <Tabs.Screen name="index" options={{title:'Home'}}/><Tabs.Screen name="calendar" options={{title:'Calendar'}}/><Tabs.Screen name="plans" options={{title:'Plans'}}/><Tabs.Screen name="memories" options={{title:'Memories'}}/><Tabs.Screen name="family" options={{title:'Family'}}/>
 </Tabs>;}
