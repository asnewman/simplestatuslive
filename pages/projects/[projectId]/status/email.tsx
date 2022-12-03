import { useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import createEmailSubscription from "app/email-subscriptions/mutations/createEmailSubscription"
import getProject from "app/projects/queries/getProject"
import { useState } from "react"

const AddStatusEmail = () => {
  const projectId = useParam("projectId", "number")
  const [project, {}] = useQuery(getProject, { id: projectId })
  const [createEmailSubscriptionMutatation] = useMutation(createEmailSubscription)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [finishedMessage, setFinishedMessage] = useState("")

  return (
    <div className="container is-fullheight-100vh" style={{ position: "relative" }}>
      <h1>Subscribe to updates for {project.name}</h1>
      <label>Email</label>
      <br />
      <input disabled={submitting} value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      <button
        disabled={submitting}
        className="tui-button"
        style={{ padding: 10 }}
        onClick={() => {
          if (!projectId) return

          setSubmitting(true)
          createEmailSubscriptionMutatation({ email, projectId })
            .then(() => {
              setFinishedMessage("Subscribed!")
            })
            .catch((e) => {
              setFinishedMessage(e.toString())
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
      >
        Subscribe
      </button>
      <br />
      <br />
      {finishedMessage}
    </div>
  )
}

export default AddStatusEmail
