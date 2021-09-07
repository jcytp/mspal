import {
  Component,
  Handler,
  Page,
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

/* CSS */
cmp.addStyle('main')

/* Event Handlers */
cmp.addHandler('move_to_home', new Handler({
  target: 'clsMoveToHome',
  type: 'click',
  listener: (ev) => {
    ev.preventDefault()
    Page.move('/home')
  },
}))
cmp.addHandler('move_to_call', new Handler({
  target: 'clsMoveToCall',
  type: 'click',
  listener: (ev) => {
    ev.preventDefault()
    Page.move('/call')
  },
}))
cmp.addHandler('move_to_points', new Handler({
  target: 'clsMoveToPoints',
  type: 'click',
  listener: (ev) => {
    ev.preventDefault()
    Page.move('/points')
  },
}))

export default cmp