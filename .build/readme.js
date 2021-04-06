var path = require( 'path' )
var fs = require( 'fs' )

function recFindByExt( base, ext, files, result ) {
  files = files || fs.readdirSync( base )
  result = result || []

  files.forEach(
    function ( file ) {
      var newbase = path.join( base, file )
      if ( fs.statSync( newbase ).isDirectory() ) {
        result = recFindByExt( newbase, ext, fs.readdirSync( newbase ), result )
      }
      else {
        if ( file.substr( -1 * ( ext.length + 1 ) ) == '.' + ext ) {
          result.push( newbase )
        }
      }
    }
  )
  return result
}
const readmeFiles = recFindByExt(
  path.join( process.cwd(), 'packages/core/src/components' ),
  'md' )

const badSeparatorRegEx = /\s*\\\|\s*/g

readmeFiles.forEach( path => {
  let fileContents = fs.readFileSync( path, 'utf8' )
  if ( fileContents.match( badSeparatorRegEx ) ) {
    fileContents = fileContents
      .replace( badSeparatorRegEx, '`, `' )
      .split( '"' )
      .join( `'` )

    fs.writeFileSync( path, fileContents )
  }
} )
