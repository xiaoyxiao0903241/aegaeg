import { defineMessages } from './define-messages'
import app from './app/vi'
import home from './home/vi'

const vi = defineMessages({
  ...app,
  home,
})

export default vi
