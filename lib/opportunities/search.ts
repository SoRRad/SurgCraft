import type { Opportunity } from "./types"
export const normalizeSearchText=(t:string)=>t.toLowerCase().trim()
export const opportunityMatchesSearch=(o:Opportunity,q:string)=>{const n=normalizeSearchText(q);if(!n)return true;const h=[o.title,o.organization,o.description,o.categories.join(' '),o.tags.join(' '),o.projectFitKeywords.join(' ')].join(' ').toLowerCase();return h.includes(n)}
