import axios from "axios"
import db, { ManagedDependency } from "db"

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

interface ManagedDependencyCheck {
  datetime: number
  passed: boolean
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
  await db.managedDependency.update({
    where: { id: managedDependency.id },
    data: {
      checks: [...managedDependency.checks, { datetime: Date.now(), passed: true }],
    },
  })
}

export default checkManagedDependencies
