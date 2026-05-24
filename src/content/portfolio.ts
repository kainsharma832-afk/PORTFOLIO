export const portfolioContent = {
  siteTitle: "Wang yuqi Portfolio",
  nav: {
    brand: "WYQ Portfolio",
    emailHref: "mailto:hello@example.com",
    emailLabel: "Email",
    codeHref: "https://github.com",
    codeLabel: "GitHub",
  },
  hero: {
    location: "Based in China",
    title: "PORTFOLIO",
    description: "Hello,这里整理了我的项目、审美和创作方向。",
    skills: ["Product design", "UI Design", "Photography"],
    sideTitle: "Selected work",
    sideDescription: "向下滚动浏览我的精选项目，悬停卡片可以查看作品信息。",
    scrollLabel: "Scroll",
  },
  work: {
    eyebrow: "Portfolio",
    title: "Selected Work",
    description: "这里展示我的部分项目作品，包括视觉设计、网页设计、摄影和动态实验。",
  },
  about: {
    eyebrow: "About",
    title: "联系我",
    paragraphs: [
      "Email：3303797070@qq.com",
      "我希望通过设计和技术，把想法变成清晰、有质感、可展示的数字作品。",
    ],
  },
};

export const projects = [
  {
    id: 1,
    title: "音愈",
    slug: "project-1",
    category: "Product design",
    description: "脑卒中后吞咽障碍居家康复设备，用全新的声音训练方式帮助患者改善吞咽问题。",
    cover: "/images/projects/project-1/cover.jpg",
    images: [
      "/images/projects/project-1/01.jpg",
      "/images/projects/project-1/02.jpg",
      "/images/projects/project-1/03.jpg",
    ],
    projectUrl: "http://127.0.0.1:5500/index.html",
    pdfUrl: "/pdfs/projects/project-1/project.pdf",
    figmaUrl:
      "https://www.figma.com/design/oEQQm7tK03JHl45IgbdW39/Kain-Sharma-s-team-library?node-id=5379-7&t=Uqh9LiWSnjipBD3m-4",
    detail: {
      index: "01",
      subtitle: "脑卒中后吞咽障碍居家康复设备",
      intro: ["用全新的声音训练方式帮助患者改善吞咽问题", "sEMG 肌电颈环 + 发声训练软件"],
      background: {
        eyebrow: "BACKGROUND",
        label: "背景",
        title: "吞咽障碍会出现在 37%-78% 的中风患者中",
        source: "GBD 2021（2021 年全球疾病负担研究，Global Burden of Disease Study 2021）。",
        body: "据统计，约有 37% 至 78% 的脑卒中患者会出现不同程度的吞咽困难。它不仅显著增加误吸性肺炎、营养不良和脱水的风险，还与住院时间延长、再入院率升高及死亡风险上升密切相关。因此，早期识别、精准评估与有效干预对于改善患者预后具有至关重要的临床意义。",
      },
      problems: [
        {
          title: "训练无反馈",
          color: "#eebeed",
          body: "目前训练以被动为主，而非患者主动的、功能性的训练，且训练结果依靠量表评估。",
        },
        {
          title: "使用场景局限",
          color: "#9fd6ff",
          body: "场景局限，无法居家使用。必须在医疗机构由专业人士操作。",
        },
        {
          title: "体验不适",
          color: "#ffed7b",
          body: "舌压板与冰酸刺激训练过程枯燥不适，电刺激佩戴过程复杂，有潜在危险。",
        },
      ],
      research: {
        eyebrow: "USER RESEARCH",
        label: "用户研究",
        title: "从患者、家属和训练场景中寻找居家康复机会",
        cards: [
          "问卷调研老人及家属对康复类产品的购买意向和需求，并将问卷内容可视化。",
          "观察传统康复流程中训练反馈不足、操作门槛高和坚持困难的问题。",
          "梳理居家环境下患者对舒适佩戴、低压力训练和清晰反馈的需求。",
        ],
      },
      concept: {
        eyebrow: "HOW TO MANAGE POST-STROKE DYSPHAGIA?",
        title: "创新性提出用发声代替传统训练的方式",
        body: "吞咽与发声共享大部分肌肉，因此方案采用 LSVT 李西尔弗曼言语治疗思路，将发声训练、颈部 sEMG 采集和软件反馈结合，为患者提供更舒适、便捷、有尊严的康复体验。",
        highlight: "吞咽与发声共享大部分肌肉",
        doi: "DOI：10.1007/s00405-022-07719-7",
      },
      process: [
        {
          title: "engineering drawing",
          label: "工程图",
          body: "围绕颈部佩戴稳定性、传感器位置和训练反馈进行结构推导。",
        },
        {
          title: "sketch",
          label: "草图",
          body: "通过草图快速探索颈环、控制按钮、软垫与产品整体比例。",
        },
        {
          title: "story board",
          label: "故事板",
          body: "模拟患者在居家环境中佩戴、训练、查看反馈和持续康复的流程。",
        },
      ],
      components: [
        {
          title: "Toggle button",
          label: "开关按钮",
        image: "/images/projects/project-1/01.jpg",
        },
        {
          title: "Cushion",
          label: "乳胶软垫",
        image: "/images/projects/project-1/02.jpg",
        },
        {
          title: "Product",
          label: "完整产品",
        image: "/images/projects/project-1/03.jpg",
        },
      ],
      galleryGroups: [
        {
          label: "模型测试与组装",
          color: "#eebeed",
          images: ["/images/projects/project-1/01.jpg", "/images/projects/project-1/02.jpg"],
        },
        {
          label: "产品渲染图",
          color: "#9fd6ff",
          images: ["/images/projects/project-1/cover.jpg", "/images/projects/project-1/03.jpg"],
        },
        {
          label: "产品 UI 界面",
          color: "#ffed7b",
          images: ["/images/projects/project-1/02.jpg", "/images/projects/project-1/03.jpg"],
        },
      ],
    },
  },
  {
    id: 2,
    title: "Portrait Series",
    slug: "portrait-series",
    category: "Photography",
    description: "",
    cover: "/images/projects/portrait-series/cover.jpg",
    images: [
      "/images/projects/portrait-series/01.jpg",
      "/images/projects/portrait-series/02.jpg",
      "/images/projects/portrait-series/03.jpg",
    ],
  },
  {
    id: 3,
    title: "Website Concept",
    slug: "website-concept",
    category: "Web Design",
    description: "一个结合排版、滚动动效和响应式布局的网站概念设计。",
    cover: "/images/projects/website-concept/cover.jpg",
    images: [
      "/images/projects/website-concept/01.jpg",
      "/images/projects/website-concept/02.jpg",
      "/images/projects/website-concept/03.jpg",
    ],
  },
  {
    id: 4,
    title: "Motion Poster",
    slug: "motion-poster",
    category: "Motion Design",
    description: "一个使用动态文字和视觉节奏完成的海报动效实验。",
    cover: "/images/projects/motion-poster/cover.jpg",
    images: [
      "/images/projects/motion-poster/01.jpg",
      "/images/projects/motion-poster/02.jpg",
      "/images/projects/motion-poster/03.jpg",
    ],
  },
  {
    id: 5,
    title: "Editorial Layout",
    slug: "editorial-layout",
    category: "Editorial",
    description: "一个关注网格、留白和图片叙事的版式设计项目。",
    cover: "/images/projects/editorial-layout/cover.jpg",
    images: [
      "/images/projects/editorial-layout/01.jpg",
      "/images/projects/editorial-layout/02.jpg",
      "/images/projects/editorial-layout/03.jpg",
    ],
  },
  {
    id: 6,
    title: "Product Visual",
    slug: "product-visual",
    category: "Art Direction",
    description: "一个围绕产品质感、色彩和视觉氛围展开的创意项目。",
    cover: "/images/projects/product-visual/cover.jpg",
    images: [
      "/images/projects/product-visual/01.jpg",
      "/images/projects/product-visual/02.jpg",
      "/images/projects/product-visual/03.jpg",
    ],
  },
];
