const selfUrl = import.meta.url;
let worker = new Worker(new URL("./search-worker.js", selfUrl).href);

const resolves = {};

worker.onmessage = (e) => {
  const { taskId, results } = e.data;
  resolves[taskId].resolve(results);
  delete resolves[taskId];
};

export default async ({ content }) => {
  const taskId = Math.random().toString(16).slice(2);
  const articlesUrl = new URL("_articles.json", new URL(DOCROOT, location))
    .href;
  worker.postMessage({ content: content.trim(), taskId, articlesUrl });

  const results = await new Promise(
    (resolve, reject) => (resolves[taskId] = { resolve, reject })
  );

  return results;
};
