import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
export function OpportunityListResult({data}:{data:any[]}){if(!data?.length)return <p className='text-xs'>No curated result available. Browse Opportunity Hub.</p>;return <div className='space-y-2'>{data.slice(0,4).map((o:any)=><OpportunityCard key={o.id} opportunity={o}/>)}</div>}
