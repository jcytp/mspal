import Component from "../mspal/Component.js"

const cmp = new Component()

/* html */
cmp.setHtml(`
  <h2>Commentary of some points</h2>
  <p>Component's HTML will be expanded into the element specified by its id. In the following example, the Header component is deployed in the element with id="header".</p>
  <pre>const cmp = new Component()
cmp.setHtml(\`
&lt;header id="header"&gt;&lt;/header&gt;
\`)
cmp.addSubComponent('header', 'common/header.js')</pre>
  <p>Components that are not needed on the first accessed page will not be downloaded at the time. If a new component is required due to a page transition, it will be retrieved sequentially.</p>
  <p>The style sheet should be prepared as an external file, and all files used by a component shuld be described in that component. Even if the same style sheet is specified by multiple components, it will be called only once, and will be maintained in memory even if it is temporarily unnecessary due to page transitions.</p>
  <p>In the API definition, indefinite strings contained in URIs can be described as {param-name}. Define a name that does not conflict with query variables or Body variables, and also describe it in the params property. Pass the value of the required variable as a Map object. It is also possible to prepare values with the same id as the variable name in the page and omit the Map object.</p>
  <p>The API currently supports only GET, POST, and PUT methods, and does not support having query variables except for the GET method, so it is still in its infancy.</p>
`)

/* style sheets */
cmp.addStyle('main.css')

/* export */
export default cmp
