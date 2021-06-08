import {
  Component,
  API,
  Handler,
  page,
} from "/sspa.js"

const cmp = new Component('Login')

/* HTML */
cmp.setHtml(`
  <header id="header"></header>
  <main>
    <h2>Login</h2>
    <form>
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <input type="submit" id="submit" value="Login" />
    </form>
    <p>Don't have an account? <a href="/register" class="clsOpenRegister">Register</a></p>
  </main>
  <footer id="footer"></footer>
`)

/* Child Components */
cmp.addChild('header', page.loadComponent('Header'))
cmp.addChild('footer', page.loadComponent('Footer'))

/* APIs */
cmp.addAPI('submit', new API({
  url: '/login',
  method: 'POST',
  params: ['name', 'password'],
}))

/* Event Handlers */
cmp.addHandler('submit', new Handler({
  target: 'submit',
  type: 'click',
  listener: async (ev) => {
    ev.preventDefault()
    data = await cmp.callAPI('submit')
    if (data && data.code == 0) {
      page.open('/home')
    } else {
      alert('Login failed.')
    }
  },
}))
cmp.addHandler('move_to_register', new Handler({
  target: 'clsOpenRegister',
  type: 'click',
  listener: (ev) => {
    ev.preventDefault()
    page.open('/register')
  },
}))

export default cmp