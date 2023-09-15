import { getLang } from "../data.mjs";

const en = {
  search: "Search",
  recent: "Recent",
  norecent: "No recent search",
  noresult: 'No results for "{{stext}}"',
  inpreview: "In Preview",
  preview: "Preview",
  tabopen: "New tab opens",
  refresh: "Refresh",
  previous: "Previous",
  next: "Next",
};

const cn = {
  search: "搜索",
  recent: "最近",
  norecent: "没有搜索记录",
  noresult: '没有搜索到关于"{{stext}}"的结果',
  inpreview: "预览中",
  preview: "预览网页",
  tabopen: "新标签打开",
  refresh: "刷新页面",
  previous: "上一篇",
  next: "下一篇",
};

const tw = {
  search: "搜索",
  recent: "最近",
  norecent: "没有搜索紀錄",
  noresult: '沒有搜尋到關於"{{stext}}"的結果',
  inpreview: "預覽中",
  preview: "預覽網頁",
  tabopen: "新標籤打開",
  refresh: "刷新頁面",
  previous: "上一篇",
  next: "下一篇",
};

const es = {
  search: "Buscar",
  recent: "Reciente",
  norecent: "No hay registros de búsqueda",
  noresult: 'No se encontraron resultados para "{{stext}}"',
  inpreview: "En vista previa",
  preview: "Vista previa de la página",
  tabopen: "Abrir en nueva pestaña",
  refresh: "Actualizar página",
  previous: "Anterior",
  next: "Siguiente",
};

const locals = $.stanz(en);

locals._t = (key, data) => {
  let target = locals.get(key);

  Object.entries(data).forEach(([key, value]) => {
    const reg = new RegExp(`\{\{ *${key}? *\}\}`, "g");
    target = target.replace(reg, value);
  });

  return target;
};

getLang().then((lang) => {
  switch (lang) {
    case "cn":
      Object.assign(locals, cn);
      break;
    case "t-cn":
      Object.assign(locals, tw);
      break;
    case "es":
      Object.assign(locals, es);
      break;
  }
});

export default locals;
