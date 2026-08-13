(function () {
  "use strict";

  // ---- Trailer ----
  const trailer = document.getElementById("trailer");
  const trailerFrames = trailer ? trailer.querySelectorAll(".tframe") : [];
  const trailerDots = trailer ? trailer.querySelectorAll(".tdot") : [];
  const trailerSkyline = document.getElementById("trailerSkyline");
  const glitchCode = document.getElementById("glitchCode");
  const trailerHeroA = document.getElementById("trailerHeroA");
  const trailerHeroB = document.getElementById("trailerHeroB");
  const trailerSkipBtn = document.getElementById("trailerSkipBtn");

  let trailerCurrentFrame = 0;
  let trailerHeroLoopRunning = false;
  let trailerFinished = false;
  let trailerAdvanceTimer = null;

  function buildTrailerSkyline() {
    if (!trailerSkyline || trailerSkyline.childElementCount) return;

    const heights = [30, 55, 24, 70, 40, 85, 28, 62, 46, 75, 34, 58];
    let x = 0;

    heights.forEach((h) => {
      const bar = document.createElement("span");
      bar.style.left = x + "px";
      bar.style.width = "34px";
      bar.style.height = h + "px";
      trailerSkyline.appendChild(bar);
      x += 40;
    });
  }

  function buildTrailerGlitch() {
    if (!glitchCode || glitchCode.childElementCount) return;

    const snippets = [
      "01001000 01101001",
      "function thwip(x){",
      "  return x * 2;",
      "}",
      "const bea = 19;",
      "while(true){ love++; }",
      "<hero state='loading'/>",
      "sys.init(webshooter)",
      "> compiling gift.exe",
      "01100010 01100101 01100001",
      "render(heart, x, y)",
      "if(bea.birthday) party();",
      "spidey.sense += 1;",
      "> linking multiverse.dll",
      "class hero extends bae{}",
      "01110000 01110010",
    ];

    const columns = 11;

    for (let i = 0; i < columns; i++) {
      const col = document.createElement("div");
      col.className = "glitch-col";
      col.style.left = (i * (100 / columns)) + "%";
      col.style.animationDuration =
        (2.2 + Math.random() * 2.2).toFixed(2) + "s";
      col.style.animationDelay =
        (-Math.random() * 3).toFixed(2) + "s";

      const lines = 16 + Math.floor(Math.random() * 6);
      let text = "";

      for (let l = 0; l < lines; l++) {
        text += snippets[Math.floor(Math.random() * snippets.length)] + "\n";
      }

      col.textContent = text;
      glitchCode.appendChild(col);
    }
  }

  function runHeroLoop() {
    if (trailerHeroLoopRunning) return;

    trailerHeroLoopRunning = true;

    let ax = -60;
    let bx = -110;

    function step() {
      if (
        !trailer ||
        trailer.classList.contains("hide") ||
        trailerFinished
      ) {
        trailerHeroLoopRunning = false;
        return;
      }

      if (trailerCurrentFrame !== 1) {
        ax = -60;
        bx = -110;
        requestAnimationFrame(step);
        return;
      }

      ax += 4;
      bx += 4;

      const stageWidth = trailer.offsetWidth || 800;

      if (ax > stageWidth + 60) ax = -60;
      if (bx > stageWidth + 60) bx = -110;

      const bobA = Math.sin(ax * 0.04) * 22;
      const bobB = Math.sin(bx * 0.04 + 1) * 18;

      if (trailerHeroA) {
        trailerHeroA.style.transform =
          "translate(" +
          ax +
          "px," +
          bobA +
          "px) rotate(" +
          bobA * 1.4 +
          "deg)";
      }

      if (trailerHeroB) {
        trailerHeroB.style.transform =
          "translate(" +
          bx +
          "px," +
          bobB +
          "px) rotate(" +
          bobB * 1.4 +
          "deg)";
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function showTrailerFrame(i) {
    trailerCurrentFrame = i;

    trailerFrames.forEach((f) => {
      f.classList.toggle("active", Number(f.dataset.f) === i);
    });

    trailerDots.forEach((d) => {
      d.classList.toggle("active", Number(d.dataset.d) === i);
    });
  }

  function finishTrailer() {
    if (trailerFinished) return;

    trailerFinished = true;

    if (trailerAdvanceTimer) {
      clearTimeout(trailerAdvanceTimer);
    }

    if (trailer) {
      trailer.classList.add("hide");

      setTimeout(() => {
        trailer.hidden = true;
        startCharSelect();
      }, 550);
    } else {
      startCharSelect();
    }
  }

  function advanceTrailer() {
    if (trailerFinished) return;

    const next = trailerCurrentFrame + 1;

    if (next >= trailerFrames.length) {
      trailerAdvanceTimer = setTimeout(finishTrailer, 2500);
      return;
    }

    showTrailerFrame(next);

    trailerAdvanceTimer = setTimeout(
      advanceTrailer,
      2500
    );
  }

  function startTrailer() {
    if (!trailer) return;

    buildTrailerSkyline();
    buildTrailerGlitch();

    trailer.hidden = false;
    trailer.classList.remove("hide");

    showTrailerFrame(0);
    runHeroLoop();

    trailerAdvanceTimer = setTimeout(
      advanceTrailer,
      2500
    );
  }

  if (trailerSkipBtn) {
    trailerSkipBtn.addEventListener(
      "click",
      finishTrailer
    );
  }

  if (trailer) {
    trailer.addEventListener("click", (e) => {
      if (e.target === trailerSkipBtn) return;

      if (
        trailerCurrentFrame >=
        trailerFrames.length - 1
      ) {
        finishTrailer();
      }
    });
  }

  // ---- Character select ----
  const charSelect = document.getElementById("charSelect");
  const csGrid = document.getElementById("csGrid");
  const csCallout = document.getElementById("csCallout");

  const csCharacters = [
    { name: "WEB-RED", head: "#ED1D24", body: "#0D3B78" },
    { name: "NOIR", head: "#2b2b2b", body: "#111111" },
    { name: "IRON ARC", head: "#B0141A", body: "#FFC72C" },
    { name: "VENOM-X", head: "#0f0f0f", body: "#1E5FC2" },
    {
      name: "SPIDER-BAE",
      head: "#F4EFE1",
      body: "#D4537E",
      accent: "#7F5AF0",
    },
    { name: "GOLD-WING", head: "#FFC72C", body: "#33404F" },
  ];

  const csTargetIndex = 4;

  function buildCharGrid() {
    if (!csGrid) return [];

    if (csGrid.childElementCount) {
      return Array.from(csGrid.children);
    }

    const cards = [];

    csCharacters.forEach((c) => {
      const card = document.createElement("div");
      card.className = "cs-card";

      const head = document.createElement("span");
      head.className = "cs-card-head";
      head.style.background = c.head;

      if (c.accent) {
        head.style.boxShadow =
          "0 0 0 2px " + c.accent;
      }

      const body = document.createElement("span");
      body.className = "cs-card-body";
      body.style.background = c.body;

      const name = document.createElement("span");
      name.className = "cs-card-name";
      name.textContent = c.name;

      card.appendChild(head);
      card.appendChild(body);
      card.appendChild(name);

      csGrid.appendChild(card);
      cards.push(card);
    });

    return cards;
  }

  function setHighlighted(cards, index) {
    cards.forEach((card, i) => {
      card.classList.toggle(
        "cs-card--highlight",
        i === index
      );
    });
  }

  function runGridSelection(
    cards,
    targetIndex,
    onDone
  ) {
    if (!cards.length) {
      onDone();
      return;
    }

    const total = cards.length;
    const loops = 2;
    const totalSteps =
      loops * total + targetIndex + 1;

    let step = 0;

    function tick() {
      const current = step % total;

      setHighlighted(cards, current);

      step += 1;

      if (step >= totalSteps) {
        onDone();
        return;
      }

      const progress =
        step / totalSteps;

      const delay =
        70 +
        Math.pow(progress, 3) * 260;

      setTimeout(tick, delay);
    }

    tick();
  }

  function finishCharSelect() {
    if (!charSelect) return;

    charSelect.classList.add("hide");

    setTimeout(() => {
      charSelect.hidden = true;
    }, 550);
  }

  function startCharSelect() {
    if (!charSelect || !csGrid || !csCallout) {
      return;
    }

    charSelect.hidden = false;
    charSelect.classList.remove("hide");

    csCallout.textContent = "SELECTING...";
    csCallout.classList.remove("locked");

    const cards = buildCharGrid();

    runGridSelection(
      cards,
      csTargetIndex,
      () => {
        setHighlighted(cards, -1);

        const target = cards[csTargetIndex];

        if (target) {
          target.classList.add("cs-card--locked");
        }

        csCallout.textContent =
          "SPIDER-BAE LOCKED IN";

        csCallout.classList.add("locked");

        setTimeout(
          finishCharSelect,
          2400
        );
      }
    );
  }

  // ---- Boot loader ----
  const bootLoader =
    document.getElementById("bootLoader");

  const bootBarFill =
    document.getElementById("bootBarFill");

  const bootPercent =
    document.getElementById("bootPercent");

  const bootSub =
    document.getElementById("bootSub");

  if (bootLoader) {
    const bootLines = [
      "INITIALIZING WEB-SHOOTERS",
      "CALIBRATING SPIDEY-SENSE",
      "LOADING BEA-VERSE ASSETS",
      "SYNCING WITH THE MULTIVERSE",
    ];

    let lineIndex = 0;
    let progress = 0;

    const minDuration = 5000;
    const start = performance.now();

    let pageLoaded =
      document.readyState === "complete";

    window.addEventListener(
      "load",
      () => {
        pageLoaded = true;
      }
    );

    function tick(now) {
      const elapsed = now - start;

      const timeRatio =
        Math.min(
          elapsed / minDuration,
          1
        );

      const target = pageLoaded
        ? 100
        : Math.min(
            90,
            timeRatio * 90
          );

      progress +=
        (target - progress) * 0.18;

      if (target - progress < 0.3) {
        progress = target;
      }

      const shown = Math.floor(progress);

      bootBarFill.style.width =
        shown + "%";

      bootPercent.textContent =
        String(shown).padStart(2, "0") +
        "%";

      const newLineIndex =
        Math.min(
          bootLines.length - 1,
          Math.floor(
            (shown / 100) *
            bootLines.length
          )
        );

      if (newLineIndex !== lineIndex) {
        lineIndex = newLineIndex;
        bootSub.firstChild.textContent =
          bootLines[lineIndex];
      }

      if (
        progress >= 100 &&
        pageLoaded
      ) {
        setTimeout(
          () =>
            bootLoader.classList.add(
              "hide"
            ),
          350
        );

        setTimeout(() => {
          bootLoader.hidden = true;
          startTrailer();
        }, 900);

        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    bootLoader.addEventListener(
      "click",
      () => {
        if (progress > 60) {
          progress = 100;
        }
      }
    );
  } else {
    startTrailer();
  }

  // ---- Gate / Spidey ----
  const noBtn =
    document.getElementById("noBtn");

  const yesBtn =
    document.getElementById("yesBtn");

  const gate =
    document.getElementById("gate");

  const gateHint =
    document.getElementById("gateHint");

  const spideyCorner =
    document.getElementById("spideyCorner");

  const spideyBubble =
    document.getElementById("spideyBubble");

  const spideyMessages = [
    "Thwip!",
    "Hi, Bea!",
    "Nice catch!",
    "Web-slinging by~",
    "You found me!",
    "Keep reading!",
  ];

  let spideyMsgIndex = 0;

  function pokeSpidey() {
    spideyCorner.classList.remove("popped");

    void spideyCorner.offsetWidth;

    spideyCorner.classList.add("popped");

    spideyBubble.textContent =
      spideyMessages[
        spideyMsgIndex %
          spideyMessages.length
      ];

    spideyMsgIndex += 1;

    spideyBubble.classList.add("show");

    setTimeout(
      () =>
        spideyBubble.classList.remove(
          "show"
        ),
      1400
    );

    setTimeout(
      () =>
        spideyCorner.classList.remove(
          "popped"
        ),
      650
    );
  }

  if (spideyCorner) {
    spideyCorner.addEventListener(
      "click",
      pokeSpidey
    );

    spideyCorner.addEventListener(
      "keydown",
      (e) => {
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          e.preventDefault();
          pokeSpidey();
        }
      }
    );
  }

  const site =
    document.getElementById("site");

  // ---- Notification ----
  const notifBell =
    document.getElementById(
      "notifBell"
    );

  if (notifBell) {
    notifBell.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        notifBell.classList.toggle(
          "active"
        );
      }
    );

    document.addEventListener(
      "click",
      (e) => {
        if (
          !notifBell.contains(
            e.target
          )
        ) {
          notifBell.classList.remove(
            "active"
          );
        }
      }
    );

    function wiggleBell() {
      notifBell.classList.remove(
        "wiggle"
      );

      void notifBell.offsetWidth;

      notifBell.classList.add(
        "wiggle"
      );
    }

    setTimeout(wiggleBell, 1800);
    setInterval(wiggleBell, 9000);
  }

  // ---- Existing No-button behavior ----
  const hints = [
    "hm, it moved.",
    "it seems to be avoiding you.",
    "still no luck.",
    "this button really does not want to be pressed.",
    "okay, this is getting a little silly.",
    "yes is right there, you know.",
    "at this point it's basically exercise.",
  ];

  let dodgeCount = 0;

  function randomPosition() {
    const rect =
      noBtn.getBoundingClientRect();

    const margin = 20;

    const maxX =
      Math.max(
        margin,
        window.innerWidth -
          rect.width -
          margin
      );

    const maxY =
      Math.max(
        margin,
        window.innerHeight -
          rect.height -
          margin
      );

    const x =
      margin +
      Math.random() *
        (maxX - margin);

    const y =
      margin +
      Math.random() *
        (maxY - margin);

    return { x, y };
  }

  function moveNoBtn() {
    const { x, y } =
      randomPosition();

    noBtn.style.left =
      x + "px";

    noBtn.style.top =
      y + "px";
  }

  function evade() {
    dodgeCount += 1;

    if (
      !noBtn.classList.contains(
        "dodging"
      )
    ) {
      const rect =
        noBtn.getBoundingClientRect();

      noBtn.style.left =
        rect.left + "px";

      noBtn.style.top =
        rect.top + "px";

      noBtn.classList.add(
        "dodging"
      );

      requestAnimationFrame(
        moveNoBtn
      );
    } else {
      moveNoBtn();
    }

    gateHint.textContent =
      hints[
        Math.min(
          dodgeCount - 1,
          hints.length - 1
        )
      ];
  }

  noBtn.addEventListener(
    "pointerenter",
    evade
  );

  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      evade();
    },
    { passive: false }
  );

  noBtn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      evade();
    }
  );

  yesBtn.addEventListener(
    "click",
    () => {
      gate.style.transition =
        "opacity 0.6s ease";

      gate.style.opacity = "0";

      setTimeout(() => {
        gate.style.display =
          "none";

        site.hidden = false;

        window.scrollTo({
          top: 0,
          behavior:
            "instant" in window
              ? "instant"
              : "auto",
        });
      }, 600);
    }
  );

  // ---- Modal / Letter ----
  const modalOverlay =
    document.getElementById(
      "modalOverlay"
    );

  const modalTitle =
    document.getElementById(
      "modalTitle"
    );

  const modalBody =
    document.getElementById(
      "modalBody"
    );

  const modalEyebrow =
    document.getElementById(
      "modalEyebrow"
    );

  const modalClose =
    document.getElementById(
      "modalClose"
    );

  const envelope =
    document.getElementById(
      "envelope"
    );

  let letterParagraphs = [];
  let letterIndex = 0;

  function renderLetterStep() {
    if (
      !modalBody ||
      !letterParagraphs.length
    ) {
      return;
    }

    const text =
      letterParagraphs[
        letterIndex
      ] || "";

    modalBody.innerHTML = "";

    const reader =
      document.createElement(
        "div"
      );

    reader.className =
      "letter-reader";

    const paperNote =
      document.createElement(
        "div"
      );

    paperNote.className =
      "letter-note";

    const textEl =
      document.createElement(
        "p"
      );

    textEl.className =
      "letter-reveal-text";

    paperNote.appendChild(
      textEl
    );

    reader.appendChild(
      paperNote
    );

    const controls =
      document.createElement(
        "div"
      );

    controls.className =
      "letter-controls";

    const progress =
      document.createElement(
        "span"
      );

    progress.className =
      "letter-progress";

    progress.textContent =
      (letterIndex + 1) +
      " / " +
      letterParagraphs.length;

    controls.appendChild(
      progress
    );

    const next =
      document.createElement(
        "button"
      );

    next.type = "button";
    next.className =
      "btn btn-yes letter-next";

    next.textContent =
      letterIndex <
      letterParagraphs.length - 1
        ? "Continue ›"
        : "Finish reading ♥";

    controls.appendChild(
      next
    );

    reader.appendChild(
      controls
    );

    modalBody.appendChild(
      reader
    );

    let pos = 0;

    const chars =
      text.split("");

    const typeNext = () => {
      if (
        pos >= chars.length
      ) {
        return;
      }

      textEl.textContent +=
        chars[pos++];

      setTimeout(
        typeNext,
        12
      );
    };

    typeNext();

    next.addEventListener(
      "click",
      () => {
        if (
          letterIndex <
          letterParagraphs.length - 1
        ) {
          letterIndex += 1;
          renderLetterStep();
        } else {
          next.textContent =
            "Read again ↻";

          next.onclick = () => {
            letterIndex = 0;
            renderLetterStep();
          };
        }
      }
    );
  }

  function openLetterModal(
    title,
    body
  ) {
    modalEyebrow.textContent =
      "for you";

    modalTitle.textContent =
      title;

    letterParagraphs =
      String(body || "")
        .split(/\n\s*\n/)
        .map((part) =>
          part.trim()
        )
        .filter(Boolean);

    if (
      !letterParagraphs.length
    ) {
      letterParagraphs = [
        String(body || ""),
      ];
    }

    letterIndex = 0;

    modalOverlay.hidden = false;

    renderLetterStep();
  }

  function openModal(
    eyebrow,
    title,
    body
  ) {
    modalEyebrow.textContent =
      eyebrow;

    modalTitle.textContent =
      title;

    modalBody.textContent =
      body;

    modalOverlay.hidden = false;
  }

  function closeModal() {
    modalOverlay.hidden = true;

    letterParagraphs = [];
    letterIndex = 0;

    if (modalBody) {
      modalBody.innerHTML = "";
    }

    if (envelope) {
      envelope.classList.remove(
        "opening"
      );
    }
  }

  modalClose.addEventListener(
    "click",
    closeModal
  );

  modalOverlay.addEventListener(
    "click",
    (e) => {
      if (
        e.target ===
        modalOverlay
      ) {
        closeModal();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "Escape" &&
        !modalOverlay.hidden
      ) {
        closeModal();
      }
    }
  );

  function fetchContent(type) {
    return fetch(
      `/api/content/${type}`
    ).then((r) => {
      if (!r.ok) {
        throw new Error(
          "failed to load content"
        );
      }

      return r.json();
    });
  }

  envelope.addEventListener(
    "click",
    () => {
      if (
        envelope.classList.contains(
          "opening"
        )
      ) {
        return;
      }

      /*
        IMPORTANT:
        This keeps your existing envelope
        animation exactly as it was.
      */
      envelope.classList.add(
        "opening"
      );

      setTimeout(() => {
        fetchContent("letter")
          .then((data) =>
            openLetterModal(
              data.title,
              data.body
            )
          )
          .catch(() =>
            openLetterModal(
              "For Beatrice",
              "The letter could not be loaded right now — please try again in a moment."
            )
          );
      }, 450);
    }
  );

  // ---- Existing after-game content buttons ----
  document
    .querySelectorAll(
      ".after-game-buttons .btn"
    )
    .forEach((btn) => {
      btn.addEventListener(
        "click",
        () => {
          const type =
            btn.getAttribute(
              "data-content"
            );

          fetchContent(type)
            .then((data) =>
              openModal(
                "for you",
                data.title,
                data.body
              )
            )
            .catch(() =>
              openModal(
                "for you",
                "Hmm",
                "This could not be loaded right now — please try again in a moment."
              )
            );
        }
      );
    });

  const gameStage =
    document.getElementById(
      "gameStage"
    );

  const afterGame =
    document.getElementById(
      "afterGame"
    );

  window.addEventListener(
    "dino:finished",
    () => {
      /*
        Existing Dino completion transition
        remains untouched.
      */
      gameStage.classList.add(
        "fading-out"
      );

      setTimeout(() => {
        gameStage.hidden = true;
        afterGame.hidden = false;
      }, 900);
    }
  );

  // ---- Get to know you mini game ----
  const knowQuestions = [
    {
      q: "Pick the vibe for a perfect free day.",
      options: [
        "Cozy + quiet",
        "Go somewhere new",
        "Stay up way too late",
      ],
      points: [2, 3, 1],
    },

    {
      q: "Choose a side quest.",
      options: [
        "Take cute photos",
        "Play a game",
        "Find a new song",
      ],
      points: [3, 2, 1],
    },

    {
      q: "Which message would make you smile most?",
      options: [
        "I saved this for you.",
        "Look what I found!",
        "You were on my mind.",
      ],
      points: [2, 1, 3],
    },

    {
      q: "Pick a tiny superpower.",
      options: [
        "Pause time",
        "Read minds",
        "Teleport anywhere",
      ],
      points: [3, 2, 1],
    },

    {
      q: "Final choice: how should this little adventure end?",
      options: [
        "With a laugh",
        "With a surprise",
        "With a soft little heart",
      ],
      points: [2, 3, 1],
    },
  ];

  const knowQuestionEl =
    document.getElementById(
      "knowQuestion"
    );

  const knowOptionsEl =
    document.getElementById(
      "knowOptions"
    );

  const knowFeedbackEl =
    document.getElementById(
      "knowFeedback"
    );

  const knowNextBtn =
    document.getElementById(
      "knowNext"
    );

  const knowCountEl =
    document.getElementById(
      "knowQuestionCount"
    );

  const knowScoreEl =
    document.getElementById(
      "knowScore"
    );

  const knowProgressEl =
    document.getElementById(
      "knowProgressFill"
    );

  let knowIndex = 0;
  let knowScore = 0;

  function renderKnowQuestion() {
    if (
      !knowQuestionEl ||
      !knowOptionsEl
    ) {
      return;
    }

    const item =
      knowQuestions[
        knowIndex
      ];

    knowQuestionEl.textContent =
      item.q;

    knowCountEl.textContent =
      "QUESTION " +
      String(
        knowIndex + 1
      ).padStart(2, "0") +
      " / " +
      String(
        knowQuestions.length
      ).padStart(2, "0");

    knowScoreEl.textContent =
      knowScore + " PTS";

    knowProgressEl.style.width =
      (
        (knowIndex /
          knowQuestions.length) *
        100
      ) + "%";

    knowFeedbackEl.textContent =
      "";

    knowNextBtn.hidden =
      true;

    knowOptionsEl.innerHTML =
      "";

    item.options.forEach(
      (option, optionIndex) => {
        const btn =
          document.createElement(
            "button"
          );

        btn.type = "button";
        btn.className =
          "know-option";

        btn.textContent =
          option;

        btn.addEventListener(
          "click",
          () => {
            knowScore +=
              item.points[
                optionIndex
              ];

            knowScoreEl.textContent =
              knowScore + " PTS";

            knowFeedbackEl.textContent =
              optionIndex === 2
                ? "Oooo, interesting choice 👀"
                : "Choice locked in ✦";

            knowOptionsEl
              .querySelectorAll(
                "button"
              )
              .forEach((b) => {
                b.disabled = true;

                b.classList.toggle(
                  "selected",
                  b === btn
                );
              });

            knowNextBtn.hidden =
              false;

            knowNextBtn.textContent =
              knowIndex <
              knowQuestions.length - 1
                ? "Next question ›"
                : "See my result ✦";
          }
        );

        knowOptionsEl.appendChild(
          btn
        );
      }
    );
  }

  if (knowNextBtn) {
    knowNextBtn.addEventListener(
      "click",
      () => {
        if (
          knowIndex <
          knowQuestions.length - 1
        ) {
          knowIndex += 1;
          renderKnowQuestion();
        } else {
          knowProgressEl.style.width =
            "100%";

          knowQuestionEl.textContent =
            "Your tiny result is ready.";

          knowOptionsEl.innerHTML =
            "";

          const result =
            document.createElement(
              "div"
            );

          result.className =
            "know-result";

          result.textContent =
            knowScore >= 12
              ? "CERTIFIED MAIN CHARACTER ✦"
              : knowScore >= 8
              ? "VERY CUTE ENERGY DETECTED ✦"
              : "MYSTERIOUS LITTLE CREATURE UNLOCKED ✦";

          knowOptionsEl.appendChild(
            result
          );

          knowFeedbackEl.textContent =
            "Score: " +
            knowScore +
            " / 15 — now you're ready for the next part.";

          knowNextBtn.textContent =
            "Go to the game ↓";

          knowNextBtn.onclick =
            () => {
              document
                .querySelector(
                  ".game-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

              knowNextBtn.hidden =
                true;
            };
        }
      }
    );
  }

  renderKnowQuestion();

  // ---- Music enhancement ----
  const musicToggle =
    document.getElementById(
      "musicToggle"
    );

  const musicPanel =
    document.getElementById(
      "musicPanel"
    );

  const musicVisualizer =
    document.getElementById(
      "musicVisualizer"
    );

  const musicStatus =
    document.getElementById(
      "musicStatus"
    );

  const musicFocusBtn =
    document.getElementById(
      "musicFocusBtn"
    );

  if (
    musicToggle &&
    musicPanel
  ) {
    musicToggle.addEventListener(
      "click",
      () => {
        const isOpen =
          musicPanel.classList.toggle(
            "open"
          );

        musicToggle.setAttribute(
          "aria-expanded",
          isOpen
            ? "true"
            : "false"
        );

        if (musicVisualizer) {
          musicVisualizer.classList.toggle(
            "active",
            isOpen
          );
        }

        if (musicStatus) {
          musicStatus.textContent =
            isOpen
              ? "MUSIC PLAYER OPEN"
              : "NOW PLAYING FOR YOU";
        }
      }
    );
  }

  if (musicFocusBtn) {
    musicFocusBtn.addEventListener(
      "click",
      () => {
        const active =
          document.body.classList.toggle(
            "music-focus-mode"
          );

        musicFocusBtn.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

        musicFocusBtn.textContent =
          active
            ? "Exit focus mode"
            : "Focus mode";
      }
    );
  }

  // ---- Final ending sequence ----
  const finishExperience =
    document.getElementById(
      "finishExperience"
    );

  const finaleOverlay =
    document.getElementById(
      "finaleOverlay"
    );

  const finaleTitle =
    document.getElementById(
      "finaleTitle"
    );

  const finaleMessage =
    document.getElementById(
      "finaleMessage"
    );

  const finaleEnd =
    document.getElementById(
      "finaleEnd"
    );

  const finaleReplay =
    document.getElementById(
      "finaleReplay"
    );

  function startFinale() {
    if (!finaleOverlay) {
      return;
    }

    finaleOverlay.hidden = false;

    finaleOverlay.classList.remove(
      "finale-live"
    );

    void finaleOverlay.offsetWidth;

    finaleOverlay.classList.add(
      "finale-live"
    );

    document.body.classList.add(
      "finale-active"
    );

    if (finaleTitle) {
      finaleTitle.textContent =
        "YOU MADE IT.";
    }

    if (finaleMessage) {
      finaleMessage.textContent =
        "There is just one last little thing I wanted you to see.";
    }

    if (finaleEnd) {
      finaleEnd.textContent =
        "";
    }

    setTimeout(() => {
      if (finaleTitle) {
        finaleTitle.textContent =
          "THANK YOU FOR PLAYING.";
      }
    }, 1700);

    setTimeout(() => {
      if (finaleMessage) {
        finaleMessage.textContent =
          "I hope this little corner of the internet made you smile, even just a little.";
      }
    }, 3000);

    setTimeout(() => {
      if (finaleEnd) {
        finaleEnd.textContent =
          "THE END ♡";
      }
    }, 4700);
  }

  if (finishExperience) {
    finishExperience.addEventListener(
      "click",
      startFinale
    );
  }

  if (finaleReplay) {
    finaleReplay.addEventListener(
      "click",
      () => {
        window.location.reload();
      }
    );
  }

  // ---- GPS tracker ----
  const gpsButton =
    document.getElementById(
      "gpsButton"
    );

  const gpsOverlay =
    document.getElementById(
      "gpsOverlay"
    );

  const gpsYes =
    document.getElementById(
      "gpsYes"
    );

  const gpsNo =
    document.getElementById(
      "gpsNo"
    );

  function openGpsPopup() {
    gpsOverlay.hidden = false;

    gpsButton.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  function closeGpsPopup() {
    gpsOverlay.hidden = true;

    gpsButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  if (
    gpsButton &&
    gpsOverlay
  ) {
    gpsButton.addEventListener(
      "click",
      openGpsPopup
    );

    gpsOverlay.addEventListener(
      "click",
      (e) => {
        if (
          e.target ===
          gpsOverlay
        ) {
          closeGpsPopup();
        }
      }
    );

    document.addEventListener(
      "keydown",
      (e) => {
        if (
          e.key === "Escape" &&
          !gpsOverlay.hidden
        ) {
          closeGpsPopup();
        }
      }
    );

    gpsYes.addEventListener(
      "click",
      () => {
        window.open(
          "https://spideytracker.net/",
          "_blank",
          "noopener"
        );

        closeGpsPopup();
      }
    );

    gpsNo.addEventListener(
      "click",
      closeGpsPopup
    );
  }

})();
