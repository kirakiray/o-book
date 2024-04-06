const generateUrl = "http://localhost:11434/api/generate";

export const translate = async ({ content, callback }) => {
  const data = {
    model: "gemma:7b",
    // prompt: "你会翻译什么人类的语言?",
    prompt: `将下面的内容翻译成英文：\n ${content}`,
  };

  const response = await fetch(generateUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const reader = response.body.getReader();

  return new Promise((resolve) => {
    let context = "";

    const push = async () => {
      const { done, value } = await reader.read();

      if (done) {
        resolve({ context });
        return;
      }

      const data = JSON.parse(new TextDecoder("utf-8").decode(value));

      //   console.log("data: ", data);

      context += data.response;

      callback &&
        callback({
          context,
          response: data.response,
        });

      push();
    };

    push();
  });
};
