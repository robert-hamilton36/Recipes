require("@babel/register")

import { JSDOM } from 'jsdom'

const dom = new JSDOM("<body></body>", {
  beforeParse(window) {
    window.innerWidth = 200
    window.innerHeight = 400
  },
})

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator

globalThis.IS_REACT_ACT_ENVIRONMENT = true
