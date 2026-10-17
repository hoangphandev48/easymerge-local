import { createApp } from './app.js'
import { createPool } from './db/pool.js'
import { createStaticTokenAuth } from './middleware/token-auth.js'
import { createPgProductRepository } from './modules/products/product.pg-repository.js'

const adminToken = process.env.ADMIN_TOKEN
if (!adminToken) throw new Error('ADMIN_TOKEN is required')

const app = createApp({
  products: createPgProductRepository(createPool()),
  authenticate: createStaticTokenAuth(adminToken),
})
const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => console.log(`API listening on :${port}`))
