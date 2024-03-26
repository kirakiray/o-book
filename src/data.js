import { create } from "./mdserver.js";

export const currentData = {
  handle: null,
  server: null,
};

export const initServer = async ({ handle }) => {
  currentData.handle = handle;
  currentData.server = await create({
    handle,
    temp: await fetch("/statics/index.html").then((e) => e.text()),
  });
};
