import puppeteer from "puppeteer";

export const openPage = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  return browser;

  // 在这里可以执行更多的浏览器操作
  // await browser.close();
};
