const fs = require( 'fs' )
const path = require( 'path' )

const jsonFilePath = path.resolve( process.cwd(), './dist/nent.html-data.json' )

if ( !fs.existsSync( jsonFilePath ) )
  throw new Error( `Missing ${ jsonFilePath } file. Please build core components first: yarn build` )

let jsonFileContent = fs.readFileSync( jsonFilePath, 'utf8' )
let jsonFileData = JSON.parse( jsonFileContent )

jsonFileData.tags.forEach( tag => {
  console.log( `Processing tag: ${ tag.name }` )
  tag.references = []
  tag.references.push( {
    name: 'Documentation',
    url: `https://nent.dev/components/${ tag.name }`
  } )
  tag.references.push( {
    name: 'Source',
    url: `https://github.com/nent/nent/tree/main/packages/core/src/components/${ tag.name }`
  } )
} )

fs.writeFileSync( jsonFilePath, JSON.stringify( jsonFileData, null, 2 ) )

const vsCodePath = path.resolve( process.cwd(), '../../tools/vscode/nent.html-data.json' )
fs.writeFileSync( vsCodePath, JSON.stringify( jsonFileData, null, 2 ) )
