import newOriental from '../assets/brands/new-oriental.png';
import expo from '../assets/brands/expo-2010.gif';
import brics from '../assets/brands/brics-2017.jpg';
import asianGames from '../assets/brands/hangzhou-asian-games.png';
import boc from '../assets/brands/bank-of-china.png';
import post from '../assets/brands/china-post.png';
import ibm from '../assets/brands/ibm.png';
import hsbc from '../assets/brands/hsbc.svg';
import heroVideo from '../assets/media/enterprise-learning-h3.mp4';
import heroPoster from '../assets/media/enterprise-learning-h3-poster.jpg';

export { newOriental };
// Bespoke image2 + MiniMax H3 learning scene, served locally. Provenance: assets/media/SOURCES.md.
export { heroVideo as VIDEO_URL, heroPoster as VIDEO_POSTER };
export const planner = { name: '胡婷 Maggie', title: '企业培训规划师', email: 'huting20@xdf.cn', phone: '15811383545' } as const;

export interface Brand { src: string; alt: string; relationship: string; gradient: { from: string; to: string }; imageClass?: string }
// Original marks and relationship evidence: assets/brands/SOURCES.md. Not a claim of current endorsement.
export const brands: Brand[] = [
  { src: newOriental, alt: '新东方', relationship: '企业英语培训', gradient: { from: '#6ee7b7', to: '#087f8c' } },
  { src: boc, alt: '中国银行', relationship: '过往企培合作机构', gradient: { from: '#fb7185', to: '#be123c' } },
  { src: ibm, alt: 'IBM', relationship: '过往企培合作机构', gradient: { from: '#93c5fd', to: '#2563eb' }, imageClass: 'brand-ibm' },
  { src: hsbc, alt: '汇丰 HSBC', relationship: '过往企培合作机构', gradient: { from: '#fda4af', to: '#e11d48' } },
  { src: post, alt: '中国邮政', relationship: '过往企培合作机构', gradient: { from: '#bef264', to: '#15803d' } },
  { src: expo, alt: '上海世博会', relationship: '城市文明志愿者语言培训合作伙伴', gradient: { from: '#86efac', to: '#059669' }, imageClass: 'brand-project' },
  { src: brics, alt: '金砖国家厦门会晤', relationship: '志愿者英语培训合作机构', gradient: { from: '#fdba74', to: '#ea580c' }, imageClass: 'brand-project' },
  { src: asianGames, alt: '杭州亚运会', relationship: '官方语言培训机构', gradient: { from: '#c4b5fd', to: '#7c3aed' } },
];

export const scenarios = [
  { id: 'global', label: '跨国沟通', audience: '跨国协作、海外业务及国际化团队', title: '跨国会议里，听得懂，也接得上。', description: '遇到不同口音、临场提问或跨部门讨论，把听力输入和实际对话放在一起练。', outcomes: ['听懂关键信息，适应不同口音', '清晰介绍工作、表达观点', '在会议中提问、回应与确认'], courses: [['日常输入', 'AI 外刊精读', '在真实语境中积累词汇与听力素材'], ['集中训练', '定制小班直播', '练习全球会议、跨文化沟通与现场应答'], ['专项强化', '定制 1v1', '围绕关键岗位的个人表达难点训练']] },
  { id: 'business', label: '业务表达', audience: '销售、采购、管理者及客户沟通岗位', title: '从介绍方案，到回应每一个问题。', description: '围绕商务会谈、业务介绍与工作汇报练习，把岗位知识转化为对方听得懂的英语表达。', outcomes: ['积累行业词汇和商务表达', '有条理地介绍方案、陈述观点', '在会谈中回应提问、澄清需求'], courses: [['团队演练', '定制小班直播', '结合岗位场景，练习会谈与业务陈述'], ['个人提升', '定制 1v1', '针对表达逻辑、用词与流利度重点训练'], ['持续积累', 'AI 外刊精读', '通过行业主题补充词汇与表达素材']] },
  { id: 'foundation', label: '员工基础提升', audience: '基础薄弱、久未使用英语的员工团队', title: '从敢开口开始，把英语基础补扎实。', description: '先了解员工的真实基础，从发音、常用词汇和简单表达入手，再逐步进入工作场景。', outcomes: ['掌握基础发音与高频词汇', '听懂并使用常见职场表达', '建立可以持续的日常学习节奏'], courses: [['基础补强', '基础录播课程', '从语音、通用英语到高频商务语境'], ['日常巩固', 'AI 外刊精读', '按基础选择主题，练词汇、阅读与跟读'], ['开口实践', '定制小班直播', '在互动课堂中练习简单沟通与场景对话']] },
] as const;
export type Goal = typeof scenarios[number]['id'] | 'discuss' | '';
export const services = [
  ['课程怎么定', '先测评分层，再按岗位设计', '围绕英文会议、客户沟通与行业主题，匹配员工基础和工作需求。'],
  ['员工怎么学', '日常自学，结合直播训练', 'AI 外刊、小班直播、1v1 与基础录播，按团队时间和目标组合。'],
  ['HR 怎么跟进', '学习进度与阶段反馈', '跟进录播进度、直播到课和测试成绩，结合项目沟通调整安排。'],
] as const;
export const catalogue = [
  ['AI 外刊精读', '日常词汇、阅读、听力与跟读训练；主题可按行业需求调整。'],
  ['定制小班直播', '团队共性场景集中训练，强调课堂互动与即时表达。'],
  ['定制 1v1 直播', '结合个人水平、目标与时间排课，主讲老师与班主任共同跟进。'],
  ['基础录播课程', '覆盖语音、通用职场英语与商务语境，适合基础补强。'],
] as const;
export const topics = [['科技', 'AI 如何改变工作'], ['健康', '膳食纤维为何走红'], ['旅行', '无护照旅行还有多远'], ['太空', '为火星生活做准备'], ['科研', '一颗原子也不浪费'], ['商业', '品牌为什么更换标志']] as const;
export const steps = [
  ['需求访谈', '明确岗位、业务场景、员工基础与可投入时间。'],
  ['测评分层', '结合入门测评匹配基础层与进阶层，配置课程。'],
  ['学练结合', '排课、课前提醒、作业反馈与学习群答疑持续跟进。'],
  ['阶段复盘', '通过阶段测、月度项目沟通与结业报告回顾学习。'],
] as const;
export const faqs = [
  ['能围绕我们的行业和岗位定制吗？', '可以。外刊主题、直播话题与训练任务可结合行业、岗位场景和员工基础调整。先明确实际工作中需要用英语完成什么，再安排课程内容。'],
  ['员工英语基础差异很大，怎么一起培训？', '通过入门测评与需求访谈分层。基础薄弱员工先补语音、词汇与通用表达，有一定基础的员工强化会议、跨文化沟通等具体场景。'],
  ['工作忙，学习时间怎么安排？', 'AI 外刊与录播可安排在碎片时间，直播按团队可上课时段排课。外刊方案可按每日或工作日推送，具体频次和项目周期在需求沟通后确定。'],
  ['HR 能了解学习参与和效果吗？', '项目可按月反馈录播学习进度、直播到课次数和平均测试成绩，并通过项目会议沟通后续安排；阶段测与结业报告用于复盘。具体反馈范围随采购课程与服务确定。'],
  ['培训费用和周期怎么确定？', '需要结合参训人数、员工基础、课程形式、课时和服务范围制定。明确团队目标后，再沟通课程组合、项目周期和报价；本页不预设统一价格。'],
] as const;
