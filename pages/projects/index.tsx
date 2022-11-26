import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getProjects from "app/projects/queries/getProjects"
import TopBanner from "app/core/components/TopBanner"
import { useRouter } from "next/router"

export const Projects = () => {
  const [projects] = usePaginatedQuery(getProjects, {})
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <TopBanner />
      <div className="pad1charside">
        <h1 className="green-168-text">projects</h1>
        {projects.map((p) => (
          <div key={p.id}>
            <Link href={`/projects/${p.id}/edit`}>{p.name}</Link>
          </div>
        ))}
        <br />
        <button
          className="tui-button"
          onClick={async () => {
            await router.push("/projects/new")
          }}
        >
          create new project
        </button>
      </div>
    </>
  )
}

export default Projects
