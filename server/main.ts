import type { RegisterServerOptions } from "@peertube/peertube-types"
import { downloadYtDlpPlugin } from "./actions/download-yt-dlp-plugin"
// import { deleteYtDlpPlugin } from "./actions/delete-yt-dlp-plugin"
// import { deleteYtDlpConfig } from "./actions/delete-yt-dlp-config"
// import { deleteYtDlpPluginDir } from "./actions/delete-yt-dlp-plugin-dir"
// import { deleteFromTubeArchivist } from "./actions/delete-from-tubearchivist"
import { saveConfig } from "./actions/save-config"
import { deleteFromTubeArchivist } from "./actions/delete-from-tubearchivist"

const INPUT = {
  CONFIG: "config",
  DELETE_AFTER_IMPORT: "delete-after-import",
}

async function register({
  peertubeHelpers,
  registerSetting,
  registerHook,
  settingsManager,
  storageManager,
}: RegisterServerOptions): Promise<void> {
  peertubeHelpers.logger.info("Register tubearchivist plugin")

  registerSetting({
    name: INPUT.CONFIG,
    label: "TubeArchivist Config",
    type: "input-textarea",
    descriptionHTML: `
<p>List the tubearchivist hostnames and accesstokens you want to handle as json:</p>
<pre><code>[{
  "hostname": "tubearchivist.example.com",
  "access_token": "your-access-token"
}]
</code></pre>`,
    default: `[{
  "hostname": "tubearchivist.example.com",
  "access_token": "your_access_token"
}]`,
    private: false,
  })

  registerSetting({
    name: INPUT.DELETE_AFTER_IMPORT,
    label: "Delete video from TubeArchivist after import",
    type: "input-checkbox",
    default: false,
    private: false,
  })

  registerHook({
    target: "action:application.listening",
    handler: async () => {
      await downloadYtDlpPlugin()
      saveConfig(await storageManager.getData(INPUT.CONFIG))
    },
  })

  registerHook({
    target: "action:notifier.notification.created" as any,
    handler: async (req: any) => {
      const deleteAfterImport = await settingsManager.getSetting(
        INPUT.DELETE_AFTER_IMPORT
      )

      peertubeHelpers.logger.info(`deleteAfterImport, ${deleteAfterImport}`)
      peertubeHelpers.logger.info(
        `notification created ${req.notification.VideoImport.targetUrl}`
      )

      if (!deleteAfterImport) {
        return
      }

      if (!req.notification?.VideoImport?.targetUrl) {
        return
      }

      if (req.notification.type !== 7) {
        return
      }

      peertubeHelpers.logger.info(
        `Deleting video from TubeArchivist: ${req.notification.VideoImport.targetUrl}`
      )

      const config = await settingsManager.getSetting(INPUT.CONFIG)

      await deleteFromTubeArchivist(
        req.notification.VideoImport.targetUrl,
        JSON.parse(config as string),
        peertubeHelpers.logger
      )

      peertubeHelpers.logger.info(
        `Deleted video from TubeArchivist: ${req.notification.VideoImport.targetUrl}`
      )
    },
  })

  await downloadYtDlpPlugin()
  saveConfig(await settingsManager.getSetting(INPUT.CONFIG))

  settingsManager.onSettingsChange(async (settings: any) => {
    saveConfig(settings[INPUT.CONFIG])
  })
}

async function unregister(): Promise<void> {
  // deleteYtDlpPlugin()
  // deleteYtDlpConfig()
  // deleteYtDlpPluginDir()
}

module.exports = {
  register,
  unregister,
}
