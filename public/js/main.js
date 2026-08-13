(function () {
  "use strict";

  // ---- Trailer ----
  const trailer = document.getElementById("trailer");
  const trailerFrames = trailer ? trailer.querySelectorAll(".tframe") : [];
  const trailerDots = trailer ? trailer.querySelectorAll(".tdot") : [];
  const trailerSkyline = document.getElementById("trailerSkyline");
  const trailerHeart = document.getElementById("trailerHeart");
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

  function buildTrailerHeart() {
    if (!trailerHeart || trailerHeart.childElementCount) return;
    const pattern = [
      0,1,1,0,1,1,0,0,
      1,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,0,
      0,1,1,1,1,1,0,0,
      0,0,1,1,1,0,0,0,
      0,0,0,1,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0
    ];
    pattern.forEach((p) => {
      const cell = document.createElement("span");
      cell.style.background = p ? "#ED1D24" : "transparent";
      trailerHeart.appendChild(cell);
    });
  }

  function runHeroLoop() {
    if (trailerHeroLoopRunning) return;
    trailerHeroLoopRunning = true;
    let ax = -60;
    let bx = -110;

    function step() {
      if (!trailer || trailer.classList.contains("hide") || trailerFinished) {
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
        trailerHeroA.style.transform = "translate(" + ax + "px," + bobA + "px) rotate(" + (bobA * 1.4) + "deg)";
      }
      if (trailerHeroB) {
        trailerHeroB.style.transform = "translate(" + bx + "px," + bobB + "px) rotate(" + (bobB * 1.4) + "deg)";
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
    if (trailerAdvanceTimer) clearTimeout(trailerAdvanceTimer);
    if (trailer) {
      trailer.classList.add("hide");
      setTimeout(() => { trailer.hidden = true; }, 550);
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
    trailerAdvanceTimer = setTimeout(advanceTrailer, 2500);
  }

  function startTrailer() {
    if (!trailer) return;
    buildTrailerSkyline();
    buildTrailerHeart();
    trailer.hidden = false;
    trailer.classList.remove("hide");
    showTrailerFrame(0);
    runHeroLoop();
    trailerAdvanceTimer = setTimeout(advanceTrailer, 2500);
  }

  if (trailerSkipBtn) {
    trailerSkipBtn.addEventListener("click", finishTrailer);
  }
  if (trailer) {
    trailer.addEventListener("click", (e) => {
      if (e.target === trailerSkipBtn) return;
      if (trailerCurrentFrame >= trailerFrames.length - 1) finishTrailer();
    });
  }

  // ---- Boot loader ----
  const bootLoader = document.getElementById("bootLoader");
  const bootBarFill = document.getElementById("bootBarFill");
  const bootPercent = document.getElementById("bootPercent");
  const bootSub = document.getElementById("bootSub");

  if (bootLoader) {
    const bootLines = [
      "INITIALIZING WEB-SHOOTERS",
      "CALIBRATING SPIDEY-SENSE",
      "LOADING BEA-VERSE ASSETS",
      "SYNCING WITH THE MULTIVERSE",
    ];
    let lineIndex = 0;
    let progress = 0;
    const minDuration = 5000; // ms — full pixel boot-up sequence
    const start = performance.now();
    let pageLoaded = document.readyState === "complete";
    window.addEventListener("load", () => { pageLoaded = true; });

    function tick(now) {
      const elapsed = now - start;
      const timeRatio = Math.min(elapsed / minDuration, 1);
      const target = pageLoaded ? 100 : Math.min(90, timeRatio * 90);
      progress += (target - progress) * 0.18;
      if (target - progress < 0.3) progress = target;

      const shown = Math.floor(progress);
      bootBarFill.style.width = shown + "%";
      bootPercent.textContent = String(shown).padStart(2, "0") + "%";

      const newLineIndex = Math.min(
        bootLines.length - 1,
        Math.floor((shown / 100) * bootLines.length)
      );
      if (newLineIndex !== lineIndex) {
        lineIndex = newLineIndex;
        bootSub.firstChild.textContent = bootLines[lineIndex];
      }

      if (progress >= 100 && pageLoaded) {
        setTimeout(() => bootLoader.classList.add("hide"), 350);
        setTimeout(() => {
          bootLoader.hidden = true;
          startTrailer();
        }, 900);
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    bootLoader.addEventListener("click", () => {
      if (progress > 60) {
        progress = 100;
      }
    });
  } else {
    startTrailer();
  }

  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const gate = document.getElementById("gate");
  const gateHint = document.getElementById("gateHint");
  const spideyCorner = document.getElementById("spideyCorner");
  const spideyBubble = document.getElementById("spideyBubble");
  const spideyMessages = ["Thwip!", "Hi, Bea!", "Nice catch!", "Web-slinging by~", "You found me!", "Keep reading!"];
  let spideyMsgIndex = 0;

  function pokeSpidey() {
    spideyCorner.classList.remove("popped");
    void spideyCorner.offsetWidth;
    spideyCorner.classList.add("popped");
    spideyBubble.textContent = spideyMessages[spideyMsgIndex % spideyMessages.length];
    spideyMsgIndex += 1;
    spideyBubble.classList.add("show");
    setTimeout(() => spideyBubble.classList.remove("show"), 1400);
    setTimeout(() => spideyCorner.classList.remove("popped"), 650);
  }

  if (spideyCorner) {
    spideyCorner.addEventListener("click", pokeSpidey);
    spideyCorner.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pokeSpidey();
      }
    });
  }

  const site = document.getElementById("site");

  const notifBell = document.getElementById("notifBell");
  if (notifBell) {
    notifBell.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      notifBell.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!notifBell.contains(e.target)) {
        notifBell.classList.remove("active");
      }
    });

    function wiggleBell() {
      notifBell.classList.remove("wiggle");
      void notifBell.offsetWidth;
      notifBell.classList.add("wiggle");
    }
    setTimeout(wiggleBell, 1800);
    setInterval(wiggleBell, 9000);
  }

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
    const rect = noBtn.getBoundingClientRect();
    const margin = 20;
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    return { x, y };
  }

  function moveNoBtn() {
    const { x, y } = randomPosition();
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }

  function evade() {
    dodgeCount += 1;
    if (!noBtn.classList.contains("dodging")) {
      const rect = noBtn.getBoundingClientRect();
      noBtn.style.left = rect.left + "px";
      noBtn.style.top = rect.top + "px";
      noBtn.classList.add("dodging");
      requestAnimationFrame(moveNoBtn);
    } else {
      moveNoBtn();
    }
    gateHint.textContent = hints[Math.min(dodgeCount - 1, hints.length - 1)];
  }

  noBtn.addEventListener("pointerenter", evade);
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    evade();
  }, { passive: false });
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    evade();
  });

  yesBtn.addEventListener("click", () => {
    gate.style.transition = "opacity 0.6s ease";
    gate.style.opacity = "0";
    setTimeout(() => {
      gate.style.display = "none";
      site.hidden = false;
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }, 600);
  });

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalClose = document.getElementById("modalClose");
  const envelope = document.getElementById("envelope");

  function openModal(eyebrow, title, body) {
    modalEyebrow.textContent = eyebrow;
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalOverlay.hidden = false;
  }
  function closeModal() {
    modalOverlay.hidden = true;
    if (envelope) envelope.classList.remove("opening");
  }
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalOverlay.hidden) closeModal();
  });

  function fetchContent(type) {
    return fetch(`/api/content/${type}`).then((r) => {
      if (!r.ok) throw new Error("failed to load content");
      return r.json();
    });
  }

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("opening")) return;
    envelope.classList.add("opening");
    setTimeout(() => {
      fetchContent("letter")
        .then((data) => openModal("for you", data.title, data.body))
        .catch(() =>
          openModal("for you", "For Beatrice", "The letter could not be loaded right now — please try again in a moment.")
        );
    }, 450);
  });

  document.querySelectorAll(".after-game-buttons .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-content");
      fetchContent(type)
        .then((data) => openModal("for you", data.title, data.body))
        .catch(() =>
          openModal("for you", "Hmm", "This could not be loaded right now — please try again in a moment.")
        );
    });
  });

  const gameStage = document.getElementById("gameStage");
  const afterGame = document.getElementById("afterGame");

  window.addEventListener("dino:finished", () => {
    gameStage.classList.add("fading-out");
    setTimeout(() => {
      gameStage.hidden = true;
      afterGame.hidden = false;
    }, 900);
  });

  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  if (musicToggle && musicPanel) {
    musicToggle.addEventListener("click", () => {
      const isOpen = musicPanel.classList.toggle("open");
      musicToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  const gpsButton = document.getElementById("gpsButton");
  const gpsOverlay = document.getElementById("gpsOverlay");
  const gpsYes = document.getElementById("gpsYes");
  const gpsNo = document.getElementById("gpsNo");

  function openGpsPopup() {
    gpsOverlay.hidden = false;
    gpsButton.setAttribute("aria-expanded", "true");
  }
  function closeGpsPopup() {
    gpsOverlay.hidden = true;
    gpsButton.setAttribute("aria-expanded", "false");
  }

  if (gpsButton && gpsOverlay) {
    gpsButton.addEventListener("click", openGpsPopup);
    gpsOverlay.addEventListener("click", (e) => {
      if (e.target === gpsOverlay) closeGpsPopup();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !gpsOverlay.hidden) closeGpsPopup();
    });
    gpsYes.addEventListener("click", () => {
      window.open("https://spideytracker.net/", "_blank", "noopener");
      closeGpsPopup();
    });
    gpsNo.addEventListener("click", closeGpsPopup);
  }

})();
