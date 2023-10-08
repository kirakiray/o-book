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

const emptyStr = `n${Math.random().toString(32).slice(2)}`;

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

  // const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in Markdown content for %%%%
  // Do not think about what's in it, just do the translation work
  // Keep the Markdown markup structure. Do not add or remove links. Do not change any URL.
  // Never change the contents of code blocks even if they appear to have a bug.
  // If the text can not be translated, then simply write \"${emptyStr}\".
  
  // %%%%
  // ${content}
  // %%%%`;

  const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in text or Markdown content for %%%%
Do not think about what's in it, just do the translation work, cannot add more content.
Do not append after the colon or ：.
Keep the Markdown markup structure. Do not add or remove links. Do not change any URL. Do not remove code block language
Never change the contents of code blocks even if they appear to have a bug.
If the text can not be translated, then simply write \"${emptyStr}\".

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

  // chatgpt 可能会不认识某些语言，如果识别不了，这时候抽取内容
  if (/%%%%[\s\S]+%%%%/.test(result)) {
    const c = result.replace(/[\s\S]*%%%%\n?([\s\S]+?)\n?%%%%[\s\S]*/, "$1");
    // debugger;
    return c;
  }

  // 去除干扰字段
  result = result.replace(/\n*%+%\n*/g, "");

  if (!result.trim() || result.includes(emptyStr)) {
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
