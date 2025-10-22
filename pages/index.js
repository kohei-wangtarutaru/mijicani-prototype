import { useState } from "react";

export default function Home() {
  const steps = [
    { key: "storeName", question: "お店の名前を教えてください。" },
    { key: "mood", question: "お店の雰囲気を一言で表すと？（例：落ち着いた・賑やか・高級感など）" },
    { key: "menu", question: "得意料理や提供メニューを教えてください。" },
    { key: "goal", question: "投稿の目的を教えてください。（例：新規顧客の獲得・リピート促進など）" },
  ];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(false);

  const handleNext = (answer) => {
    const key = steps[step].key;
    setForm({ ...form, [key]: answer });
    if (step + 1 < steps.length) setStep(step + 1);
    else setPreview(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {!preview ? (
        <>
          {step === 0 && Object.keys(form).length === 0 ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">SNS投稿をもっと手軽に。</h1>
              <p className="mb-8 text-gray-600">たった4つの質問で、あなたのお店の初投稿をAIが提案します。</p>
              <button
                onClick={() => setStep(0)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow"
              >
                はじめてみる
              </button>
            </div>
          ) : (
            <QuestionCard
              step={step}
              question={steps[step].question}
              onNext={handleNext}
            />
          )}
        </>
      ) : (
        <Preview form={form} />
      )}
    </main>
  );
}

function QuestionCard({ step, question, onNext }) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="max-w-sm w-full">
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="ここに入力"
        className="w-full p-3 border rounded-lg mb-4"
      />
      <button
        onClick={() => onNext(answer)}
        disabled={!answer}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}

function Preview({ form }) {
  return (
    <div className="max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">AIが作成した投稿サンプル</h2>
      <img
        src="/sample.jpg"
        alt="sample"
        className="rounded-lg mb-4 shadow"
      />
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-gray-800 mb-2">
          {form.storeName} — {form.mood}雰囲気のお店。
        </p>
        <p className="text-gray-800 mb-2">
          看板メニューは「{form.menu}」。
        </p>
        <p className="text-gray-600 text-sm">
          投稿目的：{form.goal}
        </p>
      </div>
      <button className="mt-6 w-full px-6 py-2 bg-blue-600 text-white rounded-lg">
        次の投稿プランを見る
      </button>
    </div>
  );
}
