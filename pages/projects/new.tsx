import { useMutation } from "@blitzjs/rpc"
import TopBanner from "app/core/components/TopBanner"
import createProject from "app/projects/mutations/createProject"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"

const NewProjectPage = () => {
  const router = useRouter()
  const [projName, setProjName] = useState("")

  const [createProjectMutation] = useMutation(createProject)

  return (
    <>
      <Head>
        <title>Add project</title>
      </Head>
      <TopBanner />
      <br />
      <br />
      <div className="pad1charside">
        <div className="tui-window full-width black-255">
          <fieldset className="tui-fieldset">
            <legend className="tui-legend">new project</legend>
            <div>
              name.........:{" "}
              <input
                className="tui-input"
                type="text"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
              />
            </div>
            <br />
            <button
              className="tui-button"
              disabled={projName.length === 0 || Boolean(projName.match(/(?:(?!\s)\W)+/))}
              onClick={async () => {
                const res = await createProjectMutation({
                  name: projName,
                })

                await router.push(`/projects/${res.id}/edit`)
              }}
            >
              create
            </button>
          </fieldset>
        </div>
      </div>
    </>
  )
}

NewProjectPage.authenticate = true

export default NewProjectPage
