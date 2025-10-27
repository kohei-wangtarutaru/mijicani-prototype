import formidable from "formidable";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import mime from "mime-types"; // 👈 MIMEタイプ補正用
import OpenAI from "openai";

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
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const filePath = file.filepath || file.path;

      if (!fs.existsSync(filePath)) {
        throw new Error("Uploaded file not found");
      }

      // ✅ 画像ファイルのMIMEタイプ確認
      const mimeType = mime.lookup(filePath);
      console.log("Detected MIME type:", mimeType);

      // ✅ SharpでPNGとして再エンコード（形式を保証）
      const resizedPath = path.join(uploadDir, `resized-${Date.now()}.png`);
      await sharp(filePath)
        .resize(1024, 1024, { fit: "inside" })
        .png({ compressionLevel: 8 })
        .toFile(resizedPath);

      // ✅ 明示的に拡張子付きでストリーム化
      const stream = fs.createReadStream(resizedPath);

      // ✅ OpenAIへ送信
      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: stream,
        prompt:
          "背景をオシャレにして、料理メインの部分を自然に綺麗に整える。新しい要素は追加しないでください。",
        size: "1024x1024",
      });

      const editedUrl = response.data?.[0]?.url;
      if (!editedUrl) throw new Error("No URL returned from OpenAI");

      res.status(200).json({ url: editedUrl });
    } catch (error) {
      console.error("Image edit error:", error);
      res.status(500).json({
        error: "AI image edit failed",
        message: error.message,
      });
    }
  });
}
