#!/usr/bin/env node

import { create } from 'create-initializer'
import { resolve } from 'path'

const templateRoot = resolve( __dirname, '../templates' )

// See https://github.com/ClassicOldSong/create-initializer/blob/master/README.md for the all options.

create( '@nent/create', {
  templateRoot,
  caveat: ({ answers }) => `Run '-> cd ${answers.name} && yarn dev' to begin.`,
} )
