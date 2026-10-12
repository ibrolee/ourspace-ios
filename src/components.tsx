import React from 'react';
import {Pressable,ScrollView,StyleSheet,Text,View,type ViewStyle} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C} from './theme';
import type {Kind} from './OurSpaceContext';

export const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.cream},
 page:{paddingHorizontal:22,paddingBottom:120,paddingTop:13,gap:19},
 h1:{color:C.ink,fontSize:31,fontWeight:'800',letterSpacing:-1.2},
 h2:{color:C.ink,fontSize:20,fontWeight:'800'},
 h3:{color:C.ink,fontSize:16,fontWeight:'700'},
 body:{color:C.muted,fontSize:14,lineHeight:22},
 small:{color:C.muted,fontSize:12},
 card:{backgroundColor:C.white,borderRadius:22,padding:17,borderWidth:1,borderColor:C.line},
 row:{flexDirection:'row',alignItems:'center'},
 input:{borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:C.white,padding:15,color:C.ink,fontSize:16}
});
export function Page({children}:{children:React.ReactNode}){return <SafeAreaView style={s.screen} edges={['top']}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.page}>{children}</ScrollView></SafeAreaView>;}
export function SectionTitle({title,action,onPress}:{title:string;action?:string;onPress?:()=>void}){return <View style={[s.row,{justifyContent:'space-between'}]}><Text style={s.h2}>{title}</Text>{action?<Pressable onPress={onPress}><Text style={{color:C.green,fontWeight:'800'}}>{action} ›</Text></Pressable>:null}</View>;}
export function RoundIcon({name,bg=C.pale,color=C.green,size=22}:{name:React.ComponentProps<typeof Ionicons>['name'];bg?:string;color?:string;size?:number}){return <View style={{height:48,width:48,borderRadius:16,backgroundColor:bg,alignItems:'center',justifyContent:'center'}}><Ionicons name={name} size={size} color={color}/></View>;}
export function AddButton({kind,style}:{kind:Kind;style?:ViewStyle}){return <Pressable accessibilityRole="button" onPress={()=>router.push({pathname:'/new',params:{kind}})} style={[{backgroundColor:C.green,padding:16,borderRadius:17,alignItems:'center',flexDirection:'row',justifyContent:'center',gap:8},style]}><Ionicons name="add" color="white" size={19}/><Text style={{fontWeight:'800',color:'white'}}>Add {kind}</Text></Pressable>;}
export function Empty({icon,title,message}:{icon:React.ComponentProps<typeof Ionicons>['name'];title:string;message:string}){return <View style={[s.card,{alignItems:'center',paddingVertical:33,gap:9}]}><RoundIcon name={icon}/><Text style={s.h3}>{title}</Text><Text style={[s.body,{textAlign:'center'}]}>{message}</Text></View>;}
export function DemoNotice(){return <Text style={[s.small,{marginTop:10}]}>Private offline iOS build · Other devices are not synced yet.</Text>;}
export const friendlyDate=(iso:string,options?:Intl.DateTimeFormatOptions)=>new Date(iso).toLocaleDateString(undefined,options??{month:'short',day:'numeric',year:'numeric'});
