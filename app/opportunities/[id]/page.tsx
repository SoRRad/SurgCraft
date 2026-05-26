import Link from 'next/link'
import { getOpportunityById } from '@/lib/opportunities/data'
export default function Page({params}:{params:{id:string}}){const o=getOpportunityById(params.id);if(!o)return <main className='p-6'><p>Opportunity not found</p><Link href='/opportunities'>Back to Opportunity Hub</Link></main>;return <main className='p-6 space-y-2'><h1 className='text-2xl'>{o.title}</h1><p>{o.description}</p><a href={o.officialUrl}>Official website</a></main>}
