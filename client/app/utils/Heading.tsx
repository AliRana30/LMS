"use client"
import { FC, useEffect } from "react"

interface HeadProps {
  title: string
  description: string
  keywords: string
}

const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update document title dynamically
    if (title) {
      document.title = title
    }

    // Update meta tags dynamically
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    if (description) {
      updateMetaTag('description', description)
    }
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }
  }, [title, description, keywords])

  return null
}

export default Heading