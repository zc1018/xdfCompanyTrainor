import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { catalogue, scenarios, type Goal } from '../content';
import { cn, goToContact } from '../lib';

export default function Solutions({ onGoal }: { onGoal: (goal: Goal) => void }) {
  const [selected, setSelected] = useState(0);
  const scenario = scenarios[selected];
  function choose(index: number, focus = false) {
    setSelected(index); onGoal(scenarios[index].id);
    if (focus) document.getElementById(`goal-${scenarios[index].id}`)?.focus();
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (index + 1) % scenarios.length;
    if (event.key === 'ArrowLeft') next = (index + scenarios.length - 1) % scenarios.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = scenarios.length - 1;
    if (next !== undefined) { event.preventDefault(); choose(next, true); }
  }
  return <section id="solutions" className="section-shell" aria-labelledby="solutions-title">
    <div className="section-heading"><div><p className="eyebrow">01 / 为工作场景而学</p><h2 id="solutions-title">先选一个<br className="sm:hidden" />培训目标。</h2></div><p>不必先研究课程。<br />从员工最需要用英语的地方开始。</p></div>
    <div role="tablist" aria-label="团队培训目标" className="scenario-tabs mb-10 flex gap-2 rounded-full bg-slate-100 p-1.5 sm:w-fit">
      {scenarios.map((item, index) => <button key={item.id} id={`goal-${item.id}`} role="tab" type="button" aria-selected={index === selected} aria-controls="scenario-panel" tabIndex={index === selected ? 0 : -1} onClick={() => choose(index)} onKeyDown={e => keyboard(e, index)} className={cn('min-h-11 flex-1 whitespace-nowrap rounded-full px-4 py-3 text-xs font-medium transition-colors sm:flex-none sm:px-7 sm:text-sm', index === selected ? 'bg-[#0a152d] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900')}>{item.label}</button>)}
    </div>
    <div id="scenario-panel" role="tabpanel" aria-labelledby={`goal-${scenario.id}`} tabIndex={0} className="grid gap-10 lg:grid-cols-2 lg:gap-20">
      <div><p className="mb-4 text-xs text-slate-500">适合{scenario.audience}</p><h3 className="max-w-md text-2xl font-medium leading-relaxed tracking-tight md:text-3xl">{scenario.title}</h3><p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">{scenario.description}</p><ul className="my-6 space-y-3">{scenario.outcomes.map(item => <li key={item} className="flex items-center gap-3 text-sm text-slate-600"><Check size={15} className="shrink-0 text-teal-700" aria-hidden="true" />{item}</li>)}</ul><button type="button" className="text-link" onClick={() => { onGoal(scenario.id); goToContact(); }}>咨询{scenario.label}方案<ArrowUpRight size={17} aria-hidden="true" /></button></div>
      <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 sm:p-8"><div className="mb-3 flex justify-between gap-4 text-xs"><span className="font-semibold">建议课程组合</span><span className="text-slate-400">测评后按需调整</span></div><ol>{scenario.courses.map(([stage, name, desc]) => <li key={name} className="flex gap-5 border-b border-slate-100 py-5 last:border-0 last:pb-0"><span className="w-14 shrink-0 pt-1 text-[11px] text-slate-400">{stage}</span><div><h4 className="text-base font-medium">{name}</h4><p className="mt-2 text-xs leading-6 text-slate-500">{desc}</p></div></li>)}</ol></div>
    </div>
    <details className="mt-10 border-y border-slate-200/70"><summary className="flex min-h-16 items-center justify-between gap-4 py-4 text-sm font-medium">四种学习方式，可以如何组合？<Plus size={18} aria-hidden="true" /></summary><div className="grid gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-4">{catalogue.map(([title, desc]) => <div key={title}><h3 className="mb-3 text-sm font-medium">{title}</h3><p className="text-xs leading-6 text-slate-500">{desc}</p></div>)}</div></details>
  </section>;
}
