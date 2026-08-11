import { create } from 'zustand'
import { EventItem, AppSettings, Theme } from './types'

const key='focuscal:v6'
const today=new Date()
const iso=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const seed:EventItem[]=[
 {id:'1',title:'企画書の最終チェック',date:iso(today),start:'09:00',end:'10:00',category:'work',priority:'high',completed:false},
 {id:'2',title:'30分ランニング',date:iso(today),start:'18:30',end:'19:00',category:'health',priority:'normal',completed:false},
 {id:'3',title:'読書 20ページ',date:iso(new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)),category:'study',priority:'low',completed:false},
]

type State={events:EventItem[];settings:AppSettings;selectedDate:string;setSelectedDate:(d:string)=>void;setTheme:(t:Theme)=>void;toggleDone:(id:string)=>void;addEvent:(e:Omit<EventItem,'id'|'completed'>)=>void;updateEvent:(e:EventItem)=>void;deleteEvent:(id:string)=>void;reset:()=>void}
const initial=()=>{try{const v=JSON.parse(localStorage.getItem(key)||'');return v.events?{events:v.events,settings:{...v.settings}}:null}catch{return null}}
const saved=initial()
export const useStore=create<State>((set,get)=>({
 events:saved?.events||seed, settings:saved?.settings||{theme:'violet',weekStartsMonday:true,reducedMotion:false}, selectedDate:iso(today),
 setSelectedDate:d=>set({selectedDate:d}), setTheme:theme=>set(s=>({...s,settings:{...s.settings,theme}})),
 toggleDone:id=>set(s=>({events:s.events.map(e=>e.id===id?{...e,completed:!e.completed}:e)})),
 addEvent:e=>set(s=>({events:[...s.events,{...e,id:crypto.randomUUID(),completed:false}]})),
 updateEvent:e=>set(s=>({events:s.events.map(x=>x.id===e.id?e:x)})), deleteEvent:id=>set(s=>({events:s.events.filter(e=>e.id!==id)})),
 reset:()=>set({events:seed,settings:{theme:'violet',weekStartsMonday:true,reducedMotion:false}})
}))
useStore.subscribe(s=>{try{localStorage.setItem(key,JSON.stringify({events:s.events,settings:s.settings}))}catch{}})
export {iso}
