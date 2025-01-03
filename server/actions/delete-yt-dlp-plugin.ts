import { unlinkSync } from "fs"
import { YT_DLP_PLUGIN_DEST_FILE } from "../constants/yt-dlp"
import { ytDlpPluginExists } from "../helpers/yt-dlp-plugin-exists"

export const deleteYtDlpPlugin = () => {
  if (!ytDlpPluginExists()) {
    return
  }

  unlinkSync(YT_DLP_PLUGIN_DEST_FILE)
}
