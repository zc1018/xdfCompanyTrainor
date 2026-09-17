import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, Download, Mail, Phone } from 'lucide-react';
import { planner, scenarios, type Goal } from '../content';

interface Fields { company: string; goal: Goal; size: string; timing: string }
const makeSummary = (fields: Fields) => ['新东方企业英语培训 · 咨询需求', '', `企业 / 团队：${fields.company.trim() || '待确认'}`, `培训目标：${scenarios.find(item => item.id === fields.goal)?.label || '希望一起梳理培训目标'}`, `预计人数：${fields.size}`, `计划开始：${fields.timing}`, '', '希望进一步沟通：员工分层、课程组合、项目排期与预算范围。'].join('\n');

export default function Contact({ goal, onGoal }: { goal: Goal; onGoal: (goal: Goal) => void }) {
  const [company, setCompany] = useState('');
  const [size, setSize] = useState('待确认');
  const [timing, setTiming] = useState('待确认');
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ signature: string; text: string } | null>(null);
  const [status, setStatus] = useState('');
  const resultTitle = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const signature = JSON.stringify([company, goal, size, timing]);
  const visible = result?.signature === signature;
  useEffect(() => { if (visible) resultTitle.current?.focus({ preventScroll: true }); }, [visible]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!goal) { setError(true); document.getElementById('goal')?.focus(); return; }
    setError(false); setStatus('');
    setResult({ signature, text: makeSummary({ company, goal, size, timing }) });
  }
  async function copy() {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.text); setStatus('摘要已复制，尚未发送给企业培训规划师。'); }
    catch { summaryRef.current?.focus(); summaryRef.current?.select(); setStatus('浏览器未允许自动复制，已选中摘要。请手动复制，或保存为文本。'); }
  }
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob(['\uFEFF', result.text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = '企业英语培训-咨询需求.txt';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('已生成文本文件，请确认下载记录。需求尚未发送。');
  }
  return <section id="contact" aria-labelledby="contact-title" className="contact-section rounded-[36px] bg-[#0a152d] px-6 py-14 text-white sm:px-10 lg:p-16">
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20"><div><p className="mb-6 text-xs tracking-widest text-slate-400">下一步，从一次需求沟通开始</p><h2 id="contact-title" tabIndex={-1} className="section-title">把团队的需求，<br />变成清晰的培训计划。</h2><p className="mt-6 text-sm leading-7 text-slate-400">一起梳理员工分层、课程组合、<br />项目排期与预算范围。</p><div className="mt-10 border-t border-white/15 pt-8"><p className="text-xs text-slate-400">{planner.title}</p><p className="mt-3 text-2xl font-medium">{planner.name}</p><a href={`mailto:${planner.email}`} className="mt-5 flex min-h-11 items-center gap-3 text-sm text-slate-200 hover:text-white"><Mail size={16} aria-hidden="true" />{planner.email}</a><a href={`tel:${planner.phone}`} className="flex min-h-11 items-center gap-3 text-sm text-slate-200 hover:text-white"><Phone size={16} aria-hidden="true" />{planner.phone}</a></div></div>
      <div className="rounded-[28px] bg-white p-6 text-[#0a1b33] sm:p-8"><p className="eyebrow">企业培训需求</p><h3 className="text-xl font-medium">先说说培训方向</h3><p className="mt-2 text-xs leading-6 text-slate-500">只需选一个目标，其余信息可稍后确认。</p>
        <form id="inquiry-form" onSubmit={submit} noValidate>
          <div className="mt-7 grid gap-5 sm:grid-cols-2"><div className="field"><label htmlFor="company">企业 / 团队名称 <span>选填</span></label><input id="company" autoComplete="organization" maxLength={80} value={company} onChange={e => setCompany(e.target.value)} placeholder="例如：海外业务部" /></div><div className="field"><label htmlFor="goal">希望优先提升什么 <span>必选</span></label><select id="goal" required value={goal} aria-invalid={error && !goal ? true : undefined} aria-describedby={error && !goal ? 'goal-error' : undefined} onChange={e => { onGoal(e.target.value as Goal); setError(false); }}><option value="">请选择培训目标</option>{scenarios.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}<option value="discuss">还不确定，希望一起梳理</option></select>{error && !goal ? <p id="goal-error" role="alert" className="mt-2 text-xs text-red-700">请选择培训目标，也可以选择一起梳理。</p> : null}</div><div className="field"><label htmlFor="size">预计参训人数 <span>选填</span></label><select id="size" value={size} onChange={e => setSize(e.target.value)}><option value="待确认">尚未确定</option>{['20 人以内', '21–50 人', '51–100 人', '100 人以上'].map(value => <option key={value}>{value}</option>)}</select></div><div className="field"><label htmlFor="timing">希望什么时候开始 <span>选填</span></label><select id="timing" value={timing} onChange={e => setTiming(e.target.value)}><option value="待确认">尚未确定</option>{['1 个月内', '1–3 个月内', '3 个月以后'].map(value => <option key={value}>{value}</option>)}</select></div></div>
          <button type="submit" className="mt-6 flex min-h-12 w-full items-center justify-between rounded-full bg-[#0a152d] px-6 py-3 text-sm font-medium text-white hover:bg-slate-800">生成咨询摘要<ArrowUpRight size={16} aria-hidden="true" /></button><p className="mt-4 text-[11px] leading-6 text-slate-400">本页不保存草稿，刷新可能丢失内容。摘要仅在本地生成，不会自动发送，无需填写个人联系方式。</p>
        </form>
        {visible && result ? <div id="inquiry-result" className="mt-6 border-t border-slate-200 pt-6"><h4 id="result-title" ref={resultTitle} tabIndex={-1} className="text-sm font-medium">摘要已生成，尚未发送。</h4><p className="mt-2 text-xs leading-6 text-slate-500">可带入邮件草稿，在邮件应用中确认发送。</p><label className="sr-only" htmlFor="inquiry-summary">咨询需求摘要</label><textarea ref={summaryRef} id="inquiry-summary" readOnly value={result.text} rows={8} className="mt-4 w-full resize-y rounded-xl border border-slate-200 p-3 text-xs leading-6" /><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={copy} className="summary-action"><Copy size={14} aria-hidden="true" />复制摘要</button><button type="button" onClick={download} className="summary-action"><Download size={14} aria-hidden="true" />保存为文本</button><a id="email-summary" href={`mailto:${planner.email}?subject=${encodeURIComponent('企业英语培训需求咨询')}&body=${encodeURIComponent(result.text)}`} className="summary-action"><Mail size={14} aria-hidden="true" />打开邮件草稿</a></div><p role="status" className="mt-3 text-xs leading-6 text-slate-500">{status}</p></div> : null}
      </div>
    </div>
  </section>;
}
