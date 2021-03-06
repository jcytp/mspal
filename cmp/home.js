import Component from "../mspal/Component.js"

const cmp = new Component()

/* html */
cmp.setHtml(`
  <h2>What's mspal?</h2>
  <p>The "mspal" is Micro SPA Library.</p>
  <ul>
    <li>This is for those of us who don't want to send heavy files to visitors on their first load.</li>
    <li>This is for those of us who don't want to run heavy build processes.</li>
    <li>This is for those of us who don't want to spend time learning a cumbersome framework.</li>
  </ul>
  <h2>How to use?</h2>
  <ol>
    <li>Place the mspal.js file, mspal directory, routes.json, and components directory and make each file available for download by visitors.</li>
    <li>In the html file that the visitor loads first, load the mspal.js and specify the spa-root element as follows.</li>
    <li>Using this sample as a reference, describe the contents of your website in the files in the components directory.</li>
    <li>Edit routes.json and specify the component to be loaded first depending on the URI.</li>
    <li>Rewrite and place settings.js, if you need it.</li>
  </ol>
`)

/* style sheets */
cmp.addStyle('main.css')

/* export */
export default cmp
