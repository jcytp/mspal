
import App from 'mspal/App.js'
import DOM from 'mspal/DOM.js'

const app = new App()

app.init({
  'base_path': DOM.getUrlPath(import.meta.url.replace('main.js', '')),
  'components_dir': 'cmp',
  'styles_dir': 'css',
  'root_component_path': 'root.js',
})

app.start()
