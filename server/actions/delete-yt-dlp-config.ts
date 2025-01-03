import { unlinkSync } from "fs"
import { YT_DLP_PLUGIN_DEST_CONFIG } from "../constants/yt-dlp"

export const deleteYtDlpConfig = () => {
  unlinkSync(YT_DLP_PLUGIN_DEST_CONFIG)
}
