import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  GitBranch,
  Repeat,
  Terminal,
} from "lucide-react";

const lessons = [
  {
    icon: Terminal,
    title: "Print Output",
    description: "Display text or values on the screen.",
    code: `say "Hello, World!"`,
    output: `console.log("Hello, World!");`,
  },
  {
    icon: Code2,
    title: "Variables",
    description: "Store values using the let keyword.",
    code: `let name = "Bishoy"\nlet age = 21`,
    output: `let name = "Bishoy";\nlet age = 21;`,
  },
  {
    icon: GitBranch,
    title: "Conditions",
    description: "Make decisions using if and else.",
    code: `if age >= 18 {\n    say "Adult"\n}`,
    output: `if (age >= 18) {\n    console.log("Adult");\n}`,
  },
  {
    icon: Repeat,
    title: "Loops",
    description: "Repeat code multiple times.",
    code: `repeat 3 {\n    say "Hello"\n}`,
    output: `for (let i = 0; i < 3; i++) {\n    console.log("Hello");\n}`,
  },
];

function Learn() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            <BookOpen size={16} />
            Easy Com Documentation
          </div>

          <h1 className="text-4xl font-bold text-white md:text-6xl">
            Learn{" "}
            <span className="text-indigo-400">Easy Com</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Learn the basics of Easy Com programming with simple syntax,
            examples, and JavaScript translations.
          </p>

          <Link
            to="/translator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-600"
          >
            Try Translator
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Braces size={20} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Language Basics
              </h2>

              <p className="text-sm text-slate-500">
                The fundamental syntax of Easy Com
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.title} lesson={lesson} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              Complete Example
            </h2>

            <p className="mt-2 text-slate-400">
              A small Easy Com program using multiple language features.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock
              title="Easy Com"
              code={`# User information

let name = "Bishoy"
let age = 21

say name

if age >= 18 {
    say "You are an adult"
}

repeat 3 {
    say "Welcome to Easy Com"
}`}
            />

            <CodeBlock
              title="JavaScript"
              code={`// User information

let name = "Bishoy";
let age = 21;

console.log(name);

if (age >= 18) {
    console.log("You are an adult");
}

for (let i = 0; i < 3; i++) {
    console.log("Welcome to Easy Com");
}`}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/translator"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/30 px-6 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/10"
            >
              Open Translator
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function LessonCard({ lesson }) {
  const Icon = lesson.icon;

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-indigo-400/30">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Icon size={21} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {lesson.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {lesson.description}
          </p>
        </div>
      </div>

      <CodeBlock title="Easy Com" code={lesson.code} />

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          JavaScript
        </p>

        <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-sm leading-6 text-green-400">
          {lesson.output}
        </pre>
      </div>
    </article>
  );
}

function CodeBlock({ title, code }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <pre className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-300">
        {code}
      </pre>
    </div>
  );
}

export default Learn;