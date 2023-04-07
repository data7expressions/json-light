const menus:any = {
	main: `
      jsonl [command] <options>
  
      version ............ show package version
      help ............... show help menu for a command
      schema ............ returns the schema from the json data
      compress ............ compress a json file
      decompress .............. decompress a compressed json file`,

	schema: `
      jsonl schema <options>
  
      --input, -i ..... input json file path or json data
      --output, -o ..... output file (optional)`,

	compress: `
      jsonl compress <options>
  
      --input, -i ..... input json file path or json data
      --schema, -s ..... schema (optional)
      --output, -o ..... output file (optional)`,

	decompress: `
      jsonl decompress <options>
  
      --input, -i ..... input compressed json file path or compressed json data
      --schema, -s ..... schema (optional)
      --output, -o ..... output file (optional)`,
	version: `
      jsonl version`
}

module.exports = (args:any) => {
	const subCmd = args._[0] === 'help'
		? args._[1]
		: args._[0]

	console.log(menus[subCmd] || menus.main)
}
