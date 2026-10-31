// 読み上げ：ブラウザ標準の Web Speech API（無料・端末内の音声）。外部サービスへの送信・課金なし。
export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
export function speakText(lines: [string, string][]): string {
  return lines.map(([who, t]) => (who ? `${who}。` : '') + t.replace(/[「」『』]/g, '').replace(/……/g, '、')).join('\n');
}
export function speak(text: string, rate = 1) {
  if (!ttsSupported()) return false;
  const ss = window.speechSynthesis; ss.cancel();
  for (const part of text.split('\n').filter(Boolean)) {
    const u = new SpeechSynthesisUtterance(part); u.lang = 'ja-JP'; u.rate = rate;
    const v = ss.getVoices().find(v => v.lang.startsWith('ja')); if (v) u.voice = v;
    ss.speak(u);
  }
  return true;
}
export function stopSpeak() { if (ttsSupported()) window.speechSynthesis.cancel(); }
