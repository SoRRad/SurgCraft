const SAVED = 'orion:opportunity-bookmarks'
const COMP = 'orion:opportunity-compare'
const REM = 'orion:opportunity-reminders'
const canUseWindow = () => typeof window !== 'undefined'

function readStringArray(key: string): string[] {
  if (!canUseWindow()) return []
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch { return [] }
}
const writeStringArray = (key: string, value: string[]) => { if (canUseWindow()) localStorage.setItem(key, JSON.stringify(value)) }

export const listSavedOpportunityIds = () => readStringArray(SAVED)
export const isOpportunitySaved = (id: string) => listSavedOpportunityIds().includes(id)
export const saveOpportunity = (id: string) => { const next = [...new Set([...listSavedOpportunityIds(), id])]; writeStringArray(SAVED, next); if (canUseWindow()) window.dispatchEvent(new Event('orion:opportunities:saved-updated')) }
export const removeSavedOpportunity = (id: string) => { writeStringArray(SAVED, listSavedOpportunityIds().filter((x) => x !== id)); if (canUseWindow()) window.dispatchEvent(new Event('orion:opportunities:saved-updated')) }
export const toggleSavedOpportunity = (id: string) => isOpportunitySaved(id) ? removeSavedOpportunity(id) : saveOpportunity(id)
export const clearSavedOpportunities = () => writeStringArray(SAVED, [])

export const listCompareOpportunityIds = () => readStringArray(COMP)
export const addOpportunityToCompare = (id: string) => { const next = [...new Set([...listCompareOpportunityIds(), id])].slice(0, 4); writeStringArray(COMP, next); if (canUseWindow()) window.dispatchEvent(new Event('orion:opportunities:compare-updated')) }
export const removeOpportunityFromCompare = (id: string) => writeStringArray(COMP, listCompareOpportunityIds().filter((x) => x !== id))
export const clearOpportunityCompare = () => writeStringArray(COMP, [])
export const isOpportunityCompared = (id: string) => listCompareOpportunityIds().includes(id)

export const getOpportunityReminderPreferences = (): number[] => {
  if (!canUseWindow()) return []
  try { const parsed = JSON.parse(localStorage.getItem(REM) || '[]'); return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === 'number') : [] } catch { return [] }
}
export const saveOpportunityReminderPreferences = (prefs: number[]) => { if (canUseWindow()) localStorage.setItem(REM, JSON.stringify(prefs)) }
