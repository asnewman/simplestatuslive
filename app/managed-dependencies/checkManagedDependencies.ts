import axios from "axios"
import db, { ManagedDependency, Project } from "db"
import { failedCheckMailer } from "mailers/failedCheckMailer"

async function checkManagedDependencies() {
  const managedDependencies = await db.managedDependency.findMany({})

  for (const managedDependency of managedDependencies) {
    switch (managedDependency.name) {
      case "github": {
        try {
          const response = await axios.get("https://www.githubstatus.com")
          if (response.data.includes("All Systems Operational")) {
            await saveSuccess(managedDependency)
          } else {
            await saveFailure(managedDependency)
          }
        } catch (error) {
          await saveFailure(managedDependency)
        }
        break
      }
      case "slack": {
        try {
          const response = await axios.get("https://status.slack.com")
          if (response.data.includes("Slack is up and running")) {
            await saveSuccess(managedDependency)
          } else {
            await saveFailure(managedDependency)
          }
        } catch (error) {
          await saveFailure(managedDependency)
        }
        break
      }
      default:
        break
    }
  }
}

async function saveSuccess(managedDependency: ManagedDependency) {
  await db.managedDependency.update({
    where: { id: managedDependency.id },
    data: {
      checks: [...managedDependency.checks, { datetime: Date.now(), passed: true }],
    },
  })
}

async function saveFailure(managedDependency: ManagedDependency) {
  const lastCheck = managedDependency.checks[managedDependency.checks.length - 1]

  if (
    !lastCheck ||
    // @ts-ignore
    lastCheck.passed
  ) {
    await notifyFailures(managedDependency)
  }

  await db.managedDependency.update({
    where: { id: managedDependency.id },
    data: {
      checks: [...managedDependency.checks, { datetime: Date.now(), passed: false }],
    },
  })
}

async function notifyFailures(managedDependency: ManagedDependency) {
  const managedDependenciesOnProjects = await db.managedDependenciesOnProjects.findMany({
    where: { managedDependencyId: managedDependency.id },
  })

  const projectIds = managedDependenciesOnProjects.map((m) => m.projectId)

  for (const projectId of projectIds) {
    const project = await db.project.findFirst({ where: { id: projectId } })

    if (!project) {
      continue
    }

    if (project.email !== "") {
      failedCheckMailer({
        to: project.email,
        projectName: project.name,
        dependencyName: managedDependency.name,
      })
        .send()
        .catch((e) => {
          console.warn(
            `Failed to send email to ${project.email} for managedDependencyId error: ${managedDependency.id} ${e}`
          )
        })
    }

    if (project.slackWebhook !== "") {
      await axios.post(project.slackWebhook, {
        text: `Issue detected for ${managedDependency.name}!`,
      })
    }
  }
}

export default checkManagedDependencies
