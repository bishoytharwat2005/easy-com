import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  RotateCcw,
  Volume2,
  Trash2,
  Plus,
} from "lucide-react";

import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

function Translator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const stableSignRef = useRef("");
  const signFramesRef = useRef(0);
  const lastAddedSignRef = useRef("");

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [handsDetected, setHandsDetected] = useState(0);

  const [translation, setTranslation] = useState(
    "في انتظار الإشارة..."
  );

  const [sentence, setSentence] = useState([]);

  const [error, setError] = useState("");

  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],

    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],

    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12],

    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16],

    [13, 17],
    [17, 18],
    [18, 19],
    [19, 20],

    [0, 17],
  ];

  const distance = (a, b) => {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
        (a.y - b.y) ** 2
    );
  };

  const isFingerOpen = (
    landmarks,
    tip,
    pip
  ) => {
    const wrist = landmarks[0];

    return (
      distance(
        landmarks[tip],
        wrist
      ) >
      distance(
        landmarks[pip],
        wrist
      ) * 1.15
    );
  };

  const getFingers = (landmarks) => {
    return {
      index: isFingerOpen(
        landmarks,
        8,
        6
      ),

      middle: isFingerOpen(
        landmarks,
        12,
        10
      ),

      ring: isFingerOpen(
        landmarks,
        16,
        14
      ),

      pinky: isFingerOpen(
        landmarks,
        20,
        18
      ),
    };
  };

  const detectOneHandSign = (
    landmarks
  ) => {
    if (
      !landmarks ||
      landmarks.length !== 21
    ) {
      return "غير معروف";
    }

    const {
      index,
      middle,
      ring,
      pinky,
    } = getFingers(landmarks);

    const openCount = [
      index,
      middle,
      ring,
      pinky,
    ].filter(Boolean).length;

    const thumbUp =
      landmarks[4].y <
        landmarks[3].y &&
      landmarks[4].y <
        landmarks[2].y;

    const thumbDown =
      landmarks[4].y >
        landmarks[3].y &&
      landmarks[4].y >
        landmarks[2].y;

    const fist =
      openCount === 0;

    const openHand =
      openCount === 4;

    const indexOnly =
      index &&
      !middle &&
      !ring &&
      !pinky;

    const twoFingers =
      index &&
      middle &&
      !ring &&
      !pinky;

    const threeFingers =
      index &&
      middle &&
      ring &&
      !pinky;

    const love =
      index &&
      pinky &&
      !middle &&
      !ring;

    if (thumbUp && fist) {
      return "نعم";
    }

    if (thumbDown && fist) {
      return "لا";
    }

    if (love) {
      return "أحب";
    }

    if (openHand) {
      return "السلام عليكم";
    }

    if (fist) {
      return "توقف";
    }

    if (indexOnly) {
      return "واحد";
    }

    if (twoFingers) {
      return "اثنان";
    }

    if (threeFingers) {
      return "ثلاثة";
    }

    return "غير معروف";
  };

  const detectTwoHandsSign = (
    hands
  ) => {
    if (hands.length !== 2) {
      return "غير معروف";
    }

    const hand1 =
      getFingers(hands[0]);

    const hand2 =
      getFingers(hands[1]);

    const count1 =
      Object.values(hand1).filter(
        Boolean
      ).length;

    const count2 =
      Object.values(hand2).filter(
        Boolean
      ).length;

    if (
      count1 === 4 &&
      count2 === 4
    ) {
      return "معًا";
    }

    if (
      count1 === 0 &&
      count2 === 0
    ) {
      return "قوة";
    }

    return "غير معروف";
  };

  const addSignToSentence = (
    sign
  ) => {
    if (
      !sign ||
      sign === "غير معروف" ||
      sign === "في انتظار الإشارة..."
    ) {
      return;
    }

    setSentence((prev) => {
      return [...prev, sign];
    });
  };

  const updateTranslation = (
    sign
  ) => {
    if (sign === "غير معروف") {
      signFramesRef.current = 0;
      stableSignRef.current = "";

      return;
    }

    if (
      stableSignRef.current === sign
    ) {
      signFramesRef.current += 1;
    } else {
      stableSignRef.current = sign;
      signFramesRef.current = 1;
    }

    if (
      signFramesRef.current >= 12
    ) {
      setTranslation(sign);

      if (
        lastAddedSignRef.current !==
        sign
      ) {
        lastAddedSignRef.current =
          sign;

        addSignToSentence(sign);
      }
    }
  };

  const drawLandmarks = (
    results
  ) => {
    const canvas =
      canvasRef.current;

    const video =
      videoRef.current;

    if (!canvas || !video) {
      return;
    }

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return;
    }

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const ctx =
      canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const hands =
      results.landmarks || [];

    setHandsDetected(
      hands.length
    );

    if (hands.length === 0) {
      stableSignRef.current = "";
      signFramesRef.current = 0;
      lastAddedSignRef.current = "";

      setTranslation(
        "في انتظار الإشارة..."
      );

      return;
    }

    hands.forEach(
      (landmarks) => {
        ctx.strokeStyle =
          "#22c55e";

        ctx.fillStyle =
          "#22c55e";

        ctx.lineWidth = 3;

        ctx.lineCap = "round";

        ctx.lineJoin = "round";

        connections.forEach(
          ([start, end]) => {
            const p1 =
              landmarks[start];

            const p2 =
              landmarks[end];

            ctx.beginPath();

            ctx.moveTo(
              p1.x *
                canvas.width,
              p1.y *
                canvas.height
            );

            ctx.lineTo(
              p2.x *
                canvas.width,
              p2.y *
                canvas.height
            );

            ctx.stroke();
          }
        );

        landmarks.forEach(
          (point) => {
            ctx.beginPath();

            ctx.arc(
              point.x *
                canvas.width,
              point.y *
                canvas.height,
              5,
              0,
              Math.PI * 2
            );

            ctx.fill();
          }
        );
      }
    );

    let sign;

    if (hands.length === 2) {
      sign =
        detectTwoHandsSign(
          hands
        );
    } else {
      sign =
        detectOneHandSign(
          hands[0]
        );
    }

    updateTranslation(sign);
  };

  const detectHands = () => {
    const video =
      videoRef.current;

    const landmarker =
      landmarkerRef.current;

    if (
      !video ||
      !landmarker ||
      video.readyState < 2
    ) {
      animationRef.current =
        requestAnimationFrame(
          detectHands
        );

      return;
    }

    try {
      const results =
        landmarker.detectForVideo(
          video,
          performance.now()
        );

      drawLandmarks(results);
    } catch (err) {
      console.error(err);
    }

    animationRef.current =
      requestAnimationFrame(
        detectHands
      );
  };

  const startCamera =
    async () => {
      try {
        setLoading(true);
        setError("");

        const vision =
          await FilesetResolver.forVisionTasks(
            "/wasm"
          );

        const landmarker =
          await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "/models/hand_landmarker.task",

                delegate: "CPU",
              },

              runningMode: "VIDEO",

              numHands: 2,

              minHandDetectionConfidence:
                0.5,

              minHandPresenceConfidence:
                0.5,

              minTrackingConfidence:
                0.5,
            }
          );

        landmarkerRef.current =
          landmarker;

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: "user",

                width: {
                  ideal: 1280,
                },

                height: {
                  ideal: 720,
                },
              },

              audio: false,
            }
          );

        streamRef.current =
          stream;

        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();

        setCameraActive(true);
        setLoading(false);

        animationRef.current =
          requestAnimationFrame(
            detectHands
          );
      } catch (err) {
        console.error(err);

        setLoading(false);
        setCameraActive(false);

        setError(
          "حدث خطأ أثناء تشغيل الكاميرا أو تحميل النموذج."
        );
      }
    };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();

      videoRef.current.srcObject =
        null;
    }

    if (canvasRef.current) {
      const ctx =
        canvasRef.current.getContext(
          "2d"
        );

      ctx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    setCameraActive(false);
    setHandsDetected(0);

    setTranslation(
      "في انتظار الإشارة..."
    );

    stableSignRef.current = "";
    signFramesRef.current = 0;
    lastAddedSignRef.current = "";

    window.speechSynthesis?.cancel();
  };

  const restartCamera = () => {
    stopCamera();

    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const speakSentence = () => {
    if (
      sentence.length === 0
    ) {
      return;
    }

    const text =
      sentence.join(" ");

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang = "ar-EG";
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  const speakTranslation = () => {
    if (
      !translation ||
      translation ===
        "غير معروف" ||
      translation ===
        "في انتظار الإشارة..."
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        translation
      );

    utterance.lang = "ar-EG";
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  const clearSentence = () => {
    setSentence([]);

    lastAddedSignRef.current = "";
  };

  const manuallyAddSign = () => {
    if (
      translation ===
        "غير معروف" ||
      translation ===
        "في انتظار الإشارة..."
    ) {
      return;
    }

    addSignToSentence(
      translation
    );

    lastAddedSignRef.current =
      translation;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      window.speechSynthesis?.cancel();

      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-6 pb-20 pt-32"
    >
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            <Camera size={16} />
            Easy Com Translator
          </div>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            مترجم لغة{" "}
            <span className="text-indigo-400">
              الإشارة
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            حرك يدك أمام الكاميرا وسيقوم
            Easy Com بالتعرف على الإشارة
            وتحويلها إلى جملة منطوقة.
          </p>

        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

          <div className="relative aspect-video w-full bg-black">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover ${
                cameraActive
                  ? ""
                  : "hidden"
              }`}
            />

            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />

            {!cameraActive && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">

                  <Camera
                    size={55}
                    className="mx-auto mb-4 text-slate-700"
                  />

                  <p className="text-slate-500">
                    الكاميرا غير مفعلة
                  </p>

                </div>
              </div>
            )}

            {cameraActive && (
              <>
                <div className="absolute right-4 top-4 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 backdrop-blur">
                  <span className="text-sm text-slate-300">
                    الأيدي:
                  </span>

                  <span className="mr-2 font-bold text-green-400">
                    {handsDetected}
                  </span>
                </div>

                <div className="absolute left-4 top-4 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-2 backdrop-blur">
                  <span className="text-sm text-green-400">
                    ● Hand Tracking
                  </span>
                </div>

                <div className="absolute bottom-4 right-1/2 w-[90%] translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/90 px-6 py-5 text-center backdrop-blur-xl">

                  <p className="text-xs tracking-widest text-slate-500">
                    الإشارة الحالية
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {translation}
                  </p>

                </div>
              </>
            )}

          </div>

          <div className="flex flex-wrap justify-center gap-4 p-6">

            {!cameraActive ? (
              <button
                onClick={
                  startCamera
                }
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-7 py-3 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                <Camera size={19} />

                {loading
                  ? "جاري التشغيل..."
                  : "تشغيل الكاميرا"}
              </button>
            ) : (
              <button
                onClick={
                  stopCamera
                }
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-7 py-3 font-semibold text-red-400 hover:bg-red-500/20"
              >
                <CameraOff size={19} />

                إيقاف الكاميرا
              </button>
            )}

            <button
              onClick={
                restartCamera
              }
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5"
            >
              <RotateCcw size={18} />

              إعادة التشغيل
            </button>

            <button
              onClick={
                manuallyAddSign
              }
              disabled={
                translation ===
                  "غير معروف" ||
                translation ===
                  "في انتظار الإشارة..."
              }
              className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-6 py-3 font-semibold text-green-300 hover:bg-green-400/20 disabled:opacity-40"
            >
              <Plus size={18} />

              إضافة للجملة
            </button>

          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-6">

          <div className="mb-4 flex items-center justify-between gap-4">

            <h2 className="text-lg font-semibold text-white">
              الجملة
            </h2>

            <span className="text-sm text-slate-500">
              {sentence.length} كلمات
            </span>

          </div>

          <div className="min-h-[100px] rounded-xl border border-white/5 bg-slate-950/60 p-5">

            {sentence.length > 0 ? (
              <p className="text-2xl font-semibold leading-loose text-white">
                {sentence.join(" ")}
              </p>
            ) : (
              <p className="text-slate-500">
                ابدأ بعمل الإشارات أمام الكاميرا...
              </p>
            )}

          </div>

          <div className="mt-4 flex flex-wrap gap-3">

            <button
              onClick={
                speakSentence
              }
              disabled={
                sentence.length === 0
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Volume2 size={18} />

              نطق الجملة
            </button>

            <button
              onClick={
                clearSentence
              }
              disabled={
                sentence.length === 0
              }
              className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-6 py-3 font-semibold text-red-300 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={18} />

              مسح الجملة
            </button>

            <button
              onClick={
                speakTranslation
              }
              disabled={
                translation ===
                  "غير معروف" ||
                translation ===
                  "في انتظار الإشارة..."
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-40"
            >
              <Volume2 size={18} />

              نطق الإشارة الحالية
            </button>

          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <StatusCard
            title="الكاميرا"
            value={
              cameraActive
                ? "تعمل"
                : "متوقفة"
            }
          />

          <StatusCard
            title="الأيدي"
            value={
              cameraActive
                ? `${handsDetected} / 2`
                : "في الانتظار"
            }
          />

          <StatusCard
            title="الكلمات"
            value={`${sentence.length}`}
          />

        </div>

        <div className="mt-8 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-6">

          <h2 className="mb-4 text-lg font-semibold text-white">
            الإشارات الحالية
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">

            <SignCard
              icon="👍"
              text="نعم"
            />

            <SignCard
              icon="👎"
              text="لا"
            />

            <SignCard
              icon="👋"
              text="السلام عليكم"
            />

            <SignCard
              icon="✊"
              text="توقف"
            />

            <SignCard
              icon="☝️"
              text="واحد"
            />

            <SignCard
              icon="✌️"
              text="اثنان"
            />

            <SignCard
              icon="🤟"
              text="أحب"
            />

            <SignCard
              icon="🤲"
              text="معًا"
            />

            <SignCard
              icon="💪"
              text="قوة"
            />

          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-6">

          <h2 className="mb-3 text-lg font-semibold text-white">
            طريقة العمل
          </h2>

          <p
            dir="ltr"
            className="overflow-x-auto font-mono text-sm text-slate-400"
          >
            Camera → Hand Detection → 21
            Landmarks → Sign Recognition →
            Arabic Words → Sentence → Speech
          </p>

        </div>

      </div>
    </main>
  );
}

function StatusCard({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function SignCard({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
      <span className="text-2xl">
        {icon}
      </span>

      <span className="text-sm text-slate-300">
        {text}
      </span>
    </div>
  );
}

export default Translator;