import { PeerTubeHelpers } from "@peertube/peertube-types"
import { Config } from "../types"

export const deleteFromTubeArchivist = async (
  targetUrl: string,
  config: Config[],
  logger: PeerTubeHelpers["logger"]
) => {
  const url = new URL(targetUrl)
  const hostname = url.hostname
  const protocol = url.protocol

  const targetConfig = config.find((c) => c.hostname === hostname)

  if (!targetConfig) {
    throw new Error(`No config found for ${hostname}`)
  }

  const videoId = url.pathname.split("/video/").pop()

  logger.info(`Deleting video from TubeArchivist: ${videoId}`)

  const deleteResponse = await fetch(
    `${protocol}//${hostname}/api/video/${videoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${targetConfig.access_token}`,
      },
    }
  )

  if (!deleteResponse.ok) {
    throw new Error(
      `Failed to delete video from TubeArchivist: ${await deleteResponse.text()}`
    )
  }

  logger.info(`Ignoring video from TubeArchivist: ${videoId}`)

  const ignoreResponse = await fetch(
    `${protocol}//${hostname}/api/download/${videoId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${targetConfig.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ignore-force",
      }),
    }
  )

  if (!ignoreResponse.ok) {
    throw new Error(
      `Failed to ignore video from TubeArchivist: ${await ignoreResponse.text()}`
    )
  }
}
