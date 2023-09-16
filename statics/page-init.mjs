import { wrapSubstringWithSpan } from "./util.mjs";

function articleWrapCode(article) {
  article.all("pre code").forEach((e) => {
    e.unwrap();
    e.wrap({ tag: "doc-code" });
  });
}

export default async (PATH, [{ query, load }]) => {
  return {
    attached() {
      if (query.pid) {
        setTimeout(() => {
          const target = this.shadow.$("article")[query.pid];

          if (query.search) {
            target.html = wrapSubstringWithSpan(target.text, query.search);
          }

          target.ele.scrollIntoView();
        }, 500);
      }

      articleWrapCode(this.shadow.$("article"));

      // const loading = $("#loading");
      // if (loading) {
      //   setTimeout(() => {
      //     loading.classList.add("fadeout");
      //     setTimeout(() => {
      //       loading.remove();
      //     }, 400);
      //   }, 200);
      // }
    },
  };
};
