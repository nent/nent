#!/usr/bin/env node

const { create } = require( 'create-initializer' )
const { resolve } = require( 'path' )

const templateRoot = resolve( __dirname, '..', 'templates' )

// See https://github.com/ClassicOldSong/create-initializer/blob/master/README.md for the all options.

create( 'create-nent', {
  templateRoot,
  extra: {
    serviceWorker: {
      type: 'checkbox',
      choices: ['pwa'],
      describe: 'extras',
      prompt: 'if-no-arg',
    },
  },
  after: async ( { installNpmPackage, run, packageDir, answers } ) => {
    run( `yarn --cwd ${ packageDir } add serve -D` )
    run( `yarn --cwd ${ packageDir } add @nent/core -D` )
    if ( answers.serviceWorker ) {
      run( `yarn --cwd ${ packageDir } add workbox-cli -D` )
    }
  },
  caveat: `Run yarn start to begin.`,
} )
