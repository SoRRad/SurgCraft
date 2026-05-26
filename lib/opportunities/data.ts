import opportunities from "@/content/opportunities/opportunities.json"
import categories from "@/content/opportunities/categories.json"
import bundles from "@/content/opportunities/bundles.json"
import type { Opportunity, OpportunityBundle } from "./types"
export const OPPORTUNITIES = opportunities as Opportunity[]
export const OPPORTUNITY_CATEGORIES = categories as string[]
export const OPPORTUNITY_BUNDLES = bundles as OpportunityBundle[]
export const getOpportunityById=(id:string)=>OPPORTUNITIES.find(o=>o.id===id)
