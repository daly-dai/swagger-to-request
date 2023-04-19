import { defineBuildConfig } from 'unbuild'
import fg from 'fast-glob'

export default defineBuildConfig({
  entries: [
    "./src/index"
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
