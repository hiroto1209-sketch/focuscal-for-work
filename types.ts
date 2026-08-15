export type Theme = 'violet' | 'sakura' | 'ocean' | 'ember' | 'matrix'
export type Priority = 'low' | 'normal' | 'high'
export type EventItem = {
  id:string; title:string; date:string; start?:string; end?:string; memo?:string;
  category:'work'|'personal'|'health'|'study'; priority:Priority; completed:boolean;
}
export type AppSettings = {
  theme:Theme
  weekStartsMonday:boolean
  reducedMotion:boolean
  showHolidays:boolean
}
