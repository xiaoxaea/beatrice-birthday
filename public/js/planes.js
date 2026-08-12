(function () {
  "use strict";

  const layer = document.getElementById("planesLayer");
  if (!layer) return;

  const PLANE_IDS = ["hero-1", "hero-2", "hero-3", "hero-4", "hero-5", "hero-6"];

  const MIN_GAP_MS = 3500;
  const MAX_GAP_MS = 9000;
  const MIN_FLIGHT_MS = 6000;
  const MAX_FLIGHT_MS = 11000;
  const MAX_CONCURRENT = 3;
  const ARC_SAMPLES = 24;
  const TRAIL_INTERVAL_MS = 220;

  let activeCount = 0;
  let styleTagCounter = 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function vw() {
    return window.innerWidth;
  }
  function vh() {
    return window.innerHeight;
  }

  function edgePoint() {
    const side = pick(["top", "bottom", "left", "right"]);
    const pad = 140;
    switch (side) {
      case "top":
        return { x: rand(0, vw()), y: -pad, side };
      case "bottom":
        return { x: rand(0, vw()), y: vh() + pad, side };
      case "left":
        return { x: -pad, y: rand(0, vh()), side };
      default:
        return { x: vw() + pad, y: rand(0, vh()), side };
    }
  }

  function oppositeBias(side) {
    const pad = 140;
    switch (side) {
      case "top":
        return { x: rand(0, vw()), y: vh() + pad };
      case "bottom":
        return { x: rand(0, vw()), y: -pad };
      case "left":
        return { x: vw() + pad, y: rand(0, vh()) };
      default:
        return { x: -pad, y: rand(0, vh()) };
    }
  }

  function quadPoint(p0, p1, p2, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  }

  function buildArcPoints() {
    const start = edgePoint();
    const end = oppositeBias(start.side);

    const bowAmount = rand(-260, 260);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const midX = (start.x + end.x) / 2 + nx * bowAmount;
    const midY = (start.y + end.y) / 2 + ny * bowAmount;
    const control = { x: midX, y: midY };

    const arc = [];
    for (let i = 0; i <= ARC_SAMPLES; i++) {
      arc.push(quadPoint(start, control, end, i / ARC_SAMPLES));
    }
    return arc;
  }

  function angleBetween(a, b) {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  }

  function spawnTrailMark(x, y, tilt) {
    const mark = document.createElement("div");
    mark.className = "trail-mark";
    mark.style.left = x + "px";
    mark.style.top = y + "px";
    mark.style.setProperty("--tr", tilt + "deg");
    layer.appendChild(mark);
    setTimeout(() => mark.remove(), 650);
  }

  function spawnPlane() {
    if (activeCount >= MAX_CONCURRENT) {
      scheduleNext();
      return;
    }

    const planeId = pick(PLANE_IDS);
    const arc = buildArcPoints();
    const duration = rand(MIN_FLIGHT_MS, MAX_FLIGHT_MS);
    const scale = rand(0.85, 1.15);
    const flip = Math.random() > 0.5 ? -1 : 1;

    const wrapper = document.createElement("div");
    wrapper.className = "plane flying";
    styleTagCounter += 1;
    const animName = "plane-fly-" + styleTagCounter;
    wrapper.style.animationName = animName + ", plane-fade";
    wrapper.style.animationDuration = duration + "ms, " + duration + "ms";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 130");
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const use = document.createElementNS(svgNS, "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + planeId);
    use.setAttribute("href", "#" + planeId);
    svg.appendChild(use);

    wrapper.appendChild(svg);

    let keyframeBody = "";
    let lastRot = 0;
    arc.forEach((pt, i) => {
      const pct = (i / (arc.length - 1)) * 100;
      const next = arc[i + 1];
      const prev = arc[i - 1];
      const heading = next ? angleBetween(pt, next) : angleBetween(prev, pt);
      const rot = heading * flip;
      lastRot = rot;
      const scaleX = flip < 0 ? -scale : scale;
      keyframeBody +=
        pct +
        "% { transform: translate(" +
        pt.x +
        "px, " +
        pt.y +
        "px) rotate(" +
        rot +
        "deg) scale(" +
        scaleX +
        ", " +
        scale +
        "); }\n";
    });

    const styleEl = document.createElement("style");
    styleEl.textContent = "@keyframes " + animName + " {\n" + keyframeBody + "}";
    document.head.appendChild(styleEl);

    layer.appendChild(wrapper);
    activeCount += 1;

    const flightStart = performance.now();
    const trailTimer = setInterval(() => {
      const elapsedFraction = (performance.now() - flightStart) / duration;
      if (elapsedFraction >= 1) return;
      const idx = Math.min(arc.length - 1, Math.floor(elapsedFraction * (arc.length - 1)));
      const pt = arc[idx];
      spawnTrailMark(pt.x, pt.y, lastRot);
    }, TRAIL_INTERVAL_MS);

    wrapper.addEventListener("animationend", function onEnd(e) {
      if (e.animationName === animName) {
        wrapper.removeEventListener("animationend", onEnd);
        clearInterval(trailTimer);
        wrapper.remove();
        styleEl.remove();
        activeCount -= 1;
      }
    });

    scheduleNext();
  }

  function scheduleNext() {
    const gap = rand(MIN_GAP_MS, MAX_GAP_MS);
    setTimeout(spawnPlane, gap);
  }

  function init() {
    const initialCount = Math.min(2, MAX_CONCURRENT);
    for (let i = 0; i < initialCount; i++) {
      setTimeout(spawnPlane, rand(400, 2200));
    }
    scheduleNext();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
