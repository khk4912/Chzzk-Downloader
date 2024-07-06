export async function _fetch (url: string, options: RequestInit = {}): Promise<Response> {
  options.headers = {
    Accept: '*/*',
    Priority: 'u=1, i',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  }

  return await fetch(url, options)
}
