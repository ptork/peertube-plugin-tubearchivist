import { rmdirSync } from "fs"
import { YT_DLP_PLUGIN_ROOT } from "../constants/yt-dlp"

export const deleteYtDlpPluginDir = () => {
  rmdirSync(YT_DLP_PLUGIN_ROOT, { recursive: true })
}
