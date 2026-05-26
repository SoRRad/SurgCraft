"use client"
import Link from 'next/link'
import type { Opportunity } from '@/lib/opportunities/types'
export function OpportunityCard({opportunity}:{opportunity:Opportunity}){return <div className='rounded border p-3 space-y-1'><p className='font-semibold'>{opportunity.title}</p><p className='text-sm'>{opportunity.organization}</p><p className='text-xs'>{opportunity.deadlineUrgencyLabel}</p><div className='flex gap-2'><Link href={`/opportunities/${opportunity.id}`}>Details</Link><a href={opportunity.officialUrl} target='_blank'>Official</a></div></div>}
