import { describe,it,expect } from 'vitest'
import { OPPORTUNITIES } from '@/lib/opportunities/data'
import { getDeadlineUrgency, getUpcomingDeadlines } from '@/lib/opportunities/deadlines'
import { filterOpportunities, sortOpportunities } from '@/lib/opportunities/filter'
import { opportunityMatchesSearch } from '@/lib/opportunities/search'
import { opportunitiesToCsv, opportunityDeadlinesToIcs } from '@/lib/opportunities/export'
import { getBundleById } from '@/lib/opportunities/bundles'
import { allTools } from '@/lib/llm/tools'

describe('opportunities utils',()=>{
 it('deadline urgency',()=>{expect(getDeadlineUrgency(null)).toBe('unknown')})
 it('search',()=>{expect(opportunityMatchesSearch(OPPORTUNITIES[0],'hand')).toBe(true)})
 it('filter/sort',()=>{const filtered=filterOpportunities(OPPORTUNITIES,{type:'conference'});expect(filtered.length).toBeGreaterThan(0);expect(sortOpportunities(filtered,'title')[0]).toBeTruthy()})
 it('bundle lookup',()=>{expect(getBundleById('hand-academic')).toBeTruthy()})
 it('csv/ics',()=>{expect(opportunitiesToCsv(OPPORTUNITIES)).toContain('id,title');const ics=opportunityDeadlinesToIcs(OPPORTUNITIES);expect(ics).toContain('VCALENDAR')})
 it('deadlines skip unknown',()=>{expect(getUpcomingDeadlines(OPPORTUNITIES,90).every(o=>!!o.deadlineDate)).toBe(true)})
 it('tool caps max results',async()=>{const r=await (allTools.show_opportunity_list as any).execute({maxResults:99});expect(r.length).toBeLessThanOrEqual(20)})
 it('show opportunity strict input',()=>{expect(()=> (allTools.show_opportunity as any).inputSchema.parse({opportunity_id:'x', fabricated:'y'})).toThrow()})
})
