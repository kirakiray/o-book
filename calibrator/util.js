export const getBlockError = (beforeContent, afterContent) => {
  if (beforeContent.match(/```.+/g)) {
    let error;
    beforeContent.match(/```.+/g).forEach((str) => {
      if (!afterContent.includes(str)) {
        error = {
          type: 2,
          desc: "代码块语言错误",
        };
      }
    });
    if (error) {
      return error;
    }
  }

  // 判断特殊字符是否一致
  let charError = "";
  ["\\n", "#", "<", ">", "\\[", "\\]"].forEach((char, index) => {
    const reg = new RegExp(char, "g");
    const leftLen = beforeContent.match(reg)?.length || 0;
    const rightLen = afterContent.match(reg)?.length || 0;

    if (leftLen !== rightLen) {
      if (index === 0) {
        charError += `"回车":${rightLen - leftLen}; `;
      } else {
        charError += `"${char}":${rightLen - leftLen}; `;
      }
    }
  });

  if (charError) {
    return {
      type: 4,
      desc: charError,
    };
  }

  // const japaneseRegex = /[\u0800-\u4e00]/;
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/;

  // 带有中文
  if (
    /[\u4e00-\u9fa5]+/.test(afterContent) &&
    !japaneseRegex.test(afterContent)
  ) {
    return {
      type: 3,
      desc: "转换的代码出现中文",
    };
  }
};
