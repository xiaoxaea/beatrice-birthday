(function () {
  "use strict";

  const layer = document.getElementById("planesLayer");
  if (!layer) return;

  const PLANE_IDS = ["plane-1", "plane-2", "plane-3", "plane-4", "plane-5", "plane-6"];

  const MIN_GAP_MS = 3500;
  const MAX_GAP_MS = 9000;
  const MIN_FLIGHT_MS = 6000;
  const MAX_FLIGHT_MS = 11000;
  const MAX_CONCURRENT = 3;

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
    const pad = 120;
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
    const pad = 120;
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

  function buildPath() {
    const start = edgePoint();
    const end = oppositeBias(start.side);

    const midX = (start.x + end.x) / 2 + rand(-220, 220);
    const midY = (start.y + end.y) / 2 + rand(-180, 180);

    const points = [
      { x: start.x, y: start.y },
      { x: midX, y: midY },
      { x: end.x, y: end.y },
    ];

    if (Math.random() > 0.45) {
      points.splice(2, 0, {
        x: (midX + end.x) / 2 + rand(-140, 140),
        y: (midY + end.y) / 2 + rand(-140, 140),
      });
    }

    return points;
  }

  function angleBetween(a, b) {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  }

  function spawnPlane() {
    if (activeCount >= MAX_CONCURRENT) {
      scheduleNext();
      return;
    }

    const planeId = pick(PLANE_IDS);
    const points = buildPath();
    const duration = rand(MIN_FLIGHT_MS, MAX_FLIGHT_MS);
    const scale = rand(0.7, 1.25);
    const flip = Math.random() > 0.5 ? -1 : 1;

    const wrapper = document.createElement("div");
    wrapper.className = "plane flying";
    styleTagCounter += 1;
    const animName = "plane-fly-" + styleTagCounter;
    wrapper.style.animationName = animName + ", plane-fade";
    wrapper.style.animationDuration = duration + "ms, " + duration + "ms";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "-90 -50 220 100");
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";
    const use = document.createElementNS(svgNS, "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + planeId);
    use.setAttribute("href", "#" + planeId);
    svg.appendChild(use);
    wrapper.appendChild(svg);

    let keyframeBody = "";
    points.forEach((pt, i) => {
      const pct = (i / (points.length - 1)) * 100;
      const next = points[i + 1];
      const heading = next ? angleBetween(pt, next) : angleBetween(points[i - 1], pt);
      const rot = heading * flip;
      const scaleX = flip < 0 ? -scale : scale;
      keyframeBody += pct + "% { transform: translate(" + pt.x + "px, " + pt.y + "px) rotate(" + rot + "deg) scale(" + scaleX + ", " + scale + "); }\n";
    });

    const styleEl = document.createElement("style");
    styleEl.textContent = "@keyframes " + animName + " {\n" + keyframeBody + "}";
    document.head.appendChild(styleEl);

    layer.appendChild(wrapper);
    activeCount += 1;

    wrapper.addEventListener("animationend", function onEnd(e) {
      if (e.animationName === animName) {
        wrapper.removeEventListener("animationend", onEnd);
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
