import { defineMessages } from './define-messages'
import app from './app/es'
import home from './home/es'

const es = defineMessages({
  ...app,
  home,
})

export default es
