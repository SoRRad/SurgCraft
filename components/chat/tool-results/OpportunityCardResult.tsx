import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
export function OpportunityCardResult({data}:{data:any}){if(!data)return <p className='text-xs'>No curated result available. Browse Opportunity Hub.</p>;return <OpportunityCard opportunity={data}/>} 
