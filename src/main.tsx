import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/jost/300.css'
import '@fontsource-variable/nunito'

import { App } from '@/app/App'
import '@/app/styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
