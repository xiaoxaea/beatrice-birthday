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

  // How many times a single flight path may bounce off the game screen
  // before we give up and just let it through (keeps things cheap/safe).
  const MAX_BOUNCES = 2;
  // Extra breathing room around the game frame so a plane visibly bounces
  // a little before touching the border, instead of clipping into it.
  const BOUNCE_PADDING = 46;

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

  // ---- Game-screen collision + bounce ----
  // The flight arc above is pre-computed once at spawn time (it's played back
  // as a single CSS keyframe animation, not simulated frame-by-frame), so
  // "bouncing" is done by finding where the path first enters the game
  // frame's rect and mirroring everything after that point across the wall
  // it hit — same idea as a ball bouncing off a flat surface, just applied
  // to the whole precomputed path in one pass.

  function getGameRect() {
    const world = document.getElementById("gameWorld");
    if (!world || world.hidden) return null;
    const frame = document.querySelector(".gw-frame");
    if (!frame) return null;
    const r = frame.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return {
      left: r.left - BOUNCE_PADDING,
      right: r.right + BOUNCE_PADDING,
      top: r.top - BOUNCE_PADDING,
      bottom: r.bottom + BOUNCE_PADDING,
    };
  }

  function inRect(pt, rect) {
    return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
  }

  // p0 is outside the rect, p1 is inside it — binary-search along the
  // segment for the boundary crossing, and report which wall it's nearest.
  function findWallHit(p0, p1, rect) {
    let lo = 0;
    let hi = 1;
    for (let iter = 0; iter < 18; iter++) {
      const mid = (lo + hi) / 2;
      const pt = { x: p0.x + (p1.x - p0.x) * mid, y: p0.y + (p1.y - p0.y) * mid };
      if (inRect(pt, rect)) hi = mid;
      else lo = mid;
    }
    const t = (lo + hi) / 2;
    const hit = { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };

    const distLeft = Math.abs(hit.x - rect.left);
    const distRight = Math.abs(hit.x - rect.right);
    const distTop = Math.abs(hit.y - rect.top);
    const distBottom = Math.abs(hit.y - rect.bottom);
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    let wall = "left";
    if (minDist === distRight) wall = "right";
    else if (minDist === distTop) wall = "top";
    else if (minDist === distBottom) wall = "bottom";

    return { hit, wall };
  }

  function applyBounces(points, rect) {
    let path = points.slice();
    let bounces = 0;

    while (bounces < MAX_BOUNCES) {
      let hitIndex = -1;
      for (let i = 1; i < path.length; i++) {
        if (!inRect(path[i - 1], rect) && inRect(path[i], rect)) {
          hitIndex = i;
          break;
        }
      }
      if (hitIndex === -1) break;

      const { hit, wall } = findWallHit(path[hitIndex - 1], path[hitIndex], rect);
      const before = path.slice(0, hitIndex);
      const tail = path.slice(hitIndex);

      // Mirror everything after the hit across the wall — a left/right wall
      // flips the horizontal component and keeps vertical motion going;
      // a top/bottom wall does the reverse. That's the actual "bounce".
      const mirrored = tail.map((p) => {
        if (wall === "left" || wall === "right") {
          return { x: 2 * hit.x - p.x, y: p.y };
        }
        return { x: p.x, y: 2 * hit.y - p.y };
      });

      path = before.concat([hit], mirrored);
      bounces += 1;
    }

    return path;
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
    const rawArc = buildArcPoints();
    const gameRect = getGameRect();
    const arc = gameRect ? applyBounces(rawArc, gameRect) : rawArc;

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
