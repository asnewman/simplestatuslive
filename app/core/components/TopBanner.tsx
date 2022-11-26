import Link from "next/link"
import React from "react"

export default function TopBanner() {
  return (
    <div
      className="tui-panel green-168 black-255-text full-width pad1charside"
      style={{ paddingTop: 3, paddingBottom: 3 }}
    >
      <Link href={`/`}>simplestatus</Link>
    </div>
  )
}
