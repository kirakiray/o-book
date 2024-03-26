import { create } from "./mdserver.js";

export const currentData = {
  handle: null,
  server: null,
};

export const initServer = async ({ handle, temp }) => {
  currentData.handle = handle;
  currentData.server = await create({
    handle,
    temp,
  });
};
