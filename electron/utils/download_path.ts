import * as os from 'os'

export function getDefaultDownloadPath (): string {
  return `${os.homedir()}/Downloads`
}
