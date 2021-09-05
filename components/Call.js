import {
  Component,
  API,
  Handler,
} from "../mspal.js"
import util from "../mspal/util"

const cmp = new Component('Call')

/* HTML */
cmp.setHtml(`
  <header id="header"></header>
  <main>
    <h2>API Call</h2>
    <p>This page shows a sample API call. Thanks to <a href="https://ghibliapi.herokuapp.com/">Studio Ghibli API</a>.</p>
    <input type="button" id="btn-ghibli-peple" value="get people of ghibli" />
    <table id="tbl-ghibli-people" class="data">
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
cmp.addAPI('get-ghibli-people', new API({
  url: 'https://ghibliapi.herokuapp.com/people',
}))
cmp.addAPI('get-ghibli-film', new API({
  url: 'https://ghibliapi.herokuapp.com/films/{film-id}',
}))

/* Event Handlers */
cmp.addHandler('btn-ghibli-people', new Handler({
  target: 'btn-ghibli-people',
  type: 'click',
  listener: async (ev) => {
    ev.preventDefault()
    const result = await cmp.callAPI('get-ghibli-people')
    const data = result ? await result.json() : null
    if (data) {
      const table = util.id('tbl-ghibli-people')
      for (const entry of data) {
        const films = new Array()
        for (film_url of entry.films) {
          const film_id = film_url.split('/').slice(-1)[0]
          const film_result = await cmp.callAPI('get-ghibli-film', new Map([['film-id', film_id]]))
          const film_data = film_result ? await film_result.json() : null
          if (film_data) {
            films.push(film_data.title)
          }
        }
        const film_api = cmp.getAPI(get-ghibli-film)
        film_api.setUrlParam('id', )
        const tr = util.newElem('TR')
        const td = [
          util.newElem('TD', null, null, null, entry.name),
          util.newElem('TD', null, null, null, entry.gender),
          util.newElem('TD', null, null, null, entry.age),
          util.newElem('TD', null, null, null, films),
        ]
      }
    } else {
      alert('data not found.')
    }
  },
}))


export default cmp