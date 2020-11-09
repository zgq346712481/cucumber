import readline from 'readline'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let keep = true

rl.on('line',(line) => {
  if(line.match(/^import /)) {
    return
  }
  if(line.match(/class.*{/)) {
    keep = false
  }
  if(keep) {
    if(line.match(/^\s*(interface|namespace|enum)\s/)) {
      console.log(`export ${line}`)
    } else {
      console.log(line)
    }
  }
  if(line.match(/^\s*}/)) {
    keep = true
  }
})

