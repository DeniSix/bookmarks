// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = /[\w\-]+$/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

// Simple JSONP
function jsonp(url, data, callback) {
  if (typeof data === 'function') {
    callback = data
    data = {}
  }

  var cbName = 'jsonp_' + Date.now()
  data['callback'] = cbName
  window[cbName] = function (data) {
    window[cbName] = null
    callback(data)
  }

  var query = []
  for (var v in data) {
    query.push(v + '=' + encodeURIComponent(data[v]))
  }

  var script = document.createElement('script')
  script.src = url + '?' + query.join('&')
  document.querySelector('head').appendChild(script)
}

var YQL_API = 'https://query.yahooapis.com/v1/public/yql'
var BING_WALLPAPER_API = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
var WALLPAPER_URL = 'url(http://www.bing.com{url}_1920x1080.jpg)'

document.addEventListener('DOMContentLoaded', function () {
  var $head = document.querySelector('head')
  var $container = document.querySelector('#container')
  var $background = document.querySelector('#background li')
  $background.style.backgroundImage = localStorage ? localStorage.getItem('background') : ''

  // fetch wallpaper of the day
  jsonp(YQL_API,
    { q: 'SELECT * FROM json WHERE url="' + BING_WALLPAPER_API + '"'
    , format: 'json'
    , jsonCompat: 'new'
    }
    , function (res) {
        var url = WALLPAPER_URL.replace('{url}', res.query.results.json.images[0].urlbase)
        localStorage ? localStorage['background'] = url : void(0)
        $background.style.backgroundImage = url
      }
  )

  var raw = null
  var bookmarks = []
  var current = null

  // get first comment node
  for (var i = 0; i < $head.childNodes.length; i++) {
    var node = $head.childNodes[i]
    if (node.nodeType === 8) {
      raw = node.data.split('\n').filter(function (val) {
        // remove empty lines
        return val !== null && val.trim() !== ''
      })
      break
    }
  }

  if (!raw) {
    alert('Bookmarks data not found!\nAre something wrong with comment?')
    throw new Error('Bookmarks data not found')
  }

  for (var i = 0; i < raw.length; i++) {
    var val = raw[i].trim()

    if (val === '-') {
      // divider
      current.push(null)
    } else if(raw[i][0] === ' ' || raw[i][0] === '\t') {
      // bookmark
      var v = val.split(/\s+/)
      var url = v.pop()
      current.push({title: v.join(' '), url: url})
    } else {
      // stack
      current = []
      bookmarks.push({title: val, links: current})
    }
  }

  var template = tmpl('links-list')
  var html = ''
  for (var i = 0; i < bookmarks.length; i++) html += template(bookmarks[i])
  $container.innerHTML = html
})
