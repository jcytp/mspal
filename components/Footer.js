import {
  Component,
} from "../mspal/mspal.js"

const cmp = new Component('Footer')

/* HTML */
cmp.setHtml(`
  <p>Copyright &copy; Since 09-2021, <a href="mailto:toshiki.jcytp@gmail.com">JCYTP</a>.</p>
`)

/* CSS */
cmp.addStyle('main')

export default cmp