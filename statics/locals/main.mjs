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
  morelang: "More languages",
  showallcode: "Show all codes",
  hideunimportcode: "Hide unimportant codes",
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
  morelang: "更多语言",
  showallcode: "显示所有代码",
  hideunimportcode: "隐藏不重要的代码",
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
  morelang: "更多语言",
  showallcode: "显示所有代码",
  hideunimportcode: "隐藏不重要的代码",
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
  morelang: "Más idiomas",
  showallcode: "Mostrar todos los códigos",
  hideunimportcode: "Ocultar código no importante",
};

const ja = {
  search: "検索",
  recent: "最近",
  norecent: "検索履歴なし",
  noresult: "「{{stext}}」に関する結果が見つかりません",
  inpreview: "プレビュー中",
  preview: "ウェブページのプレビュー",
  tabopen: "新しいタブで開く",
  refresh: "ページをリフレッシュ",
  previous: "前のページ",
  next: "次のページ",
  morelang: "他の言語",
  showallcode: "すべてのコードを表示",
  hideunimportcode: "重要でないコードを非表示",
};

const ko = {
  search: "검색",
  recent: "최근",
  norecent: "검색 기록 없음",
  noresult: '"{{stext}}"에 대한 결과가 없습니다',
  inpreview: "미리보기 중",
  preview: "웹 페이지 미리보기",
  tabopen: "새 탭에서 열기",
  refresh: "페이지 새로고침",
  previous: "이전",
  next: "다음",
  morelang: "다른 언어",
  showallcode: "모든 코드 표시",
  hideunimportcode: "중요하지 않은 코드 숨기기",
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
    case "ja":
      Object.assign(locals, ja);
      break;
    case "ko":
      Object.assign(locals, ko);
      break;
  }
});

export default locals;
