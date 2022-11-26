import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { useRouter } from "next/router"
import Head from "next/head"
import TopBanner from "app/core/components/TopBanner"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <TopBanner />
      <div className="pad1charside">
        <LoginForm
          onSuccess={(_user) => {
            const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
            return router.push(next)
          }}
        />
      </div>
    </>
  )
}

export default LoginPage
