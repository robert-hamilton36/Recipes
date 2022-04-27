require("@babel/register")
import 'regenerator-runtime/runtime'

import { JSDOM } from 'jsdom'

process.env.JWT_SECRET = '718DB056CAF3C160626A3F4399D1EB121171088526CBF24295536543298A6C4C'

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
