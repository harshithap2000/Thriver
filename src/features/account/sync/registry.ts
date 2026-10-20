import { useAppointmentsStore } from '@/features/appointments'
import { useSavedGuides } from '@/features/learn'
import { useMedicationStore } from '@/features/medication'
import { useMeditationStore } from '@/features/meditation'
import { useMoodStore } from '@/features/mood-check-in'
import { useMoveStore } from '@/features/move'
import { useProfileStore } from '@/features/profile'
import { useAssistantConsent } from '@/features/records'
import { useRecoveryStore } from '@/features/recovery'

import { listAdapter, recordAdapter, setAdapter, settingsAdapter } from './adapters'
import type { SyncAdapter } from './types'

/**
 * The local stores that are backed up and synced. Not here yet, on purpose: records files,
 * journal entries and family notes. They will sync once end-to-end encryption (the "vault",
 * docs/architecture/backend.md §7) is in place; until then they stay on the device only.
 */
export const syncAdapters: readonly SyncAdapter[] = [
  settingsAdapter('profile', useProfileStore, [
    'name',
    'joinedAt',
    'onboarded',
    'health',
    'careTeam',
    'aiPersonalise',
    'aiConsentAt',
  ]),
  settingsAdapter('assistant_settings', useAssistantConsent, [
    'consented',
    'consentedAt',
    'language',
  ]),
  recordAdapter('symptom_check_in', useRecoveryStore, 'checkIns'),
  recordAdapter('clearance', useRecoveryStore, 'clearances'),
  recordAdapter('plan_day', useRecoveryStore, 'planDone'),
  recordAdapter('mood_check_in', useMoodStore, 'checkIns'),
  listAdapter('medication', useMedicationStore, 'medications', (m: { id: string }) => m.id),
  recordAdapter('dose_day', useMedicationStore, 'taken'),
  listAdapter('appointment', useAppointmentsStore, 'appointments', (a: { id: string }) => a.id),
  listAdapter('activity', useMoveStore, 'activities', (a: { id: string }) => a.id),
  settingsAdapter('move_settings', useMoveStore, ['dailyGoal']),
  listAdapter(
    'meditation_session',
    useMeditationStore,
    'history',
    (s: { sessionId: string; completedAt: string }) => `${s.completedAt}|${s.sessionId}`,
  ),
  setAdapter('saved_guide', useSavedGuides, 'saved'),
]
