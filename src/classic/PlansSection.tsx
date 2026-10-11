import { hire } from '../content/hire'
import { Plans } from '../Panels/Plans'

export default function PlansSection() {
  return (
    <section id="plans" aria-labelledby="plans-h">
      <h2 id="plans-h">{hire.headline}</h2>
      <Plans />
    </section>
  )
}
