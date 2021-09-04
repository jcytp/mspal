import {
  Component,
} from "../mspal.js"

const cmp = new Component('Home')

/* HTML */
cmp.setHtml(`
  <header id="header"></header>
  <main>
    <h2>Home</h2>
  </main>
  <footer id="footer"></footer>
`)

export default cmp