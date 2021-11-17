import Component from "../mspal/Component.js"
import API from "../mspal/API.js"
import DOM from "../mspal/DOM.js"

const cmp = new Component()

/* html */
cmp.setHtml(`
  <h2>API Call</h2>
  <p>This page shows a sample API call. It uses <a href="https://ghibliapi.herokuapp.com/">Studio Ghibli API</a>.</p>
  <input type="button" id="btnGhibliPeople" class="dataButton" value="get people of ghibli" />
  <table id="tblGhibliPeople" class="dataTable">
    <thead>
      <tr>
        <td>name</td>
        <td>gender</td>
        <td>age</td>
        <td>films</td>
      </tr>
    </thead>
  </table>
`)

/* style sheets */
cmp.addStyle('main.css')
cmp.addStyle('data-table.css')

/* api call */
cmp.addApi('get_ghibli_people', new API({
  url: 'https://ghibliapi.herokuapp.com/people',
}))
cmp.addApi('get_ghibli_film', new API({
  url: 'https://ghibliapi.herokuapp.com/films/{film-id}',
  params: ['film-id'],
}))

/* event handler */
cmp.addClickHandler('btn_ghibli_people', async (ev) => {
  const result = await cmp.callApi('get_ghibli_people')
  const people_data = result ? await result.json() : null
  if (people_data) {
    // list up film titles
    const mem_film_id_list = new Array()
    const promise_list = new Array()
    for (const person of people_data) {
      for (const film_url of person.films) {
        const film_id = film_url.split('/').slice(-1)[0]
        if (!mem_film_id_list.includes(film_id)) {
          mem_film_id_list.push(film_id)
          promise_list.push(new Promise(async (resolve) => {
            const result = await cmp.callApi('get_ghibli_film', null, new Map([
              ['film-id', film_id],
            ]))
            const film_data = result ? await result.json() : null
            const film_title = film_data ? film_data.title : '-'
            resolve([film_id, film_title])
          }))
        }
      }
    }
    const film_names = new Map(await Promise.all(promise_list))
    // render table
    const table = DOM.get('#tblGhibliPeople')
    table.innerHTML = '<thead><tr><td>name</td><td>gender</td><td>age</td><td>films</td></tr></thead>'
    for (const person of people_data) {
      table.appendChild(DOM.newElem('TR', (tr) => {
        tr.appendChild(DOM.newElem('TD', (td) => {
          td.innerText = person.name
        }))
        tr.appendChild(DOM.newElem('TD', (td) => {
          td.innerText = person.gender
        }))
        tr.appendChild(DOM.newElem('TD', (td) => {
          td.innerText = person.age
        }))
        tr.appendChild(DOM.newElem('TD', (td) => {
          td.innerText = person.films.map(film_id => film_names.get(film_id))
        }))
      }))
    }
  } else {
    alert('data not found.')
  }
})

/* export */
export default cmp
