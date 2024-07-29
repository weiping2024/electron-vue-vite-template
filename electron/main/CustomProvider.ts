import {
  newError,
  UpdateInfo,
  CustomPublishOptions,
} from "builder-util-runtime";
import { Provider, ResolvedUpdateFileInfo } from "electron-updater";
import { ProviderRuntimeOptions } from "electron-updater/out/providers/Provider";

type RequestInfoType = {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
};

export class CustomProvider extends Provider<UpdateInfo> {
  private readonly baseUrl: URL;

  constructor(
    private readonly configuration: CustomPublishOptions,
    private readonly updater: any,
    runtimeOptions: ProviderRuntimeOptions,
  ) {
    super({
      ...runtimeOptions,
      isUseMultipleRangeRequest: false,
    });
    const url = `${this.configuration.host}/repos/${this.configuration.owner}/${this.configuration.repo}/releases/${this.updater?.channel || this.configuration.channel}`;
    this.baseUrl = new URL(url);
  }

  async getLatestVersion(): Promise<UpdateInfo> {
    try {
      const updateInfo: {
        name: string;
        assets: RequestInfoType[];
        published_at: string;
      } = JSON.parse(await this.httpRequest(this.baseUrl));
      return {
        version: updateInfo.name,
        files: updateInfo.assets.map((it) => {
          return {
            url: it.browser_download_url,
            path: it.browser_download_url,
            size: it.size,
            releaseDate: it.updated_at,
            sha512: "",
          };
        }),
        releaseDate: updateInfo.published_at,
      } as unknown as UpdateInfo;
    } catch (e: any) {
      throw newError(
        `Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`,
        "ERR_UPDATER_LATEST_VERSION_NOT_FOUND",
      );
    }
  }

  resolveFiles(updateInfo: UpdateInfo): Array<ResolvedUpdateFileInfo> {
    return updateInfo.files.map((it) => {
      return {
        url: new URL(it.url),
        info: it,
      };
    });
  }

  toString() {
    return `CustomProvider (baseUrl: ${this.baseUrl})`;
  }
}
