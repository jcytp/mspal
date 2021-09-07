
import Component from './mspal/Component.js'
import API from './mspal/API.js'
import Handler from './mspal/Handler.js'
import Page from './mspal/Page.js'

export { Component, API, Handler, Page }

const getBasePath = () => {
  const scripts = document.getElementsByTagName("script")
  for (const script of scripts) {
    const match = script.src.match(/(^|.*\/)mspal.js/)
    if (match) {
      return match[1]
    }
  }
  return ''
}
const getSettings = async (base_path, filename) => {
  const settings_api = new API({
    url: `${base_path}${filename}`
  })
  const response = await settings_api.call()
  if (response) {
    const settings = await response.json()
    return settings
  }
  return {'base_path': base_path}
}

const starter = new Handler({
  target: '__window',
  type: 'load',
  listener: () => {
    const base_path = getBasePath()
    const settings = getSettings(base_path, 'settings.json')
    Page.init(settings)
  }
})
starter.set()
