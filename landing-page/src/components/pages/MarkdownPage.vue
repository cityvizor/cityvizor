<template>
<div>
  <VueShowdown id="markdownContent" :markdown="content"/>
</div>
</template>

<script>

export default {
  name: 'AboutPage',
  props: {
    mdFileName: String
  },
  asyncComputed: {
    content: {
      get () {
      // We can't use a fully dynamic path here: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
      return import(`raw-loader!../../assets/markdown/${this.mdFileName}.md`).then(content => {
        // Get rid of the extra string and escaping created by treating the markdown as a js module
          return content.default.replace(/^export default "/, "").replace(/";$/, "").replace(/\\n/g, "\n").replace(/\\/g, "")
      })
      },
      default () {
        return ""
      }
    }
  }
}
</script>

<style lang="scss">
// Copied and modified: https://github.com/jasonm23/markdown-css-themes/blob/gh-pages/markdown.css
#markdownContent {
  margin-left: 10%;
  margin-right: 10%;
}

body {
  line-height:1.5em;
  padding:1em;
}

a{ color: #0645ad; text-decoration:none;}
a:visited{ color: #0b0080; }
a:hover{ color: #06e; }
a:active{ color:#faa700; }
a:focus{ outline: thin dotted; }
a:hover, a:active{ outline: 0; }

::-moz-selection{background:rgba(255,255,0,0.3);color:#000}
::selection{background:rgba(255,255,0,0.3);color:#000}

a::-moz-selection{background:rgba(255,255,0,0.3);color:#0645ad}
a::selection{background:rgba(255,255,0,0.3);color:#0645ad}

p {
  margin:1em 0;
}

img {
  max-width:100%;
}

h1,h2,h3,h4,h5,h6 {
  font-weight:normal;
  color:#111;
  line-height:1em;
  margin: 0.5em;
}

h4,h5,h6 { font-weight: bold; }
h1 { font-size:2.5em; }
h2 { 
  font-size:2em;
  text-decoration: underline;
  text-decoration-color: #6fcf97;
}
h3 { font-size:1.5em; }
h4 { font-size:1.2em; }
h5 { font-size:1em; }
h6 { font-size:0.9em; }

blockquote{
  color:#666666;
  margin:0;
  padding-left: 3em;
  border-left: 0.5em #EEE solid;
}
hr { display: block; height: 2px; border: 0; border-top: 1px solid #aaa;border-bottom: 1px solid #eee; margin: 1em 0; padding: 0; }
pre, code, kbd, samp { color: #000; font-family: monospace, monospace; _font-family: 'courier new', monospace; font-size: 0.98em; }
pre { white-space: pre; white-space: pre-wrap; word-wrap: break-word; }

b, strong { font-weight: bold; }

dfn { font-style: italic; }

ins { background: #ff9; color: #000; text-decoration: none; }

mark { background: #ff0; color: #000; font-style: italic; font-weight: bold; }

sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sup { top: -0.5em; }
sub { bottom: -0.25em; }

ul, ol { margin: 1em 0; padding: 0 0 0 2em; }
li p:last-child { margin:0 }
dd { margin: 0 0 0 2em; }

img { border: 0; -ms-interpolation-mode: bicubic; vertical-align: middle; }

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
th { 
  border-bottom: 1px solid black;
  text-align: left;
}
td { vertical-align: top; }

</style>

