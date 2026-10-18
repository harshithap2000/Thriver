import { buildSummary } from './buildSummary'

describe('buildSummary', () => {
  it('summarises the period from the stored data', () => {
    const summary = buildSummary({
      days: 4,
      today: new Date(2026, 9, 16),
      activePlanIds: ['walk', 'arm'],
      planDone: {
        '2026-10-13': ['walk', 'protein'],
        '2026-10-16': ['walk', 'arm'],
        '2026-10-01': ['walk'],
      },
      checkIns: {
        '2026-10-13': { tiredness: 6, pain: 3, warnings: [] },
        '2026-10-14': { tiredness: 6, pain: 3, warnings: ['fever', 'swelling'] },
        '2026-10-16': { tiredness: 4, pain: 2, warnings: [] },
      },
      activities: [
        { date: '2026-10-13', minutes: 10 },
        { date: '2026-10-16', minutes: 15 },
        { date: '2026-10-16', minutes: 5 },
        { date: '2026-09-01', minutes: 60 },
      ],
      medications: [{ id: 'm', times: ['08:00', '20:00'] }],
      taken: { '2026-10-15': { 'm@08:00': 'x', 'm@20:00': 'x' }, '2026-10-16': { 'm@08:00': 'x' } },
    })

    expect(summary).toMatchObject({
      from: '2026-10-13',
      to: '2026-10-16',
      sessions: { done: 3, planned: 8 },
      activeMinutes: 30,
      doses: { taken: 3, due: 8 },
      checkInCount: 3,
      tiredness: { first: 6, last: 4 },
      pain: { first: 3, last: 2 },
      swellingDays: 1,
      alerts: [{ date: '2026-10-14', warnings: ['fever', 'swelling'] }],
    })
    expect(summary.dailyMinutes.map((d) => d.minutes)).toEqual([10, 0, 0, 20])
  })

  it('leaves out what wasn’t recorded', () => {
    const summary = buildSummary({
      days: 7,
      activePlanIds: [],
      planDone: {},
      checkIns: {},
      activities: [],
      medications: [],
      taken: {},
    })
    expect(summary).toMatchObject({ doses: null, tiredness: null, alerts: [], activeMinutes: 0 })
  })
})
