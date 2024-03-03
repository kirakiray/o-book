const fetchOptions = {
  agent: "",
};

const cacheResp = {};

async function wrapFetch(url, type) {
  if (fetchOptions.agent) {
    return fetchOptions.agent(url, type);
  }

  let pms;

  if (!cacheResp[url]) {
    cacheResp[url] = fetch(url);

    setTimeout(() => {
      cacheResp[url] = null;
    }, 3000);
  }

  pms = Promise.resolve((await cacheResp[url]).clone());

  if (type) {
    return pms.then((e) => e[type]());
  }

  return pms;
}
