import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { FORM_ERROR } from "app/projects/components/ProjectForm"
import { z } from "zod"
import LabeledTextField from "app/core/components/LabeledTextField"
import Form from "app/core/components/Form"
import { useState } from "react"
import LabeledTextArea from "app/core/components/LabeledTextArea"

interface Dependency {
  url: string
  name: string
  headers?: Object
  data?: Object
}

interface RawDependency extends Dependency {
  url: string
  name: string
  headers?: string
  data?: string
}

const NewProjectPage = () => {
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  const [dependencies, setDependencies] = useState<Dependency[]>([])
  const [showDependencyModal, setShowDependencyModal] = useState(false)
  const [modalError, setModalError] = useState("")

  const saveDependency = (values: RawDependency) => {
    const newDependencies = [...dependencies]
    let headers: Dependency["headers"] = {}
    let data: Dependency["data"] = {}
    try {
      if (values.headers) {
        headers = JSON.parse(values.headers)
      }
      if (values.data) {
        data = JSON.parse(values.data)
      }
    } catch (e) {
      setModalError("Headers and Data must be in JSON format.")
      return false
    }
    newDependencies.push({ ...values, headers, data })
    setDependencies(newDependencies)
    return true
  }

  return (
    <Layout title={"Create New Project"}>
      <h1 className="title is-1 mt-4">Create New Project</h1>

      <Form
        submitText="Create Project"
        schema={z.object({
          name: z.string(),
        })}
        initialValues={{}}
        onSubmit={async (values) => {
          if (dependencies.length === 0) {
            return {
              [FORM_ERROR]: "You must have at least one dependency.",
            }
          }

          try {
            const project = await createProjectMutation(values)
            router.push(Routes.ShowProjectPage({ projectId: project.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <div>
          <button
            className="button mb-4"
            onClick={() => {
              setShowDependencyModal(true)
            }}
          >
            Add dependency
          </button>
        </div>
        {dependencies.map((d) => (
          <p>{d.name}</p>
        ))}
      </Form>
      <DependencyModal
        showDependencyModal={showDependencyModal}
        setShowDependencyModal={setShowDependencyModal}
        saveDependency={saveDependency}
        modalError={modalError}
      />
      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>
    </Layout>
  )
}

const DependencyModal = ({
  showDependencyModal,
  setShowDependencyModal,
  saveDependency,
  modalError,
}: {
  showDependencyModal: boolean
  setShowDependencyModal: (val: boolean) => void
  saveDependency: (values: RawDependency) => boolean
  modalError: string
}) => {
  return (
    <div className={`modal ${showDependencyModal ? "is-active" : ""}`}>
      <div
        className="modal-background"
        onClick={() => {
          setShowDependencyModal(false)
        }}
      ></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-2">Add Dependency</h2>
          {modalError && <p className="notification is-danger">{modalError}</p>}
          <Form
            submitText="Save"
            schema={z.object({
              name: z.string(),
              url: z.string().trim().url(),
            })}
            onSubmit={(values) => {
              if (saveDependency(values)) {
                setShowDependencyModal(false)
              }
            }}
          >
            <LabeledTextField name="name" label="Name" placeholder="Name" />
            <LabeledTextField name="url" label="Url" placeholder="Url" />
            <LabeledTextArea
              name="headers"
              label="Headers (optional)"
              placeholder="Must be JSON format"
            />
            <LabeledTextArea
              name="data"
              label="Data (optional)"
              placeholder="Must be JSON format"
            />
          </Form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

NewProjectPage.authenticate = true

export default NewProjectPage
