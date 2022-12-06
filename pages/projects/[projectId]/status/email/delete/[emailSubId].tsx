import { useParam } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import deleteEmailSubscription from "app/email-subscriptions/mutations/deleteEmailSubscription"
import React, { useState } from "react"

const DeleteEmailSub = () => {
  const projectId = useParam("projectId", "number")
  const emailSubId = useParam("emailSubId", "number")
  const [deleteEmailSubscriptionMutatation] = useMutation(deleteEmailSubscription)
  const [submitting, setSubmitting] = useState(false)
  const [finishedMessage, setFinishedMessage] = useState("")

  return (
    <div className="container is-fullheight-100vh" style={{ position: "relative" }}>
      <h1>Unsubscribe to status update</h1>
      <label>Are you sure?</label>
      <br />
      <br />
      <button
        disabled={submitting}
        className="tui-button"
        style={{ padding: 10 }}
        onClick={() => {
          if (!emailSubId || !projectId) return

          setSubmitting(true)
          deleteEmailSubscriptionMutatation({ id: emailSubId, projectId })
            .then(() => {
              setFinishedMessage("Unsubscribed!")
            })
            .catch((e) => {
              setFinishedMessage(e.toString())
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
      >
        Yes
      </button>
      <br />
      <br />
      {finishedMessage}
    </div>
  )
}

export default DeleteEmailSub
