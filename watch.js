#!/usr/bin/env node

var fs = require('fs')
fs.watch(__dirname + '/src/', function (event, filename) {
  if (/\.tmp/i.test(filename) || event !== 'change') return

  console.log('Rebuild...')

  var spawn = require('child_process').spawn
  var pro = spawn('node', ['build.js'])

  pro.stdout.on('data', function (data) {
    console.log('(log): ' + data)
  })

  pro.stderr.on('data', function (data) {
    console.log('(error): ' + data)
  })
})
