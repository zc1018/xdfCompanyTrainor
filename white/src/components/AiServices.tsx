import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, BookOpen, MessageCircle } from 'lucide-react';
import speakingListen from '../../../assets/products/speaking/listen.png';
import speakingRepeat from '../../../assets/products/speaking/repeat.png';
import speakingGuided from '../../../assets/products/speaking/guided-chat.png';
import speakingIndependent from '../../../assets/products/speaking/independent-chat.png';
import vocabularyWord from '../../../assets/products/vocabulary/word.png';
import vocabularySentence from '../../../assets/products/vocabulary/sentence.png';
import vocabularyContext from '../../../assets/products/vocabulary/context.png';
import vocabularyCalendar from '../../../assets/products/vocabulary/calendar.png';
import type { LearningProject } from '../content';

interface LearningStage {
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  caption: string;
}

interface Service {
  id: string;
  project: LearningProject;
  number: string;
  name: string;
  title: readonly [string, string];
  description: string;
  audience: string;
  adaptation: string;
  example: string;
  followUp: string;
  stages: readonly LearningStage[];
}

// Product scope and unmodified screenshots: white/CONTENT-SOURCES.md.
const speaking: Service = {
  id: 'ai-speaking',
  project: 'speaking',
  number: '03',
  name: 'AI 口语外教',
  title: ['先听懂，再跟着说，', '一步步练到自己聊。'],
  description: '把一次开口练习拆成清晰的四步。从理解情境、模仿表达，到借助提示对话，再尝试独立交流，让员工有更多开口机会。',
  audience: '需要增加听说练习、建立沟通信心的员工。',
  adaptation: '按基础匹配已有课程与任务；岗位对话、角色和表达内容可评估定制，先确认样课。',
  example: '课次示例 · 办理当日通行证',
  followUp: '学后可查看练习记录与报告，回顾薄弱环节并重练。',
  stages: [
    { label: '听一听', title: '先听懂情境与任务', description: '听完整示范，了解对话双方的角色，以及这次沟通要完成什么。', image: speakingListen, alt: 'AI 口语外教听一听界面：听健身房示范对话，理解办理当日通行证的任务', caption: '听示范，理解沟通任务。' },
    { label: '跟着说', title: '模仿关键表达，再回听', description: '逐句听读、录音与回听，把一句话说顺，再进入后续对话。', image: speakingRepeat, alt: 'AI 口语外教跟着说界面：逐句听示范并录音跟读', caption: '从一句话开始练习表达。' },
    { label: '试着聊', title: '借助提示完成对话', description: '选择角色，跟随任务提示回应 AI，把刚学到的表达用在交流中。', image: speakingGuided, alt: 'AI 口语外教试着聊界面：根据访客角色和提示与接待员对话', caption: '有提示地练习，有目标地回应。' },
    { label: '自己聊', title: '围绕任务，独立组织语言', description: '减少提示，自己决定怎么问、怎么回答，尝试完成一次连贯的沟通。', image: speakingIndependent, alt: 'AI 口语外教自己聊界面：阅读角色任务后独立与 Victor 开始对话', caption: '围绕同一个任务，尝试自主表达。' },
  ],
};

const vocabulary: Service = {
  id: 'word-camp',
  project: 'vocabulary',
  number: '04',
  name: '单词训练营 · 酷酷背',
  title: ['从一个词，', '学到搭配与完整表达。'],
  description: '看图、听音建立词义认知，再进入词组和例句。通过情境练习检查理解，配合学习日历与周报，把每次积累连成一条学习路径。',
  audience: '需要补充词汇、巩固英语基础与常用表达的员工。',
  adaptation: '按基础匹配课程与学习节奏；岗位词表可评估制作配套搭配、例句、图片及检测题。',
  example: '内容示例 · student',
  followUp: '日历回看每天学了什么，周报了解阶段学习记录。',
  stages: [
    { label: '单词认知', title: '让词义和画面联系起来', description: '从图片、词形与发音认识 student，先理解这个词指什么。', image: vocabularyWord, alt: '酷酷背单词学习界面：通过学生场景图学习 student', caption: '单词 · student' },
    { label: '词组例句', title: '把单词放进完整语境', description: '从 student 到 good student，再听读完整例句，结合双语解析理解用法。', image: vocabularySentence, alt: '酷酷背例句学习界面：She is a good student in our class.', caption: '搭配 · good student → 例句 · She is a good student in our class.' },
    { label: '情境检测', title: '学完即练，检查是否理解', description: '用图片辨义等练习确认词在情境中的意思，再回看和复练未掌握的内容。', image: vocabularyContext, alt: '酷酷背图片辨义界面：从三个场景中辨认正在课堂学习的学生', caption: '情境练习 · 将词义与实际场景对应。' },
    { label: '学习记录', title: '知道学到哪里，接着往下学', description: '课程按单元、课次和模块组织，支持继续学习，并用日历与周报回看个人学习过程。', image: vocabularyCalendar, alt: '酷酷背学习日历界面：按天查看已学习的内容与课次记录', caption: '个人学习记录示例 · 图中记录用于展示功能。' },
  ],
};

function ServiceSection({ service, onConsult }: { service: Service; onConsult: (project: LearningProject) => void }) {
  const [active, setActive] = useState(0);
  const stage = service.stages[active];
  const isSpeaking = service.project === 'speaking';

  function changeStage(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (index + 1) % service.stages.length;
    if (event.key === 'ArrowLeft') next = (index + service.stages.length - 1) % service.stages.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = service.stages.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${service.id}-step-${next}`)?.focus();
  }

  return <section id={service.id} className="ai-service" data-project={service.project} aria-labelledby={`${service.id}-title`}>
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="eyebrow">{service.number} / {service.name}</p>
        <h2 id={`${service.id}-title`} className="section-title">{service.title[0]}<br />{service.title[1]}</h2>
        <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">{service.description}</p>
        <div className="project-tabs" role="tablist" aria-label={`${service.name}学习步骤`}>
          {service.stages.map((item, index) => <button
            key={item.label}
            id={`${service.id}-step-${index}`}
            role="tab"
            type="button"
            aria-selected={active === index}
            aria-controls={`${service.id}-panel`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={event => changeStage(event, index)}
            className="project-tab"
          ><span aria-hidden="true">0{index + 1}</span>{item.label}</button>)}
        </div>
        <p className="mt-6 text-base font-medium">{stage.title}</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">{stage.description}</p>
        <button type="button" className="text-link mt-5" onClick={() => onConsult(service.project)}>
          咨询{isSpeaking ? 'AI 口语外教' : '单词训练营'}方案<ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div id={`${service.id}-panel`} role="tabpanel" tabIndex={0} aria-labelledby={`${service.id}-step-${active}`} className="project-preview">
        <div className="project-preview-header">
          <span className="flex items-center gap-2 font-medium">{isSpeaking ? <MessageCircle size={16} aria-hidden="true" /> : <BookOpen size={16} aria-hidden="true" />}{service.name}</span>
          <span>产品界面示例</span>
        </div>
        <figure>
          <div className="project-screenshot" data-portrait={isSpeaking}>
            <img src={stage.image} alt={stage.alt} width={isSpeaking ? 390 : 956} height={isSpeaking ? 844 : 440} loading="lazy" decoding="async" />
          </div>
          <figcaption className="project-caption">
            <p className="text-xs text-slate-600">{service.example}</p>
            <p className="mt-2 text-sm leading-6">{stage.caption}</p>
          </figcaption>
        </figure>
        <p className="project-preview-note">切换学习步骤查看界面；本页展示截图，可在咨询时了解课程体验。</p>
      </div>
    </div>
    <div className="project-use-cases">
      <div><h3>适合哪些员工</h3><p>{service.audience}</p></div>
      <div><h3>怎样用于企业培训</h3><p>{service.adaptation}</p></div>
    </div>
    <p className="mt-6 text-sm leading-7 text-slate-600">{service.followUp}</p>
  </section>;
}

export default function AiServices({ onConsult }: { onConsult: (project: LearningProject) => void }) {
  return <>
    <ServiceSection service={speaking} onConsult={onConsult} />
    <ServiceSection service={vocabulary} onConsult={onConsult} />
  </>;
}
