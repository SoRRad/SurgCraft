import { describe,it,expect } from 'vitest'
import { OPPORTUNITIES } from '@/lib/opportunities/data'
import { getDeadlineUrgency } from '@/lib/opportunities/deadlines'
import { filterOpportunities, sortOpportunities } from '@/lib/opportunities/filter'
import { opportunityMatchesSearch } from '@/lib/opportunities/search'
import { opportunitiesToCsv, opportunityDeadlinesToIcs } from '@/lib/opportunities/export'

describe('opportunities utils',()=>{
 it('deadline urgency',()=>{expect(getDeadlineUrgency(null)).toBe('unknown')})
 it('search',()=>{expect(opportunityMatchesSearch(OPPORTUNITIES[0],'hand')).toBe(true)})
 it('filter/sort',()=>{const filtered=filterOpportunities(OPPORTUNITIES,{type:'conference'});expect(filtered.length).toBeGreaterThan(0);expect(sortOpportunities(filtered,'title')[0]).toBeTruthy()})
 it('csv/ics',()=>{expect(opportunitiesToCsv(OPPORTUNITIES)).toContain('id,title');expect(opportunityDeadlinesToIcs(OPPORTUNITIES)).toContain('VCALENDAR')})
})
