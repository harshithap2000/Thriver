/** The health profile collected at sign-up. Used to personalise Learn and Shop. */

export const cancerTypes = [
  { id: 'breast', label: 'Breast' },
  { id: 'head-neck', label: 'Head & neck (mouth, throat)' },
  { id: 'gynae', label: 'Cervical, ovarian or uterine' },
  { id: 'colorectal', label: 'Bowel (colorectal)' },
  { id: 'lung', label: 'Lung' },
  { id: 'prostate', label: 'Prostate' },
  { id: 'stomach', label: 'Stomach or food pipe' },
  { id: 'blood', label: 'Blood (leukaemia, lymphoma, myeloma)' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'other', label: 'Other' },
] as const

export const treatments = [
  { id: 'surgery', label: 'Surgery' },
  { id: 'chemotherapy', label: 'Chemotherapy' },
  { id: 'radiotherapy', label: 'Radiotherapy' },
  { id: 'hormone', label: 'Hormone therapy' },
  { id: 'immunotherapy', label: 'Immunotherapy / targeted' },
] as const

export const conditions = [
  { id: 'lymphoedema', label: 'Lymph nodes removed or swelling risk (lymphoedema)' },
  { id: 'stoma', label: 'Stoma / ostomy bag' },
  { id: 'swallowing', label: 'Sore mouth or difficulty swallowing' },
  { id: 'neuropathy', label: 'Numbness or tingling in hands or feet' },
  { id: 'bones', label: 'Cancer has affected my bones' },
  { id: 'hairLoss', label: 'Hair loss' },
] as const

export type CancerType = (typeof cancerTypes)[number]['id']
export type TreatmentId = (typeof treatments)[number]['id']
export type ConditionId = (typeof conditions)[number]['id']

export interface HealthProfile {
  cancerType: CancerType | null
  /** YYYY-MM-DD, or null if no surgery / not shared. */
  surgeryDate: string | null
  treatments: TreatmentId[]
  conditions: ConditionId[]
}

export const emptyHealth: HealthProfile = {
  cancerType: null,
  surgeryDate: null,
  treatments: [],
  conditions: [],
}

/** Who a guide or product is for. Missing fields mean "everyone". */
export interface Audience {
  cancerTypes?: CancerType[]
  conditions?: ConditionId[]
  treatments?: TreatmentId[]
}

/**
 * How relevant content is to this person. 0 for general content; positive when it matches;
 * -1 when it targets other people specifically (hide by default).
 */
export function relevance(audience: Audience | undefined, health: HealthProfile) {
  if (!audience) return 0
  let score = 0
  if (health.cancerType && audience.cancerTypes?.includes(health.cancerType)) score += 3
  score += 2 * health.conditions.filter((c) => audience.conditions?.includes(c)).length
  if (health.treatments.some((t) => audience.treatments?.includes(t))) score += 1
  return score > 0 ? score : -1
}

/** Orders content for this person: matches first, then general; others last or hidden. */
export function personalise<T extends { audience?: Audience }>(
  items: readonly T[],
  health: HealthProfile,
) {
  const scored = items.map((item, index) => ({
    item,
    index,
    score: relevance(item.audience, health),
  }))
  const hasProfile =
    health.cancerType !== null || health.conditions.length > 0 || health.treatments.length > 0
  const visible = scored
    .filter((s) => !hasProfile || s.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
  return {
    items: visible.map((s) => ({ ...s.item, forYou: hasProfile && s.score > 0 })),
    hidden: scored.filter((s) => hasProfile && s.score < 0).map((s) => s.item),
  }
}

export const cancerLabel = (id: CancerType | null) =>
  cancerTypes.find((c) => c.id === id)?.label ?? null

/** Whole weeks since surgery, or null. */
export function weeksSince(date: string | null, today = new Date()) {
  if (!date) return null
  const [y = 0, m = 1, d = 1] = date.split('-').map(Number)
  const days = Math.floor((today.getTime() - new Date(y, m - 1, d).getTime()) / 86_400_000)
  return days < 0 ? null : Math.floor(days / 7)
}
