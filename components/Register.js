import {
  Component,
} from "/sspa.js"

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
  </main>
  <footer id="footer"></footer>
`)

export default cmp