import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getProjects from "app/projects/queries/getProjects"
import TopBanner from "app/core/components/TopBanner"

export const Projects = () => {
  const [projects] = usePaginatedQuery(getProjects, {})

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
      </div>
    </>
  )
}

export default Projects
