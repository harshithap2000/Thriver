import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/shared/ui/Button'
import { inputClass } from '@/shared/ui/Field'

import { emptyHealth, type HealthProfile } from '../health'
import { MAX_NAME_LENGTH, useProfileStore } from '../useProfileStore'
import { AiConsentToggle, CancerFields, ConditionFields } from './HealthFields'

const STEPS = 5

function Step({
  step,
  title,
  subtitle,
  children,
  onBack,
}: {
  step: number
  title: string
  subtitle?: string
  children: ReactNode
  onBack?: () => void
}) {
  return (
    <section aria-labelledby="onboarding-title" className="space-y-6">
      <div className="space-y-2">
        <div className="text-ink-muted flex items-center justify-between text-sm">
          {onBack ? (
            <button type="button" onClick={onBack} className="hover:text-ink font-semibold">
              ‹ Back
            </button>
          ) : (
            <span />
          )}
          <span>
            Step {step} of {STEPS - 1}
          </span>
        </div>
        <div className="bg-mint h-2 overflow-hidden rounded-full" aria-hidden="true">
          <div
            className="bg-pine h-full rounded-full"
            style={{ width: `${(step / (STEPS - 1)) * 100}%` }}
          />
        </div>
      </div>
      <div>
        <h1 id="onboarding-title" className="text-ink text-[1.7rem] leading-tight font-extrabold">
          {title}
        </h1>
        {subtitle && <p className="text-ink-muted mt-1.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

/** First-run sign-up. Everything is stored on this device until accounts launch. */
export function Onboarding() {
  const navigate = useNavigate()
  const store = useProfileStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(store.name)
  const [health, setHealth] = useState<HealthProfile>(store.health ?? emptyHealth)
  const [ai, setAi] = useState(store.aiPersonalise)

  const finish = () => {
    store.setName(name)
    store.setHealth(health)
    store.setAiPersonalise(ai)
    store.completeOnboarding()
    navigate('/', { replace: true })
  }

  if (step === 0) {
    return (
      <section
        aria-labelledby="welcome-title"
        className="flex min-h-[80dvh] flex-col justify-between gap-8 pt-8"
      >
        <div className="space-y-4 text-center">
          <p className="text-6xl" aria-hidden="true">
            🌱
          </p>
          <h1 id="welcome-title" className="text-ink text-3xl font-extrabold">
            Welcome to Thriver
          </h1>
          <p className="text-ink-muted text-lg">
            Your companion for life after cancer treatment: recovery, records, learning and support,
            in one place.
          </p>
        </div>
        <div className="space-y-3">
          <Button onClick={() => setStep(1)} className="bg-pine hover:bg-ink w-full py-4 text-base">
            Get started
          </Button>
          <p className="text-ink-muted rounded-2xl bg-white p-4 text-center text-sm shadow-sm">
            <b className="text-ink">Already use Thriver on another phone?</b> Signing in and syncing
            between phones is coming soon. For now, everything stays on this phone.
          </p>
        </div>
      </section>
    )
  }

  if (step === 1) {
    return (
      <Step
        step={1}
        title="What should we call you?"
        subtitle="Just your first name is fine."
        onBack={() => setStep(0)}
      >
        <input
          aria-label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="given-name"
          placeholder="Your name"
          className={`${inputClass} py-3.5 text-lg`}
        />
        <Button onClick={() => setStep(2)} className="bg-pine hover:bg-ink w-full py-3.5 text-base">
          Continue
        </Button>
      </Step>
    )
  }

  if (step === 2) {
    return (
      <Step
        step={2}
        title="Tell us about your cancer"
        subtitle="So we can show guides and products that fit your recovery. Skip anything you’d rather not share."
        onBack={() => setStep(1)}
      >
        <CancerFields value={health} onChange={setHealth} />
        <div className="space-y-2">
          <Button
            onClick={() => setStep(3)}
            className="bg-pine hover:bg-ink w-full py-3.5 text-base"
          >
            Continue
          </Button>
          <button
            type="button"
            onClick={() => {
              setHealth(emptyHealth)
              setStep(4)
            }}
            className="text-ink-muted w-full py-2 text-sm font-semibold"
          >
            I’d rather not say
          </button>
        </div>
      </Step>
    )
  }

  if (step === 3) {
    return (
      <Step
        step={3}
        title="Anything your care team mentioned?"
        subtitle="Tick any that apply. This helps us keep suggestions safe for you."
        onBack={() => setStep(2)}
      >
        <ConditionFields value={health} onChange={setHealth} />
        <Button onClick={() => setStep(4)} className="bg-pine hover:bg-ink w-full py-3.5 text-base">
          {health.conditions.length ? 'Continue' : 'None of these, continue'}
        </Button>
      </Step>
    )
  }

  return (
    <Step
      step={4}
      title="Your privacy"
      subtitle="Your health information belongs to you."
      onBack={() => setStep(3)}
    >
      <ul className="text-ink space-y-2">
        <li>📱 Your profile and records are stored only on this phone.</li>
        <li>✏️ You can change or delete them any time in Profile.</li>
      </ul>
      <AiConsentToggle checked={ai} onChange={setAi} />
      <Button onClick={finish} className="bg-pine hover:bg-ink w-full py-3.5 text-base">
        Finish
      </Button>
    </Step>
  )
}
