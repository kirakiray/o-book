import https from "https";
import path from "path";
import chn from "chinese-s2t";

const langMap = {
  cn: "simplified Chinese",
  "t-cn": "traditional Chinese",
  en: "English",
  es: "Spanish",
  jp: "Japanese",
};

export default async function translate({ content, targetLang, originLang }) {
  if (!content.trim()) {
    return content;
  }

  if (originLang === "cn" && targetLang === "t-cn") {
    return chn.s2t(content);
  } else if (originLang === "t-cn" && targetLang === "cn") {
    return chn.t2s(content);
  }

  if (!langMap[targetLang]) {
    throw new Error(`${targetLang} not supported`);
  }

  if (!langMap[originLang]) {
    throw new Error(`${originLang} not supported`);
  }

  //   const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in content for %%%%

  // You must strictly follow the rules:
  // - Translation only, don't try to add content
  // - Keep the Markdown markup structure. Don't add or remove links. Do not change any URL.

  // %%%%${content}%%%%`;

  const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in content for %%%%
Translation only, don't try to add content
Keep the Markdown markup structure. Don't add or remove links. Do not change any URL.
If the text can not be translated, then simply write \"null\"

%%%%
${content}
%%%%`;

  let result = await chat(prompt).catch(() => {
    // 再试一次
    return chat(prompt);
  });

  // console.log(content);
  // console.log(result);
  // debugger;

  // chatgpt 可能会不认识某些语言，如果识别不了，会返回原文，这时候就直接返回

  // 去除干扰字段
  result = result.replace(/%+%\n?/g, "");

  if (!result.trim() || result === "null") {
    // debugger;
    return content;
  }

  // 保证末尾的回车数不变
  let lastLength = content.match(/\n+$/) ? content.match(/\n+$/)[0].length : 0;
  if (lastLength) {
    // 保证返回的值也保留对应的回车
    let i = result.match(/\n+$/) ? result.match(/\n+$/)[0].length : 0;
    for (; i < lastLength; i++) {
      result += "\n";
    }
  }

  // 保证开头的回车数不变
  let beginLength = content.match(/^\n+/) ? content.match(/^\n+/)[0].length : 0;
  if (beginLength) {
    let i = result.match(/^\n+/) ? result.match(/^\n+/)[0].length : 0;
    for (; i < beginLength; i++) {
      result = "\n" + result;
    }
  }

  return result;
}

export async function chat(prompt) {
  const { apiKey, baseURL } = await import(
    path.resolve(process.env.PWD, "./apikey.js")
  );

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  };

  const postData = JSON.stringify(data);

  const options = {
    hostname: baseURL,
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          let msg = result.choices[0].message.content;

          resolve(msg);
        } catch (err) {
          console.error(err);
          console.error(responseData);
          reject(err);
        }
      });
    });

    req.on("error", (error) => {
      console.error("error request:", error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}
