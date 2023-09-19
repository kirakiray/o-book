const fetchOptions = {
  agent: "",
};

async function wrapFetch(url, type) {
  if (fetchOptions.agent) {
    return fetchOptions.agent(url, type);
  }

  if (type) {
    return fetch(url).then((e) => e[type]());
  }

  return fetch(url);
}
