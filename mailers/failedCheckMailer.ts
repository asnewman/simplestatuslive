import email from "integrations/email"

type FailedCheckMailer = {
  to: string
  projectName: string
  projectId: number
  dependencyName: string
  /** If this exists then add the unsubscribe message. */
  emailSubId?: number
}

export function failedCheckMailer({
  to,
  projectName,
  projectId,
  dependencyName,
  emailSubId,
}: FailedCheckMailer) {
  console.info("Sending failed check email to: " + to)
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const unsubscribeLink = `${origin}/projects/${projectId}/status/email/delete/${emailSubId}`

  const msg = {
    from: "bot@simplestat.us",
    to,
    subject: `${projectName}: Dependency ${dependencyName} has a failed.`,
    html: `
      <p>${projectName} has a dependency that may be broken.</p>
      <p>Dependency ${dependencyName} has failed its status check.</p>
      <p>View ${projectName}'s status page at ${origin}/projects/${projectId}/status.</p>
      <br />
      ${
        emailSubId
          ? `<p>Unsubscribe from these emails at <a href="${unsubscribeLink}">here</a>.</p>`
          : ""
      }
    `,
  }

  return {
    async send() {
      email(msg)
        .then(() => {
          console.info("Email sent to: " + to)
        })
        .catch((e) => {
          console.error("Failed to send email: " + e)
        })
    },
  }
}
