import { OPPORTUNITIES } from '@/lib/opportunities/data'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
export default function Page(){return <main className='p-6 space-y-4'><h1 className='text-2xl font-semibold'>Opportunity Hub</h1><p>Conferences, abstract deadlines, grants, and funding opportunities.</p>{OPPORTUNITIES.map(o=><OpportunityCard key={o.id} opportunity={o} />)}</main>}
