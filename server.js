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

const LETTER_TEXT = `My dearest Bea,

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

 they say that
the most beautiful things
are not seen, but felt.
although, i think you are both.

 your beauty has never 
been a doubt to me, for your soul
is even more charming than your face.
and our spark is undoubtedly present, 
for no water could ever quench 
the flames of our fire.

 they say that 
the most beautiful things 
are not seen, but felt.
so why are you both?

 blow out the candles.
make the wish too big to fit in words.
whatever it is — i hope it finds you.

happy birthday, beatrice.
nineteen suits you.`;

const PROSE_TEXT = `What Matters is You, not the State of You

I don't like you for the way you are on good days, when your voice is steady and your smile knows where to land, when liking you feels easy and explainable, when you look like someone the world knows to keep.

I like you when you are unremarkable, when nothing about you glows or ascends, when you sit across from me holding yourself together with habits and quiet apologies, when you are just human—unfinished, unsure, yet still trying.

I would choose you tired, eyes dull from carrying yesterday too long, hands empty because you gave everything away again, heart heavy with things you never say out loud because you're afraid they'll make you smaller.

I would choose you rusted, like you with the patience of rain learning the shape of a wound, stay even when staying feels like hunger. If you lose your way, I won't rush you back. If you change, I won't ask for the version I met. If you fall apart, I won't call it failure — I'll call it proof that you're real.

You don't need to be healed to be loved. You don't need to be strong to be chosen. You don't need to shine to be worthy of staying. What matters is the way you breathe next to me, the way you exist without asking permission, the way you exist and remain yourself even when the world teaches you to disappear. I am not devoted to your potential, or your better days, or the idea of who you could become. I am devoted to you — here, now, exactly as you are, even when you don't believe me, that's enough. I will always love you, always, for who you are:)

again, thank you for being born, for being here, for being the bea that everyone loves, including me. I may not know your very exact circumstances as of this moment, but I can assure you that when everyone becomes your enemy, I will always stand by your side, ea^^ `

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
