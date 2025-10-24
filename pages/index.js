import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [submittedName, setSubmittedName] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("/api/edit-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setResultUrl(data.url);
      } else {
        alert("画像加工に失敗しました");
      }
    } catch (error) {
      alert("通信エラー: " + error.message);
    }
    setLoading(false);
  };

  if (!started)
    return (
      <Screen>
        <h1 className="text-2xl font-bold mb-4">SNS投稿をもっと手軽に。</h1>
        <p className="mb-8 text-gray-600">
          まずはお店の名前を教えてください。
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow"
        >
          はじめてみる
        </button>
      </Screen>
    );

  if (!submittedName)
    return (
      <Screen>
        <div className="max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">
            お店の名前を教えてください。
          </h2>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="例：マクドナルド"
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={() => setSubmittedName(true)}
            disabled={!storeName}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            決定
          </button>
        </div>
      </Screen>
    );

  return (
    <Screen>
      <div className="max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">
          「{storeName}」の料理写真をアップしてください。
        </h2>

        {!image && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
        )}

        {previewUrl && !resultUrl && (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className="rounded-lg mb-4 shadow"
            />
            <button
              onClick={handleProcess}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "AIが加工中…" : "AIで加工する"}
            </button>
          </>
        )}

        {resultUrl && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-2">加工後の画像</h3>
            <img
              src={resultUrl}
              alt="result"
              className="rounded-lg shadow mb-4"
            />
            <p className="text-gray-600">
              背景をオシャレに整え、料理を自然に綺麗にしました。
            </p>
          </>
        )}
      </div>
    </Screen>
  );
}

function Screen({ children }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      {children}
    </main>
  );
}
