const SAVED='orion:opportunity-bookmarks', COMP='orion:opportunity-compare', REM='orion:opportunity-reminders'; const can=()=>typeof window!=='undefined';
const emit=(k:string)=>{if(can()) window.dispatchEvent(new Event(k))}
const read=(k:string)=>{if(!can())return[] as string[];try{const p=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(p)?p.filter((x):x is string=>typeof x==='string'):[]}catch{return[]}}
const write=(k:string,v:string[])=>{if(can()) localStorage.setItem(k,JSON.stringify(v))}
export const listSavedOpportunityIds=()=>read(SAVED); export const isOpportunitySaved=(id:string)=>listSavedOpportunityIds().includes(id)
export const saveOpportunity=(id:string)=>{write(SAVED,[...new Set([...listSavedOpportunityIds(),id])]);emit('orion:opportunities:saved-updated')}
export const removeSavedOpportunity=(id:string)=>{write(SAVED,listSavedOpportunityIds().filter(x=>x!==id));emit('orion:opportunities:saved-updated')}
export const toggleSavedOpportunity=(id:string)=>isOpportunitySaved(id)?removeSavedOpportunity(id):saveOpportunity(id)
export const clearSavedOpportunities=()=>{write(SAVED,[]);emit('orion:opportunities:saved-updated')}
export const listCompareOpportunityIds=()=>read(COMP); export const isOpportunityCompared=(id:string)=>listCompareOpportunityIds().includes(id)
export const addOpportunityToCompare=(id:string)=>{write(COMP,[...new Set([...listCompareOpportunityIds(),id])].slice(0,4));emit('orion:opportunities:compare-updated')}
export const removeOpportunityFromCompare=(id:string)=>{write(COMP,listCompareOpportunityIds().filter(x=>x!==id));emit('orion:opportunities:compare-updated')}
export const clearOpportunityCompare=()=>{write(COMP,[]);emit('orion:opportunities:compare-updated')}
export const getOpportunityReminderPreferences=():number[]=>{if(!can())return[];try{const p=JSON.parse(localStorage.getItem(REM)||'[]');return Array.isArray(p)?p.filter((x):x is number=>typeof x==='number'):[]}catch{return[]}}
export const saveOpportunityReminderPreferences=(prefs:number[])=>{if(can()) localStorage.setItem(REM,JSON.stringify(prefs))}
