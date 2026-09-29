// =====================================================================
// 編集ゾーン：問題を追加・修正するときはここだけを編集
// =====================================================================

const LESSON_TITLE = "Lesson 10　不定詞①（名詞用法）";

// 学習記録：スプレッドシートの「Lesson」列に記録する名前
const LESSON_ID = "Lesson 10";

// 学習記録の送信先（Google Apps Script のウェブアプリ URL を "" の中に貼る）。空のままなら記録は送らない
const LOG_URL = "";


// 最初に選べる問題数（収録問題数を超える数は「全問」の数に置きかえて表示）
const COUNT_OPTIONS = [10, 20, 30];

// 指示文：問題の inst（なければ type）で選ばれる
const INSTRUCTIONS = {
  form:      "日本語に合うように，［ ］の語句を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
  formPhrase:"日本語に合うように，不定詞を使って英文を完成させるとき，下線部に入る語句を選びなさい。",
  order:     "日本語，または【状況】に合うように，語句を並べかえなさい。",
  blanks:    "日本語に合うように，（　）に入る語を選びなさい。動詞は枠内の語群から選ぶこと。"
};

// type: "form"   … template の {} に入る語の組み合わせを3択で選ぶ（answer と dummies 2つ，いずれも {} の数と同じ長さの配列）
// type: "order"  … chunks（語群）を並べかえ（answer が正しい順番）。文頭チャンクは小文字で保存し表示時に大文字化
// type: "blanks" … template の {} ごとに選択。verb: true の空欄は語群（VERB_CHOICES）から，それ以外は answer＋dummies の3択
// verb: ［ ］内に示す語句，ja: 問題文の日本語／状況，trans: 答え合わせ後に表示する訳，note: 答え合わせ後に表示する解説
// 文頭の {} に入る語は小文字で保存（表示時に大文字化）

const QUESTIONS = [
  // ---- 1 ----
  { src: "1 ⑴", type: "form", ja: "雨の日に自転車に乗るのは危険だ。", verb: "ride",
    template: "{} is dangerous {} {} a bike on a rainy day.",
    answer: ["it", "to", "ride"], dummies: [["that", "to", "ride"], ["it", "to", "riding"]],
    note: "「～することは…だ」は〈It is … to＋動詞の原形〉で表せる。この It は「形式主語」といい，本当の主語 to ride a bike on a rainy day（雨の日に自転車に乗ること）の代わりに文の先頭に置かれている。It は「それは」とは訳さない。\nto のあとは必ず動詞の原形なので，to riding は誤り。" },
  { src: "1 ⑵", type: "form", ja: "船の上でクジラを見るのは楽しいにちがいない。", verb: "watch",
    template: "{} must be fun {} {} whales on the boat.",
    answer: ["it", "to", "watch"], dummies: [["this", "to", "watch"], ["it", "to", "watching"]],
    note: "⑴と同じく形式主語 It を使った文。It は to watch whales on the boat（船の上でクジラを見ること）を指す。must be ～ は「～にちがいない」。\nto のあとは動詞の原形 watch。" },
  { src: "1 ⑶", type: "form", ja: "これらすべての書類に記入することが必要ですか。", verb: "fill",
    template: "Is {} necessary {} {} out all these forms?",
    answer: ["it", "to", "fill"], dummies: [["this", "to", "fill"], ["it", "to", "filling"]],
    note: "形式主語 it を使った文の疑問文。It is necessary to ～ を疑問文にすると，be動詞を前に出して Is it necessary to ～? になる。\nfill out は「（書類）に記入する」。to のあとは原形 fill。" },
  { src: "1 ⑷", type: "form", ja: "外国にひとりで住むのはどんな感じですか。", verb: "live",
    template: "What is {} like {} {} alone in a foreign country?",
    answer: ["it", "to", "live"], dummies: [["that", "to", "live"], ["it", "to", "living"]],
    note: "What is A like? は「A はどのようなものか」。この A に形式主語 it を入れ，本当の主語 to live alone in a foreign country（外国にひとりで住むこと）をあとに置いた文。\nto のあとは原形 live。" },
  { src: "1 ⑸", type: "form", ja: "私の希望は世界のさまざまな文化を体験することだ。", verb: "experience",
    template: "My hope {} {} {} different cultures of the world.",
    answer: ["is", "to", "experience"], dummies: [["is", "for", "experience"], ["is", "to", "experiencing"]],
    note: "〈主語＋is＋to＋動詞の原形〉で「（主語）は～することだ」という意味になる。to experience は「体験すること」で，is のあとにきて主語 My hope の内容を説明している（補語）。\nto のあとは原形なので，to experiencing は誤り。" },
  { src: "1 ⑹", type: "form", ja: "向上することは，変化することだ。", verb: "improve / change",
    template: "{} {} is {} {}.",
    answer: ["to", "improve", "to", "change"], dummies: [["to", "improve", "for", "change"], ["to", "improved", "to", "changed"]],
    note: "「～すること」は〈to＋動詞の原形〉で表せる。To improve（向上すること）を主語にし，is のあとに to change（変化すること）を置く。\nこの文は形式主語 It を使わず，to不定詞をそのまま主語にしている。文頭なので To は大文字で書く。" },

  // ---- 2 ----
  { src: "2 ⑴", type: "form", ja: "彼女があなたに腹を立てるのは当然だ。", verb: "get",
    template: "It is natural {} {} {} {} angry with you.",
    answer: ["for", "her", "to", "get"], dummies: [["for", "she", "to", "get"], ["of", "her", "to", "get"]],
    note: "「（人）が～するのは…だ」は〈It is … for＋人＋to＋動詞の原形〉で表す。for her は「彼女が」という意味で，to get angry の動作をする人を表す（意味上の主語）。\nfor のあとは目的格なので，she ではなく her。get angry with ～ は「～に腹を立てる」。" },
  { src: "2 ⑵", type: "form", ja: "日本の学生が留学するのはよい考えだ。", verb: "Japanese students",
    template: "It’s a good idea {} {} {} {} {} abroad.",
    answer: ["for", "Japanese", "students", "to", "study"],
    dummies: [["of", "Japanese", "students", "to", "study"], ["for", "Japanese", "students", "studying", "to"]],
    note: "⑴と同じく〈It is … for＋人＋to＋動詞の原形〉の形。for Japanese students で「日本の学生が」，to study abroad で「留学すること」。\nIt’s は It is の短縮形。study abroad は「留学する」。" },

  // ---- 3 ----
  { src: "3 ⑴", type: "order", ja: "駅の近くに住むのは便利だ。",
    before: "", after: "the station.",
    chunks: ["live", "convenient", "it", "to", "near", "is"],
    answer: ["it", "is", "convenient", "to", "live", "near"],
    note: "形式主語 It を使って It is convenient to ～ とする。It is のあとに「どうなのか」（convenient：便利な）を置き，そのあとに本当の主語 to live near the station（駅の近くに住むこと）を続ける。" },
  { src: "3 ⑵", type: "order", ja: "いちばん大切なことは，あなたが幸せであることだ。",
    before: "The most important thing is", after: ".",
    chunks: ["be", "for", "happy", "to", "you"],
    answer: ["for", "you", "to", "be", "happy"],
    note: "〈for＋人＋to＋動詞の原形〉で「（人）が～すること」。for you to be happy で「あなたが幸せであること」。to のあとは原形 be になる。\nis のあとにこのまとまりを置いて「いちばん大切なことは～だ」とする。" },
  { src: "3 ⑶", type: "order", ja: "【状況】友だちに「今度のお正月はどうするの」とたずねたら，こんな返事でした。",
    before: "My", after: "in Hawaii.",
    chunks: ["plan", "to", "spend", "is", "the New Year"],
    answer: ["plan", "is", "to", "spend", "the New Year"],
    trans: "私の予定はお正月をハワイで過ごすことです。",
    note: "〈主語＋is＋to＋動詞の原形〉「（主語）は～することだ」の形。My plan is to spend ～ で「私の予定は～を過ごすことだ」。spend は「（時間）を過ごす」。" },
  { src: "3 ⑷", type: "order", ja: "【状況】兄ははじめてマラソン大会に出場するために走り込んでいますが…。",
    before: "It won’t", after: "the marathon.",
    chunks: ["easy", "to", "for", "finish", "my brother", "be"],
    answer: ["be", "easy", "for", "my brother", "to", "finish"],
    trans: "兄がマラソンを完走することはたやすいことではないだろう。",
    note: "〈It is … for＋人＋to＋動詞の原形〉に won’t（= will not）を入れた未来の否定文。won’t のあとは原形なので be easy になる。\nそのあとに for my brother（兄が），to finish the marathon（マラソンを完走すること）の順に並べる。" },

  // ---- 5 ----
  { src: "5 ⑴", type: "form", ja: "私たちは，次の日曜日にまたあなたに会えることを希望しています。", verb: "hope",
    template: "We {} {} {} you again next Sunday.",
    answer: ["hope", "to", "see"], dummies: [["hope", "for", "see"], ["hope", "to", "seeing"]],
    note: "hope to ～ で「～することを望む」。〈to＋動詞の原形〉が hope の目的語になっている。to see you で「あなたに会うこと」（see の代わりに meet でもよい）。\nto のあとは原形なので，to seeing は誤り。" },
  { src: "5 ⑵", type: "form", ja: "雨が激しく降り始めた。", verb: "begin",
    template: "It {} {} {} hard.",
    answer: ["began", "to", "rain"], dummies: [["begin", "to", "rain"], ["began", "to", "rained"]],
    note: "begin to ～ で「～し始める」。過去の文なので begin の過去形 began（begin – began – begun）を使う。天気を表す文なので主語は It。\nto のあとは原形 rain。" },
  { src: "5 ⑶", type: "form", ja: "彼らはあなたのために歓迎パーティーを開くことを計画している。", verb: "hold",
    template: "They’re {} {} {} a welcome party for you.",
    answer: ["planning", "to", "hold"], dummies: [["plan", "to", "hold"], ["planning", "to", "holding"]],
    note: "plan to ～ で「～することを計画する」。They’re（= They are）のあとなので，現在進行形 are planning にする。\nhold a party は「パーティーを開く」。to のあとは原形 hold。" },
  { src: "5 ⑷", type: "form", ja: "その赤ちゃんはまもなく歩けるようになるだろう。", verb: "learn",
    template: "The baby will {} {} {} soon.",
    answer: ["learn", "to", "walk"], dummies: [["learns", "to", "walk"], ["learn", "to", "walking"]],
    note: "learn to ～ で「～するようになる，～できるようになる」。will のあとは原形なので learn。\nlearns（s がつく形）や to walking は誤り。" },
  { src: "5 ⑸", type: "form", ja: "私は音を立てないようにした。", verb: "make",
    template: "I {} {} {} {} any noise.",
    answer: ["tried", "not", "to", "make"], dummies: [["tried", "to", "not", "make"], ["not", "tried", "to", "make"]],
    note: "try to ～ は「～しようと努める」。「～しないように努める」と否定するときは，to の直前に not を置いて try not to ～ にする。過去の文なので tried not to make。\nmake noise は「音を立てる」。not の位置に注意。" },
  { src: "5 ⑹", type: "form", ja: "彼は英語で気持ちを表現するのが難しいとわかった。", verb: "express",
    template: "He {} it hard {} {} his feelings in English.",
    answer: ["found", "to", "express"], dummies: [["found", "for", "express"], ["found", "to", "expressing"]],
    note: "find it … to ～ で「～するのは…だとわかる」。この it は「形式目的語」で，あとの to express his feelings in English（英語で気持ちを表現すること）を指す。\n過去の文なので found（find – found – found）。express one’s feelings は「気持ちを表現する」。" },

  // ---- 6 ----
  { src: "6 ⑴", type: "form", inst: "formPhrase", ja: "「何を言えばよいのか」",
    template: "Sam didn’t know {} to her.",
    answer: ["what to say"], dummies: [["what to tell"], ["to say what"]],
    trans: "サムは彼女に何を言えばいいのかわからなかった。",
    note: "〈疑問詞＋to＋動詞の原形〉で「～すべきか，～したらよいか」という意味になる。what to say で「何を言えばよいのか」。\nあとに to her が続くので say を使う（say A to B「B に A を言う」）。tell は tell her のように to がいらないので，ここでは使えない。" },
  { src: "6 ⑵", type: "form", inst: "formPhrase", ja: "「だれを招くべきか」",
    template: "Let’s decide {} to the wedding.",
    answer: ["who to invite"], dummies: [["who invite to"], ["to invite who"]],
    trans: "結婚式にだれを招くべきか決めましょう。",
    note: "〈疑問詞＋to＋動詞の原形〉の形。who to invite で「だれを招くべきか」（who は whom でもよい）。\n疑問詞が先頭，そのあとに〈to＋動詞の原形〉の順。invite は「招待する」。" },
  { src: "6 ⑶", type: "form", inst: "formPhrase", ja: "「どのバスに乗るべきか」",
    template: "Can you tell me {}?",
    answer: ["which bus to take"], dummies: [["which to take bus"], ["to take which bus"]],
    trans: "どのバスに乗るべきか教えてくれますか。",
    note: "which bus（どのバス）をひとまとまりの疑問詞として使い，which bus to take で「どのバスに乗るべきか」。which と bus は離さない。\nバスなどに「乗る」は take。" },
  { src: "6 ⑷", type: "form", inst: "formPhrase", ja: "「～になる方法」",
    template: "I want to know {} an astronaut.",
    answer: ["how to become"], dummies: [["how become"], ["how to becoming"]],
    trans: "宇宙飛行士になる方法を知りたい。",
    note: "how to ～ で「～する方法，～のしかた」。how to become an astronaut で「宇宙飛行士になる方法」（become は be でもよい）。\nhow のあとの to を忘れないこと。astronaut は「宇宙飛行士」。" },
  { src: "6 ⑸", type: "form", inst: "formPhrase", ja: "「どこで待つべきか」",
    template: "The question is {} for him.",
    answer: ["where to wait"], dummies: [["where waiting"], ["to wait where"]],
    trans: "問題は彼をどこで待つべきかだ。",
    note: "where to ～ で「どこで～すべきか」。where to wait for him で「彼をどこで待つべきか」。wait for ～ は「～を待つ」。\nThe question is ～ は「問題は～だ」。" },
  { src: "6 ⑹", type: "form", inst: "formPhrase", ja: "「いつ来ればよいか」",
    template: "I’m not sure {} next.",
    answer: ["when to come"], dummies: [["when coming"], ["to come when"]],
    trans: "次はいつ来ればよいか定かではない。",
    note: "when to ～ で「いつ～すればよいか」。when to come next で「次はいつ来ればよいか」。\nI’m not sure ～ は「～がよくわからない」。" },

  // ---- 7 ----
  { src: "7 ⑴", type: "order", ja: "トムはケイトに謝ることを拒否している。",
    before: "", after: ".",
    chunks: ["apologize", "refuses", "Kate", "Tom", "to", "to"],
    answer: ["Tom", "refuses", "to", "apologize", "to", "Kate"],
    note: "refuse to ～ で「～することを拒否する」。apologize to ～ は「～に謝る」。\n1つ目の to は〈to＋動詞の原形〉の to，2つ目の to は「～に」を表す to。" },
  { src: "7 ⑵", type: "order", ja: "地震の際にどこに避難すべきかを確認するほうがいいですよ。",
    before: "You", after: "to in case of an earthquake.",
    chunks: ["evacuate", "should", "check", "to", "where"],
    answer: ["should", "check", "where", "to", "evacuate"],
    note: "where to ～「どこに～すべきか」を check（確認する）の目的語にする。should check で「確認するほうがよい」。\nevacuate to ～ は「～に避難する」なので，where to evacuate のあとに to が残る。in case of ～ は「～の場合に備えて」。" },
  { src: "7 ⑶", type: "order", ja: "【状況】医師から間食を控えるよう言われたので，私は…。",
    before: "I", after: "between meals.",
    chunks: ["not", "eat", "decided", "sweets", "to"],
    answer: ["decided", "not", "to", "eat", "sweets"],
    trans: "私は間食に甘いものを食べないと決めた。",
    note: "decide to ～ は「～することに決める」。「～しないことに決める」は，to の直前に not を置いて decide not to ～ にする。\n過去の文なので decided not to eat。between meals は「食事と食事の間に（間食に）」。" },
  { src: "7 ⑷", type: "order", ja: "【状況】ルーシーは最近悩みがあり，だれかに相談したいのですが…。",
    before: "Lucy", after: "for advice.",
    chunks: ["ask", "know", "who", "doesn’t", "to"],
    answer: ["doesn’t", "know", "who", "to", "ask"],
    trans: "ルーシーはだれに助言を求めるべきかわからない。",
    note: "who to ～ で「だれに～すべきか」。who to ask を know の目的語にして，doesn’t know who to ask「だれに頼めばよいかわからない」とする。\nask for advice は「助言を求める」。" }
];

// blanks 型の語群（この Lesson では未使用）
const VERB_BOX = "";
const VERB_CHOICES = [];

// =====================================================================
// ここから下はロジック（通常は編集不要）
// =====================================================================

// 旧形式（before / answer / after）の form 問題を template 形式にそろえる
QUESTIONS.forEach(q => {
  if (q.type === "form" && !q.template) {
    q.template = [q.before, "{}", q.after].filter(Boolean).join(" ");
    q.answer = [q.answer];
    q.dummies = q.dummies.map(d => [d]);
  }
});

const app = document.getElementById("app");
const progressEl = document.getElementById("progress");

let queue = [];    // 出題する問題（QUESTIONS のインデックス）
let records = [];  // 各問の解答状態 { result, choice, sels, picked, pool }
let pos = 0;
let studentId = "";

// ---------- 学籍番号の保存（この端末のブラウザに記憶） ----------
function loadId() {
  try { return localStorage.getItem("studentId") || ""; } catch (e) { return ""; }
}
function saveId(id) {
  try { localStorage.setItem("studentId", id); } catch (e) {}
}

// ---------- 学習記録の送信 ----------
const RESULT_LABELS = { correct: "正解", wrong: "不正解", skipped: "とばした" };

function chosenText(q, rec) {
  if (rec.result === "skipped") return "";
  if (q.type === "form") return optionLabel(q, rec.options[rec.choice]);
  if (q.type === "blanks") return rec.sels.join(" / ");
  return rec.picked.map(pi => rec.pool[pi]).join(" ");
}

function sendLog(q, rec) {
  if (!LOG_URL) return;
  const body = JSON.stringify({
    student: studentId,
    lesson: LESSON_ID,
    question: q.src,
    result: RESULT_LABELS[rec.result],
    choice: chosenText(q, rec)
  });
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body })
      .catch(() => {});
  } catch (e) {}
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function joinSentence(parts) {
  return parts.filter(Boolean).join(" ").replace(/ ([.,?!])/g, "$1");
}

function fullAnswer(q) {
  if (q.type === "form") return fillTemplate(q.template, q.answer);
  if (q.type === "order") return cap(joinSentence([q.before, ...q.answer, q.after]));
  return fillTemplate(q.template, q.blanks.map(b => b.answer));
}

function fillTemplate(template, words) {
  let i = 0;
  return cap(template.replace(/\{\}/g, () => words[i++]));
}

// 選択肢の表示：隣り合う空所はスペース，離れた空所は「…」でつなぐ
function optionLabel(q, words) {
  const parts = q.template.split("{}");
  const atStart = q.template.startsWith("{}");
  return words.map((w, k) => (k === 0 && atStart ? cap(w) : w) +
    (k < words.length - 1 ? (parts[k + 1].trim() === "" ? " " : " … ") : "")).join("");
}

// 文頭にくる語句だけ大文字で表示
function displayChunk(q, text, isFirst) {
  return isFirst && !q.before ? cap(text) : text;
}

// 答え合わせ済み、またはとばした問題は解答を確定（解説を表示）
function isChecked(rec) { return !!rec.result; }

// ---------- 画面：問題数の選択 ----------
function renderHome() {
  progressEl.textContent = "";
  const counts = [...new Set(COUNT_OPTIONS.map(n => Math.min(n, QUESTIONS.length)))];
  let html = `<p class="ja">学籍番号（4桁）</p>`;
  html += `<p><input type="text" id="sid" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(studentId || loadId())}"></p>`;
  html += `<p class="ja">問題数を選んでください（全${QUESTIONS.length}問から出題）</p><div class="actions">`;
  html += counts.map(n => `<button class="primary count" data-n="${n}">${n}問</button>`).join("");
  html += `</div>`;
  app.innerHTML = html;

  const sid = document.getElementById("sid");
  const buttons = app.querySelectorAll("button.count");
  const update = () => {
    sid.value = sid.value.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
                         .replace(/\D/g, "").slice(0, 4);
    buttons.forEach(b => b.disabled = !/^\d{4}$/.test(sid.value));
  };
  sid.addEventListener("input", update);
  update();

  buttons.forEach(b => b.addEventListener("click", () => {
    studentId = sid.value;
    saveId(studentId);
    start(shuffle(QUESTIONS.map((_, i) => i)).slice(0, Number(b.dataset.n)));
  }));
}

function start(indices) {
  queue = shuffle(indices);
  records = queue.map(() => ({}));
  pos = 0;
  renderQuestion();
}

// ---------- 画面：問題 ----------
function renderQuestion() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  const checked = isChecked(rec);
  progressEl.textContent = `${studentId}｜${pos + 1} / ${queue.length}`;

  let html = `<p class="source">EXERCISES ${esc(q.src)}</p>`;
  html += `<p class="instruction">${INSTRUCTIONS[q.inst || q.type]}</p>`;
  if (q.ja) html += `<p class="ja">${esc(q.ja)}</p>`;

  if (q.type === "form") {
    if (!rec.options) rec.options = shuffle([q.answer, ...q.dummies]);
    const fills = rec.choice === undefined ? null : rec.options[rec.choice];
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      return `<span class="slot">${fills ? esc(k === 0 && atStart ? cap(fills[k]) : fills[k]) : "&nbsp;"}</span>`;
    });
    if (q.verb) html += `<p class="hint">［ ${esc(q.verb)} ］</p>`;
    html += `<p class="sentence">${body}</p>`;
    html += `<div class="pool" id="options">` + rec.options.map((o, oi) =>
      `<button class="chunk${oi === rec.choice ? " selected" : ""}" data-i="${oi}" ${checked ? "disabled" : ""}>${esc(optionLabel(q, o))}</button>`
    ).join("") + `</div>`;
  }

  if (q.type === "blanks") {
    if (!rec.sels) rec.sels = q.blanks.map(() => "");
    if (!rec.opts) rec.opts = q.blanks.map(b => b.verb ? VERB_CHOICES : shuffle([b.answer, ...b.dummies]));
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      const opts = rec.opts[k].map(o =>
        `<option value="${esc(o)}" ${o === rec.sels[k] ? "selected" : ""}>${esc(k === 0 && atStart ? cap(o) : o)}</option>`
      ).join("");
      return `<select data-k="${k}" ${checked ? "disabled" : ""}><option value="">―</option>${opts}</select>`;
    });
    if (VERB_BOX) html += `<div class="verbs">${VERB_BOX}</div>`;
    html += `<p class="sentence">${body}</p>`;
  }

  if (q.type === "order") {
    if (!rec.pool) {
      do { rec.pool = shuffle(q.chunks); } while (rec.pool.join(" ") === q.answer.join(" "));
      rec.picked = [];
    }
    html += `<p class="sentence" id="line"></p><div class="pool" id="pool"></div>`;
  }

  html += `<div class="actions">`;
  html += `<button id="back" ${pos === 0 ? "disabled" : ""}>もどる</button>`;
  if (!checked) html += `<button id="skip">とばす</button>`;
  html += `<button class="primary" id="main">${checked ? (pos + 1 < queue.length ? "次へ" : "結果を見る") : "答え合わせ"}</button>`;
  html += `</div><div id="fb"></div>`;
  app.innerHTML = html;

  document.getElementById("back").addEventListener("click", () => { pos--; renderQuestion(); });
  if (!checked) document.getElementById("skip").addEventListener("click", onSkip);
  document.getElementById("main").addEventListener("click", onMain);

  if (q.type === "form" && !checked) {
    app.querySelectorAll("#options button").forEach(b => b.addEventListener("click", () => {
      rec.choice = Number(b.dataset.i);
      renderQuestion();
    }));
  }
  if (q.type === "blanks" && !checked) {
    app.querySelectorAll("select").forEach(el => el.addEventListener("change", () => {
      rec.sels[Number(el.dataset.k)] = el.value;
      updateMain(q, rec);
    }));
  }
  if (q.type === "order") renderOrder(q, rec, checked);

  if (checked) renderFeedback(q, rec.result);
  else updateMain(q, rec);
}

function renderOrder(q, rec, checked) {
  const line = document.getElementById("line");
  const poolEl = document.getElementById("pool");

  const chosen = rec.picked.map((pi, k) =>
    `<button class="chunk" data-k="${k}" ${checked ? "disabled" : ""}>${esc(displayChunk(q, rec.pool[pi], k === 0))}</button>`
  ).join(" ");
  const slots = rec.picked.length < rec.pool.length ? ` <span class="slot">&nbsp;</span>` : "";
  line.innerHTML = joinSentence([esc(q.before), chosen + slots, esc(q.after)]);

  poolEl.innerHTML = rec.pool.map((text, pi) =>
    rec.picked.includes(pi) ? "" : `<button class="chunk" data-pi="${pi}" ${checked ? "disabled" : ""}>${esc(text)}</button>`
  ).join("");

  if (checked) return;
  line.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.splice(Number(b.dataset.k), 1);
    renderOrder(q, rec, false);
  }));
  poolEl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.push(Number(b.dataset.pi));
    renderOrder(q, rec, false);
  }));
  updateMain(q, rec);
}

function isReady(q, rec) {
  if (q.type === "form") return rec.choice !== undefined;
  if (q.type === "blanks") return rec.sels.every(v => v);
  return rec.picked.length === rec.pool.length;
}

function updateMain(q, rec) {
  document.getElementById("main").disabled = !isReady(q, rec);
}

function judge(q, rec) {
  if (q.type === "form") return rec.options[rec.choice].join(" ") === q.answer.join(" ");
  if (q.type === "blanks") return q.blanks.every((b, i) => rec.sels[i] === b.answer);
  return rec.picked.map(pi => rec.pool[pi]).join(" ") === q.answer.join(" ");
}

function renderFeedback(q, result) {
  const marks = {
    correct: `<p class="mark ok">○ 正解</p>`,
    wrong:   `<p class="mark ng">× 不正解</p>`,
    skipped: `<p class="mark">とばした問題</p>`
  };
  let fb = `<div class="feedback">`;
  fb += marks[result];
  fb += `<p class="answer">${esc(fullAnswer(q))}</p>`;
  if (q.trans) fb += `<p>${esc(q.trans)}</p>`;
  if (q.note) fb += `<p class="note">${esc(q.note).replace(/\n/g, "<br>")}</p>`;
  fb += `</div>`;
  document.getElementById("fb").innerHTML = fb;
}

function onMain() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  if (isChecked(rec)) { next(); return; }
  rec.result = judge(q, rec) ? "correct" : "wrong";
  sendLog(q, rec);
  renderQuestion();
  document.getElementById("main").focus();
}

function onSkip() {
  records[pos].result = "skipped";
  sendLog(QUESTIONS[queue[pos]], records[pos]);
  renderQuestion();
  document.getElementById("main").focus();
}

function next() {
  pos++;
  if (pos < queue.length) renderQuestion();
  else renderResult();
}

// ---------- 画面：結果 ----------
function renderResult() {
  progressEl.textContent = "";
  const score = records.filter(r => r.result === "correct").length;
  const skipped = records.filter(r => r.result === "skipped").length;
  const missed = queue.filter((_, i) => records[i].result !== "correct");

  let html = `<p class="result">${score} / ${queue.length} 問正解</p>`;
  if (skipped) html += `<p class="ja">とばした問題：${skipped}問</p>`;
  html += `<div class="actions">`;
  if (missed.length) html += `<button class="primary" id="retryWrong">間違えた・とばした問題（${missed.length}問）</button>`;
  html += `<button id="home">問題数を選び直す</button></div>`;
  app.innerHTML = html;

  if (missed.length) document.getElementById("retryWrong").addEventListener("click", () => start(missed));
  document.getElementById("home").addEventListener("click", renderHome);
}

document.getElementById("title").textContent = LESSON_TITLE;
renderHome();
