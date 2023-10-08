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

  //   If the text does not contain ${langMap[originLang]}
  // then simply write \"n0\"

  const prompt = `Translate ${langMap[originLang]} text separated by \`\`\`\`
returns into ${langMap[targetLang]}. 

You must strictly follow the rules below.

- Never change the Markdown markup structure. Don't add or remove links. Do not change any URL.
- Never change the contents of code blocks even if they appear to have a bug.
- Always preserve the original line breaks. Do not add or remove blank lines.
- Never touch the permalink such as \`{/*examples*/}\` at the end of each heading.
- Never touch HTML-like tags such as \`<Notes>\`.

\`\`\`\`
${content}
\`\`\`\`
  `;

  let result = await chat(prompt).catch(() => {
    // 再试一次
    return chat(prompt);
  });

  // if (!result.trim() || result === "n0") {
  if (!result.trim()) {
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
          msg = msg.replace(/\`\`\`\`/g, "");

          const marr = msg.match(/\`\`\`/g);
          if (marr && marr.length === 1) {
            msg = msg.replace("```", "");
          }

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
