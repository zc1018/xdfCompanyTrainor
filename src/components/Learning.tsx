import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { topics } from '../content';
import { cn } from '../lib';

const modes = [
  ['语境词汇', '在语境里记词汇', '结合上下文理解词义，让表达有出处。'],
  ['句子透视', '把长句拆明白', 'X-Ray 句子透视，梳理结构与逻辑。'],
  ['影子跟读', '从听懂走向开口', '练习重音、语调和流利度。'],
] as const;
const footers = ['读懂词义，也记住用法', '先找主干，再理解细节', '听见表达，再把它说出来'];
export default function Learning() {
  const [active, setActive] = useState(0);
  function keydown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = (index + 1) % 3;
    if (e.key === 'ArrowLeft') next = (index + 2) % 3;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 2;
    if (next !== undefined) { e.preventDefault(); setActive(next); document.getElementById(`learn-${next}`)?.focus(); }
  }
  return <section id="ai-reading" className="reading-section rounded-[36px] bg-[#edf1f5] px-6 py-14 sm:px-10 md:py-20 lg:px-16" aria-labelledby="reading-title">
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"><div><p className="eyebrow">02 / AI 外刊精读</p><h2 id="reading-title" className="section-title">一篇好内容，<br />带动每天的英语练习。</h2><p className="mt-6 max-w-md text-sm leading-7 text-slate-500">把碎片时间用来读懂一篇文章、积累实用表达，再开口练一练。选题可结合行业与岗位需求。</p><div className="mt-8 flex gap-2" role="tablist" aria-label="AI 外刊学习方式">{modes.map(([label], index) => <button key={label} id={`learn-${index}`} role="tab" aria-selected={active === index} aria-controls="learning-panel" tabIndex={active === index ? 0 : -1} type="button" onClick={() => setActive(index)} onKeyDown={e => keydown(e, index)} className={cn('min-h-11 rounded-full border px-4 text-xs font-medium transition-colors', active === index ? 'border-[#0a152d] bg-[#0a152d] text-white' : 'border-slate-200 bg-white/70 text-slate-500 hover:border-slate-400')}>{label}</button>)}</div><p className="mt-6 text-sm font-medium">{modes[active][1]}</p><p className="mt-2 text-xs text-slate-500">{modes[active][2]}</p></div>
      <div id="learning-panel" role="tabpanel" aria-labelledby={`learn-${active}`} tabIndex={0} className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_20px_60px_-30px_rgba(10,27,51,0.15)]"><div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 text-xs sm:px-8"><span className="flex items-center gap-2 font-medium"><BookOpen size={15} aria-hidden="true" />AI 外刊精读</span><span className="text-slate-400">学习方式示意</span></div><div className="min-h-[360px] p-6 sm:p-8">
        <p className="mb-6 text-[10px] uppercase tracking-[0.15em] text-slate-400">{active === 0 ? 'Vocabulary in context' : active === 1 ? 'X-Ray sentence analysis' : 'Shadowing practice'}</p>
        {active === 0 ? <><p lang="en" className="sample-sentence">Let’s review the <mark>proposal</mark> before our next meeting.</p><div className="sample-note"><strong lang="en">proposal <span className="ml-2 text-xs font-normal text-slate-400">/prəˈpəʊzəl/</span></strong><p className="mt-2">n. 提议；方案</p><p className="mt-1 text-slate-500">在这句话中，指会议前需要审阅的方案。</p></div><p className="mt-5 text-xs text-slate-500">下次开会前，我们先审阅一下方案。</p></> : active === 1 ? <><p lang="en" className="sample-sentence"><span className="text-teal-700">The team</span> <span className="text-indigo-600">will review</span> <span className="text-amber-700">the proposal</span> before the meeting begins.</p><div className="mt-4 flex gap-5 text-xs"><span className="text-teal-700">主语</span><span className="text-indigo-600">谓语</span><span className="text-amber-700">宾语</span></div><div className="sample-note"><strong>句子主干：团队将审阅方案。</strong><p className="mt-2 text-slate-500">before 引导时间状语从句，说明动作发生在会议开始之前。</p></div></> : <><p lang="en" className="sample-sentence">Let’s <strong>review</strong> the <strong>proposal</strong> / before our next <strong>meeting.</strong> ↘</p><div className="sample-note space-y-2"><p>关键词重读 · 突出主要信息</p><p>意群停顿 · 按意思分组表达</p><p>句末降调 · 表达完整陈述</p></div><p className="mt-5 text-xs leading-6 text-slate-500">先听，再跟读。结合产品中的发音反馈反复练习。</p></>}
      </div><div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-6 py-4 text-[11px] text-slate-500 sm:px-8"><span>{footers[active]}</span><span className="text-slate-400">非实时测评 · 非音频播放</span></div></div>
    </div>
    <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-slate-300/50 pt-8"><h3 className="text-sm font-medium">话题不止于职场</h3><p className="text-xs text-slate-400">跨领域选题示例 · 可按行业定制</p></div><ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{topics.map(([topic, title]) => <li key={topic} className="flex items-center gap-4 border-b border-slate-300/50 py-5"><span className="text-[11px] text-slate-400">{topic}</span><h4 className="text-sm">{title}</h4><ArrowUpRight size={13} className="ml-auto text-slate-400" aria-hidden="true" /></li>)}</ul>
  </section>;
}
