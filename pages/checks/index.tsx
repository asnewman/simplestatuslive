import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getChecks from "app/checks/queries/getChecks"

const ITEMS_PER_PAGE = 100

export const ChecksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ checks, hasMore }] = usePaginatedQuery(getChecks, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {checks.map((check) => (
          <li key={check.id}>
            <Link href={Routes.ShowCheckPage({ checkId: check.id })}>
              <a>{check.id}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ChecksPage = () => {
  return (
    <Layout>
      <Head>
        <title>Checks</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewCheckPage()}>
            <a>Create Check</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ChecksList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ChecksPage
