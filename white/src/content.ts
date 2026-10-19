import newOriental from '../../assets/brands/new-oriental.png';
import expo from '../../assets/brands/expo-2010.gif';
import brics from '../../assets/brands/brics-2017.jpg';
import asianGames from '../../assets/brands/hangzhou-asian-games.png';
import boc from '../../assets/brands/bank-of-china.png';
import post from '../../assets/brands/china-post.png';
import ibm from '../../assets/brands/ibm.png';
import hsbc from '../../assets/brands/hsbc.svg';
import heroVideo from '../../assets/media/enterprise-learning-h3.mp4';
import heroPoster from '../../assets/media/enterprise-learning-h3-poster.jpg';

export { newOriental };
// Bespoke image2 + MiniMax H3 learning scene, served locally. Provenance: assets/media/SOURCES.md.
export { heroVideo as VIDEO_URL, heroPoster as VIDEO_POSTER };
export const planner = { name: '胡经理', title: '企业培训规划师', email: 'huting20@xdf.cn', phone: '15811383545' } as const;

export const aiProjects = [
  { id: 'reading', anchor: 'ai-reading', name: 'AI 外刊精读', focus: '阅读输入与表达积累' },
  { id: 'speaking', anchor: 'ai-speaking', name: 'AI 口语外教', focus: '听说练习与场景对话' },
  { id: 'vocabulary', anchor: 'word-camp', name: '单词训练营', focus: '词汇、搭配与语境理解' },
] as const;
export type LearningProject = typeof aiProjects[number]['id'];

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
  { id: 'global', label: '跨国沟通', audience: '跨国协作、海外业务及国际化团队', title: '跨国会议里，听得懂，也接得上。', description: '遇到不同口音、临场提问或跨部门讨论，把听力输入、AI 对话练习与直播演练放在一起。', outcomes: ['听懂关键信息，适应不同口音', '清晰介绍工作、表达观点', '在会议中提问、回应与确认'], courses: [['日常输入', 'AI 外刊精读', '在真实语境中积累词汇与听力素材'], ['开口练习', 'AI 口语外教', '从听示范、跟读到引导对话，增加日常开口机会'], ['集中训练', '定制小班直播', '练习全球会议、跨文化沟通与现场应答'], ['专项强化', '定制 1v1', '围绕关键岗位的个人表达难点训练']] },
  { id: 'business', label: '业务表达', audience: '销售、采购、管理者及客户沟通岗位', title: '从介绍方案，到回应每一个问题。', description: '先积累词汇与常用表达，再结合 AI 对话和直播演练，把知识逐步用到工作沟通中。岗位专属内容可另行评估。', outcomes: ['积累常用词汇与表达素材', '有条理地介绍方案、陈述观点', '在会谈中回应提问、澄清需求'], courses: [['词汇积累', '单词训练营', '从单词、搭配到例句补基础；岗位词表可评估定制'], ['日常对话', 'AI 口语外教', '匹配已有课程与学习任务，逐步减少提示完成表达'], ['团队演练', '定制小班直播', '结合岗位场景，练习会谈与业务陈述'], ['个人提升', '定制 1v1', '针对表达逻辑、用词与流利度重点训练']] },
  { id: 'foundation', label: '员工基础提升', audience: '基础薄弱、久未使用英语的员工团队', title: '从认识单词开始，一步步敢开口。', description: '先了解员工的真实基础，组合词汇学习、听说练习与基础课程，逐步进入完整语境。', outcomes: ['积累基础词汇与常用搭配', '听懂示范，尝试简单对话', '建立可以持续的日常学习节奏'], courses: [['词汇补强', '单词训练营', '看图、听音、学搭配与例句，再用情境练习检查理解'], ['听说起步', 'AI 口语外教', '按课次听一听、跟着说，再借助提示练习对话'], ['阅读输入', 'AI 外刊精读', '按基础选择主题，积累词汇、阅读与跟读素材'], ['基础课程', '基础录播课程', '从语音、通用英语到高频商务语境']] },
] as const;
export type Goal = typeof scenarios[number]['id'] | 'discuss' | '';
export const services = [
  ['课程怎么定', '先测评分层，再按岗位设计', '围绕英文会议、客户沟通与行业主题，匹配员工基础和工作需求。'],
  ['员工怎么学', '阅读、口语、词汇，搭配直播训练', 'AI 外刊精读、AI 口语外教、单词训练营，与小班、1v1、基础录播按需组合。'],
  ['HR 怎么跟进', '学习记录与阶段反馈', '结合课程学习记录、直播到课和阶段测评，按约定开展项目复盘。'],
] as const;
export const catalogue = [
  ['AI 外刊精读', '日常词汇、阅读、听力与跟读训练；主题可按行业需求调整。'],
  ['AI 口语外教', '从听示范、跟读到引导对话与独立交流，结合练习记录回顾与再练。'],
  ['单词训练营', '酷酷背单词：单词、搭配、例句与情境检测，配合学习日历和周报。'],
  ['定制小班直播', '团队共性场景集中训练，强调课堂互动与即时表达。'],
  ['定制 1v1 直播', '结合个人水平、目标与时间排课，主讲老师与班主任共同跟进。'],
  ['基础录播课程', '覆盖语音、通用职场英语与商务语境，适合基础补强。'],
] as const;
export const topics = [['科技', 'AI 如何改变工作'], ['健康', '膳食纤维为何走红'], ['旅行', '无护照旅行还有多远'], ['太空', '为火星生活做准备'], ['科研', '一颗原子也不浪费'], ['商业', '品牌为什么更换标志']] as const;
export const steps = [
  ['需求访谈', '明确岗位、业务场景、员工基础与可投入时间。'],
  ['测评分层', '结合员工基础，匹配外刊、口语、词汇及直播课程；定制内容先确认样课。'],
  ['学练结合', '按课次组织 AI 自学与直播训练，配套约定的导学、提醒和学习答疑。'],
  ['阶段复盘', '结合学习记录、任务表现和阶段测评，按约定提供反馈与后续建议。'],
] as const;
export const faqs = [
  ['能围绕我们的行业和岗位定制吗？', '可以先结合岗位目标匹配已有课程。外刊主题、直播任务可按需调整；AI 口语的岗位对话、单词训练营的专业词汇及配套例句和检测题，需要完成语料确认、教研制作与样课试学，再确定范围和排期。'],
  ['员工英语基础差异很大，怎么一起培训？', '通过入门测评与需求访谈分层。基础薄弱员工可用单词训练营积累词汇、基础录播补强语音，并从 AI 口语的示范与跟读起步；有一定基础的员工增加外刊输入、独立对话或直播场景训练。'],
  ['工作忙，学习时间怎么安排？', 'AI 外刊、AI 口语、单词训练营与录播可按课次安排在碎片时间，直播按团队可上课时段排课。具体学习频次、任务量和项目周期在需求沟通后确定。'],
  ['AI 口语外教和单词训练营，可以与直播一起选吗？', '可以按需组合。单词训练营用于词汇与搭配积累，AI 外刊提供阅读输入，AI 口语增加听说与对话练习，小班或 1v1 用于集中演练和重点指导。课程清单与服务范围在方案中共同确认。'],
  ['HR 能了解学习参与和效果吗？', '可结合 AI 口语练习记录、单词训练营的个人日历与周报、录播进度、直播到课和阶段测评开展复盘。企业需要的汇总内容、获取方式和反馈频次按项目约定；如需专属管理看板，可进一步沟通评估。'],
  ['可以接入企业账号系统或专属数据看板吗？', '可以提出需求，由产品与技术评估账号、权限、数据字段、费用和排期。这类系统接入与标准课程采购分别确认，具体以项目方案为准。'],
  ['培训费用和周期怎么确定？', '需要结合参训人数、员工基础、课程形式、课时和服务范围制定。明确团队目标后，再沟通课程组合、项目周期和报价；本页不预设统一价格。'],
] as const;
