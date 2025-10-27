import formidable from "formidable";
import fs from "fs";
import path from "path";
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

      // 🧩 ファイルをバッファとして読み込み
      const imageBuffer = fs.readFileSync(filePath);

      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: imageBuffer,
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
