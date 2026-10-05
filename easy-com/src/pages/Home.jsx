import { Link } from "react-router";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-slate-950 pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20">
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
                <Sparkles size={16} />
                Simple Programming. Powerful Results.
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl">
                Learn.
                <span className="text-indigo-400"> Write.</span>
                <br />
                Translate.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Easy Com is a simple programming language designed to make
                programming easier to understand and easier to write.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/translator"
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-600"
                >
                  Try Translator
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/learn"
                  className="rounded-xl border border-white/10 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/5"
                >
                  Learn Easy Com
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="rounded-xl bg-slate-950 p-6 font-mono text-sm leading-8">
                  <p className="text-slate-500">
                    # Easy Com
                  </p>

                  <p>
                    <span className="text-purple-400">say</span>{" "}
                    <span className="text-green-400">
                      "Hello, World!"
                    </span>
                  </p>

                  <p>
                    <span className="text-purple-400">let</span>{" "}
                    <span className="text-blue-400">name</span>{" "}
                    ={" "}
                    <span className="text-green-400">
                      "Bishoy"
                    </span>
                  </p>

                  <p>
                    <span className="text-purple-400">say</span>{" "}
                    <span className="text-blue-400">name</span>
                  </p>

                  <div className="my-5 border-t border-white/10" />

                  <p className="text-slate-500">
                    // JavaScript Output
                  </p>

                  <p>
                    <span className="text-blue-400">
                      console
                    </span>
                    .log(
                    <span className="text-green-400">
                      "Hello, World!"
                    </span>
                    );
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3">
          <Feature
            icon={<Code2 />}
            title="Simple Syntax"
            text="Write code using an easy and readable syntax."
          />

          <Feature
            icon={<Zap />}
            title="Fast Translation"
            text="Translate Easy Com code into JavaScript instantly."
          />

          <Feature
            icon={<Sparkles />}
            title="Learn Easily"
            text="Understand programming concepts through simple examples."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-indigo-400/30">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{text}</p>
    </div>
  );
}

export default Home;