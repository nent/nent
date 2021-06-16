//import { angularOutputTarget } from '@stencil/angular-output-target'
//import { reactOutputTarget } from '@stencil/react-output-target'
import { Config } from '@stencil/core'
import { JsonDocs } from '@stencil/core/internal'
import analyzer from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer'
import { version } from './package.json'

const config: Config = {
  namespace: 'nent',
  hashFileNames: false,
  rollupPlugins: {
    after: [
      analyzer({
        summaryOnly: true,
      }),
      visualizer({
        filename: './dist/stats.html',
      }),
    ],
  },
  outputTargets: [
    // angularOutputTarget({
    //   componentCorePackage: '@nent/core',
    //   directivesProxyFile: '../core-angular/src/directives/proxies.ts',
    //   excludeComponents: [ 'n-app', 'n-app-analytics'],
    // }),
    // reactOutputTarget({
    //   componentCorePackage: '@nent/core',
    //   proxiesFile: '../core-react/src/components.ts',
    //   excludeComponents: [ 'n-app', 'n-app-analytics'],
    //   loaderDir: 'dist/loader'
    // }),
    {
      type: 'dist',
      esmLoaderPath: 'loader',
      copy: [
        {
          src: 'components/**/*.md',
          dest: '../../docs',
          keepDirStructure: true,
        },
      ],
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: `NENT 2021 - all rights reserved`,
      dependencies: false,
      strict: true,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements.json',
    },
    {
      type: 'docs-custom',
      strict: true,
      generator: (docs: JsonDocs) => {
        Object.assign(docs, { version })
      },
    },
    {
      type: 'docs-json',
      file: 'dist/components.json',
    },
  ],
}

export { config }
