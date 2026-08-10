const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HIGHSCORE_FILE = path.join(__dirname, "data", "highscore.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ---------------------------------------------------------
   Content served from the "back end" — kept here rather than
   hard-coded in the front end so the letter, poem, prose and
   mystery note are all fetched from the server at runtime.
--------------------------------------------------------- */

const LETTER_TEXT = `My dearest Beatrice,

Nineteen looks wonderful on you. If you're reading this, it means you chose "yes" — and honestly, I never doubted you would, even if I made the "no" button work a little for its living.

I wanted to build you something instead of just saying it, because some things deserve more than a text message and a cake emoji. So here it is: a small, slightly ridiculous, entirely sincere corner of the internet, made for exactly one person. You.

Nineteen is a strange age to try to describe, because it isn't the neat milestone that eighteen was, or the one twenty will be. It's quieter than that. It's the year in between — where you're no longer new at being an adult, but you're also not pretending to have it all figured out anymore, and there's something wonderful about that honesty. You get to keep growing without an audience watching for the big dramatic moment. You just get to become more yourself, a little at a time, on your own schedule. I hope this year gives you exactly that kind of room.

I want you to know that the version of you I've gotten to know is the kind of person other people quietly hope to be. You listen like it matters. You laugh with your whole self, not just your mouth. You care about people even when it's inconvenient, and you notice the small things — the things most people walk straight past — and you make them feel seen. That is not a small talent. That is one of the rarest ones there is, and I don't think you give yourself enough credit for it.

I also want you to know that it's okay to be unfinished. Nineteen doesn't come with a manual, and anyone who tells you they had it all sorted out at your age is either lying or has forgotten what it actually felt like. You are allowed to change your mind. You are allowed to want different things at twenty-five than you want right now. You are allowed to rest without earning it first. Growth isn't a straight line, and you don't owe anyone a tidy story about how you got from here to there.

So here is what I hope for you this year: I hope you get a little braver about the things you actually want, and a little kinder to yourself about the things you don't get right the first time. I hope you find at least one new thing that makes you lose track of time in a good way. I hope the people around you keep showing up the way you show up for them, because you deserve that kind of reciprocity, not just the version where you're always the one holding things together. I hope you laugh so hard at least once this year that it becomes a story you tell for the rest of your life. And I hope that whenever nineteen gets loud or confusing or heavy, you remember that you don't have to carry it alone.

I built this whole strange little website because I wanted your birthday to feel like an event, not just a date on a calendar. There's a game hiding further down, and a couple of other small surprises after that, because I think birthdays should have layers, like a very poorly disguised treasure hunt. Take your time with it. There's no rush.

Happy nineteenth birthday, Beatrice. Thank you for being exactly who you are, unapologetically and completely. Here's to this next year being kind to you, and here's to you being just as kind to yourself.

With more warmth than this letter can really hold,
Someone who is very glad you clicked "yes."`;

const POEM_TEXT = `Nineteen Candles

Not a girl anymore, not fully grown either,
just standing in that soft, unhurried in-between —
one foot in the laughter of who you were,
one foot reaching toward who you're becoming.

I hope this year hands you gentle things:
mornings that don't rush you,
people who stay,
a version of yourself you like a little more
each time you look.

You carry warmth like it costs you nothing,
though I know sometimes it does.
So tonight, just this once,
let someone else hold the light for you.

Blow out the candles.
Make the wish too big to fit in words.
Whatever it is — I hope it finds you.

Happy birthday, Beatrice.
Nineteen suits you.`;

const PROSE_TEXT = `On Turning Nineteen

There's a particular kind of birthday that doesn't announce itself. Eighteen shouts. Twenty-one will shout too, eventually, if traditions hold. But nineteen just quietly arrives, and you're expected to keep going as if nothing happened, when really, a whole year of becoming has just been folded shut and a new one has opened blank in front of you.

I think that's why nineteen deserves more attention than it gets, not less. It's the age of unglamorous, unwitnessed growth — the kind that doesn't make it into anyone's highlight reel but adds up to something enormous anyway. The late-night conversations that changed how you see a person. The mistake you made and actually learned from, instead of just surviving. The small, private moment you chose kindness when it would have been easier not to. Nobody throws a party for those things. But they're the reason the person blowing out candles tonight is more remarkable than the person who blew them out last year.

So this is me, quietly noticing. Not the big things — those you already know about — but the small, constant ones. The way you make ordinary days feel less ordinary just by being in them. The way you ask good questions and actually wait for the answers. The way your kindness never seems to run out, even on the days you probably need some of it back.

Nineteen won't be perfect. No year is. There will be days that feel too big and days that feel too small, and both of those are allowed to just be days, without needing to mean anything. But I hope, more than anything, that this year you let yourself take up exactly as much space as you deserve — no more apologizing for it, no more shrinking to make things easier for everyone else.

Happy birthday. Here's to the year of being quietly, unmistakably more yourself.`;

const MYSTERY_TEXT = `Okay. Since you clicked it anyway.

Here's the actual secret: there isn't a dramatic one. I just wanted an excuse to spend a few evenings building you something instead of buying you something. The poem took longer than it should have. I rewrote the letter three times. The dinosaur game has a bug I never fixed because you'll probably beat it before you notice.

That's it. That's the whole secret.

...okay, maybe one more thing: I'm really glad you exist. Happy birthday, Beatrice. 🤍`;

app.get("/api/content/letter", (req, res) => {
  res.json({ title: "For Beatrice", body: LETTER_TEXT });
});

app.get("/api/content/poem", (req, res) => {
  res.json({ title: "Poem", body: POEM_TEXT });
});

app.get("/api/content/prose", (req, res) => {
  res.json({ title: "Proses", body: PROSE_TEXT });
});

app.get("/api/content/mystery", (req, res) => {
  res.json({ title: "...", body: MYSTERY_TEXT });
});

/* ---------------------------------------------------------
   Tiny persistence layer for the dino game's high score,
   stored server-side in data/highscore.json.
--------------------------------------------------------- */

function readHighscore() {
  try {
    const raw = fs.readFileSync(HIGHSCORE_FILE, "utf-8");
    return JSON.parse(raw).highscore || 0;
  } catch (err) {
    return 0;
  }
}

function writeHighscore(value) {
  fs.mkdirSync(path.dirname(HIGHSCORE_FILE), { recursive: true });
  fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify({ highscore: value }, null, 2));
}

app.get("/api/highscore", (req, res) => {
  res.json({ highscore: readHighscore() });
});

app.post("/api/highscore", (req, res) => {
  const score = Number(req.body && req.body.score);
  if (!Number.isFinite(score)) {
    return res.status(400).json({ error: "score must be a number" });
  }
  const current = readHighscore();
  const next = Math.max(current, score);
  writeHighscore(next);
  res.json({ highscore: next });
});

app.listen(PORT, () => {
  console.log(`Beatrice's birthday site is running at http://localhost:${PORT}`);
});
