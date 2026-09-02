import app from '~/i18n/messages/app/hi'
import { defineMessages } from '~/i18n/messages/define-messages'
import home from '~/i18n/messages/home/hi'

const hi = defineMessages({
  ...app,
  home,
})

export default hi
