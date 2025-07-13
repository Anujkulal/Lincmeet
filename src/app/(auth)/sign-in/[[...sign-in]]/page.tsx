import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SigninPage = () => {
  return (
    <main className='h-screen w-full flex items-center justify-center'>
        <SignIn />
    </main>
  )
}

export default SigninPage


// [[...sign-in]] // this folder used to catch sign-in redirects