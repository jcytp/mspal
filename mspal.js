
import Component from './mspal/Component.js'
import API from './mspal/API.js'
import Handler from './mspal/Handler.js'
import Page from './mspal/Page.js'

export { Component, API, Handler, Page }

const starter = new Handler({
  target: '__window',
  type: 'load',
  listener: Page.init
})
starter.set()
