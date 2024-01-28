import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })
const PORT = 3000

const start = async () => {
    
  const adminOptions = {
    resources: [{
        resource: { model: getModelByName('User'), client: prisma },
        options: {password: {isVisible: false} }
    }]}


  const app = express()

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()