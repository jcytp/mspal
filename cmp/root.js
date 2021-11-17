import Component from "../mspal/Component.js"

const cmp = new Component()

/* save current HTML as this component's html */
cmp.setHtml(null)

/* sub components */
cmp.addSubComponent('header', 'common/header.js')
cmp.addSubComponent('footer', 'common/footer.js')
cmp.addSubComponent('main', 'home.js', routes=['/'])
cmp.addSubComponent('main', 'call/sample.js', routes=['/call/sample'])
cmp.addSubComponent('main', 'points.js', routes=['/points'])

/* style sheets */
cmp.addStyle('main.css')

/* export */
export default cmp
