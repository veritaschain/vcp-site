import { Hono } from 'hono'
import { renderer } from './renderer'
import { faqPage } from './pages/faq'
import { faqPageEn } from './pages/faq-en'

const app = new Hono()

app.use(renderer)

// Redirect root to English FAQ
app.get('/', (c) => {
  return c.redirect('/faq')
})

// English FAQ (default)
app.get('/faq', (c) => {
  return c.html(faqPageEn())
})

// Japanese FAQ
app.get('/ja', (c) => {
  return c.html(faqPage())
})

export default app
