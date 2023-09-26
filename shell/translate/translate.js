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

  const prompt = `Translate ${langMap[originLang]} text separated by \`\`\`\`
returns into ${langMap[targetLang]}, preserving the original markdown or html markup. If the text does not contain ${langMap[originLang]}, return to the original
\`\`\`\`
${content}
\`\`\`\`
  `;

  const result = await chat(prompt).catch(() => {
    // 再试一次
    return chat(prompt);
  });

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

          console.log(prompt);
          console.log(msg);

          debugger;
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
