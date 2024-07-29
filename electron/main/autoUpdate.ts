import { autoUpdater } from "electron-updater";
import { BrowserWindow, dialog } from "electron";
import { CustomProvider } from "./CustomProvider";
import MessageBoxOptions = Electron.MessageBoxOptions;

export const update = (win: BrowserWindow) => {
  autoUpdater.setFeedURL({
    provider: "custom",
    updateProvider: CustomProvider,
    host: "https://api.github.com",
    channel: "latest",
    owner: "weiping2024",
    repo: "electron-vue-vite-template",
  });
  autoUpdater.channel = "latest";
  // autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.autoDownload = false;

  autoUpdater.on("update-available", () => {
    const dialogOpts = {
      type: "info",
      buttons: ["立刻下载", "稍后下载"],
      title: "下载提示",
      message: "检测到新版本，是否立即下载？",
    } as MessageBoxOptions;

    dialog.showMessageBox(win, dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on("update-downloaded", () => {
    const dialogOpts = {
      type: "info",
      buttons: ["立刻", "稍后"],
      title: "安装提示",
      message: "新版本已下载，是否立即安装？",
    } as MessageBoxOptions;

    dialog.showMessageBox(win, dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
    const dialogOpts = {
      type: "error",
      buttons: ["关闭"],
      title: "安装失败",
      message,
    } as unknown as MessageBoxOptions;

    dialog.showMessageBox(win, dialogOpts);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 6000);
};
