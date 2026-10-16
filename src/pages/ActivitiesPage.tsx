import { Link } from 'react-router'

import { PlaceholderPage } from './PlaceholderPage'

export default function ActivitiesPage() {
  return (
    <PlaceholderPage title="Activities">
      <Link to="/posts" className="text-pine inline-block font-semibold underline">
        View the example data feature (posts)
      </Link>
    </PlaceholderPage>
  )
}
