import { hire } from '../content/hire'
import { PanelShell } from './Dialog'
import { Plans } from './Plans'

export default function HirePanel() {
  return (
    <PanelShell id="hire" title={hire.headline} variant="hire">
      <Plans />
    </PanelShell>
  )
}
