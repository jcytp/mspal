import Component from "../../mspal/Component.js"

const cmp = new Component()

/* html */
cmp.setHtml(`
  <h1><a href="/" class="clsMoveToHome">mspal - sample</a></h1>
  <nav>
    <ul>
      <li><a href="/" id="aNavHome">Home</a></li>
      <li><a href="/call/sample" id="aNavCall">API Call</a></li>
      <li><a href="/points" id="aNavPoints">Commentary</a></li>
    </ul>
  </nav>
`)

/* links */
cmp.addInnerLink('aNavHome', '/')
cmp.addInnerLink('aNavCall', '/call/sample')
cmp.addInnerLink('aNavPoints', '/points')

/* style sheets */
cmp.addStyle('main.css')

/* export */
export default cmp
