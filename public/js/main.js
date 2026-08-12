(function () {
  "use strict";

  /* ---------------- Gate: dodging "No" button ---------------- */
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const gate = document.getElementById("gate");
  const gateHint = document.getElementById("gateHint");
  /* ---------------- Spidey corner ---------------- */
  const spideyCorner = document.getElementById("spideyCorner");
  const spideyBubble = document.getElementById("spideyBubble");
  const spideyMessages = ["Thwip!", "Hi, Bea!", "Nice catch!", "Web-slinging by~", "You found me!", "Keep reading!"];
  let spideyMsgIndex = 0;

  function pokeSpidey() {
    spideyCorner.classList.remove("popped");
    void spideyCorner.offsetWidth; // restart the animation
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

  /* ---------------- Notification bell ---------------- */
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
  // Just in case a fast pointer still lands a click, don't let it "work".
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

  /* ---------------- Modal ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalClose = document.getElementById("modalClose");

  function openModal(eyebrow, title, body) {
    modalEyebrow.textContent = eyebrow;
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalOverlay.hidden = false;
  }
  function closeModal() {
    modalOverlay.hidden = true;
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

  /* ---------------- Envelope / letter ---------------- */
  const envelope = document.getElementById("envelope");
  envelope.addEventListener("click", () => {
    fetchContent("letter")
      .then((data) => openModal("for you", data.title, data.body))
      .catch(() =>
        openModal("for you", "For Beatrice", "The letter could not be loaded right now — please try again in a moment.")
      );
  });

  /* ---------------- Post-game buttons ---------------- */
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

  /* ---------------- Dino game finish -> reveal buttons ---------------- */
  const gameStage = document.getElementById("gameStage");
  const afterGame = document.getElementById("afterGame");

  window.addEventListener("dino:finished", () => {
    gameStage.classList.add("fading-out");
    setTimeout(() => {
      gameStage.hidden = true;
      afterGame.hidden = false;
    }, 900);
  });
})();
