import { Hono } from 'hono'
import { renderer } from './renderer'
import { faqPage } from './pages/faq'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.redirect('/faq')
})

app.get('/faq', (c) => {
  return c.html(faqPage())
})

export default app
