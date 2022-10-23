import email from "integrations/email"

type FailedCheckMailer = {
  to: string
  projectName: string
  projectDependencyName: string
}

export function failedCheckMailer({ to, projectName, projectDependencyName }: FailedCheckMailer) {
  console.info("Sending failed check email to: " + to)
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN

  const msg = {
    from: "bot@simplestat.us",
    to,
    subject: `${projectName}: Dependency ${projectDependencyName} has a failed.`,
    html: `
      <p>Your project ${projectName} has a dependency that may be broken.</p>
      <p>Dependency ${projectDependencyName} has failed its status check.</p>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
        throw new Error("No production email implementation in mailers/forgotPasswordMailer")
      } else {
        email(msg)
        console.info("Email sent to: " + to)
      }
    },
  }
}
