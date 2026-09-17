import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight, Pause, Play } from 'lucide-react';
import { VIDEO_URL, VIDEO_POSTER } from '../content';
import { goToContact } from '../lib';

interface Props { paused: boolean; reduceMotion: boolean; onToggle: () => void }
export default function Hero({ paused, reduceMotion, onToggle }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = true;
    const sync = () => {
      if (paused || document.hidden || !inView) video.pause();
      else void video.play().catch(() => { /* Autoplay may be blocked; static background remains. */ });
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [paused]);

  return <section id="home" aria-labelledby="hero-title" className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
    <div aria-hidden="true" className="hero-media absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <img src={VIDEO_POSTER} alt="" width="1920" height="1080" fetchPriority="high" className="hero-poster absolute inset-0 w-full h-full object-cover scale-105" />
      <video ref={videoRef} src={VIDEO_URL} poster={VIDEO_POSTER} data-failed={videoFailed} onError={() => setVideoFailed(true)} autoPlay={!reduceMotion} loop muted playsInline preload={reduceMotion ? 'none' : 'metadata'} className="w-full h-full object-cover scale-105 transition-transform duration-1000" />
    </div>
    <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-[580px]">
        <p className="mb-6 text-[11px] font-semibold tracking-[0.16em] text-slate-500">NEW ORIENTAL · CORPORATE LEARNING</p>
        <h1 id="hero-title" className="font-display text-[42px] md:text-[56px] font-medium tracking-tight text-[#0a1b33] leading-[1.3]">英语学得会，<br />工作用得上。</h1>
        <p className="mt-6 max-w-[390px] font-sans text-[14px] md:text-[15px] leading-[1.9] text-[#64748b]">从英文会议、客户沟通，到员工日常提升。<br className="hidden sm:block" />按岗位与基础设计课程，<br className="hidden sm:block" />把学习安排进工作节奏。</p>
        <motion.button type="button" onClick={goToContact} whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-full bg-[#0a152d] px-7 py-3.5 text-sm font-medium text-white">聊聊企业培训需求<ArrowUpRight size={17} aria-hidden="true" /></motion.button>
        <p className="mt-4 text-xs text-slate-500">先明确目标，再匹配课程与预算</p>
      </motion.div>
    </div>
    <button type="button" onClick={onToggle} disabled={reduceMotion} aria-label={reduceMotion ? '已按系统设置停止动态效果' : paused ? '播放背景视频与标识滚动' : '暂停背景视频与标识滚动'} aria-pressed={paused} className="motion-toggle absolute right-5 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-white/80 md:bottom-10 md:right-8 md:top-auto">{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
      <motion.nav aria-label="首屏导航" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40">
        <span aria-hidden="true" className="nav-star ml-1 mr-2 flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-[#0a1b33]">✦</span>
        <a href="#solutions" className="nav-standard">培训方案</a>
        <a href="#ai-reading" className="nav-standard">学习方式</a>
        <a href="#contact" className="nav-contact ml-2 flex items-center gap-2 bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">聊聊需求<ChevronRight size={14} aria-hidden="true" /></a>
      </motion.nav>
    </div>
  </section>;
}
