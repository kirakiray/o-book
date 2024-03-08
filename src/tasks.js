export const statics = async ({ path }) => {
  if (/^_statics\//.test(path)) {
    const repath = path.replace(/^_statics\//, "statics/");

    const headers = {};

    const body = await fetch(repath).then((resp) => {
      for (let [name, value] of resp.headers) {
        headers[name] = value;
      }

      return resp.text();
    });

    return {
      body,
      headers,
    };
  }
};

export const config = async ({ path, all }) => {
  if (/^[a-z]+\/config.json/.test(path)) {
    return {
      body: JSON.stringify(all),
    };
  }
};
