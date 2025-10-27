import formidable from "formidable";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import mime from "mime-types";
import OpenAI from "openai";
import { File } from "formdata-node"; // ← MIME を明示できる File クラス

export const config = {
  api: { bodyParser: false },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = "/tmp";
  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const fileAny = Array.isArray(files.image) ? files.image[0] : files.image;
      const filePath = fileAny?.filepath || fileAny?.path;

      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error("Uploaded file not found");
      }

      // 入力画像の MIME（参考ログ）
      const detected = mime.lookup(filePath) || "application/octet-stream";
      console.log("Detected input MIME:", detected);

      // ✅ 画像を 1024x1024 以内の PNG に再エンコード（サイズ＋形式を保証）
      const pngBuffer = await sharp(filePath)
        .resize(1024, 1024, { fit: "inside" })
        .png({ compressionLevel: 8 })
        .toBuffer();

      // ✅ MIME を明示した File オブジェクトを作成
      const pngFile = new File([pngBuffer], "image.png", { type: "image/png" });

      // ✅ OpenAI Images Edit API 呼び出し（MIME= image/png を確実に付与）
      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: pngFile,
        prompt:
          "背景をオシャレにして、料理メインの部分を自然に綺麗に整える。新しい要素は追加しないでください。",
        size: "1024x1024"
      });

      const editedUrl = response.data?.[0]?.url;
      if (!editedUrl) throw new Error("No URL returned from OpenAI");

      return res.status(200).json({ url: editedUrl });
    } catch (error) {
      console.error("Image edit error:", error);
      return res.status(500).json({
        error: "AI image edit failed",
        message: error.message
      });
    }
  });
}
