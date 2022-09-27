import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "simplestatus"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container is-max-desktop px-5">{children}</div>
    </>
  )
}

export default Layout
