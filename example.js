var fs = require('fs')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var Discovery = require('.')

var key = process.argv[2]
var archive = hyperdrive(ram, key)
var archive2 = hyperdrive(ram)
var discovery = Discovery()

archive.ready(function (err) {
  if (err) throw err
  discovery.add(archive)
  console.log('key', archive.key.toString('hex'))
})
archive2.ready(function (err) {
  if (err) throw err
  archive2.writeFile('example.js', fs.readFileSync('example.js'), ()=>{})
  discovery.add(archive2)
  console.log('key', archive2.key.toString('hex'))
})

discovery.on('connection', function (peer, type) {
  // console.log('got', peer, type) // type is 'webrtc-swarm' or 'discovery-swarm'
  // console.log('connected to', sw.connections, 'peers')
  console.log('connection')
  peer.on('close', function () {
    console.log('peer disconnected')
  })
})
discovery.on('listening', () => {
  console.log('listening')
})
discovery.on('error', (err) => {
  console.log('error', err)
})
