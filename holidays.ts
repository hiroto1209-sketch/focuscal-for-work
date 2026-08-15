export type JapaneseHoliday = {
  date: string
  name: string
  official: boolean
}

const exact: Record<string, string> = {
  // 2025
  '2025-01-01':'元日','2025-01-13':'成人の日','2025-02-11':'建国記念の日','2025-02-23':'天皇誕生日','2025-02-24':'休日',
  '2025-03-20':'春分の日','2025-04-29':'昭和の日','2025-05-03':'憲法記念日','2025-05-04':'みどりの日','2025-05-05':'こどもの日','2025-05-06':'休日',
  '2025-07-21':'海の日','2025-08-11':'山の日','2025-09-15':'敬老の日','2025-09-23':'秋分の日','2025-10-13':'スポーツの日',
  '2025-11-03':'文化の日','2025-11-23':'勤労感謝の日','2025-11-24':'休日',

  // 2026 — 内閣府公表日
  '2026-01-01':'元日','2026-01-12':'成人の日','2026-02-11':'建国記念の日','2026-02-23':'天皇誕生日','2026-03-20':'春分の日',
  '2026-04-29':'昭和の日','2026-05-03':'憲法記念日','2026-05-04':'みどりの日','2026-05-05':'こどもの日','2026-05-06':'休日',
  '2026-07-20':'海の日','2026-08-11':'山の日','2026-09-21':'敬老の日','2026-09-22':'休日','2026-09-23':'秋分の日',
  '2026-10-12':'スポーツの日','2026-11-03':'文化の日','2026-11-23':'勤労感謝の日',

  // 2027 — 内閣府公表日
  '2027-01-01':'元日','2027-01-11':'成人の日','2027-02-11':'建国記念の日','2027-02-23':'天皇誕生日','2027-03-21':'春分の日','2027-03-22':'休日',
  '2027-04-29':'昭和の日','2027-05-03':'憲法記念日','2027-05-04':'みどりの日','2027-05-05':'こどもの日',
  '2027-07-19':'海の日','2027-08-11':'山の日','2027-09-20':'敬老の日','2027-09-23':'秋分の日','2027-10-11':'スポーツの日',
  '2027-11-03':'文化の日','2027-11-23':'勤労感謝の日',
}

const pad=(n:number)=>String(n).padStart(2,'0')
const key=(y:number,m:number,d:number)=>`${y}-${pad(m)}-${pad(d)}`
const nthMonday=(y:number,m:number,n:number)=>{
  const first=new Date(y,m-1,1)
  const offset=(8-first.getDay())%7
  return 1+offset+(n-1)*7
}

// Current-law fallback for years not yet published by the Cabinet Office.
// Equinox formulas are the standard Japanese calendar approximation for 1980–2099.
const vernal=(y:number)=>Math.floor(20.8431+0.242194*(y-1980)-Math.floor((y-1980)/4))
const autumnal=(y:number)=>Math.floor(23.2488+0.242194*(y-1980)-Math.floor((y-1980)/4))

function baseHolidays(y:number){
  const map=new Map<string,string>()
  const add=(m:number,d:number,name:string)=>map.set(key(y,m,d),name)
  add(1,1,'元日')
  add(1,nthMonday(y,1,2),'成人の日')
  add(2,11,'建国記念の日')
  if(y>=2020)add(2,23,'天皇誕生日')
  if(y>=1980&&y<=2099)add(3,vernal(y),'春分の日')
  add(4,29,'昭和の日')
  add(5,3,'憲法記念日')
  add(5,4,'みどりの日')
  add(5,5,'こどもの日')
  add(7,nthMonday(y,7,3),'海の日')
  add(8,11,'山の日')
  add(9,nthMonday(y,9,3),'敬老の日')
  if(y>=1980&&y<=2099)add(9,autumnal(y),'秋分の日')
  add(10,nthMonday(y,10,2),'スポーツの日')
  add(11,3,'文化の日')
  add(11,23,'勤労感謝の日')
  return map
}

function calculatedYear(y:number){
  const map=baseHolidays(y)
  // 国民の休日：前日と翌日が祝日の平日
  for(let m=1;m<=12;m++){
    const last=new Date(y,m,0).getDate()
    for(let d=2;d<last;d++){
      const cur=key(y,m,d)
      if(map.has(cur))continue
      const prev=new Date(y,m-1,d-1),next=new Date(y,m-1,d+1)
      const pk=key(prev.getFullYear(),prev.getMonth()+1,prev.getDate())
      const nk=key(next.getFullYear(),next.getMonth()+1,next.getDate())
      if(map.has(pk)&&map.has(nk))map.set(cur,'休日')
    }
  }
  // 振替休日：日曜の祝日の後、最初の祝日でない日
  const originals=[...map.entries()]
  for(const [date] of originals){
    const d=new Date(date+'T00:00:00')
    if(d.getDay()!==0)continue
    let candidate=new Date(d)
    do{candidate.setDate(candidate.getDate()+1)}while(map.has(key(candidate.getFullYear(),candidate.getMonth()+1,candidate.getDate())))
    map.set(key(candidate.getFullYear(),candidate.getMonth()+1,candidate.getDate()),'休日')
  }
  return map
}

const cache=new Map<number,Map<string,string>>()

export function getJapaneseHoliday(date:string):JapaneseHoliday|null{
  if(exact[date])return {date,name:exact[date],official:true}
  const y=Number(date.slice(0,4))
  if(!Number.isFinite(y))return null
  if(!cache.has(y))cache.set(y,calculatedYear(y))
  const name=cache.get(y)?.get(date)
  return name?{date,name,official:false}:null
}
