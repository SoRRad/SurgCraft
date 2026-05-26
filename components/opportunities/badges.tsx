import type { Opportunity } from '@/lib/opportunities/types'
export const OpportunityTypeBadge=({type}:{type:Opportunity['type']})=><span className='rounded bg-surface-subtle px-2 py-0.5 text-xs'>{type}</span>
export const DeadlineBadge=({label}:{label:string})=><span className='rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-800'>{label}</span>
export const SourceTrustBadge=({label}:{label:string})=><span className='rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-800'>{label}</span>
export const ReviewStatusBadge=({status}:{status:string})=><span className='rounded bg-slate-100 px-2 py-0.5 text-xs'>{status}</span>
export const FundingAmountBadge=({amount}:{amount:string|null})=><span className='rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800'>{amount??'Amount not listed.'}</span>
