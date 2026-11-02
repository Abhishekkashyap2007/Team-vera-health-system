import React from 'react';

/**
 * MarkdownRenderer - Renders ChatGPT-style Markdown responses with clean typography,
 * headers, bulleted lists, numbered steps, bold highlights, dividers, and alert boxes.
 */
export default function MarkdownRenderer({ content = '', className = '' }) {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null; // 'ul' | 'ol'
  let keyIndex = 0;

  const flushList = () => {
    if (currentList.length === 0) return;
    if (listType === 'ul') {
      elements.push(
        <ul key={`ul-${keyIndex++}`} className="space-y-1.5 my-2.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else if (listType === 'ol') {
      elements.push(
        <ol key={`ol-${keyIndex++}`} className="space-y-1.5 my-2.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-700">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                {idx + 1}
              </span>
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = [];
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Horizontal Rule
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      elements.push(
        <hr key={`hr-${keyIndex++}`} className="my-4 border-t border-slate-200" />
      );
      continue;
    }

    // Empty Line
    if (!line) {
      flushList();
      continue;
    }

    // Headings (H1, H2, H3, H4)
    if (line.startsWith('#')) {
      flushList();
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];

        const isEmergency = /🚨|⚠️|alert|emergency|red flag/i.test(text);

        if (level === 1) {
          elements.push(
            <h1 key={`h1-${keyIndex++}`} className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 mb-2 tracking-tight">
              {renderInline(text)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h2-${keyIndex++}`} className={`text-lg sm:text-xl font-bold mt-4 mb-2 tracking-tight ${isEmergency ? 'text-red-600' : 'text-slate-900'}`}>
              {renderInline(text)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${keyIndex++}`} className={`text-sm sm:text-base font-bold mt-3.5 mb-1.5 flex items-center gap-1.5 ${isEmergency ? 'text-rose-700' : 'text-sky-900'}`}>
              {renderInline(text)}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={`h4-${keyIndex++}`} className="text-xs sm:text-sm font-bold text-slate-800 mt-2 mb-1">
              {renderInline(text)}
            </h4>
          );
        }
        continue;
      }
    }

    // Blockquotes / Disclaimer
    if (line.startsWith('>')) {
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${keyIndex++}`} className="my-2.5 p-3 rounded-xl bg-amber-50 border-l-4 border-amber-400 text-amber-900 text-xs italic">
          {renderInline(quoteText)}
        </div>
      );
      continue;
    }

    // Unordered List Items (- or *)
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      currentList.push(ulMatch[1]);
      continue;
    }

    // Ordered List Items (1. , 2. )
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      currentList.push(olMatch[1]);
      continue;
    }

    // Normal Paragraph
    flushList();
    elements.push(
      <p key={`p-${keyIndex++}`} className="my-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-700">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return (
    <div className={`space-y-0.5 text-slate-800 font-sans ${className}`}>
      {elements}
    </div>
  );
}

/**
 * Parses bold (**text**), italic (*text* or _text_), code (`code`), and links.
 */
function renderInline(text = '') {
  if (!text) return null;

  // Split by markdown delimiters while capturing them
  const parts = [];
  let remaining = text;
  let idx = 0;

  // Regex for **bold**, *italic*, `code`
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/;

  while (remaining) {
    const match = remaining.match(tokenRegex);
    if (!match) {
      parts.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      parts.push(remaining.substring(0, matchIndex));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldContent = token.slice(2, -2);
      parts.push(
        <strong key={`b-${idx++}`} className="font-bold text-slate-900">
          {boldContent}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicContent = token.slice(1, -1);
      parts.push(
        <em key={`i-${idx++}`} className="italic text-slate-800">
          {italicContent}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code key={`c-${idx++}`} className="px-1.5 py-0.5 rounded bg-slate-100 text-sky-700 font-mono text-[11px] border border-slate-200">
          {codeContent}
        </code>
      );
    }

    remaining = remaining.substring(matchIndex + token.length);
  }

  return parts;
}

