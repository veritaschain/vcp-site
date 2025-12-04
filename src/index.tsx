import { Hono } from 'hono'
import { renderer } from './renderer'
import { faqPage } from './pages/faq'
import { faqPageEn } from './pages/faq-en'
import { faqPageZh } from './pages/faq-zh'
import { brokersPageEn } from './pages/brokers-en'
import { brokersPageJa } from './pages/brokers-ja'
import { brokersPageZh } from './pages/brokers-zh'

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

// Chinese FAQ
app.get('/zh', (c) => {
  return c.html(faqPageZh())
})

// Brokers LP - English (default)
app.get('/brokers', (c) => {
  return c.html(brokersPageEn())
})

// Brokers LP - Japanese
app.get('/brokers/ja', (c) => {
  return c.html(brokersPageJa())
})

// Brokers LP - Chinese
app.get('/brokers/zh', (c) => {
  return c.html(brokersPageZh())
})

export default app
