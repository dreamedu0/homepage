/* =========================================================
   공통 스크립트: config.js 의 정보를 각 페이지에 채워 넣고,
   메뉴·푸터·움직임을 만듭니다. (이 파일은 고치지 않아도 됩니다)
   ========================================================= */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var S = window.SITE || {};
  var PH = S.showPlaceholders !== false;
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var svcIndex = document.body.dataset.service ? Number(document.body.dataset.service) - 1 : -1;
  var services = Array.isArray(S.services) ? S.services : [];
  var SVC = svcIndex >= 0 ? (services[svcIndex] || {}) : {};

  /* ---------- 도우미 ---------- */
  function has(v) { return Array.isArray(v) ? v.some(has) : v != null && String(v).trim() !== ""; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function get(path) {
    if (path.indexOf("svc.") === 0) return SVC[path.slice(4)];
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, S);
  }
  // 값이 있으면 그 값을, 없으면 (미리보기 모드에서만) [항목 이름] 표시를 돌려줍니다.
  function t(v, label) {
    if (has(v)) return '<span data-filled>' + esc(v) + "</span>";
    return PH ? '<span class="ph">' + esc(label) + "</span>" : "";
  }
  function list(arr) { return (Array.isArray(arr) ? arr : []).filter(function (x) { return PH || has(typeof x === "object" ? Object.values(x) : x); }); }
  function svcName(i) { var s = services[i] || {}; return has(s.name) ? s.name : "대표 업무 " + (i + 1); }
  var mailHref = has(S.email) ? "mailto:" + S.email.trim() : "contact.html";

  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z"/></svg>',
    place: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    kakao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c5 0 9 3.1 9 7s-4 7-9 7c-.8 0-1.6-.1-2.3-.2L5 20l1.2-3.6C4.2 15.1 3 13.2 3 11c0-3.9 4-7 9-7z"/></svg>'
  };

  /* ---------- 메뉴 ---------- */
  var MENU = [
    ["index.html", "홈"], ["about.html", "소개"], ["expert.html", "담당자"],
    ["services.html", "대표 업무"], ["faq.html", "자주 묻는 질문"], ["contact.html", "문의·위치"]
  ];
  function isCurrent(href) { return href === page || (href === "services.html" && /^service-\d\.html$/.test(page)); }

  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="container nav">' +
        '<a class="brand" href="index.html" aria-label="홈으로">' +
          '<span class="brand-logo"><img src="images/logo.png" alt="" onerror="this.parentNode.classList.add(\'no-logo\');this.remove()"></span>' +
          '<span class="brand-name">' + (has(S.name) ? esc(S.name) : (PH ? '<span class="ph">회사 이름</span>' : "")) + "</span>" +
        "</a>" +
        '<nav class="menu" aria-label="주요 메뉴">' + MENU.map(function (m) {
          return '<a href="' + m[0] + '"' + (isCurrent(m[0]) ? ' aria-current="page"' : "") + ">" + m[1] + "</a>";
        }).join("") + "</nav>" +
        '<a class="btn btn-primary btn-sm" data-mail>' + I.mail + "이메일로 문의하기</a>" +
        '<button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span></button>' +
      "</div>";
    var toggle = header.querySelector(".menu-toggle");
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 24); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 온라인 채널 버튼 ---------- */
  // [설정 이름, 버튼 글자, 아이콘 이름]
  var CH = [["instagram", "인스타그램", "instagram"], ["blog", "블로그", "blog"], ["blog2", "블로그 2", "blog"], ["youtube", "유튜브", "youtube"], ["place", "네이버 지도", "place"], ["kakao", "카카오톡 채널", "kakao"]];
  function channelsHTML() {
    var c = S.channels || {};
    return CH.filter(function (x) { return has(c[x[0]]); }).map(function (x) {
      // images/icon-blog.png 처럼 직접 넣은 아이콘이 있으면 그것을 씁니다.
      return '<a class="channel" href="' + esc(c[x[0]]) + '" target="_blank" rel="noopener">' +
        '<img src="images/icon-' + x[2] + '.png" alt="" onerror="this.outerHTML=this.dataset.svg" data-svg="' + esc(I[x[2]]) + '">' + x[1] + "</a>";
    }).join("");
  }

  /* ---------- 푸터 ---------- */
  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    var info = [
      ["name", "회사 이름"], ["role", "직책·역할"], ["address", "사무실 위치"], ["hours", "문의 가능 시간"]
    ].map(function (f) { var h = t(S[f[0]], f[1]); return h ? "<li>" + h + "</li>" : ""; }).join("");
    var emailLi = has(S.email) ? '<li><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>" : (PH ? '<li><span class="ph">대표 이메일</span></li>' : "");
    var ch = channelsHTML();
    footer.innerHTML =
      '<div class="container">' +
        '<div class="footer-cta">' +
          "<h2>" + (has(S.services) && has(services[0] && services[0].name) ? esc(svcName(0)) + ", 지금 상황부터 편하게 알려 주세요." : "필요한 업무가 있다면 지금 상황부터 편하게 알려 주세요.") + "</h2>" +
          '<a class="btn btn-primary" data-mail>' + I.mail + "이메일로 문의하기</a>" +
        "</div>" +
        '<div class="footer-cols">' +
          "<div><h3>INFO</h3><ul>" + info + emailLi + "</ul>" + (ch ? '<div class="channels" style="margin-top:24px">' + ch + "</div>" : "") + "</div>" +
          "<div><h3>MENU</h3><ul>" + MENU.map(function (m) { return '<li><a href="' + m[0] + '">' + m[1] + "</a></li>"; }).join("") + "</ul></div>" +
          "<div><h3>SERVICES</h3><ul>" + [0, 1, 2].map(function (i) { return '<li><a href="service-' + (i + 1) + '.html">' + esc(svcName(i)) + "</a></li>"; }).join("") + "</ul></div>" +
        "</div>" +
        '<div class="giant" aria-hidden="true">' + (has(S.name) ? esc(S.name) : (PH ? '<span class="ph">회사 이름</span>' : "")) + "</div>" +
        '<p class="copyright">© ' + new Date().getFullYear() + " " + esc(S.name || "") + ". All rights reserved.</p>" +
      "</div>";
  }

  /* ---------- 모바일 하단 고정 문의 바 ---------- */
  var bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.innerHTML = '<a class="btn btn-primary" data-mail>' + I.mail + "이메일 문의</a>" +
    '<a class="btn btn-ghost" href="contact.html">문의 방법 보기</a>';
  document.body.appendChild(bar);

  /* ---------- 첫 화면 제목 ---------- */
  var ht = document.getElementById("hero-title");
  if (ht && ht.dataset.auto !== undefined) {
    if (has(S.heroTitle)) ht.innerHTML = esc(S.heroTitle);
    // 비어 있으면: "[대표 고민], [대표 업무]로 풀어 드립니다" 형태의 약속 문장 1줄
    else {
      var sn = services[0] && services[0].name, josa = "(으)로";
      if (has(sn)) {             // 받침에 따라 '로' / '으로'
        var c = sn.trim().charCodeAt(sn.trim().length - 1) - 0xAC00, jong = c >= 0 && c <= 11171 ? c % 28 : 0;
        josa = jong === 0 || jong === 8 ? "로" : "으로";
      }
      ht.innerHTML = t(S.pain, "이 업무가 필요한 분의 고민") + ", <em class=\"grad-text\">" + (has(sn) ? esc(sn) : t("", "대표 업무")) + "</em>" + josa + " 풀어 드립니다";
    }
  }

  /* ---------- [data-k] 칸 채우기 ---------- */
  document.querySelectorAll("[data-k]").forEach(function (el) {
    var v = get(el.dataset.k);
    var html = t(v, el.dataset.ph || el.dataset.k);
    if (html) el.innerHTML = html;
    else (el.closest("[data-opt-row]") || el).hidden = true;
  });

  /* ---------- 목록 그리기 ---------- */
  var R = {
    "services-cards": function () {
      return services.map(function (s, i) {
        if (!PH && !has(s.name)) return "";
        return '<article class="svc-card reveal">' +
          '<span class="svc-num">0' + (i + 1) + "</span>" +
          "<h3>" + t(s.name, "대표 업무 " + (i + 1)) + "</h3>" +
          "<dl>" +
            (t(s.for, "필요한 분") ? "<div><dt>이런 분께</dt><dd>" + t(s.for, "필요한 분") + "</dd></div>" : "") +
            (t(s.pain, "해결하는 고민") ? "<div><dt>해결하는 고민</dt><dd>" + t(s.pain, "해결하는 고민") + "</dd></div>" : "") +
            (t(s.offer, "핵심 제공 내용") ? "<div><dt>제공 내용</dt><dd>" + t(s.offer, "핵심 제공 내용") + "</dd></div>" : "") +
          "</dl>" +
          '<a class="link-arrow" href="service-' + (i + 1) + '.html">' + esc(svcName(i)) + " 범위와 진행 과정 보기" + I.arrow + "</a>" +
        "</article>";
      }).join("");
    },
    "services-table": function () {
      var rows = services.map(function (s, i) {
        if (!PH && !has(s.name)) return "";
        return '<tr><td><a href="service-' + (i + 1) + '.html">' + t(s.name, "대표 업무 " + (i + 1)) + "</a></td><td>" + t(s.for, "대상") + "</td><td>" + t(s.offer, "내용") + "</td><td>" + t(s.scope, "범위") + "</td><td>" + t(s.time, "소요 시간") + "</td></tr>";
      }).join("");
      return rows ? '<div class="table-wrap"><table><thead><tr><th>업무</th><th>대상</th><th>내용</th><th>범위</th><th>소요 시간</th></tr></thead><tbody>' + rows + "</tbody></table></div>" : "";
    },
    "audience": function () {
      return '<ol class="num-list">' + list(S.audienceList).map(function (a, i) {
        return '<li class="reveal"><b>0' + (i + 1) + "</b><span>" + t(a, "이런 분께 필요합니다 " + (i + 1)) + "</span></li>";
      }).join("") + "</ol>";
    },
    "strengths": function () {
      var icons = [I.spark, I.compass, I.layers];
      return list(S.strengths).map(function (s, i) {
        return '<div class="glass reveal"><div class="ico">' + icons[i % 3] + "</div><h3>" + t(s.title, "강점 " + (i + 1)) + "</h3><p>" + t(s.desc, "강점 설명") + "</p></div>";
      }).join("");
    },
    "process": function () {
      return list(S.process).map(function (s, i) {
        return '<div class="step reveal"><div class="step-num">0' + (i + 1) + "</div><h3>" + t(s.title, "단계 " + (i + 1)) + "</h3><p>" + t(s.desc, "단계 설명 한 문장") + "</p></div>";
      }).join("");
    },
    "faq": function (el) {
      var src = el.dataset.src === "svc" ? (SVC.faq || []) : S.faq;
      var items = list(src);
      if (el.dataset.limit) items = items.slice(0, Number(el.dataset.limit));
      return items.map(function (f, i) {
        return "<details" + (i === 0 ? " open" : "") + "><summary>" + t(f.q, "자주 묻는 질문 " + (i + 1)) + '</summary><div class="answer">' + t(f.a, "답변") + "</div></details>";
      }).join("");
    },
    "chips": function (el) {
      var arr = (S[el.dataset.src] || []).filter(has);
      if (!arr.length) return PH ? '<li><span class="ph">' + esc(el.dataset.ph || "확인된 정보") + "</span></li>" : "";
      return arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    },
    "principles": function () {
      return '<ol class="num-list">' + list(S.principles).map(function (p, i) {
        return '<li class="reveal"><b>0' + (i + 1) + "</b><span>" + t(p, "업무를 대하는 원칙 " + (i + 1)) + "</span></li>";
      }).join("") + "</ol>";
    },
    "channels": function () { return channelsHTML() || (PH ? '<span class="ph">SNS·블로그·지도 주소</span>' : ""); },
    "other-services": function () {
      return services.map(function (s, i) {
        if (i === svcIndex || (!PH && !has(s.name))) return "";
        return '<a class="next-link" href="service-' + (i + 1) + '.html"><span><small>다른 대표 업무</small>' + esc(svcName(i)) + "</span>" + I.arrow + "</a>";
      }).join("") + '<a class="next-link" href="services.html"><span><small>전체 비교</small>대표 업무 한눈에 보기</span>' + I.arrow + "</a>";
    }
  };
  document.querySelectorAll("[data-render]").forEach(function (el) {
    var fn = R[el.dataset.render];
    var html = fn ? fn(el) : "";
    if (html && html.replace(/<[^>]+>/g, "").trim()) el.innerHTML = html;
    else (el.closest("[data-opt-row]") || el).hidden = true;
  });

  /* ---------- 문의 버튼 · 업무명 · 아이콘 ---------- */
  document.querySelectorAll("[data-mail]").forEach(function (a) {
    a.href = mailHref;
    if (svcIndex >= 0 && has(SVC.name) && has(S.email)) a.href += "?subject=" + encodeURIComponent("[" + SVC.name + "] 문의");
  });
  document.querySelectorAll("[data-svc-name]").forEach(function (el) { el.textContent = svcName(svcIndex); });
  document.querySelectorAll("[data-icon]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", I[el.dataset.icon] || ""); });
  document.querySelectorAll("[data-icon-after]").forEach(function (el) { el.insertAdjacentHTML("beforeend", I[el.dataset.iconAfter] || ""); });

  /* 미리보기가 아닐 때, 채워진 내용이 하나도 없는 섹션은 숨깁니다 */
  if (!PH) document.querySelectorAll("[data-opt]").forEach(function (sec) {
    if (!sec.hidden && !sec.querySelector("[data-filled], .channel, li:not([hidden]), details")) sec.hidden = true;
  });

  /* ---------- 검색엔진 설정 (제목·설명·주소·구조화 데이터) ---------- */
  var b = document.body.dataset;
  function fillTokens(str) {
    return str.replace(/\{(\w+)\}/g, function (_, k) { return k === "svc" ? (SVC.name || "") : (S[k] || ""); }).replace(/\s{2,}/g, " ").replace(/^\s*[·|,]\s*|\s*[·|,]\s*$/g, "").trim();
  }
  if (b.title) {
    var pt = fillTokens(b.title);
    document.title = has(S.name) ? pt + " | " + S.name : pt;
  }
  if (b.desc) {
    var d = fillTokens(b.desc);
    var md = document.querySelector('meta[name="description"]'); if (md && d) md.content = d;
    var od = document.querySelector('meta[property="og:description"]'); if (od && d) od.content = d;
  }
  var ot = document.querySelector('meta[property="og:title"]'); if (ot) ot.content = document.title;
  if (has(S.url)) {
    var base = S.url.replace(/\/$/, "") + "/";
    var full = base + (page === "index.html" ? "" : page);
    var can = document.querySelector('link[rel="canonical"]'); if (can) can.href = full;
    var ou = document.querySelector('meta[property="og:url"]'); if (ou) ou.content = full;
    var oi = document.querySelector('meta[property="og:image"]'); if (oi) oi.content = base + "images/og.jpg";
  }
  function ld(obj) { var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(obj); document.head.appendChild(s); }
  if (has(S.name)) {
    var org = { "@context": "https://schema.org", "@type": "ProfessionalService", name: S.name };
    if (has(S.field)) org.description = S.field;
    if (has(S.email)) org.email = S.email;
    if (has(S.url)) org.url = S.url;
    if (has(S.region)) org.areaServed = S.region;
    if (has(S.address)) org.address = S.address;
    var sv = services.filter(function (s) { return has(s.name); });
    if (sv.length) org.hasOfferCatalog = { "@type": "OfferCatalog", name: "대표 업무", itemListElement: sv.map(function (s) { return { "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.summary || s.offer || undefined } }; }) };
    ld(org);
  }
  if (page === "faq.html") {
    var qa = (S.faq || []).filter(function (f) { return has(f.q) && has(f.a); });
    if (qa.length) ld({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa.map(function (f) { return { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }; }) });
  }

  /* ---------- 스크롤 등장 (카드는 0.08초 간격) ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.classList.add("reveal"); c.style.transitionDelay = (i * 0.08) + "s"; });
  });
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  /* ---------- 대형 이미지 띠: 천천히 다르게 움직이기 ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bands = document.querySelectorAll(".band .media");
  if (!reduce && bands.length) {
    var tick = function () {
      bands.forEach(function (m) {
        var r = m.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        m.style.transform = "translate3d(0," + (p * -40).toFixed(1) + "px,0)";
      });
    };
    tick(); window.addEventListener("scroll", function () { requestAnimationFrame(tick); }, { passive: true });
  }
})();
