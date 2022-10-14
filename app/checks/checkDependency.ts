import axios, { AxiosRequestHeaders } from "axios"
import db, { ProjectDependency } from "db"

function checkDependency(dependency: ProjectDependency, projectId: number) {
  axios
    .get(dependency.url, {
      headers:
        Object.entries(dependency.headers || {}).length === 0
          ? undefined
          : (dependency.headers as AxiosRequestHeaders),
      data: Object.entries(dependency.data || {}).length === 0 ? undefined : dependency.data,
    })
    .then((response) => {
      if (dependency.url.includes("https://www.githubstatus.com")) {
        if (response.data.includes("All Systems Operational")) {
          saveSuccess(dependency.id, projectId)
        } else {
          saveFailure(dependency.id, projectId)
        }
      } else if (dependency.url.includes("https://status.slack.com")) {
        if (response.data.includes("Slack is up and running")) {
          saveSuccess(dependency.id, projectId)
        } else {
          saveFailure(dependency.id, projectId)
        }
      } else {
        if (response.status !== 200) {
          saveFailure(dependency.id, projectId)
        } else {
          saveSuccess(dependency.id, projectId)
        }
      }
    })
    .catch((e) => {
      console.info("Check failed: " + dependency.url + " " + e)
      saveFailure(dependency.id, projectId)
    })
}

const saveSuccess = (dependencyId: number, projectId: number) => {
  console.info("Check success dependencyId: " + dependencyId)
  db.check
    .create({
      data: {
        pass: true,
        projectId,
        projectDependencyId: dependencyId,
        run: 0,
        datetime: new Date(),
      },
    })
    .catch((e) => {
      console.warn("Failed to save success dependencyId: " + dependencyId + e)
    })
}

const saveFailure = (dependencyId: number, projectId: number) => {
  console.info("Check failure dependencyId: " + dependencyId)
  db.check
    .create({
      data: {
        pass: false,
        projectId,
        projectDependencyId: dependencyId,
        run: 0,
        datetime: new Date(),
      },
    })
    .catch((e) => {
      console.warn("Failed to save failure dependencyId: " + dependencyId + e)
    })
}

export default checkDependency
