async function test (): Promise<void> {
  const headers = {
    Accept: '*/*',
    Priority: 'u=1, i',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  }
  const x = await fetch('https://api.chzzk.naver.com/service/v3/channels/dec8d19f0bc4be90a4e8b5d57df9c071/live-detail', { headers })

  console.log(x)
}

test().then().catch((x) => { console.error(x) })
