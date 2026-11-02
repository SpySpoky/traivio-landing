/* ==========================================================================
   Traivio landing page script
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navbar: scrolled state + mobile menu ---------- */
  var nav = document.querySelector(".nav");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
  }
  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* ---------- Two-option segmented toggles (duration + billing) ---------- */
  function initSegmented(group, onChange) {
    var buttons = group.querySelectorAll("button[role='radio']");
    function select(index, focus) {
      buttons.forEach(function (b, i) {
        var active = i === index;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-checked", String(active));
        b.tabIndex = active ? 0 : -1;
        if (active && focus) b.focus();
      });
      group.classList.toggle("is-second", index === 1);
      onChange(buttons[index]);
    }
    buttons.forEach(function (b, i) {
      b.tabIndex = b.classList.contains("is-active") ? 0 : -1;
      b.addEventListener("click", function () { select(i, false); });
      b.addEventListener("keydown", function (e) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) !== -1) {
          e.preventDefault();
          select(i === 0 ? 1 : 0, true);
        }
      });
    });
  }

  /* ==========================================================================
     Interactive demo: itinerary generator
     ========================================================================== */

  // Each region is one day. Each slot holds options tagged by interest;
  // the option that best matches the selected chips wins.
  var REGIONS = {
    kyrenia: {
      name: "Kyrenia & the north coast",
      slots: [
        { time: "09:00", options: [
          { tags: ["history", "nature"], title: "St. Hilarion Castle", text: "Climb the ridge-top castle early, before the heat. Views over the whole coast." },
          { tags: ["beaches", "nature"], title: "Alagadi Turtle Beach", text: "A quiet morning swim on the protected turtle nesting beach. Nests are taped off in summer." },
          { tags: ["food"], title: "Kyrenia Harbour", text: "Breakfast by the boats: simit, hellim and a strong Turkish coffee." },
          { tags: ["gems"], title: "Karmi village", text: "Cobbled lanes, bougainvillea and artists' studios hidden in the hills above the coast." }
        ]},
        { time: "12:30", options: [
          { tags: ["history", "food"], title: "Bellapais Abbey", text: "Gothic cloisters, then lunch in the village square under the Tree of Idleness." },
          { tags: ["food", "gems"], title: "Village meze in Bellapais", text: "A long, lazy meze lunch at a family taverna with a view down to the sea." },
          { tags: ["beaches"], title: "Escape Beach", text: "Sunbeds, calm turquoise water and a beach-bar lunch west of Kyrenia." },
          { tags: ["nature"], title: "Five Finger Mountains viewpoint", text: "A picnic stop on the Beşparmak ridge, with wild herbs and big skies." }
        ]},
        { time: "15:30", options: [
          { tags: ["beaches", "nature"], title: "Alagadi Turtle Beach", text: "Two sandy coves, clear water and green turtles nesting from May to October." },
          { tags: ["history"], title: "Kyrenia Castle & Shipwreck Museum", text: "Explore the Venetian bastions and a 2,300-year-old merchant ship." },
          { tags: ["gems", "beaches"], title: "Secret cove near Esentepe", text: "A rocky inlet locals swim at. Bring water shoes and snacks." },
          { tags: ["food"], title: "Kyrenia Harbour backstreets", text: "Lokum, fresh orange juice and a stroll through the old market lanes." }
        ]},
        { time: "19:30", options: [
          { tags: ["nightlife"], title: "Kyrenia Harbour at night", text: "Sunset drinks on the waterfront, then live music in the bars along the harbour." },
          { tags: ["food"], title: "Fish dinner at Kyrenia Harbour", text: "Catch of the day grilled over charcoal, with the castle lit up beside you." },
          { tags: ["gems", "nature"], title: "Bellapais sunset lookout", text: "Watch the sun drop behind the coastline from the abbey terraces." }
        ]}
      ]
    },
    famagusta: {
      name: "Famagusta & Salamis",
      slots: [
        { time: "09:00", options: [
          { tags: ["history"], title: "Salamis ruins", text: "Roman gymnasium, marble columns and an amphitheatre by the sea. Go early." },
          { tags: ["beaches", "nature"], title: "Salamis Bay beach", text: "Soft sand and shallow water right next to the ancient city." },
          { tags: ["gems"], title: "St. Barnabas Monastery", text: "A peaceful monastery with icons and a small archaeology museum. Few crowds." }
        ]},
        { time: "12:30", options: [
          { tags: ["history"], title: "Famagusta old town", text: "Walk the Venetian walls and see the Lala Mustafa Pasha Mosque, a Gothic cathedral turned mosque." },
          { tags: ["food"], title: "Lunch in Famagusta old town", text: "Kebab and fresh lemonade on Namık Kemal Square, then baklava for dessert." }
        ]},
        { time: "15:30", options: [
          { tags: ["history", "gems"], title: "Othello Castle", text: "The citadel that inspired Shakespeare's Othello, with harbour views from the ramparts." },
          { tags: ["beaches"], title: "Glapsides Beach", text: "A long, lively sandy beach just north of the old town. Perfect for an afternoon dip." },
          { tags: ["nature"], title: "Salamis forest walk", text: "Shady pine trails between the ruins and the bay." }
        ]},
        { time: "19:30", options: [
          { tags: ["nightlife"], title: "Old town bars", text: "Cocktails inside medieval stone courtyards around the cathedral square." },
          { tags: ["food"], title: "Meze night in Famagusta", text: "Twenty little plates of local flavour. Pace yourself, there's always more." },
          { tags: ["gems"], title: "Walled city at dusk", text: "The ramparts glow gold after sunset. Locals stroll, tourists rarely know." }
        ]}
      ]
    },
    karpaz: {
      name: "Karpaz Peninsula",
      slots: [
        { time: "09:00", options: [
          { tags: ["history", "gems"], title: "Kantara Castle", text: "The quietest of the three mountain castles, with views of both coasts at once." },
          { tags: ["nature"], title: "Drive the Karpaz coast road", text: "Wild donkeys, olive groves and empty bays. Stop wherever looks good." }
        ]},
        { time: "12:30", options: [
          { tags: ["food", "gems"], title: "Dipkarpaz village lunch", text: "Home-cooked molehiya and village bread at a tiny family restaurant." },
          { tags: ["history"], title: "Agios Philon church", text: "A ruined basilica on a lonely beach with Roman mosaics underfoot." }
        ]},
        { time: "15:00", options: [
          { tags: ["beaches", "nature"], title: "Golden Beach (Altınkum)", text: "Miles of untouched dunes and clear water. Easily the island's most beautiful beach." },
          { tags: ["history"], title: "Apostolos Andreas Monastery", text: "A pilgrimage site near the very tip of the island." }
        ]},
        { time: "19:00", options: [
          { tags: ["nature", "gems"], title: "Cape Apostolos Andreas", text: "Sunset at the island's end, then some of the darkest skies in Cyprus for stargazing." },
          { tags: ["food"], title: "Bungalow dinner at Golden Beach", text: "Grilled fish and cold drinks with your toes in the sand." }
        ]}
      ]
    },
    nicosia: {
      name: "Nicosia (Lefkoşa) old town",
      slots: [
        { time: "09:30", options: [
          { tags: ["history", "food"], title: "Büyük Han", text: "A 16th-century Ottoman caravanserai. Have coffee in the courtyard, then browse the craft shops." },
          { tags: ["history"], title: "Selimiye Mosque", text: "The former St. Sophia Cathedral, with Gothic arches and minarets side by side." }
        ]},
        { time: "12:30", options: [
          { tags: ["food"], title: "Bandabuliya market", text: "The covered municipal market: halloumi, spices, şeftali kebab and fresh juice." },
          { tags: ["gems"], title: "Arasta bazaar lanes", text: "Tiny workshops, copperware and backstreet cafés where locals linger." }
        ]},
        { time: "15:00", options: [
          { tags: ["history"], title: "Venetian walls & Kyrenia Gate", text: "Walk the star-shaped walls that still ring the old city." },
          { tags: ["gems"], title: "Samanbahçe quarter", text: "Colourful 1918 terraced houses around a shared fountain. A photographer's secret." },
          { tags: ["nature"], title: "Five Finger Mountains drive", text: "Head north over the Beşparmak range for golden-hour views of the coast." }
        ]},
        { time: "19:30", options: [
          { tags: ["nightlife", "gems"], title: "Arabahmet quarter bars", text: "Restored Ottoman houses turned into candle-lit bars and live-music spots." },
          { tags: ["food"], title: "Dinner near Selimiye Square", text: "Lahmacun, cold ayran and the mosque lit up above you." }
        ]}
      ]
    }
  };

  var INTEREST_LABELS = {
    beaches: "beaches", history: "history", food: "food",
    nightlife: "nightlife", nature: "nature", gems: "hidden gems"
  };

  function score(option, interests) {
    return option.tags.reduce(function (n, t) { return n + (interests.indexOf(t) !== -1 ? 1 : 0); }, 0);
  }

  // Pick the best option for each slot. Ties go to the first listed option,
  // which is the classic pick for that time of day. A place is never visited twice.
  function buildDay(regionKey, interests) {
    var region = REGIONS[regionKey];
    var used = {};
    var stops = region.slots.map(function (slot) {
      var fresh = slot.options.filter(function (o) { return !used[o.title]; });
      var candidates = fresh.length ? fresh : slot.options;
      var best = candidates[0], bestScore = -1;
      candidates.forEach(function (o) {
        var s = score(o, interests);
        if (s > bestScore) { best = o; bestScore = s; }
      });
      used[best.title] = true;
      return { time: slot.time, title: best.title, text: best.text };
    });
    return { region: region.name, stops: stops };
  }

  function regionScore(regionKey, interests) {
    return REGIONS[regionKey].slots.reduce(function (sum, slot) {
      return sum + Math.max.apply(null, slot.options.map(function (o) { return score(o, interests); }));
    }, 0);
  }

  function buildItinerary(interests, days) {
    if (days === 1) {
      // Choose the region that best fits the selected interests. Kyrenia wins ties.
      var order = ["kyrenia", "famagusta", "karpaz", "nicosia"];
      var best = order[0];
      order.forEach(function (k) {
        if (regionScore(k, interests) > regionScore(best, interests)) best = k;
      });
      return [buildDay(best, interests)];
    }
    // 3 days: north coast, then east, then whichever fits better of Karpaz or Nicosia.
    var third = regionScore("karpaz", interests) >= regionScore("nicosia", interests) ? "karpaz" : "nicosia";
    if (interests.length === 0) third = "nicosia";
    return ["kyrenia", "famagusta", third].map(function (k) { return buildDay(k, interests); });
  }

  function describeInterests(interests) {
    if (!interests.length) return "a bit of everything";
    var labels = interests.map(function (i) { return INTEREST_LABELS[i]; });
    if (labels.length === 1) return labels[0];
    return labels.slice(0, -1).join(", ") + " & " + labels[labels.length - 1];
  }

  /* ---------- Demo UI ---------- */
  var chips = document.querySelectorAll("#chips .chip");
  var durationGroup = document.getElementById("duration");
  var generateBtn = document.getElementById("generate");
  var output = document.getElementById("demo-output");
  var selectedDays = 1;
  var runId = 0;

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", String(on));
    });
  });

  initSegmented(durationGroup, function (btn) {
    selectedDays = parseInt(btn.getAttribute("data-days"), 10);
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Types text into a node one character at a time. Stops early if a newer run started.
  function typeInto(node, text, id, speed) {
    if (prefersReducedMotion) { node.textContent = text; return Promise.resolve(); }
    var cursor = el("span", "cursor");
    cursor.setAttribute("aria-hidden", "true");
    var textNode = document.createTextNode("");
    node.appendChild(textNode);
    node.appendChild(cursor);
    var i = 0;
    return new Promise(function (resolve) {
      (function step() {
        if (id !== runId) { resolve(); return; }
        // Type a couple of characters per tick to keep long plans snappy
        i = Math.min(text.length, i + 3);
        textNode.nodeValue = text.slice(0, i);
        if (i < text.length) {
          setTimeout(step, speed);
        } else {
          cursor.remove();
          resolve();
        }
      })();
    });
  }

  async function renderItinerary(plan, interests, days, id) {
    output.innerHTML = "";
    output.setAttribute("aria-busy", "true");

    var intro = el("div", "it__intro");
    var avatar = el("span", "chat__avatar", "T");
    avatar.setAttribute("aria-hidden", "true");
    var introText = el("p");
    intro.appendChild(avatar);
    intro.appendChild(introText);
    output.appendChild(intro);

    var lead = "Here's your " + (days === 1 ? "1-day" : "3-day") + " North Cyprus plan, built around " +
      describeInterests(interests) + ". 🌊";
    await typeInto(introText, lead, id, 18);

    for (var d = 0; d < plan.length; d++) {
      if (id !== runId) return;
      var day = plan[d];
      var card = el("section", "it__day");
      var h = el("h3");
      h.appendChild(document.createTextNode("Day " + (d + 1) + " "));
      h.appendChild(el("span", "tag tag--teal", day.region));
      card.appendChild(h);
      var list = el("ol", "it__stops");
      card.appendChild(list);
      output.appendChild(card);

      for (var s = 0; s < day.stops.length; s++) {
        if (id !== runId) return;
        var stop = day.stops[s];
        var li = el("li", "it__stop");
        li.appendChild(el("span", "it__time", stop.time));
        var body = el("div");
        body.appendChild(el("b", null, stop.title));
        var txt = el("span", "it__text");
        body.appendChild(txt);
        li.appendChild(body);
        list.appendChild(li);
        output.scrollTop = output.scrollHeight;
        await typeInto(txt, stop.text, id, 12);
        if (!prefersReducedMotion) await wait(120);
      }
    }

    if (id !== runId) return;
    var outro = el("p", "demo__hint");
    outro.style.marginTop = "4px";
    outro.textContent = "In the app you can chat to swap any stop, change the pace or add dinner bookings.";
    output.appendChild(outro);
    output.setAttribute("aria-busy", "false");
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span aria-hidden="true">🔁</span> Generate again';
  }

  generateBtn.addEventListener("click", function () {
    var interests = [];
    chips.forEach(function (c) {
      if (c.getAttribute("aria-pressed") === "true") interests.push(c.getAttribute("data-interest"));
    });
    var plan = buildItinerary(interests, selectedDays);
    runId += 1;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span aria-hidden="true">⏳</span> Planning…';
    renderItinerary(plan, interests, selectedDays, runId);
  });

  /* ---------- Pricing toggle ---------- */
  var proPrice = document.getElementById("pro-price");
  var proPer = document.getElementById("pro-per");
  var proNote = document.getElementById("pro-note");
  var PRICES = {
    monthly: { amount: "€4.99", per: "/ month", note: "Billed monthly. Cancel anytime." },
    yearly: { amount: "€29.99", per: "/ year", note: "Just €2.50 a month, billed yearly." }
  };
  initSegmented(document.getElementById("billing"), function (btn) {
    var p = PRICES[btn.getAttribute("data-period")];
    if (proPrice.textContent === p.amount) return;
    proPrice.textContent = p.amount;
    proPer.textContent = p.per;
    proNote.textContent = p.note;
    proPrice.classList.remove("is-changing");
    void proPrice.offsetWidth; // restart the animation
    proPrice.classList.add("is-changing");
  });

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqButtons = document.querySelectorAll(".faq__q");
  faqButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      faqButtons.forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        other.closest(".faq__item").classList.remove("is-open");
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
        btn.closest(".faq__item").classList.add("is-open");
      }
    });
  });

  /* ---------- Waitlist form ---------- */
  var form = document.getElementById("waitlist-form");
  var emailInput = document.getElementById("email");
  var errorEl = document.getElementById("email-error");
  var successEl = document.getElementById("waitlist-success");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(msg) {
    errorEl.textContent = msg;
    form.classList.add("has-error");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
  }

  emailInput.addEventListener("input", function () {
    if (form.classList.contains("has-error")) {
      errorEl.textContent = "";
      form.classList.remove("has-error");
      emailInput.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = emailInput.value.trim();
    if (!value) return showError("Please enter your email address.");
    if (!EMAIL_RE.test(value)) return showError("That email doesn't look right. Try something like you@example.com.");

    document.getElementById("success-email").textContent = value;
    form.hidden = true;
    form.classList.remove("has-error");
    errorEl.textContent = "";
    successEl.hidden = false;
    successEl.focus();
  });

  /* ==========================================================================
     Visual effects
     ========================================================================== */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;
  var hero = document.querySelector(".hero");

  // Kick off the hero entrance: copy rises, Cyprus outline draws itself
  requestAnimationFrame(function () { hero.classList.add("is-loaded"); });

  /* ---------- Hero phone: chat messages appear one by one ---------- */
  var chatBody = document.getElementById("chat-body");
  var typing = chatBody.querySelector('[data-chat="typing"]');
  var msgs = [0, 1, 2, 3].map(function (i) { return chatBody.querySelector('[data-chat="' + i + '"]'); });
  function show(n) { n.classList.add("is-shown"); }
  function hide(n) { n.classList.remove("is-shown"); }

  if (prefersReducedMotion) {
    msgs.forEach(show);
  } else {
    var chatScript = [
      [900, function () { show(msgs[0]); }],
      [700, function () { show(typing); }],
      [1600, function () { hide(typing); show(msgs[1]); }],
      [1900, function () { show(msgs[2]); }],
      [600, function () { chatBody.insertBefore(typing, msgs[3]); show(typing); }],
      [1500, function () { hide(typing); show(msgs[3]); }]
    ];
    (function next(i) {
      if (i >= chatScript.length) return;
      setTimeout(function () { chatScript[i][1](); next(i + 1); }, chatScript[i][0]);
    })(0);
  }

  /* ---------- Scroll reveal: fade + slide up, staggered within grids ---------- */
  if (hasIO && !prefersReducedMotion) {
    var revealTargets = document.querySelectorAll(
      ".section__head, .stat, .step, .demo, .dest, .feature, .billing, .plan-card, .faq__item, .cta__box, .footer__inner, .footer__bottom"
    );
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(function (t) {
      // Stagger revealed siblings (cards in a grid, FAQ rows, stats)
      var siblings = Array.prototype.filter.call(t.parentNode.children, function (c) {
        return Array.prototype.indexOf.call(revealTargets, c) !== -1;
      });
      var index = siblings.length > 1 ? siblings.indexOf(t) : 0;
      t.classList.add("reveal");
      t.style.transitionDelay = Math.min(index, 5) * 90 + "ms";
      // Once revealed, hand transitions back to the element's own hover styles
      t.addEventListener("transitionend", function done(e) {
        if (e.target !== t || e.propertyName !== "opacity") return;
        t.classList.remove("reveal", "is-visible");
        t.style.transitionDelay = "";
        t.removeEventListener("transitionend", done);
      });
      revealIO.observe(t);
    });
  }

  /* ---------- Stats strip: count up when visible ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  function formatStat(node, value) {
    return (node.getAttribute("data-prefix") || "") + value + (node.getAttribute("data-suffix") || "");
  }
  function countUp(node) {
    var end = parseInt(node.getAttribute("data-count"), 10);
    var duration = 1600, startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var p = Math.min(1, (now - startTime) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = formatStat(node, Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (hasIO && !prefersReducedMotion) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterIO.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) {
      c.textContent = formatStat(c, 0);
      counterIO.observe(c);
    });
  }

  /* ---------- Mouse effects: desktop pointers only, never with reduced motion ---------- */
  if (finePointer && !prefersReducedMotion) {
    var cursorGlow = el("div", "cursor-glow");
    cursorGlow.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorGlow);

    var heroVisual = document.getElementById("hero-visual");
    var phoneTilt = document.getElementById("phone-tilt");
    var glare = document.querySelector(".phone__glare");
    var floatChips = Array.prototype.map.call(document.querySelectorAll(".float-chip"), function (c) {
      return { node: c, depth: parseFloat(c.getAttribute("data-depth")) || 1 };
    });

    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var glowPos = { x: mouse.x, y: mouse.y };
    var target = { x: 0, y: 0, px: 0, py: 0 };   // x/y: viewport-relative, px/py: phone-relative
    var current = { x: 0, y: 0, px: 0, py: 0 };
    var heroInView = true;
    var running = false;

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        heroInView = entries[0].isIntersecting;
      }).observe(hero);
    }

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      target.x = e.clientX / window.innerWidth * 2 - 1;
      target.y = e.clientY / window.innerHeight * 2 - 1;
      if (heroInView) {
        var r = heroVisual.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        target.px = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
        target.py = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      }
      cursorGlow.classList.add("is-active");
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      cursorGlow.classList.remove("is-active");
    });

    function frame() {
      var k = 0.08;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.px += (target.px - current.px) * k;
      current.py += (target.py - current.py) * k;
      glowPos.x += (mouse.x - glowPos.x) * 0.2;
      glowPos.y += (mouse.y - glowPos.y) * 0.2;

      cursorGlow.style.transform = "translate3d(" + glowPos.x.toFixed(1) + "px," + glowPos.y.toFixed(1) + "px,0)";

      if (heroInView) {
        // Phone turns to face the cursor
        phoneTilt.style.transform = "rotateY(" + (current.px * 14).toFixed(2) + "deg) rotateX(" + (-current.py * 10).toFixed(2) + "deg)";
        glare.style.setProperty("--gx", (current.px * 90).toFixed(1) + "px");
        glare.style.setProperty("--gy", (current.py * 140).toFixed(1) + "px");
        glare.style.setProperty("--go", "1");
        // Chips drift against the cursor; deeper chips move more
        floatChips.forEach(function (c) {
          c.node.style.transform = "translate3d(" + (-current.x * 22 * c.depth).toFixed(1) + "px," + (-current.y * 16 * c.depth).toFixed(1) + "px,0)";
        });
      }

      var settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001 &&
        Math.abs(target.px - current.px) < 0.001 && Math.abs(target.py - current.py) < 0.001 &&
        Math.abs(mouse.x - glowPos.x) < 0.5 && Math.abs(mouse.y - glowPos.y) < 0.5;
      if (settled) running = false;
      else requestAnimationFrame(frame);
    }

    /* Destination cards: 3D tilt with a light reflection that follows the cursor */
    document.querySelectorAll(".dest").forEach(function (card) {
      var shine = el("span", "dest__shine");
      shine.setAttribute("aria-hidden", "true");
      card.appendChild(shine);
      var px = 0.5, py = 0.5, w = 0, h = 0, raf = 0;

      function apply() {
        raf = 0;
        if (!card.classList.contains("is-tilting")) return;
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 12).toFixed(2) + "deg) rotateY(" +
          ((px - 0.5) * 14).toFixed(2) + "deg) translate3d(0,-6px,0)";
        shine.style.transform = "translate3d(" + (px * w).toFixed(1) + "px," + (py * h).toFixed(1) + "px,0)";
      }
      card.addEventListener("mousemove", function (e) {
        if (card.classList.contains("reveal")) return; // let the reveal finish first
        var r = card.getBoundingClientRect();
        w = r.width; h = r.height;
        px = (e.clientX - r.left) / w;
        py = (e.clientY - r.top) / h;
        card.classList.add("is-tilting");
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }
})();
