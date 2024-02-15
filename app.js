import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import { DefaultAuthProvider } from 'adminjs';
import componentLoader from 'adminjs'



const PORT = 3000

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

const start = async () => {
    
  const adminOptions = {
    resources: [{
        resource: { model: getModelByName('User'), client: prisma },
        options: {}
    }]}


  const app = express()

  const admin = new AdminJS(adminOptions)
  
  const authenticate = ({ email, password }, ctx) => {
    return { email,password };
  }

  const authProvider = new DefaultAuthProvider({
    componentLoader,
    authenticate,
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      // "authenticate" was here
      cookiePassword: 'test',
      provider: authProvider,
    },
    null,
    {
      secret: 'test',
      resave: false,
      saveUninitialized: true,
    }
  );
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()