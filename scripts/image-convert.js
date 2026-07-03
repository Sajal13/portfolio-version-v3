import sharp from "sharp";
import { glob } from "glob";
import path from "path";

const inputFormat = ["png", "jpg", "jpeg"];
const outputFormat = "webp";

const SRC_ROOTS = ["assets", "apps/cdn/assets"];

const images = await glob(
  SRC_ROOTS.map((dir) => `${dir}/**/*.{${inputFormat.join(",")}}`),
);

images.forEach(async (image) => {
  await sharp(path.resolve(image))
    .toFormat(outputFormat)
    .webp({ quality: 100 })
    .toFile(
      path.dirname(image) +
        "/" +
        path.basename(image, path.extname(image)) +
        ".webp",
    );

  console.log("Converted:", image);
});