export function isElementVisible(element) {
  var rect = element.getBoundingClientRect();

  var windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  var windowWidth = window.innerWidth || document.documentElement.clientWidth;

  var isVisible =
    rect.top < windowHeight &&
    rect.bottom > 0 &&
    rect.left < windowWidth &&
    rect.right > 0;

  return isVisible;
}

export function wrapSubstringWithSpan(str, substr) {
  return str.replace(
    new RegExp(substr, "gi"),
    "<span style='color:var(--active-color)'>$&</span>"
  );
}

export async function getSummary(url) {
  const content = await fetch(url).then((e) => e.text());

  const datas = markdownToJSON(content);

  fixHref(datas, url);

  return datas;
}

function fixHref(datas, url) {
  datas.forEach((item) => {
    if (item.href) {
      item.path = new URL(item.href, url).href;
    } else if (item.childs) {
      fixHref(item.childs, url);
    }
  });
}

function markdownToJSON(markdown) {
  const lines = markdown.split("\n");
  const json = convertLinesToJSON(lines);
  return json.childs;
}

function convertLinesToJSON(lines) {
  let json = [];
  let stack = [json];

  for (let line of lines) {
    const indent = line.search(/\S/);
    line = line.trim();

    if (line.startsWith("-")) {
      const depth = Math.floor(indent / 2) + 1;
      const item = parseListItem(line);

      while (stack.length > depth) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];
      if (!parent.childs) {
        parent.childs = [];
      }

      parent.childs.push(item);
      stack.push(item);
    }
  }

  return json;
}

function parseListItem(line) {
  const linkRegex = /\[(.*?)\]\((.*?)\)/;
  const match = line.match(linkRegex);

  if (match) {
    const name = match[1].trim();
    const href = match[2].trim();
    return { name, href };
  } else {
    const name = line.substring(1).trim();
    return { name };
  }
}
