"use client"
import { useMemo, useState } from 'react'
import { OPPORTUNITIES } from '@/lib/opportunities/data'
import { getUpcomingDeadlines } from '@/lib/opportunities/deadlines'
import { downloadTextFile, opportunityDeadlinesToIcs } from '@/lib/opportunities/export'
export default function Page(){const [days,setDays]=useState(180);const rows=useMemo(()=>getUpcomingDeadlines(OPPORTUNITIES,days),[days]);return <main className='p-6 space-y-3'><h1 className='text-2xl'>Deadline calendar</h1><p className='text-xs'>Local/static demo data. Verify official websites before submission.</p><select value={days} onChange={e=>setDays(Number(e.target.value))} className='border rounded px-2 py-1'><option value={90}>Next 90 days</option><option value={180}>Next 180 days</option><option value={365}>Next 365 days</option></select><button className='border rounded px-2 ml-2' onClick={()=>downloadTextFile('visible-deadlines.ics',opportunityDeadlinesToIcs(rows),'text/calendar')}>Export visible ICS</button>{rows.length===0?<p>No upcoming curated deadlines found. Deadline unknown for many records.</p>:<ul>{rows.map(o=><li key={o.id}>{o.title} — {o.deadlineDate}</li>)}</ul>}</main>}
