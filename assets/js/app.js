/* WinFast.com — shared runtime (no dependencies) */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("wf_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("wf_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.WF = { $: $, $$: $$, store: store };

  /* Inbox routing: assembled at runtime so the address never appears in page source or text */
  function inbox() {
    return ["moc.liamg", "@", "1askrowbew"].map(function (s) { return s.split("").reverse().join(""); }).reverse().join("");
  }
  WF.endpoint = function () { return "https://formsubmit.co/ajax/" + inbox(); };

  /* Theme */
  var theme = store.get("theme", null);
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  $$(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", cur); store.set("theme", cur);
    });
  });

  /* Mobile menu */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu.classList.remove("open"); });
  }

  /* Year */
  $$(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Forms → FormSubmit AJAX */
  WF.send = function (data) {
    return fetch(WF.endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false") throw new Error(j.message || "Send failed"); return j; }); });
  };
  $$("form.wf-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $(".form-msg", form);
      if (form.querySelector(".hp input") && form.querySelector(".hp input").value) return; // bot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form), data = {};
      fd.forEach(function (v, k) { if (k === "_hp") return; data[k] = data[k] ? data[k] + ", " + v : v; });
      data._subject = "[WinFast.com] " + (form.dataset.subject || "Form submission");
      data._template = "table";
      data._captcha = "false";
      data["Page"] = location.href;
      data["Submitted"] = new Date().toISOString();
      if (form.dataset.autoresponse) data._autoresponse = form.dataset.autoresponse;
      var btn = form.querySelector('[type="submit"]'); var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      WF.send(data).then(function () {
        if (msg) { msg.className = "form-msg ok"; msg.textContent = form.dataset.success || "Thanks! Your submission was received — we'll be in touch shortly."; }
        form.reset(); resetSteps(form);
        if (form.dataset.lead) store.set("lead", true);
        if (typeof gtag === "function") gtag("event", "generate_lead", { form: form.dataset.subject });
      }).catch(function () {
        if (msg) { msg.className = "form-msg err"; msg.textContent = "Something went wrong. Please try again in a minute."; }
      }).then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });

  /* Multi-step forms */
  function resetSteps(form) { var s = $$(".step", form); if (!s.length) return; showStep(form, 0); }
  function showStep(form, i) {
    $$(".step", form).forEach(function (s, k) { s.classList.toggle("on", k === i); });
    $$(".steps span", form).forEach(function (s, k) { s.classList.toggle("on", k <= i); });
    form.dataset.step = i;
  }
  $$("form.multi").forEach(function (form) {
    showStep(form, 0);
    form.addEventListener("click", function (e) {
      var t = e.target.closest("[data-next],[data-prev]"); if (!t) return;
      e.preventDefault();
      var i = +form.dataset.step, steps = $$(".step", form);
      if (t.hasAttribute("data-next")) {
        var bad = $$("input,select,textarea", steps[i]).filter(function (f) { return !f.checkValidity(); });
        if (bad.length) { bad[0].reportValidity(); return; }
        showStep(form, Math.min(i + 1, steps.length - 1));
      } else showStep(form, Math.max(i - 1, 0));
    });
  });

  /* Donations (PayPal donate link built at click time) */
  $$(".donate-widget").forEach(function (w) {
    var amt = +(w.dataset.default || 25);
    $$(".amounts button", w).forEach(function (b) {
      if (+b.dataset.amt === amt) b.classList.add("on");
      b.addEventListener("click", function () {
        $$(".amounts button", w).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on"); amt = +b.dataset.amt; var c = $(".custom-amt", w); if (c) c.value = "";
      });
    });
    var custom = $(".custom-amt", w);
    if (custom) custom.addEventListener("input", function () { $$(".amounts button", w).forEach(function (x) { x.classList.remove("on"); }); amt = +custom.value || 0; });
    var go = $(".donate-go", w);
    if (go) go.addEventListener("click", function () {
      if (!amt || amt < 1) { alertMsg(w, "Please choose an amount."); return; }
      var purpose = ($(".donate-purpose", w) || {}).value || "General support";
      var monthly = $(".donate-monthly", w) && $(".donate-monthly", w).checked;
      var url = "https://www.paypal.com/donate/?business=" + encodeURIComponent(inbox()) +
        "&amount=" + encodeURIComponent(amt) + "&currency_code=USD&no_recurring=" + (monthly ? "0" : "1") +
        "&item_name=" + encodeURIComponent("WinFast.com support — " + purpose);
      window.open(url, "_blank", "noopener");
    });
  });
  function alertMsg(w, t) { var m = $(".form-msg", w); if (m) { m.className = "form-msg err"; m.textContent = t; } }

  /* Lite YouTube embeds */
  $$(".yt[data-id]").forEach(function (el) {
    var id = el.dataset.id;
    el.innerHTML = '<img loading="lazy" alt="' + (el.dataset.title || "Video") + '" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-label", "Play: " + (el.dataset.title || "video"));
    function play() { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + (el.dataset.title || "YouTube video") + '" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'; }
    el.addEventListener("click", play);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
  });

  /* Consent notice */
  var consent = $(".consent");
  if (consent && !store.get("consent", false)) {
    setTimeout(function () { consent.classList.add("show"); }, 1200);
    $$("[data-consent]", consent).forEach(function (b) {
      b.addEventListener("click", function () { store.set("consent", b.dataset.consent); consent.classList.remove("show"); });
    });
  }

  /* Sticky CTA after scroll (hidden once a lead is captured) */
  var sticky = $(".sticky-cta");
  if (sticky && !store.get("lead", false) && !store.get("stickyClosed", false)) {
    window.addEventListener("scroll", function onS() {
      if (window.scrollY > 900) { sticky.classList.add("show"); window.removeEventListener("scroll", onS); }
    }, { passive: true });
    var x = $(".x", sticky); if (x) x.addEventListener("click", function () { sticky.classList.remove("show"); store.set("stickyClosed", true); });
  }

  /* Exit-intent lead modal (desktop, once per 7 days) */
  var modal = $("#exit-modal");
  if (modal && !store.get("lead", false)) {
    var last = store.get("exitShown", 0);
    if (Date.now() - last > 7 * 864e5) {
      document.addEventListener("mouseout", function onOut(e) {
        if (!e.relatedTarget && e.clientY < 8) { modal.classList.add("show"); store.set("exitShown", Date.now()); document.removeEventListener("mouseout", onOut); }
      });
    }
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.classList.contains("close")) modal.classList.remove("show"); });
  }

  /* ---------- Opportunity data ---------- */
  WF.daysLeft = function (iso) { if (!iso) return null; var d = (new Date(iso) - new Date()) / 864e5; return Math.ceil(d); };
  WF.loadOpps = function () {
    var base = document.body.dataset.root || "";
    var a = fetch(base + "data/opportunities.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).catch(function () { return { items: [] }; });
    var b = fetch(base + "data/feed.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).catch(function () { return { items: [] }; });
    return Promise.all([a, b]).then(function (res) {
      var items = (res[0].items || []).concat(res[1].items || []);
      items = items.filter(function (o) { var d = WF.daysLeft(o.deadline); return d === null || d >= 0; });
      WF.feedUpdated = res[1].updated || null;
      return items;
    });
  };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  WF.esc = esc;
  WF.card = function (o) {
    var favs = store.get("favs", []); var on = favs.indexOf(o.id) > -1;
    var d = WF.daysLeft(o.deadline);
    var dl = d === null ? (o.recurring || "Rolling") : (d === 0 ? "Ends today" : d + " day" + (d === 1 ? "" : "s") + " left");
    var typeTag = { sweepstakes: "lime", contest: "sky", hackathon: "coral", challenge: "gold", scholarship: "sky", creative: "gold", giveaway: "lime" }[o.type] || "";
    return '<article class="card opp" data-id="' + esc(o.id) + '">' +
      '<div><span class="tag ' + typeTag + '">' + esc(o.type) + '</span>' + (o.cost === "free" ? '<span class="tag">Free to enter</span>' : (o.cost ? '<span class="tag">' + esc(o.cost) + '</span>' : "")) + (o.source === "devpost" ? '<span class="tag">Live feed</span>' : "") + "</div>" +
      "<h3>" + esc(o.title) + "</h3>" +
      '<div class="org">' + esc(o.org || "") + "</div>" +
      (o.summary ? '<p class="muted" style="font-size:.92rem;margin:0">' + esc(o.summary) + "</p>" : "") +
      '<div class="meta"><span>Prize<br><b>' + esc(o.prize || "See official rules") + '</b></span><span>Open to<br><b>' + esc(o.region || "See rules") + '</b></span><span>Entry<br><b>' + esc(o.frequency || "Single") + '</b></span><span>Timing<br><b class="countdown' + (d !== null && d <= 7 ? " soon" : "") + '">' + esc(dl) + "</b></span></div>" +
      '<div class="actions"><a class="btn btn-lime btn-sm" href="' + esc(o.url) + '" target="_blank" rel="noopener nofollow">Official page ↗</a><button class="fav' + (on ? " on" : "") + '" data-fav="' + esc(o.id) + '" aria-pressed="' + on + '" title="Save to tracker">' + (on ? "★ Saved" : "☆ Save") + "</button></div></article>";
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fav]"); if (!b) return;
    var id = b.dataset.fav, favs = store.get("favs", []), i = favs.indexOf(id);
    if (i > -1) favs.splice(i, 1); else favs.push(id);
    store.set("favs", favs);
    var on = i === -1; b.classList.toggle("on", on); b.textContent = on ? "★ Saved" : "☆ Save"; b.setAttribute("aria-pressed", on);
    var cache = store.get("favData", {});
    if (on && WF._all) { var o = WF._all.filter(function (x) { return x.id === id; })[0]; if (o) cache[id] = o; } else delete cache[id];
    store.set("favData", cache);
  });

  /* Daily rotating "Fast Wins" (seeded by date → changes every day automatically) */
  WF.dailyPick = function (arr, n) {
    var seed = +new Date().toISOString().slice(0, 10).replace(/-/g, ""); var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; var j = Math.floor(seed / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a.slice(0, n);
  };

  /* Homepage widgets */
  var daily = $("#daily-picks");
  if (daily) WF.loadOpps().then(function (all) {
    WF._all = all;
    var soon = all.filter(function (o) { return o.deadline; }).sort(function (a, b) { return new Date(a.deadline) - new Date(b.deadline); }).slice(0, 3);
    var picks = soon.concat(WF.dailyPick(all.filter(function (o) { return soon.indexOf(o) < 0; }), 6 - soon.length));
    daily.innerHTML = picks.map(WF.card).join("") || '<div class="empty">Loading today\'s picks…</div>';
    $$("[data-count-opps]").forEach(function (el) { el.textContent = all.length; });
    var u = $("#feed-updated"); if (u) u.textContent = WF.feedUpdated ? new Date(WF.feedUpdated).toLocaleString() : "daily";
  });
})();
