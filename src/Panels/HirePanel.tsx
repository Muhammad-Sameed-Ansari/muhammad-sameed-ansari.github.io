import { portfolio } from '../content/portfolio'
import { PanelShell } from './Dialog'
import { Plans } from './Plans'

export default function HirePanel() {
  return (
    <PanelShell id="hire" title={portfolio.hire.headline} variant="hire">
      <Plans />
    </PanelShell>
  )
}
