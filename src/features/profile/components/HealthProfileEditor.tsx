import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/shared/ui/Button'
import { ChevronLeftIcon } from '@/shared/ui/icons'

import { useProfileStore } from '../useProfileStore'
import { AiConsentToggle, CancerFields, ConditionFields } from './HealthFields'

export function HealthProfileEditor() {
  const navigate = useNavigate()
  const store = useProfileStore()
  const [health, setHealth] = useState(store.health)
  const [ai, setAi] = useState(store.aiPersonalise)

  return (
    <form
      aria-label="Health profile"
      onSubmit={(e) => {
        e.preventDefault()
        store.setHealth(health)
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
      <AiConsentToggle checked={ai} onChange={setAi} />
      <Button type="submit" className="bg-pine hover:bg-ink w-full py-3.5 text-base">
        Save
      </Button>
    </form>
  )
}
