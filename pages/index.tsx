import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const Home = () => {
  const router = useRouter()
  return (
    <div>
      <div className="white-255-text" style={{ width: "80%", margin: "0 auto" }}>
        <h1 style={{ marginTop: 200, fontSize: 50, textAlign: "center" }}>
          Easily monitor internal and external dependencies with simplestatus
        </h1>
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
        <h2 style={{ marginTop: 50 }}>Features</h2>
        <ul>
          <li>- Public and private status pages for your projects and business</li>
          <li>- Indiviual endpoint monitoring for internal and external APIs</li>
          <li>- Health check webpages to ensure your web page is always live</li>
          <li>
            - Managed dependencies - commonly used services like GitHub and Slack are already
            monitored by simplestatus robots and can inform you of any downtime
          </li>
          <li>- Alerting via email and Slack</li>
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
