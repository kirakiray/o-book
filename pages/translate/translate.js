const generateUrl = "http://localhost:11434/api/generate";
// const generateUrl = "http://localhost:11001/api/generate";

export const translate = async ({ content, callback }) => {
  const data = {
    model: "gemma:7b",
    // model: "llama3",
    temperature: 0,
    // prompt: `把下面的中文翻译成英语，只告诉我翻译后的内容：\n ${content}`,
    prompt: `<start_of_turn>user
    把下面的中文翻译成英语：
    ${content}<end_of_turn>
    <start_of_turn>model`,
  };

  // const data = {
  //   model: "winkefinger/alma-13b:latest",
  //   temperature: 0,
  //   prompt: `Translate this from Chinese to English:
  //   Chinese: {${content}}
  //   English:
  //   `,
  // };

  const response = await fetch(generateUrl, {
    method: "POST",
    body: JSON.stringify(data),
    // headers: {
    //   "Content-Type": "application/json",
    // },
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

      const text = new TextDecoder("utf-8").decode(value);
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.log("error", text);

        let newResponseData = {
          response: "",
          done: false,
        };

        text.split(/\n/g).forEach((newText) => {
          if (!newText.trim()) {
            return;
          }
          const newData = JSON.parse(newText);
          newResponseData = {
            ...newResponseData,
            ...newData,
            response: newResponseData.response + newData.response,
          };
        });

        data = newResponseData;
      }

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
