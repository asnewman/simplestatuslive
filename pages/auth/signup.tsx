import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { BlitzPage, Routes } from "@blitzjs/next"
import TopBanner from "app/core/components/TopBanner"
import Head from "next/head"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <TopBanner />
      <div className="pad1charside">
        <SignupForm onSuccess={() => router.push(Routes.Home())} />
      </div>
    </>
  )
}

export default SignupPage
