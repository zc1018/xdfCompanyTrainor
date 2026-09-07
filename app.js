"use strict";

(() => {
  const $ = (selector) => document.querySelector(selector);
  const scenarios = {
    global: {
      label: "跨国沟通", audience: "适合跨国协作、海外业务及国际化团队",
      title: ["跨国会议里，", "听得懂，也接得上。"],
      description: "遇到不同口音、临场提问或跨部门讨论，把听力输入和实际对话放在一起练。",
      outcomes: ["听懂关键信息，适应不同口音", "清晰介绍工作、表达观点", "在会议中提问、回应与确认"],
      courses: [["日常输入", "AI 外刊精读", "在真实语境中积累词汇与听力素材"], ["集中训练", "定制小班直播", "练习全球会议、跨文化沟通与现场应答"], ["专项强化", "定制 1v1", "围绕关键岗位的个人表达难点训练"]]
    },
    business: {
      label: "业务表达", audience: "适合销售、采购、管理者及客户沟通岗位",
      title: ["从介绍方案，", "到回应每一个问题。"],
      description: "围绕商务会谈、业务介绍与工作汇报练习，把岗位知识转化为对方听得懂的英语表达。",
      outcomes: ["积累行业词汇和商务表达", "有条理地介绍方案、陈述观点", "在会谈中回应提问、澄清需求"],
      courses: [["团队演练", "定制小班直播", "结合岗位场景，练习会谈与业务陈述"], ["个人提升", "定制 1v1", "针对表达逻辑、用词与流利度重点训练"], ["持续积累", "AI 外刊精读", "通过行业主题补充词汇与表达素材"]]
    },
    foundation: {
      label: "员工基础提升", audience: "适合基础薄弱、久未使用英语的员工团队",
      title: ["从敢开口开始，", "把英语基础补扎实。"],
      description: "先了解员工的真实基础，从发音、常用词汇和简单表达入手，再逐步进入工作场景。",
      outcomes: ["掌握基础发音与高频词汇", "听懂并使用常见职场表达", "建立可以持续的日常学习节奏"],
      courses: [["基础补强", "基础录播课程", "从语音、通用英语到高频商务语境"], ["日常巩固", "AI 外刊精读", "按基础选择主题，练词汇、阅读与跟读"], ["开口实践", "定制小班直播", "在互动课堂中练习简单沟通与场景对话"]]
    }
  };
  const learning = {
    vocabulary: {
      footer: "读懂词义，也记住用法",
      content: '<p class="sample-label">职场沟通 · 语境词汇</p><p class="sample-sentence" lang="en">Let’s review the <mark>proposal</mark> before our next meeting.</p><div class="word-explanation"><strong lang="en">proposal <small>/prəˈpəʊzəl/</small></strong><p>n. 提议；方案</p><p class="muted">在这句话中，指会议前需要审阅的方案。</p></div><p class="sample-translation">下次开会前，我们先审阅一下方案。</p>'
    },
    sentence: {
      footer: "先找主干，再理解细节",
      content: '<p class="sample-label">X-Ray 句子透视 · 结构拆解</p><p class="sample-sentence grammar-sentence" lang="en"><span class="grammar-subject">The team</span> <span class="grammar-verb">will review</span> <span class="grammar-object">the proposal</span> before the meeting begins.</p><div class="grammar-key"><span><i class="grammar-subject" aria-hidden="true"></i>主语</span><span><i class="grammar-verb" aria-hidden="true"></i>谓语</span><span><i class="grammar-object" aria-hidden="true"></i>宾语</span></div><div class="word-explanation"><p><strong>句子主干：团队将审阅方案。</strong></p><p class="muted">before 引导时间状语从句，说明动作发生在会议开始之前。</p></div><p class="sample-translation">团队将在会议开始前审阅这份方案。</p>'
    },
    speaking: {
      footer: "听见表达，再把它说出来",
      content: '<p class="sample-label">影子跟读 · 重音与语调</p><p class="sample-sentence speaking-sentence" lang="en">Let’s <strong>review</strong> the <strong>proposal</strong> / before our next <strong>meeting.</strong> ↘</p><div class="speaking-tips"><div><strong>关键词重读</strong><span>突出主要信息</span></div><div><strong>意群停顿</strong><span>按意思分组表达</span></div><div><strong>句末降调</strong><span>表达完整陈述</span></div></div><p class="sample-translation">先听，再跟读。结合产品中的发音反馈反复练习。</p>'
    }
  };

  // Both tab groups support keyboard navigation; the shared panel is relabelled on selection.
  function setupTabs(selector, attribute, panelSelector, onSelect) {
    const tabs = [...document.querySelectorAll(selector)];
    function select(tab, focus = false) {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      $(panelSelector).setAttribute("aria-labelledby", tab.id);
      onSelect(tab.dataset[attribute]);
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        const vertical = tab.parentElement.getAttribute("aria-orientation") === "vertical";
        const next = vertical ? "ArrowDown" : "ArrowRight";
        const previous = vertical ? "ArrowUp" : "ArrowLeft";
        let target;
        if (event.key === next) target = (index + 1) % tabs.length;
        if (event.key === previous) target = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = tabs.length - 1;
        if (target !== undefined) { event.preventDefault(); select(tabs[target], true); }
      });
    });
  }
  function setGoal(key) {
    $("#goal").value = key;
    $("#goal").removeAttribute("aria-invalid");
    $("#goal-error").hidden = true;
    $("#inquiry-result").hidden = true;
  }
  setupTabs("[data-scenario]", "scenario", "#scenario-panel", (key) => {
    const data = scenarios[key];
    $("#scenario-audience").textContent = data.audience;
    $("#scenario-title").replaceChildren(document.createTextNode(data.title[0]), document.createElement("br"), document.createTextNode(data.title[1]));
    $("#scenario-description").textContent = data.description;
    $("#scenario-outcomes").replaceChildren(...data.outcomes.map((text) => {
      const item = document.createElement("li"); item.textContent = text; return item;
    }));
    $("#scenario-courses").replaceChildren(...data.courses.map(([stage, name, description]) => {
      const item = document.createElement("li");
      const label = document.createElement("span"); label.textContent = stage;
      const body = document.createElement("div");
      const heading = document.createElement("h4"); heading.textContent = name;
      const copy = document.createElement("p"); copy.textContent = description;
      body.append(heading, copy); item.append(label, body); return item;
    }));
    $("#scenario-cta").firstChild.textContent = `咨询${data.label}方案 `;
    $("#scenario-cta").dataset.inquiry = key;
    setGoal(key);
  });
  setupTabs("[data-learning]", "learning", "#learning-panel", (key) => {
    // Only authored static HTML is inserted here; form values/config never use innerHTML.
    $("#learning-content").innerHTML = learning[key].content;
    $("#learning-footer").textContent = learning[key].footer;
  });
  const compactLearning = matchMedia("(max-width: 800px)");
  const updateOrientation = () => $(".learning-tabs").setAttribute("aria-orientation", compactLearning.matches ? "horizontal" : "vertical");
  updateOrientation(); compactLearning.addEventListener("change", updateOrientation);

  const menu = $(".menu-toggle");
  const nav = $("#main-nav");
  function closeMenu(returnFocus = false) {
    nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", "打开导航");
    if (returnFocus) menu.focus();
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open); menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") closeMenu(true); });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (link) closeMenu();
    else if (!event.target.closest(".header-inner")) closeMenu();
    const inquiry = event.target.closest("[data-inquiry]");
    if (inquiry) setGoal(inquiry.dataset.inquiry);
  });
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches) closeMenu(); });

  // Persist an inquiry affordance while the mobile visitor is between the hero and contact.
  if ("IntersectionObserver" in window) {
    let heroVisible = true;
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === "home") heroVisible = entry.isIntersecting;
        if (entry.target.id === "contact") contactVisible = entry.isIntersecting;
      });
      $("#mobile-consult").hidden = heroVisible || contactVisible;
    }, { threshold: 0 });
    observer.observe($("#home")); observer.observe($("#contact"));
  }

  // Empty configuration is a deliberate pending state, never a fictional contact address.
  const config = window.ENTERPRISE_SALES || {};
  const contactName = typeof config.contactName === "string" ? config.contactName.trim().slice(0, 80) : "";
  const email = typeof config.email === "string" && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i.test(config.email) ? config.email : "";
  const phoneValue = typeof config.phone === "string" ? config.phone : "";
  const phoneDigits = phoneValue.replace(/\D/g, "");
  const phone = /^\+?[\d\s()-]{7,24}$/.test(phoneValue) && phoneDigits.length >= 7 && phoneDigits.length <= 15 ? phoneValue : "";
  function safeHttps(value) {
    try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : ""; } catch { return ""; }
  }
  const consultationUrl = safeHttps(config.consultationUrl);
  const wechat = typeof config.wechatId === "string" && /^[a-zA-Z][a-zA-Z\d_-]{5,30}$/.test(config.wechatId) ? config.wechatId : "";
  const links = $("#sales-links");
  links.replaceChildren();
  $("#planner-name").textContent = contactName;
  $("#planner-name").hidden = !contactName;
  function addChannel(text, href, external = false) {
    const anchor = document.createElement("a"); anchor.textContent = text; anchor.href = href;
    if (external) { anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; }
    links.append(anchor);
  }
  if (email) addChannel(`邮件咨询：${email}`, `mailto:${email}`);
  if (phone) addChannel(`电话咨询：${phone}`, `tel:${phone.replace(/[^\d+]/g, "")}`);
  if (consultationUrl) addChannel("在线联系企业培训规划师 ↗", consultationUrl, true);
  if (wechat) {
    const button = document.createElement("button"); button.type = "button"; button.textContent = `复制规划师微信：${wechat}`;
    button.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(wechat); button.textContent = `已复制微信：${wechat}`; }
      catch { button.textContent = `请手动复制微信号：${wechat}`; }
    }); links.append(button);
    if (typeof config.wechatQrImage === "string" && /^assets\/[\w/.-]+\.(png|jpe?g|webp)$/i.test(config.wechatQrImage) && !config.wechatQrImage.includes("..")) {
      const qr = document.createElement("img"); qr.src = config.wechatQrImage; qr.alt = "企业培训规划师微信二维码"; qr.width = 140; qr.height = 140; qr.loading = "lazy"; links.append(qr);
    }
  }
  const hasContact = links.children.length > 0;
  $("#sales-pending").hidden = hasContact;
  $("#sales-channels").hidden = !hasContact;
  $("#result-help").textContent = email ? "可将摘要带入邮件草稿，也可复制后联系企业培训规划师。邮件需在邮件应用中确认发送。" : hasContact ? "复制或保存摘要后，通过本页联系方式与企业培训规划师沟通。" : "复制或保存摘要，待联系方式公布后用于咨询。";

  const form = $("#inquiry-form");
  const summary = $("#inquiry-summary");
  $(".form-submit").disabled = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = $("#goal");
    if (!goal.value) {
      goal.setAttribute("aria-invalid", "true"); $("#goal-error").hidden = false; goal.focus(); return;
    }
    goal.removeAttribute("aria-invalid"); $("#goal-error").hidden = true;
    const company = $("#company").value.trim() || "待确认";
    const goalLabel = scenarios[goal.value]?.label || "希望一起梳理培训目标";
    summary.value = ["新东方企业英语培训 · 咨询需求", "", `企业 / 团队：${company}`, `培训目标：${goalLabel}`, `预计人数：${$("#size").value}`, `计划开始：${$("#timing").value}`, "", "希望进一步沟通：员工分层、课程组合、项目排期与预算范围。"].join("\n");
    $("#copy-status").textContent = "";
    $("#inquiry-result").hidden = false;
    if (email) {
      $("#email-summary").hidden = false;
      $("#email-summary").href = `mailto:${email}?subject=${encodeURIComponent("企业英语培训需求咨询")}&body=${encodeURIComponent(summary.value)}`;
    }
    $("#result-title").focus({ preventScroll: true });
    $("#inquiry-result").scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  });
  form.addEventListener("input", () => {
    $("#inquiry-result").hidden = true;
    if ($("#goal").value) { $("#goal").removeAttribute("aria-invalid"); $("#goal-error").hidden = true; }
  });
  $("#copy-summary").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      $("#copy-status").textContent = "摘要已复制，尚未发送给企业培训规划师。";
    } catch {
      summary.focus(); summary.select();
      $("#copy-status").textContent = "浏览器未允许自动复制，已选中摘要。请手动复制，或保存为文本。";
    }
  });
  $("#download-summary").addEventListener("click", () => {
    const blob = new Blob(["\uFEFF", summary.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "企业英语培训-咨询需求.txt";
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("#copy-status").textContent = "已生成文本文件，请确认浏览器下载记录。需求尚未发送。";
  });
})();
