import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Trash2,
  Volume2,
  Languages,
} from "lucide-react";

function SpeechToSign() {
  const recognitionRef = useRef(null);
  const finalTextRef = useRef("");

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");

  const isSupported =
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window;

  useEffect(() => {
    if (!isSupported) {
      setError(
        "المتصفح لا يدعم Speech Recognition. استخدم Google Chrome."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "ar-EG";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let newFinalText = "";
      let currentInterimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          newFinalText += text + " ";
        } else {
          currentInterimText += text;
        }
      }

      if (newFinalText) {
        finalTextRef.current =
          `${finalTextRef.current} ${newFinalText}`
            .trim()
            .replace(/\s+/g, " ");

        setTranscript(finalTextRef.current);
      }

      setInterimText(currentInterimText);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech Recognition Error:",
        event.error
      );

      if (event.error === "not-allowed") {
        setError(
          "يرجى السماح للمتصفح باستخدام الميكروفون."
        );
      } else if (event.error === "no-speech") {
        setError("لم يتم اكتشاف أي كلام.");
      } else {
        setError(
          "حدث خطأ أثناء التعرف على الكلام."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    setError("");
    setInterimText("");

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.stop();
    setIsListening(false);
    setInterimText("");
  };

  const clearText = () => {
    finalTextRef.current = "";
    setTranscript("");
    setInterimText("");
    setError("");
  };

  const speakText = () => {
    const text = finalTextRef.current.trim();

    if (!text) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "ar-EG";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const displayedText =
    `${transcript} ${interimText}`
      .trim()
      .replace(/\s+/g, " ");

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-6 pb-20 pt-32"
    >
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            <Languages size={16} />
            Easy Com Speech to Sign
          </div>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            تحويل{" "}
            <span className="text-indigo-400">
              الكلام
            </span>{" "}
            إلى إشارة
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            تحدث أمام الميكروفون وسيقوم
            Easy Com بتحويل كلامك إلى نص،
            ثم سنستخدمه لاحقًا لعرض إشارات لغة
            الإشارة.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 md:col-span-2">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  الكلام
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  تحدث باللغة العربية
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isListening
                    ? "bg-red-500/20 text-red-400"
                    : "bg-indigo-500/10 text-indigo-400"
                }`}
              >
                {isListening ? (
                  <Mic size={24} />
                ) : (
                  <MicOff size={24} />
                )}
              </div>

            </div>

            <div className="min-h-[250px] rounded-xl border border-white/10 bg-slate-950 p-6">

              {displayedText ? (
                <p className="text-2xl leading-loose text-white">
                  {displayedText}
                </p>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center text-center">

                  <div>

                    <Mic
                      size={45}
                      className="mx-auto mb-4 text-slate-700"
                    />

                    <p className="text-slate-500">
                      اضغط على الميكروفون وابدأ
                      الكلام...
                    </p>

                  </div>

                </div>
              )}

            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">

              {!isListening ? (
                <button
                  onClick={startListening}
                  disabled={!isSupported}
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-7 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Mic size={19} />
                  ابدأ التسجيل
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex items-center gap-2 rounded-xl bg-red-500/10 px-7 py-3 font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  <MicOff size={19} />
                  إيقاف التسجيل
                </button>
              )}

              <button
                onClick={speakText}
                disabled={!transcript.trim()}
                className="flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-6 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-400/20 disabled:opacity-40"
              >
                <Volume2 size={18} />
                تشغيل الصوت
              </button>

              <button
                onClick={clearText}
                disabled={!transcript.trim() && !interimText.trim()}
                className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-6 py-3 font-semibold text-red-300 transition hover:bg-red-400/20 disabled:opacity-40"
              >
                <Trash2 size={18} />
                مسح
              </button>

            </div>

          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold text-white">
              حالة النظام
            </h2>

            <div className="mt-6 space-y-4">

              <StatusItem
                title="Speech Recognition"
                value={
                  isSupported
                    ? "مدعوم"
                    : "غير مدعوم"
                }
                active={isSupported}
              />

              <StatusItem
                title="Microphone"
                value={
                  isListening
                    ? "يستمع..."
                    : "متوقف"
                }
                active={isListening}
              />

              <StatusItem
                title="Language"
                value="Arabic (Egypt)"
                active
              />

            </div>

          </div>

        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-6">

          <h2 className="mb-5 text-xl font-semibold text-white">
            المرحلة القادمة
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <FeatureCard
              number="01"
              title="Speech"
              description="التحدث أمام الميكروفون"
            />

            <FeatureCard
              number="02"
              title="Text"
              description="تحويل الكلام إلى نص"
            />

            <FeatureCard
              number="03"
              title="Sign"
              description="تحويل النص إلى إشارات"
            />

          </div>

        </div>

      </div>
    </main>
  );
}

function StatusItem({
  title,
  value,
  active,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-4">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-center gap-2">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            active
              ? "bg-green-400"
              : "bg-slate-600"
          }`}
        />

        <span className="font-medium text-white">
          {value}
        </span>

      </div>

    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/50 p-5">

      <span className="text-sm font-bold text-indigo-400">
        {number}
      </span>

      <h3 className="mt-2 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default SpeechToSign;