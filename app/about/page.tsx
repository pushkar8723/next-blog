import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.name}.`,
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">About</h1>
      </header>

      <div className="prose max-w-none space-y-6 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          Hi, I&apos;m {siteConfig.name}. I&apos;m a developer passionate about building great software and sharing what
          I learn along the way.
        </p>

        <p className="leading-relaxed">
          I specialize in web development with a focus on React, Next.js, and TypeScript. I believe in writing clean,
          maintainable code and creating user experiences that are both beautiful and accessible.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-foreground">What I Do</h2>
        <ul className="mt-4 space-y-2">
          <li>Build full-stack web applications</li>
          <li>Create open-source tools and libraries</li>
          <li>Write about development and technology</li>
          <li>Contribute to the developer community</li>
        </ul>

        <h2 className="mt-12 text-xl font-semibold text-foreground">Get in Touch</h2>
        <p className="leading-relaxed">
          Feel free to reach out via{" "}
          <a
            href={`mailto:${siteConfig.author.email}`}
            className="font-medium text-primary underline underline-offset-4"
          >
            email
          </a>{" "}
          or connect with me on{" "}
          <a
            href={siteConfig.links.twitter}
            className="font-medium text-primary underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          . I&apos;m always happy to chat about web development, open source, or potential collaborations.
        </p>
      </div>
    </div>
  )
}
