const generateUrl = "http://localhost:11434/api/generate";

export const translate = async ({ content, callback }) => {
  const data = {
    model: "gemma:7b",
    // prompt: "你会翻译什么人类的语言?",
    // prompt: `将下面的内容翻译成英文，不用返回多余的内容：
    // ${content}`,
    // prompt: `<start_of_turn>user
    // You are a helpful 2nd-grade teacher. Help a 2nd grader to answer questions in a short and clear manner.
    // Explain why the sky is blue<end_of_turn>
    // <start_of_turn>model`,
    prompt: `<start_of_turn>user
    Translate the content into Spanish: 
    ${content}<end_of_turn>
    <start_of_turn>model`,
  };

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

        const newResponseData = {
          response: "",
          done: false,
        };

        text.split(/\n/g).forEach((newText) => {
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
