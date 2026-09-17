import { useEffect, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Solutions from './components/Solutions';
import Learning from './components/Learning';
import Contact from './components/Contact';
import { faqs, newOriental, services, steps, type Goal } from './content';
import { goToContact } from './lib';

function MobileInquiry() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let heroVisible = true; let contactVisible = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target.id === 'home') heroVisible = entry.isIntersecting;
        if (entry.target.id === 'contact') contactVisible = entry.isIntersecting;
      }
      setVisible(!heroVisible && !contactVisible);
    });
    for (const id of ['home', 'contact']) { const element = document.getElementById(id); if (element) observer.observe(element); }
    return () => observer.disconnect();
  }, []);
  return visible ? <a id="mobile-consult" href="#contact" className="fixed bottom-5 right-5 z-40 flex min-h-12 items-center gap-4 rounded-full border border-white/20 bg-[#0a152d] px-5 text-xs font-medium text-white shadow-lg md:hidden">咨询企业培训<ArrowUpRight size={16} aria-hidden="true" /></a> : null;
}

export default function App() {
  const reduceMotion = useReducedMotion() ?? false;
  const [userPaused, setUserPaused] = useState(false);
  const [goal, setGoal] = useState<Goal>('');
  const paused = userPaused || reduceMotion;
  return <MotionConfig reducedMotion="user">
    <a href="#main" className="skip-link">跳至正文</a>
    <div className="site-shell">
      <header className="flex min-h-20 items-center justify-between gap-4 px-3 py-5 sm:px-6"><a href="#home" aria-label="新东方企业英语培训首页" className="flex items-center gap-4"><img src={newOriental} alt="新东方" width="104" height="41" className="w-[104px]" /><span className="border-l border-slate-200 pl-4 text-xs text-slate-500">企业英语培训</span></a><a href="#contact" className="hidden min-h-11 items-center gap-2 text-xs text-slate-500 hover:text-slate-900 sm:flex">联系企业培训规划师<ArrowUpRight size={14} aria-hidden="true" /></a></header>
      <main id="main">
        <Hero paused={paused} reduceMotion={reduceMotion} onToggle={() => setUserPaused(value => !value)} />
        <Marquee paused={paused} />
        <div className="content-shell">
          <section className="service-overview grid gap-8 border-b border-slate-200/70 py-14 md:grid-cols-3 md:gap-10" aria-label="课程与服务">{services.map(([question, title, description]) => <div key={question}><p className="mb-3 text-[11px] tracking-wide text-slate-400">{question}</p><h2 className="text-base font-medium tracking-tight">{title}</h2><p className="mt-3 text-xs leading-6 text-slate-500">{description}</p></div>)}</section>
          <Solutions onGoal={setGoal} />
          <Learning />
          <section id="delivery" className="section-shell" aria-labelledby="delivery-title"><div className="section-heading"><div><p className="eyebrow">03 / 项目交付</p><h2 id="delivery-title">员工有学习路径，<br />HR 有项目进度。</h2></div><p>从需求到结业，每个阶段都有安排。<br />看得见进展，也能及时调整。</p></div><ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([title, description], index) => <li key={title} className="border-t border-slate-200 pt-5"><span className="font-display text-sm text-slate-400">0{index + 1}</span><h3 className="mt-5 text-lg font-medium">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{description}</p></li>)}</ol><div className="mt-10 flex flex-col gap-5 rounded-2xl bg-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] text-slate-400">HR 可以收到什么？</p><h3 className="mt-1 text-sm font-medium">每月项目反馈</h3></div><ul className="grid gap-x-6 gap-y-3 text-xs text-slate-500 sm:grid-cols-2">{['录播学习进度', '直播到课情况', '平均测试成绩', '项目沟通与后续安排'].map(item => <li key={item} className="flex items-center gap-2"><Check size={12} aria-hidden="true" />{item}</li>)}</ul></div>
            <article className="mt-12 grid gap-8 rounded-[28px] border border-slate-200 bg-white p-7 sm:p-10 lg:grid-cols-2 lg:gap-16"><div><p className="eyebrow">方案示例 · 跨国香精香料企业</p><h3 className="text-2xl font-medium leading-relaxed">同一场全球会议，<br />听懂不同口音。</h3><p className="mt-5 text-sm leading-7 text-slate-500">面对法国、印尼、日本、韩国、新加坡等多国同事，员工需要完成真正有问有答的工作沟通。</p><button type="button" className="text-link mt-5" onClick={() => { setGoal('global'); goToContact(); }}>咨询类似培训方案<ArrowUpRight size={16} aria-hidden="true" /></button></div><dl>{[['培训对象', 'IT、HR、采购、销售及技术部门'], ['核心难点', '基础差异大、不同口音、部门专业词汇'], ['课程设计', '基础录播补强 + AI 外刊日常学习 + 小班直播场景演练'], ['训练目标', '听懂商务信息，参与跨部门对话与现场问答']].map(([term, description]) => <div key={term} className="grid grid-cols-[64px_1fr] gap-5 border-b border-slate-100 py-4 text-xs leading-6 last:border-0"><dt className="text-slate-400">{term}</dt><dd className="text-slate-600">{description}</dd></div>)}</dl></article>
          </section>
          <section id="faq" className="grid gap-8 pb-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20" aria-labelledby="faq-title"><div><p className="eyebrow">04 / 常见问题</p><h2 id="faq-title" className="section-title">做决定前，<br />你可能想了解。</h2><a href="#contact" className="text-link mt-5">聊聊具体需求<ArrowUpRight size={16} aria-hidden="true" /></a></div><div>{faqs.map(([question, answer]) => <details key={question} className="border-b border-slate-200 first:border-t"><summary className="flex min-h-16 items-center justify-between gap-5 py-5 text-sm font-medium">{question}<Plus size={16} className="shrink-0" aria-hidden="true" /></summary><p className="pb-6 pr-5 text-sm leading-7 text-slate-500">{answer}</p></details>)}</div></section>
        </div>
        <Contact goal={goal} onGoal={setGoal} />
      </main>
      <footer className="flex flex-wrap items-center justify-between gap-5 px-5 py-9 text-[11px] text-slate-400"><a href="#home" className="flex items-center gap-4"><img src={newOriental} alt="新东方" width="80" height="31" className="w-20" /><span>© 2026 · 企业英语培训</span></a><span>AI 外刊精读 · 定制直播 · 1v1 · 基础录播</span></footer>
    </div>
    <MobileInquiry />
  </MotionConfig>;
}
