import App from './mspal/App.js'
import Dom from './mspal/Dom.js'

// preload
import Api from './mspal/Api.js'
import Component from './mspal/Component.js'
import Handler from './mspal/Handler.js'
import * as cmp_root from './cmp/root.js'

const app = new App()

app.init({
  'base_path': Dom.getUrlPath(import.meta.url.replace('main.js', '')),
  'components_dir': 'cmp',
  'styles_dir': 'css',
  'root_component_path': 'root.js',
})

app.start()
