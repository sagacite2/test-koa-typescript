'use strict'
import Cover from './Cover'
export * from './UserController'

const app = new Cover()
app.registerRouters()

app.listen(3000)