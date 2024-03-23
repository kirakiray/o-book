import { createWriteStream } from "fs";
import archiver from "archiver";

async function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

zipDirectory("./statics", "./_statics.zip");
zipDirectory("./demos/quick-start", "./demos/quick-start.zip");
