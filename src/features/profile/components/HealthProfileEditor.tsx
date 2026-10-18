import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { ChevronLeftIcon } from '@/shared/ui/icons'

import { useProfileStore } from '../useProfileStore'
import { AiConsentToggle, CancerFields, ConditionFields } from './HealthFields'

export function HealthProfileEditor() {
  const navigate = useNavigate()
  const store = useProfileStore()
  const [health, setHealth] = useState(store.health)
  const [ai, setAi] = useState(store.aiPersonalise)
  const [careTeam, setCareTeam] = useState(store.careTeam)

  return (
    <form
      aria-label="Health profile"
      onSubmit={(e) => {
        e.preventDefault()
        store.setHealth(health)
        store.setCareTeam(careTeam)
        if (ai !== store.aiPersonalise) store.setAiPersonalise(ai)
        navigate('/profile')
      }}
      className="space-y-6"
    >
      <Link
        to="/profile"
        className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
      >
        <ChevronLeftIcon className="size-4" /> Profile
      </Link>
      <h1 className="text-ink text-2xl font-extrabold">Your health profile</h1>
      <CancerFields value={health} onChange={setHealth} />
      <div className="space-y-2">
        <h2 className="text-ink text-sm font-bold">Things to watch for</h2>
        <ConditionFields value={health} onChange={setHealth} />
      </div>
      <fieldset className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <legend className="text-ink float-left mb-1 text-sm font-bold">
          Your hospital or care team
        </legend>
        <p className="text-ink-muted clear-left text-sm">
          Shown if your check-in finds a warning sign, so you can call them quickly. Stays on this
          phone.
        </p>
        <Field
          label="Name"
          placeholder="e.g. Oncology helpdesk, City Hospital"
          value={careTeam.name}
          onChange={(e) => setCareTeam({ ...careTeam, name: e.target.value })}
          maxLength={60}
        />
        <Field
          label="Phone number"
          type="tel"
          inputMode="tel"
          placeholder="e.g. 080 1234 5678"
          value={careTeam.phone}
          onChange={(e) => setCareTeam({ ...careTeam, phone: e.target.value })}
          maxLength={20}
        />
      </fieldset>
      <AiConsentToggle checked={ai} onChange={setAi} />
      <Button type="submit" className="bg-pine hover:bg-ink w-full py-3.5 text-base">
        Save
      </Button>
    </form>
  )
}
