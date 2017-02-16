#!/usr/bin/env node

var fs         = require('fs')
var CleanCSS   = require('clean-css')
var UglifyJS   = require('uglify-js')
var minifyHTML = require('html-minifier').minify

var template  = fs.readFileSync(__dirname + '/src/index.html', {encoding: 'utf8'})
var links     = fs.readFileSync(__dirname + '/src/links-list.html', {encoding: 'utf8'})
var css       = fs.readFileSync(__dirname + '/src/style.css', {encoding: 'utf8'})
var favicon   = fs.readFileSync(__dirname + '/src/favicon.ico')
var bookmarks = fs.readFileSync(__dirname + '/src/bookmarks.txt', {encoding: 'utf8'})

var styles   = new CleanCSS().minify(css)
var scripts  = UglifyJS.minify(__dirname + '/src/main.js')
var linksMin = minifyHTML(links, {collapseWhitespace: true})

var result = template
  .replace('{{styles}}', styles)
  .replace('{{scripts}}', scripts.code)
  .replace('{{links-list}}', linksMin)
  .replace('{{bookmarks}}', bookmarks)
  .replace('{{favicon}}', favicon.toString('base64'))

fs.writeFileSync(__dirname + '/index.html', result, {encoding: 'utf8'})
