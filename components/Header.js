import {
  Component,
} from "../mspal.js"

const cmp = new Component('Header')

/* HTML */
cmp.setHtml(`
  <h1><a href="/home" class="clsMoveToHome">mspal - sample</a></h1>
  <nav>
    <ul>
      <li><a href="/home" class="clsMoveToHome">Home</a></li>
      <li><a href="/call" class="clsMoveToCall">API Call</a></li>
      <li><a href="/points" class="clsMoveToPoints">Commentary</a></li>
    </ul>
  </nav>
`)

export default cmp