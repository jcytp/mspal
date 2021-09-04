import {
  Component,
} from "../sspa.js"

const cmp = new Component('Register')

/* HTML */
cmp.setHtml(`
  <header id="header"></header>
  <main>
    <h2>Register</h2>
    <form>
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <input type="submit" id="submit" value="Register" />
    </form>
    <p>Do you have an account? <a href="/login" class="clsMoveToLogin">Login</a></p>
  </main>
  <footer id="footer"></footer>
`)

/* Child Components */
cmp.addChild('header', 'Header')
cmp.addChild('footer', 'Footer')

/* Event Handlers */
cmp.addHandler('move_to_login', new Handler({
  target: 'clsMoveToLogin',
  type: 'click',
  listener: (ev) => {
    ev.preventDefault()
    Page.move('/login')
  },
}))

export default cmp