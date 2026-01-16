import { ImageResponse } from "next/og"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { siteConfig } from "@/lib/site-config"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  const templatePath = join(process.cwd(), "public/images/og-template.jpg")
  const templateBuffer = readFileSync(templatePath)
  const templateBase64 = `data:image/jpeg;base64,${templateBuffer.toString("base64")}`

  // Create the ImageResponse
  const imageResponse = new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      <img
        src={templateBase64 || "/placeholder.svg"}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />
      {/* Text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#e2e8f0",
            fontWeight: 500,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#cbd5e1",
            maxWidth: "800px",
            marginTop: "12px",
          }}
        >
          {post.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "24px",
            fontSize: "18px",
            color: "#94a3b8",
          }}
        >
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )

  // Copy headers and force inline content-disposition so browsers render rather than download.
  const headers = new Headers(imageResponse.headers)
  headers.set("Content-Disposition", "inline")
  headers.set("Content-Type", "image/jpeg")

  return new Response(imageResponse.body, {
    status: imageResponse.status,
    headers,
  })
}
