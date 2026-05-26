import { OPPORTUNITY_BUNDLES, OPPORTUNITIES } from './data'
export const getBundleById=(id:string)=>OPPORTUNITY_BUNDLES.find(b=>b.id===id)
export const getBundleOpportunities=(id:string)=>{const b=getBundleById(id); if(!b) return []; return OPPORTUNITIES.filter(o=>b.recommendedOpportunityIds.includes(o.id))}
