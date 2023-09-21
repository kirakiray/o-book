export default async (PATH, [{ query, load }]) => {
  return {
    attached() {
      this.shadow.all("a").forEach((e) => {
        const href = e.attr("href") || "";

        if (href.includes(location.origin) && /\.html/.test(href)) {
          e.attr("olink", "");
        }
      });
    },
  };
};
