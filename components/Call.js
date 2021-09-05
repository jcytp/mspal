import {
  Component,
  API,
  Handler,
} from "../mspal.js"

const cmp = new Component('Call')

/* HTML */
cmp.setHtml(`
  <header id="header"></header>
  <main>
    <h2>API Call</h2>
    <p>This page shows a sample API call. Thanks to <a href="https://ghibliapi.herokuapp.com/">Studio Ghibli API</a>.</p>
    <input type="button" id="btnGhibliPeople" value="get people of ghibli" />
    <table id="tblGhibliPeople" class="data">
      <thead>
        <tr>
          <td>name</td>
          <td>gender</td>
          <td>age</td>
          <td>films</td>
        </tr>
      </thead>
    </table>
  </main>
  <footer id="footer"></footer>
`)

/* Child Components */
cmp.addChild('header', 'Header')
cmp.addChild('footer', 'Footer')

/* CSS */
cmp.addStyle('main')
cmp.addStyle('data-table')

/* APIs */
cmp.addAPI('get_ghibli_people', new API({
  url: 'https://ghibliapi.herokuapp.com/people',
}))
cmp.addAPI('get_ghibli_film', new API({
  url: 'https://ghibliapi.herokuapp.com/films/{film-id}',
  params: ['film-id'],
}))

/* Event Handlers */
cmp.addHandler('btn_ghibli_people', new Handler({
  target: 'btnGhibliPeople',
  type: 'click',
  listener: async (ev) => {
    ev.preventDefault()
    const result = await cmp.callAPI('get_ghibli_people')
    const data = result ? await result.json() : null
    if (data) {
      const table = document.getElementById('tblGhibliPeople')
      table.innerHTML = '<thead><tr><td>name</td><td>gender</td><td>age</td><td>films</td></tr></thead>'
      for (const entry of data) {
        const films = new Array()
        for (film_url of entry.films) {
          const film_id = film_url.split('/').slice(-1)[0]
          const film_result = await cmp.callAPI('get_ghibli_film', new Map([['film-id', film_id]]))
          const film_data = film_result ? await film_result.json() : null
          if (film_data) {
            films.push(film_data.title)
          }
        }
        const tr = document.createElement('TR')
        const arr_td_text = [entry.name, entry.gender, entry.age, films.toString()]
        for (const td_text of arr_td_text) {
          const td = document.createElement('TD')
          td.innerText = td_text
          tr.appendChild(td)
        }
        table.appendChild(tr)
      }
    } else {
      alert('data not found.')
    }
  },
}))


export default cmp