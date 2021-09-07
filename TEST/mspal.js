
import Component from './mspal/Component.js'
import API from './mspal/API.js'
import Handler from './mspal/Handler.js'
import Page from './mspal/Page.js'

export { Component, API, Handler, Page }

const getBasePath = () => {
  console.debug(`getBasePath`)
  const scripts = document.getElementsByTagName("SCRIPT")
  for (const script of scripts) {
    const match = script.src.match(/(^|.*\/)mspal.js/)
    if (match) {
      const url = document.createElement('a')
      url.href = match[1]
      return url.pathname
    }
  }
  return ''
}
const getSettings = async (base_path, filename) => {
  console.debug(`getSettings(${base_path}, ${filename})`)
  const settings_api = new API({
    url: `${base_path}${filename}`
  })
  const response = await settings_api.call()
  if (response.ok) {
    const settings = await response.json()
    return settings
  }
  return {'base_path': base_path}
}

const starter = new Handler({
  target: '__window',
  type: 'load',
  listener: async () => {
    const base_path = getBasePath()
    const settings = await getSettings(base_path, 'settings.json')
    await Page.init(settings)
  }
})
starter.set()
