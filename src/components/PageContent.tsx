import { ArrowUpRight, Check, Plus } from 'lucide-react';
import Contact from './Contact';
import Solutions from './Solutions';
import Learning from './Learning';
import { brands, faqs, steps, type Goal } from '../content';
import type { SectionId } from '../lib';

export default function PageContent({ goal, onGoal, onNavigate }: { goal: Goal; onGoal: (goal: Goal) => void; onNavigate: (section: SectionId) => void }) {
  return <div className="content-flow"><div className="page-content">
    <div className="content-chapter"><Solutions onGoal={onGoal} onContact={() => onNavigate('contact')} /></div>
    <div className="content-chapter"><Learning /></div>
    <div className="content-chapter"><section id="delivery" className="section-shell" aria-labelledby="delivery-title"><div className="section-heading"><div><p className="eyebrow">03 / 项目交付</p><h2 id="delivery-title">员工有学习路径，<br />HR 有项目进度。</h2></div><p>从需求到结业，每个阶段都有安排。<br />看得见进展，也能及时调整。</p></div><ol className="delivery-steps">{steps.map(([title, description], i) => <li key={title}><span className="font-mono text-xs text-white/50">0{i + 1}</span><div><h3 className="text-lg font-medium">{title}</h3><p className="mt-2 text-sm leading-7 text-white/65">{description}</p></div></li>)}</ol><div className="delivery-feedback"><div><p className="eyebrow">HR 可以收到什么？</p><h3 className="text-lg">每月项目反馈</h3></div><ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{['录播学习进度', '直播到课情况', '平均测试成绩', '项目沟通与后续安排'].map(item => <li key={item} className="flex items-center gap-2 text-sm text-white/75"><Check size={14} aria-hidden="true" />{item}</li>)}</ul></div>
      <article className="case-study"><div><p className="eyebrow">方案示例 · 跨国香精香料企业</p><h3 className="text-2xl leading-relaxed">同一场全球会议，<br />听懂不同口音。</h3><p className="mt-5 text-sm leading-7 text-white/70">面对法国、印尼、日本、韩国、新加坡等多国同事，员工需要完成真正有问有答的工作沟通。</p><button className="text-link mt-5" onClick={() => { onGoal('global'); onNavigate('contact'); }}>咨询类似培训方案<ArrowUpRight size={14} aria-hidden="true" /></button></div><dl>{[['培训对象', 'IT、HR、采购、销售及技术部门'], ['核心难点', '基础差异大、不同口音、部门专业词汇'], ['课程设计', '基础录播补强 + AI 外刊日常学习 + 小班直播场景演练'], ['训练目标', '听懂商务信息，参与跨部门对话与现场问答']].map(([term, description]) => <div key={term} className="grid grid-cols-[64px_1fr] gap-5 border-b border-white/15 py-4 text-xs leading-6"><dt className="text-white/50">{term}</dt><dd className="text-white/80">{description}</dd></div>)}</dl></article>
      <div className="brand-history"><h3 className="text-base">品牌与项目经验</h3><p className="mt-2 text-xs leading-6 text-white/55">新东方品牌、语言培训项目及部分过往企培合作机构 · 不分先后</p><div className="brand-history-list">{brands.map(brand => <figure key={brand.alt}><div><img src={brand.src} alt={brand.alt} loading="lazy" /></div><figcaption>{brand.relationship}</figcaption></figure>)}</div></div>
    </section></div>
    <div className="content-chapter"><section id="faq" className="section-shell" aria-labelledby="faq-title"><p className="eyebrow">04 / 常见问题</p><h2 id="faq-title" className="section-title">做决定前，<br />你可能想了解。</h2><div className="mt-10">{faqs.map(([question, answer]) => <details key={question} className="border-b border-white/20 first:border-t"><summary className="flex min-h-16 items-center justify-between gap-5 py-5 text-sm font-medium">{question}<Plus size={16} className="shrink-0" aria-hidden="true" /></summary><p className="pb-6 pr-5 text-sm leading-7 text-white/70">{answer}</p></details>)}</div><button className="text-link mt-8" onClick={() => onNavigate('contact')}>聊聊具体需求<ArrowUpRight size={14} aria-hidden="true" /></button></section></div>
    <div className="content-chapter"><Contact goal={goal} onGoal={onGoal} /></div>
    <footer className="page-footer"><span>新东方 · 企业英语培训</span><span>AI 外刊精读 · 定制直播 · 1v1 · 基础录播</span><a href="#home" onClick={event => { event.preventDefault(); onNavigate('home'); }}>回到顶部 ↑</a></footer>
  </div></div>;
}
