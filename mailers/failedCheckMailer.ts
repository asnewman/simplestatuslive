import email from "integrations/email"

type FailedCheckMailer = {
  to: string
  projectName: string
  dependencyName: string
}

export function failedCheckMailer({ to, projectName, dependencyName }: FailedCheckMailer) {
  console.info("Sending failed check email to: " + to)
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN

  const msg = {
    from: "bot@simplestat.us",
    to,
    subject: `${projectName}: Dependency ${dependencyName} has a failed.`,
    html: `
      <p>Your project ${projectName} has a dependency that may be broken.</p>
      <p>Dependency ${dependencyName} has failed its status check.</p>
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
