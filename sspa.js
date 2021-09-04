
import Component from './sspa/Component.js'
import API from './sspa/API.js'
import Handler from './sspa/Handler.js'
import Page from './sspa/Page.js'

export { Component, API, Handler, Page }

const page = new Page()
const starter = new Handler({
  target: '__window',
  type: 'load',
  listener: page.init
})
starter.set()
