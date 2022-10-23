import axios, { AxiosRequestHeaders } from "axios"
import db, { Project, ProjectDependency, User } from "db"
import { failedCheckMailer } from "mailers/failedCheckMailer"

async function checkDependency(project: Project, dependency: ProjectDependency) {
  console.info("Performing check for dependencyId: " + dependency.id)
  const user = await db.user.findFirst({ where: { id: project.userId } })
  if (!user) {
    throw new Error(`User ${project.userId} not found`)
  }

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
          saveSuccess(dependency.id, project.id)
        } else {
          saveFailure(project, dependency, user)
        }
      } else if (dependency.url.includes("https://status.slack.com")) {
        if (response.data.includes("Slack is up and running")) {
          saveSuccess(dependency.id, project.id)
        } else {
          saveFailure(project, dependency, user)
        }
      } else {
        if (response.status !== 200) {
          saveFailure(project, dependency, user)
        } else {
          saveSuccess(dependency.id, project.id)
        }
      }
    })
    .catch((e) => {
      console.info("Check failed: " + dependency.url + " " + e)
      saveFailure(project, dependency, user)
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

const saveFailure = (project: Project, projectDependency: ProjectDependency, user: User) => {
  console.info("Check failure dependencyId: " + projectDependency.id)
  db.check
    .create({
      data: {
        pass: false,
        projectId: project.id,
        projectDependencyId: projectDependency.id,
        run: 0,
        datetime: new Date(),
      },
    })
    .catch((e) => {
      console.warn("Failed to save failure dependencyId: " + projectDependency.id + e)
    })
  failedCheckMailer({
    to: user.email,
    projectName: project.name,
    projectDependencyName: projectDependency.name,
  }).send()
}

export default checkDependency
