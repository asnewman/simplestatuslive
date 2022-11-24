import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import Script from "next/script"

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
      <Script src="https://cdn.jsdelivr.net/npm/tuicss@2.0.1/dist/tuicss.min.js"></Script>
      {children}
    </>
  )
}

export default Layout
