import { opportunityMatchesSearch } from './search'
import { getDeadlineUrgency } from './deadlines'
import type { Opportunity } from './types'
export type OpportunityFilters={query?:string;type?:string;category?:string;deadlineStatus?:string;careerStage?:string;savedIds?:string[]}
export function filterOpportunities(ops:Opportunity[],f:OpportunityFilters){return ops.filter(o=>(!f.query||opportunityMatchesSearch(o,f.query))&&(!f.type||o.type===f.type)&&(!f.category||o.categories.includes(f.category))&&(!f.deadlineStatus||getDeadlineUrgency(o.deadlineDate)===f.deadlineStatus)&&(!f.careerStage||o.careerStage===f.careerStage)&&(!f.savedIds||f.savedIds.includes(o.id)))}
export function sortOpportunities(ops:Opportunity[],sort='deadline-soonest'){return [...ops].sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):(a.deadlineDate||'9999').localeCompare(b.deadlineDate||'9999'))}
