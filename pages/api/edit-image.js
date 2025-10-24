import formidable from "formidable";
import fs from "fs";
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

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    const imagePath = files.image[0].filepath;

    try {
      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: fs.createReadStream(imagePath),
        prompt:
          "背景をオシャレにし、料理のメイン部分を自然にきれいに整える。新しい要素は追加しないでください。",
        size: "1024x1024",
      });

      const editedUrl = response.data[0].url;
      res.status(200).json({ url: editedUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI image edit failed" });
    }
  });
}
