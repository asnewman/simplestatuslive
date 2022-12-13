import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const Home = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  return (
    <div>
      <div className="white-255-text" style={{ width: "80%", margin: "0 auto" }}>
        <h1 style={{ marginTop: 200, fontSize: 50, textAlign: "center" }}>
        Keep your uptime in the spotlight with simplestatus
        </h1>
        {currentUser ? (
          <div style={{ margin: "0 auto", width: 500, textAlign: "center" }}>
            <button
              className="tui-button"
              style={{ padding: 10 }}
              onClick={async () => {
                await router.push("/projects")
              }}
            >
              Go to your projects
            </button>
          </div>
        ) : (
          <div style={{ margin: "0 auto", width: 500, textAlign: "center" }}>
            <button
              className="tui-button"
              style={{ padding: 10 }}
              onClick={async () => {
                await router.push("/auth/signup")
              }}
            >
              Sign up for free!
            </button>
            <br />
            <br />
            <Link href="/auth/login">
              <span className="green-255-text" style={{ cursor: "pointer" }}>
                Already have an account? Login here.
              </span>
            </Link>
          </div>
        )}
        <h2 style={{ marginTop: 50 }}>Features</h2>
        <ul>
          <li>- Monitors user-configured and preset endpoints to detect downtime of dependencies</li>
          <li>- Alerts users via email and slack when downtime is detected</li>
          <li>- Provides a private or public status page for other users to see</li>
          <li>- Helps businesses and organizations maintain high uptime and avoid potential loss of revenue and customer trust</li>
          <li>- Can be customized to fit the specific needs of each user</li>
        </ul>
        <br />
        <br />
        <h2>Pricing</h2>
        <p>
          simplestatus is currently in beta. During beta all features are free to use. Feedback is
          appreciated!
        </p>
      </div>
    </div>
  )
}

export default Home
