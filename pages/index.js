import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!started) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">SNS投稿をもっと手軽に。</h1>
        <p className="mb-8 text-gray-600">
          まずは1つだけ、お店の名前を教えてください。
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow"
        >
          はじめてみる
        </button>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold mb-4">ありがとうございます！</h2>
        <p className="text-gray-700 mb-6">
          「{storeName}」の情報をもとに投稿を提案していきます。
        </p>
        <button
          onClick={() => setStarted(false)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          はじめに戻る
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">お店の名前を教えてください。</h2>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="例：マクドナルド"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={() => setSubmitted(true)}
          disabled={!storeName}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          決定
        </button>
      </div>
    </main>
  );
}
