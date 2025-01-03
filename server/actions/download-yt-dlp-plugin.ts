import fs from "fs"
import { ytDlpPluginExists } from "../helpers/yt-dlp-plugin-exists"
import {
  YT_DLP_PLUGIN_DEST_FILE,
  YT_DLP_PLUGIN_DEST_FOLDER,
  YT_DLP_PLUGIN_SOURCE,
} from "../constants/yt-dlp"

export const downloadYtDlpPlugin = async () => {
  if (ytDlpPluginExists()) {
    return
  }

  const response = await fetch(YT_DLP_PLUGIN_SOURCE)
  const content = await response.text()

  await fs.promises.mkdir(YT_DLP_PLUGIN_DEST_FOLDER, { recursive: true })
  await fs.promises.writeFile(YT_DLP_PLUGIN_DEST_FILE, content, "utf-8")
}
