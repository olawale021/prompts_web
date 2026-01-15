'use client';

import { useState } from 'react';
import { prompts, promptOrder, ToneType } from '@/lib/prompts';

type ToneResults = Record<ToneType, string>;

export default function Home() {
  const [activePrompt, setActivePrompt] = useState('bio');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [tone, setTone] = useState<ToneType>('neutral');
  const [results, setResults] = useState<ToneResults | null>(null);
  const [loading, setLoading] = useState(false);

  const currentPrompt = prompts[activePrompt];

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handlePromptChange = (promptId: string) => {
    setActivePrompt(promptId);
    setInputs({});
    setResults(null);
    setTone('neutral');
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: activePrompt, inputs }),
      });
      const data = await response.json();
      if (data.error) {
        setResults({ neutral: `Error: ${data.error}`, fun: '', serious: '' });
      } else {
        setResults(data.results);
      }
    } catch {
      setResults({ neutral: 'Error: Failed to generate content', fun: '', serious: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (newTone: ToneType) => {
    setTone(newTone);
  };

  const isFormValid = currentPrompt.inputs.every(input => inputs[input.id]?.trim());
  const currentResult = results?.[tone] || '';

  // Parse numbered list items from result
  const parseNumberedList = (text: string) => {
    const lines = text.split('\n');
    const items: { number: string; content: string }[] = [];
    let currentItem: { number: string; content: string } | null = null;

    for (const line of lines) {
      const match = line.match(/^(\d+)[\.\)]\s*(.+)/);
      if (match) {
        if (currentItem) items.push(currentItem);
        currentItem = { number: match[1], content: match[2] };
      } else if (currentItem && line.trim()) {
        currentItem.content += ' ' + line.trim();
      }
    }
    if (currentItem) items.push(currentItem);

    return items;
  };

  const numberedItems = parseNumberedList(currentResult);
  const isNumberedList = numberedItems.length >= 3;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Instagram Content Generator</h1>
          <p className="text-zinc-400 text-lg mb-4">
            9 AI-powered tools to create scroll-stopping Instagram content in seconds.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1">✓ Copy-paste ready content</span>
            <span className="flex items-center gap-1">✓ 3 tone options</span>
            <span className="flex items-center gap-1">✓ No fluff, just actionable ideas</span>
          </div>
        </div>

        {/* Prompt Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {promptOrder.map(promptId => (
            <button
              key={promptId}
              onClick={() => handlePromptChange(promptId)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePrompt === promptId
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              {prompts[promptId].name}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold">{currentPrompt.name}</h2>
          <p className="text-sm text-zinc-400 mb-4">{currentPrompt.description}</p>
          <div className="space-y-4">
            {currentPrompt.inputs.map(input => (
              <div key={input.id}>
                <label className="block text-sm text-zinc-400 mb-2">
                  {input.label}
                </label>
                {input.type === 'select' ? (
                  <select
                    value={inputs[input.id] || ''}
                    onChange={e => handleInputChange(input.id, e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="">Select...</option>
                    {input.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type}
                    value={inputs[input.id] || ''}
                    onChange={e => handleInputChange(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isFormValid || loading}
            className="mt-6 w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Result */}
        {results && (
          <div className="bg-zinc-900 rounded-xl p-6">
            {/* Tone Toggle */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-zinc-400">Tone:</span>
              {(['neutral', 'fun', 'serious'] as ToneType[]).map(t => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tone === t
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Output */}
            <div className={loading ? 'opacity-50' : ''}>
              {isNumberedList ? (
                <div className="space-y-3">
                  {numberedItems.map((item) => (
                    <div
                      key={item.number}
                      className="flex gap-4 p-4 bg-zinc-800 rounded-lg group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                        {item.number}
                      </div>
                      <div className="flex-1 text-zinc-200">{item.content}</div>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.content)}
                        className="flex-shrink-0 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-zinc-200">
                  {currentResult}
                </div>
              )}
            </div>

            {/* Copy All Button */}
            <button
              onClick={() => navigator.clipboard.writeText(currentResult)}
              className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              Copy All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
