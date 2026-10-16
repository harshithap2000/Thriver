import { useState } from 'react'

import { useProfileStore } from '@/features/profile'

import { inviteLink } from '../notes'
import { ShareLink } from './ShareLink'

export function InviteFamily() {
  const name = useProfileStore((s) => s.name)
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-3xl bg-linear-to-br from-[#fbe9ee] to-[#f1e8f8] p-5">
      <p className="text-ink font-bold">Invite your family 💛</p>
      <p className="text-ink-muted mt-1 text-sm">
        Send them a link to write you a note. When they send it back, tap their link to add it here.
      </p>
      {open ? (
        <div className="mt-4">
          <ShareLink
            url={inviteLink(name)}
            title="Leave me a note on Thriver"
            text={`Leave ${name || 'me'} a little note on Thriver 💌`}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-pine hover:bg-ink mt-3 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm"
        >
          Get invite link
        </button>
      )}
    </div>
  )
}
