import { defineMessages } from './define-messages'
import app from './app/ko'
import home from './home/ko'

const ko = defineMessages({
  ...app,
  home,
})

export default ko
