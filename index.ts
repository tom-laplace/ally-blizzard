export { stubsRoot } from './stubs/main.js'
export { configure } from './configure.js'
import { BlizzardDriver } from './src/blizzard.js'
import type { BlizzardDriverConfig } from './src/blizzard.js'
import type { HttpContext } from '@adonisjs/core/http'

export function blizzard(config: BlizzardDriverConfig) {
  return (ctx: HttpContext) => new BlizzardDriver(ctx, config)
}
