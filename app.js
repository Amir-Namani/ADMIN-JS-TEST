import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import { DefaultAuthProvider } from 'adminjs';
import componentLoader from 'adminjs'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup,GoogleAuthProvider,GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmCGPQUzpj6QuTTUJIZ3h68hwI_w954uo",
  authDomain: "admin-js-c4dc9.firebaseapp.com",
  projectId: "admin-js-c4dc9",
  storageBucket: "admin-js-c4dc9.appspot.com",
  messagingSenderId: "31769943549",
  appId: "1:31769943549:web:67db60d7f26ab8500ccd94",
  measurementId: "G-YMWL5B73FC"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth()

const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  const provider2 = new GithubAuthProvider()

  signInWithPopup(auth, provider2)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });


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