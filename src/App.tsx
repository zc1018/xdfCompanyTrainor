import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ChevronRight, Menu, Pause, Play } from 'lucide-react';
import ScrollVideo from './components/ScrollVideo';
import Reveal, { useReveals } from './components/Reveal';
import PageContent from './components/PageContent';
import { newOriental, planner, services, type Goal } from './content';
import { goToSection, isStaticVersion, type SectionId } from './lib';
import poster from '../assets/media/enterprise-scroll-poster.jpg';

const links: { label: string; section: SectionId }[] = [{ label: '培训方案', section: 'solutions' }, { label: '学习方式', section: 'ai-reading' }, { label: '交付与案例', section: 'delivery' }, { label: '常见问题', section: 'faq' }];
const capabilitySections: SectionId[] = ['solutions', 'ai-reading', 'delivery'];

export default function App() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [goal, setGoal] = useState<Goal>('');
  useReveals(!isStaticVersion);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    media.addEventListener('change', sync);
    const hash = () => { setMenuOpen(false); goToSection(location.hash.slice(1) || 'home', false, true); };
    const initialAnchor = requestAnimationFrame(() => { if (location.hash) hash(); });
    window.addEventListener('hashchange', hash); window.addEventListener('popstate', hash);
    return () => { cancelAnimationFrame(initialAnchor); media.removeEventListener('change', sync); window.removeEventListener('hashchange', hash); window.removeEventListener('popstate', hash); };
  }, []);
  const navigate = useCallback((next: SectionId) => {
    setMenuOpen(false);
    goToSection(next);
  }, []);

  return <div className={`cinematic-page relative${isStaticVersion ? ' static-page' : ''}`} data-reduced={reduced}>
    {isStaticVersion ? <div className="scroll-video fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none" aria-hidden="true"><img src={poster} alt="" width="1920" height="1080" fetchPriority="high" className="scroll-poster" /></div> : <ScrollVideo reduced={reduced} paused={paused} />}
    <a className="skip-link" href="#main">跳至正文</a>
    <div className="relative z-10">
      <header className="site-nav fixed inset-x-0 top-0 z-50 border-b border-white/15">
        <div className="nav-row px-5 sm:px-8 md:px-12">
          <Reveal><a href="#home" className="brand-lockup" aria-label="新东方企业英语培训首页"><img src={newOriental} width="104" height="41" alt="新东方" /><span>企业英语培训</span></a></Reveal>
          <nav aria-label="主导航" className="hidden items-center gap-8 md:flex lg:gap-10">{links.map(({ label, section: target }, i) => <Reveal key={target} delay={100 + i * 100}><a href={`#${target}`} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); navigate(target); }} className="nav-link">{label}{i === 0 ? <sup className="ml-1.5 font-mono text-[10px] text-white/60">3</sup> : null}</a></Reveal>)}</nav>
          <div className="flex items-center gap-2"><Reveal delay={500}><button className="nav-consult" onClick={() => navigate('contact')}>咨询企业培训</button></Reveal><button className="menu-toggle md:hidden" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button></div>
        </div>
        {menuOpen ? <nav id="mobile-navigation" aria-label="移动导航" className="mobile-navigation md:hidden">{links.map(({ label, section: target }) => <a key={target} href={`#${target}`} onClick={event => { event.preventDefault(); navigate(target); }}>{label}<ChevronRight size={14} /></a>)}</nav> : null}
      </header>
      <main id="main">
        <section id="home" className="cinematic-section px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16" aria-labelledby="hero-title">
          <div className="section-top flex flex-col justify-between gap-8 sm:flex-row">
            <div className="flex flex-col gap-2">{['AI 外刊 · 日常积累', '定制直播 · 场景实练', '分层学习 · 岗位应用'].map((label, i) => <Reveal key={label} delay={150 + i * 120}><p className="service-label font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">/ {label}</p></Reveal>)}</div>
            <Reveal delay={300} className="max-w-xs sm:text-right"><p className="intro-copy text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">从英文会议、客户沟通，<br />到员工日常提升。<br />把英语学习，安排进工作节奏。</p></Reveal>
          </div>
          <div className="section-bottom flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><Reveal delay={150}><span className="accent-badge mb-5">NEW ORIENTAL · CORPORATE LEARNING</span></Reveal><Reveal delay={280}><h1 id="hero-title" className="cinematic-title text-5xl font-normal tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">英语学得会，<br />工作用得上。</h1></Reveal><Reveal delay={420}><a href="#capability" className="scroll-cue">向下探索培训方案<ArrowDown size={14} aria-hidden="true" /></a></Reveal></div>
            <Reveal delay={420}><div className="planner-card flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md"><div className="planner-mark h-24 w-20 rounded-lg" aria-hidden="true"><img src={newOriental} alt="" /><span>CORPORATE<br />LEARNING</span></div><div className="flex flex-col gap-1.5 pr-2"><p className="text-sm font-medium text-white">和 {planner.name} 聊一聊</p><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/70">{planner.title}</p><button className="primary-cta mt-1.5" onClick={() => navigate('contact')}>聊聊培训需求<ChevronRight size={14} aria-hidden="true" /></button></div></div></Reveal>
          </div>
        </section>
        {isStaticVersion ? null : <div className="scroll-spacer h-[80vh]" aria-hidden="true" />}
        <section id="capability" className="cinematic-section capability-section px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16" aria-labelledby="capability-title">
          <div className="section-top flex flex-col justify-between gap-8 sm:flex-row"><Reveal delay={120}><span className="accent-badge">从团队需求出发</span></Reveal><Reveal delay={220} className="max-w-sm sm:text-right"><p className="intro-copy text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">不必先研究课程。<br />从员工最需要用英语的地方开始，<br />匹配基础、岗位与学习时间。</p></Reveal></div>
          <div className="capability-bottom flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="max-w-xl"><Reveal delay={180}><h2 id="capability-title" className="cinematic-title text-5xl font-normal tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">学进日常，<br />用在现场。</h2></Reveal><Reveal delay={320}><p className="capability-copy mt-6 max-w-md text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base">AI 外刊、定制小班、1v1 与基础录播，<br className="hidden sm:block" />组合成适合团队的学习路径。<br />从日常输入到开口表达，让练习贴近真实工作。</p></Reveal><Reveal delay={420}><div className="mt-8 flex flex-wrap gap-3"><button className="primary-cta main-cta" onClick={() => navigate('solutions')}>找到适合的方案<ChevronRight size={14} aria-hidden="true" /></button><button className="secondary-cta" onClick={() => navigate('contact')}>咨询培训规划师</button></div></Reveal></div>
            <div className="capability-panel w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">{services.map(([label, title, body], i) => <Reveal key={label} delay={300 + i * 110}><button className="capability-row group flex w-full gap-5 py-5 text-left" onClick={() => navigate(capabilitySections[i])}><span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/55">0{i + 1}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-4 text-base font-medium text-white sm:text-lg">{title}<ChevronRight size={16} className="shrink-0 text-white/40 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" /></span><span className="mt-1.5 block text-sm leading-relaxed text-white/70">{body}</span></span></button></Reveal>)}</div>
          </div>
        </section>
        <PageContent goal={goal} onGoal={setGoal} onNavigate={navigate} />
      </main>
    </div>
    {isStaticVersion ? null : <button className="motion-control" onClick={() => setPaused(!paused)} disabled={reduced} aria-label={reduced ? '已按系统设置关闭滚屏动效' : paused ? '开启滚屏动效' : '暂停滚屏动效'} aria-pressed={paused || reduced}>{paused || reduced ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}<span>{reduced ? '静态浏览' : paused ? '动效已暂停' : '滚动探索'}</span></button>}
  </div>;
}
