import type { DeadlineUrgency, Opportunity } from "./types"
const parse=(d:string|null)=>d?new Date(d):null
export const daysUntilDeadline=(d:string|null)=>{const x=parse(d); if(!x||Number.isNaN(x.getTime())) return null; return Math.ceil((x.getTime()-Date.now())/86400000)}
export const getDeadlineUrgency=(d:string|null):DeadlineUrgency=>{const days=daysUntilDeadline(d); if(days===null) return 'unknown'; if(days<0) return 'closed'; if(days<=14) return 'closing-soon'; if(days<=180) return 'open'; return 'future'}
export const isDeadlineOpen=(o:Opportunity)=>['open','closing-soon','future'].includes(getDeadlineUrgency(o.deadlineDate))
export const isDeadlineClosingSoon=(o:Opportunity)=>getDeadlineUrgency(o.deadlineDate)==='closing-soon'
export const getUpcomingDeadlines=(ops:Opportunity[],days=120)=>ops.filter(o=>{const d=daysUntilDeadline(o.deadlineDate);return d!==null&&d>=0&&d<=days})
export const getUpcomingMeetings=(ops:Opportunity[])=>ops.filter(o=>['conference','meeting'].includes(o.type)&&o.startDate)
export const getFundingOpportunities=(ops:Opportunity[])=>ops.filter(o=>['grant','funding','award','travel-scholarship'].includes(o.type))
export const getConferenceOpportunities=(ops:Opportunity[])=>ops.filter(o=>['conference','meeting'].includes(o.type))
