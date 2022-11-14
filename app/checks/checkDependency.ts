import axios, { AxiosRequestHeaders } from "axios"
import db, { Project, ProjectDependency, User } from "db"
import { failedCheckMailer } from "mailers/failedCheckMailer"

async function checkDependency(project: Project, dependency: ProjectDependency) {
  console.info("Performing check for dependencyId: " + dependency.id)

  axios
    .get(dependency.url, {
      headers:
        Object.entries(dependency.headers || {}).length === 0
          ? undefined
          : (dependency.headers as AxiosRequestHeaders),
      data: Object.entries(dependency.data || {}).length === 0 ? undefined : dependency.data,
      timeout: 10000,
    })
    .then((response) => {
      if (response.status !== 200) {
        saveFailure(project, dependency, `received response of ${response.status}`).catch((e) => {
          console.warn("Failed to save failure dependencyId: " + dependency.id + e)
        })
      } else {
        saveSuccess(dependency.id, project.id)
      }
    })
    .catch((e) => {
      console.info("Check failed: " + dependency.url + " " + e)
      saveFailure(project, dependency, e).catch((e) => {
        console.warn("Failed to save failure dependencyId: " + dependency.id + e)
      })
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

const saveFailure = async (
  project: Project,
  projectDependency: ProjectDependency,
  checkError: string
) => {
  console.info("Check failure dependencyId: " + projectDependency.id)

  const lastCheck = await db.check.findFirst({
    where: { projectDependencyId: projectDependency.id },
    orderBy: { id: "desc" },
  })
  console.debug("Last check: " + JSON.stringify(lastCheck))
  if (!lastCheck || (lastCheck && lastCheck.pass)) {
    if (project.email !== "") {
      failedCheckMailer({
        to: project.email,
        projectName: project.name,
        dependencyName: projectDependency.name,
      })
        .send()
        .catch((e) => {
          console.warn(
            `Failed to send email to ${project.email} for dependencyId error: ${projectDependency.id} ${e}`
          )
        })
    }
    console.debug(project)
    if (project.slackWebhook !== "") {
      console.info("Sending slack notification for dependencyId: " + projectDependency.id)
      await axios.post(project.slackWebhook, {
        text: `Dependency ${projectDependency.name} is down! Error: ${checkError}`,
      })
    }
  }

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
}

export default checkDependency
