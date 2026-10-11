import type { Project } from '../content/types'
import { asset } from '../lib/asset'

/** A project's logo when it has one, otherwise its emoji. Always decorative. */
export function ProjectIcon({ project }: { project: Pick<Project, 'icon' | 'logo'> }) {
  return project.logo ? (
    <img className="project-logo" src={asset(project.logo)} alt="" draggable={false} />
  ) : (
    <>{project.icon}</>
  )
}
