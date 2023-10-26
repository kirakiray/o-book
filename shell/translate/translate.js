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

  // 如果来源是中文，且要翻译的内容不包含中文，直接返回原文
  if (originLang === "cn" && !/[\u4e00-\u9fa5]/.test(content)) {
    return content;
  }

  if (!langMap[targetLang]) {
    throw new Error(`${targetLang} not supported`);
  }

  if (!langMap[originLang]) {
    throw new Error(`${originLang} not supported`);
  }

  // const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in text or Markdown content for %%%%
  // Do not think about what's in it, just do the translation work, cannot add more content or change content.
  // Do not add content after the colon/：.
  // Keep the Markdown markup structure. Do not add or remove links. Do not change any URL. Do not remove code block markup
  // Never change the contents of code even if they appear to have a bug.
  // If the text can not be translated, then simply write \"${emptyStr}\".

  // %%%%
  // ${content}%%%%`;
  // rubish gpt
  let result = "";
  let count = 0;

  while (count < 2) {
    const prompt = `Translate ${langMap[originLang]} to ${langMap[targetLang]} in text or Markdown content delimited by %%%%
    If the text can not be translated, then simply write \"${emptyStr}\".
    
    %%%%
    ${content}%%%%`;

    result = await chat(prompt).catch(() => {
      // 再试一次
      return chat(prompt);
    });

    // chatgpt 可能会不认识某些语言，如果识别不了，这时候抽取内容
    if (/%%%%[\s\S]+%%%%/.test(result)) {
      result = result.replace(/[\s\S]*%%%%\n?([\s\S]+?)\n?%%%%[\s\S]*/, "$1");
    }

    // 去除干扰字段
    result = result.replace(/\n*%+%\n*/g, "");

    // 以下情况进行充实
    // 1空白 2带有空白标识 3和原文一样
    if (!result.trim() || result.includes(emptyStr) || result === content) {
      count++;
    } else {
      count = 4;
    }
  }

  if (!result.trim() || result.includes(emptyStr)) {
    return content;
  }

  return fixNewlines(content, result);
}

function fixNewlines(a, b) {
  const leadingNewlines = a.match(/^\n*/)[0]; // 匹配 a 字符串开头的换行符
  const trailingNewlines = a.match(/\n*$/)[0]; // 匹配 a 字符串结尾的换行符

  const fixedB = leadingNewlines + b.trim() + trailingNewlines; // 修正 b 字符串的前后换行符，并去除首尾空白

  return fixedB;
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
