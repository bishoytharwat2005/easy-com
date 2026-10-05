function CodeEditor({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck="false"
      className="min-h-[420px] w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500"
    />
  );
}

export default CodeEditor;