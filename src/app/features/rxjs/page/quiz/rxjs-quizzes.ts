/**
 * All RxJS recap quizzes, keyed by the URL id.
 *
 * A new quiz is one more entry in {@link RXJS_QUIZZES} plus one row in
 * `RECAPS` (rxjs-layout.component.ts) — nothing else touches the page code.
 */

export interface QuizQuestion {
  /** Prompt as HTML — supports <code>, <b>, etc. */
  q: string;
  opts: string[];
  correct: number;
  /** Explanation shown after the user picks an answer (HTML). */
  ex: string;
  /** Optional code block rendered under the prompt (raw HTML). */
  code?: string;
}

export interface QuizSection {
  /** Small pill above the section, e.g. "ლექცია 1". */
  numberLabel: string;
  /** Full title next to the pill. */
  title: string;
  /** Prefix used to key answers: 'a' → ids "a0", "a1", ... */
  prefix: string;
  questions: QuizQuestion[];
}

export interface QuizVerdictThresholds {
  perfect: { title: string; sub: string };
  strong: { title: string; sub: string };
  ok: { title: string; sub: string };
  weak: { title: string; sub: string };
}

export interface QuizConfig {
  /** URL id: /courses/rxjs/quiz/:id */
  id: string;
  /** Hero heading; the accented tail is rendered separately. */
  heading: { prefix: string; accent: string };
  /** Bullet chips shown in the hero (plain HTML). */
  chips: string[];
  /** Colour variant swap — 'cyan' (default) or 'indigo'. */
  variant: 'cyan' | 'indigo';
  /** Sections in display order. */
  sections: QuizSection[];
  /** Verdict text keyed to score thresholds. */
  verdict: QuizVerdictThresholds;
  /** Footer marble line HTML. */
  footerLine: string;
}

export const RXJS_QUIZZES: Record<string, QuizConfig> = {
  '1-2': {
    id: '1-2',
    heading: { prefix: 'ლექცია', accent: '1 & 2' },
    chips: [
      '<b>12</b> კითხვა',
      'არჩევითპასუხიანი',
      'ლ.1 — <b>რატომ რეაქტიული</b>',
      'ლ.2 — <b>Observable-ის საფუძვლები</b>',
    ],
    variant: 'cyan',
    sections: [
      {
        numberLabel: 'ლექცია 1',
        title: 'რატომ რეაქტიული პროგრამირება',
        prefix: 'a',
        questions: [
          {
            q: 'რა არის Observable-ის ფუნდამენტური ბუნება Push/Pull პარადიგმაში?',
            opts: [
              'Pull სისტემა ერთი მნიშვნელობისთვის',
              'Push სისტემა ერთი მნიშვნელობისთვის',
              'Push სისტემა მრავალი მნიშვნელობისთვის',
              'Pull სისტემა მრავალი მნიშვნელობისთვის',
            ],
            correct: 2,
            ex: '<b>Observable = Push მრავალი მნიშვნელობისთვის.</b> Producer აწვდის (push) მნიშვნელობებს Consumer-ს, და ეს ხდება მრავალჯერ, დროში გაწელილად. Function = Pull/ერთი, Iterator = Pull/მრავალი, Promise = Push/ერთი.',
          },
          {
            q: 'რომელია <b>არა</b> Promise-ის შეზღუდვა, რომელსაც Observable აგვარებს?',
            opts: [
              'Promise მხოლოდ ერთ მნიშვნელობას აბრუნებს',
              'Promise ვერ გაუქმდება დაწყების შემდეგ',
              'Promise eager-ია — მაშინვე იწყება',
              'Promise ვერ ამუშავებს შეცდომებს',
            ],
            correct: 3,
            ex: 'Promise <b>ამუშავებს</b> შეცდომებს (<code>.catch</code>). დანარჩენი სამი კი მისი რეალური შეზღუდვაა: ერთი მნიშვნელობა, გაუუქმებადობა და eager შესრულება — სწორედ ამათ აგვარებს Observable.',
          },
          {
            q: 'რას დაბეჭდავს ეს კოდი: <code>console.log(1); setTimeout(()=>console.log(2)); console.log(3);</code>',
            opts: ['1, 2, 3', '1, 3, 2', '3, 2, 1', '2, 1, 3'],
            correct: 1,
            ex: '<code>setTimeout</code> ასინქრონულია — მისი callback მიდის Callback Queue-ში და სრულდება მხოლოდ მას შემდეგ, რაც Call Stack გათავისუფლდება. ამიტომ <b>1, 3, 2</b> — "2" ბოლოს.',
          },
          {
            q: 'Callback Hell-ის (Pyramid of Doom) მთავარი პრობლემა რაშია?',
            opts: [
              'კოდი ნელა სრულდება',
              'ჩალაგებული callbacks კითხვადს აზიანებს და error handling მეორდება',
              'callbacks-ს მეხსიერება ბევრი სჭირდება',
              'ბრაუზერი ვერ ამუშავებს callbacks-ს',
            ],
            correct: 1,
            ex: 'Callback Hell-ის ბირთვი <b>კითხვადობისა და კომპოზიციის</b> პრობლემაა: კოდი მარჯვნივ იზრდება, error handling ყოველ დონეზე ცალკე უნდა დაიწეროს, და ცვლილება რთულდება.',
          },
          {
            q: 'Pull პარადიგმაში ვინ არის აქტიური?',
            opts: [
              'Producer — აწვდის, როცა მოესურვება',
              'Consumer — წყვეტს, როდის მიიღოს მონაცემი',
              'ორივე ერთდროულად',
              'არც ერთი — სისტემა თავად წყვეტს',
            ],
            correct: 1,
            ex: 'Pull-ში <b>Consumer აქტიურია</b> — ის "იწევს" (pull) მნიშვნელობას როცა მზადაა (მაგ. <code>iterator.next()</code>). Producer პასიურია. Push-ში პირიქითაა — Producer აქტიური, Consumer პასიური.',
          },
          {
            q: 'რომელ შემთხვევაში <b>ჯობს</b> RxJS-ის ნაცვლად <code>async/await</code>?',
            opts: [
              'Autocomplete search უამრავი keystroke-ით',
              'Live dashboard WebSocket-ებით',
              'ერთი მარტივი fetch გვერდის load-ზე',
              'Drag-and-drop mouse-ის მოძრაობით',
            ],
            correct: 2,
            ex: 'RxJS ბრწყინავს <b>მოვლენების ნაკადებზე</b> და კომპლექსურ ასინქრონულ კომპოზიციაზე. ერთი მარტივი, ერთჯერადი fetch-ისთვის ის ზედმეტ სირთულეს ამატებს — <code>async/await</code> ჯობს.',
          },
        ],
      },
      {
        numberLabel: 'ლექცია 2',
        title: 'პირველი ნაბიჯები Observable-თან',
        prefix: 'b',
        questions: [
          {
            q: 'რას ნიშნავს, რომ Observable "lazy"-ა?',
            opts: [
              'ის ნელა მუშაობს',
              'ის არაფერს აკეთებს, სანამ არ გამოვიწერთ (subscribe)',
              'ის მხოლოდ ერთ მნიშვნელობას აბრუნებს',
              'ის ავტომატურად ჩერდება 30 წამში',
            ],
            correct: 1,
            ex: 'Observable არის მხოლოდ "რეცეპტი". სანამ <code>subscribe()</code>-ს არ დავიძახებთ, <b>არც ერთი მნიშვნელობა არ იქმნება</b>. ეს განასხვავებს მას eager Promise-ისგან, რომელიც შექმნისთანავე იწყებს მუშაობას.',
          },
          {
            q: 'Observer-ის სამი მეთოდიდან რომელი <b>წყვეტს</b> ნაკადს?',
            opts: [
              'მხოლოდ <code>complete</code>',
              'მხოლოდ <code>error</code>',
              '<code>error</code> და <code>complete</code>',
              '<code>next</code>, <code>error</code> და <code>complete</code>',
            ],
            correct: 2,
            ex: '<code>next</code> შეიძლება 0..∞ ჯერ გამოიძახოს. მაგრამ <code>error</code> ან <code>complete</code> ნაკადს <b>ხურავს</b> — ორივე ტერმინალურია. მათ შემდეგ მეტი მნიშვნელობა აღარ მოვა.',
          },
          {
            q: 'რას დაბეჭდავს: <code>of([1,2,3]).subscribe(v=>console.log(v))</code>?',
            opts: ['1, 2, 3', '[1, 2, 3]', '1', 'error'],
            correct: 1,
            ex: '<code>of</code> მთელ არგუმენტს <b>ერთ მნიშვნელობად</b> აღიქვამს — ამიტომ გამოსცემს მთელ მასივს <code>[1, 2, 3]</code>. მასივის "გასაშლელად" საჭიროა <code>from([1,2,3])</code>, რომელიც დაბეჭდავს 1, 2, 3-ს ცალ-ცალკე.',
          },
          {
            q: 'რამდენჯერ სრულდება <code>new Observable(sub=>{...})</code>-ის producer ფუნქცია, თუ ორმა subscriber-მა გამოიწერა?',
            opts: [
              'ერთხელ — გაზიარებულია ორივესთვის',
              'ორჯერ — თითო subscribe-ზე ცალკე',
              'არასდროს — ის lazy-ა',
              'დამოკიდებულია ოპერატორებზე',
            ],
            correct: 1,
            ex: 'Producer ფუნქცია სრულდება <b>ყოველ subscribe-ზე ცალკე</b>. ორი გამომწერი = ორი დამოუკიდებელი შესრულება. ეს არის <b>cold Observable</b>-ის ბუნება (ლექცია 13-ში ღრმად).',
          },
          {
            q: 'რას აკეთებს teardown ფუნქცია (producer-ის <code>return</code>)?',
            opts: [
              'ხელახლა უშვებს Observable-ს',
              'ასუფთავებს რესურსებს გაუქმებისას (მაგ. <code>clearInterval</code>)',
              'გარდაქმნის მნიშვნელობებს',
              'ამატებს error handling-ს',
            ],
            correct: 1,
            ex: 'Teardown ფუნქცია <b>ასუფთავებს რესურსებს</b> — ის ავტომატურად გამოიძახება <code>unsubscribe</code>-ზე ან <code>complete</code>/<code>error</code>-ზე. ტაიმერების, listener-ების, WebSocket-ების გასუფთავება აქ ხდება, რაც leak-ს გვაცილებს.',
          },
          {
            q: 'რომელი <b>არ არის</b> გზა, რომ Observable-ის ნაკადი დაიხუროს?',
            opts: [
              '<code>complete()</code> — წარმატებით დასრულდა',
              '<code>error(err)</code> — შეცდომით დასრულდა',
              '<code>unsubscribe()</code> — ხელით გავაუქმეთ',
              '<code>next(null)</code> — null-ის გამოშვება',
            ],
            correct: 3,
            ex: '<code>next(null)</code> უბრალოდ <b>null მნიშვნელობას გამოსცემს</b> — ნაკადი ღია რჩება. დახურვის სამი ნამდვილი გზაა: <code>complete</code>, <code>error</code> და <code>unsubscribe</code>. სამივე იწვევს teardown-ს.',
          },
        ],
      },
    ],
    verdict: {
      perfect: { title: 'უნაკლო ნაკადი! 🌊', sub: 'ორივე ლექცია მყარად გაქვს გააზრებული. მზად ხარ ლექცია 3-ისთვის.' },
      strong: { title: 'ძლიერი შედეგი', sub: 'საფუძველი კარგად გიდევს. გადახედე ერთ-ორ ახსნას და გააგრძელე.' },
      ok: { title: 'კარგი დასაწყისი', sub: 'ბაზისი გაქვს, მაგრამ ღირს ლექცია 1–2-ის ხელახლა გადათვალიერება.' },
      weak: { title: 'დაბრუნდი ლექციებზე', sub: 'მთავარი ცნებები — lazy, Push/Pull, teardown — კიდევ ერთხელ გავიმეოროთ.' },
    },
    footerLine: '<span class="m-bar">next → error → complete</span> <span class="m-bar">|</span>',
  },

  '3': {
    id: '3',
    heading: { prefix: 'ლექცია', accent: '3' },
    chips: [
      '<b>8</b> კითხვა',
      'არჩევითპასუხიანი',
      'Creation ოპერატორები',
      '<code style="color:var(--stream)">interval · timer · fromEvent · defer</code>',
    ],
    variant: 'indigo',
    sections: [
      {
        numberLabel: 'ლექცია 3',
        title: 'Creation ოპერატორები',
        prefix: 'q',
        questions: [
          {
            q: 'რა თანმიმდევრობით და როდის გამოსცემს <code>interval(1000)</code> პირველ მნიშვნელობას?',
            opts: [
              '<code>0</code>-ს მაშინვე, subscribe-ისთანავე',
              '<code>0</code>-ს 1 წამის შემდეგ (period-ის გასვლისას)',
              '<code>1</code>-ს მაშინვე',
              'დამოკიდებულია subscriber-ების რაოდენობაზე',
            ],
            correct: 1,
            ex: '<code>interval</code> პირველ მნიშვნელობას (<code>0</code>) გამოსცემს <b>მხოლოდ პირველი period-ის გასვლის შემდეგ</b> — არა მაშინვე. თუ პირველი ტკიპი მაშინვე გინდა, გამოიყენე <code>timer(0, 1000)</code>.',
          },
          {
            q: 'რითი განსხვავდება <code>timer(3000, 1000)</code>?',
            opts: [
              'გამოსცემს ერთ მნიშვნელობას 3წმ-ის შემდეგ და სრულდება',
              'დაელოდება 3წმ, გამოსცემს 0-ს, მერე ყოველ 1წმ-ში 1,2,3,... (უსასრულოდ)',
              'გამოსცემს 3-ს ერთხელ, მერე 1000-ს',
              'იგივეა, რაც <code>interval(3000)</code>',
            ],
            correct: 1,
            ex: 'ორ არგუმენტიანი <code>timer(delay, period)</code>: პირველი არგუმენტი — <b>საწყისი დაყოვნება</b> (3წმ), მეორე — <b>შემდგომი ინტერვალი</b> (1წმ). ერთ არგუმენტიანი <code>timer(3000)</code> კი ერთ მნიშვნელობას გამოსცემდა და სრულდებოდა.',
          },
          {
            q: 'რას დაბეჭდავს <code>range(5, 3)</code>?',
            opts: ['5, 6, 7', '3, 4, 5', '5, 8', '0, 1, 2, 3, 4'],
            correct: 0,
            ex: '<code>range(start, count)</code>: <code>start</code>-იდან <b><code>count</code> ცალი</b> ზედიზედ რიცხვი. <code>range(5, 3)</code> = 5-იდან 3 ცალი = <b>5, 6, 7</b>. სინქრონულად, მერე complete.',
          },
          {
            q: 'რას აკეთებს <code>fromEvent(button, "click")</code>-ის <code>unsubscribe</code> listener-თან?',
            opts: [
              'არაფერს — listener ხელით უნდა მოიხსნას',
              'ავტომატურად იძახებს <code>removeEventListener</code>-ს',
              'შლის მთელ ღილაკს DOM-იდან',
              'ჩერდება, მაგრამ listener რჩება memory-ში',
            ],
            correct: 1,
            ex: '<code>fromEvent</code>-ის <code>unsubscribe</code> <b>ავტომატურად</b> იძახებს <code>removeEventListener</code>-ს. teardown ხელით არ გჭირდება — RxJS თავად ასუფთავებს, რაც leak-ს გვაცილებს.',
          },
          {
            q: 'რომელი აღწერს <code>EMPTY</code>-ს სწორად?',
            opts: [
              'გამოსცემს ერთ null-ს და სრულდება',
              'არასდროს არაფერს აკეთებს (ღიად რჩება)',
              'მაშინვე სრულდება, არც ერთი მნიშვნელობის გამოშვების გარეშე',
              'მაშინვე აგდებს error-ს',
            ],
            correct: 2,
            ex: '<code>EMPTY</code> <b>მაშინვე იძახებს <code>complete</code>-ს</b>, არც ერთი <code>next</code>-ის გარეშე. შეადარე: <code>NEVER</code> = არასდროს არაფერი (ღიად რჩება); <code>throwError</code> = მაშინვე error.',
          },
          {
            q: 'RxJS 7+-ში როგორია <code>throwError</code>-ის სწორი გამოძახება?',
            opts: [
              '<code>throwError(new Error("boom"))</code>',
              '<code>throwError(() => new Error("boom"))</code>',
              '<code>throwError("boom")</code>',
              '<code>throwError.next(new Error("boom"))</code>',
            ],
            correct: 1,
            ex: 'RxJS 7+-ში <code>throwError</code> იღებს <b>ფაბრიკის ფუნქციას</b>: <code>() => new Error(...)</code>. ძველი <code>throwError(new Error(...))</code> მოძველებულია (deprecated).',
          },
          {
            q: 'რატომ დაბეჭდავს <code>of(Date.now())</code> ორ subscriber-ზე <b>ერთსა და იმავე</b> დროს (2წმ-ის სხვაობის მიუხედავად)?',
            opts: [
              'იმიტომ, რომ <code>of</code> ქეშირებას აკეთებს',
              'იმიტომ, რომ <code>Date.now()</code> ერთხელ, Observable-ის შექმნისას ითვლება',
              'იმიტომ, რომ <code>of</code> ცხელი (hot) Observable-ია',
              'ეს ბაგია RxJS-ში',
            ],
            correct: 1,
            ex: '<code>Date.now()</code> უბრალო JS გამოსახულებაა — ის <b>ერთხელ, <code>of</code>-ის შექმნის მომენტში</b> ითვლება, არა ყოველ subscribe-ზე. ორივე subscriber იმ ერთ დათვლილ მნიშვნელობას იღებს.',
          },
          {
            q: 'როგორ გავასწოროთ ზემოთა პრობლემა, რომ ყოველ subscribe-ზე ახალი დრო მივიღოთ?',
            opts: [
              '<code>defer(() => of(Date.now()))</code>',
              '<code>from(Date.now())</code>',
              '<code>interval(Date.now())</code>',
              'გამოსავალი არ არსებობს <code>of</code>-ით',
            ],
            correct: 0,
            ex: '<code>defer(() => of(Date.now()))</code> — ფაბრიკის ფუნქცია სრულდება <b>ყოველ ცალკე subscribe-ზე</b>, ამიტომ <code>Date.now()</code> ყოველ ჯერზე თავიდან ითვლება. <code>defer</code> eager კოდს lazy-დ აქცევს — ეს ფუნდამენტური პატერნია.',
          },
        ],
      },
    ],
    verdict: {
      perfect: { title: 'უნაკლო ნაკადი! 🌊', sub: 'Creation ოპერატორები მყარად გაქვს. მზად ხარ pipe()-ისა და ოპერატორებისთვის (ლექცია 4).' },
      strong: { title: 'ძლიერი შედეგი', sub: 'timer/interval/defer კარგად გესმის. გადახედე ერთ-ორ ახსნას და გააგრძელე.' },
      ok: { title: 'კარგი დასაწყისი', sub: 'ბაზისი გაქვს, მაგრამ timing-ისა და defer-ის ნიუანსები ღირს გავიმეოროთ.' },
      weak: { title: 'დაბრუნდი ლექციაზე', sub: 'interval vs timer, eager vs lazy, defer — ეს ცნებები კიდევ ერთხელ გავიაროთ.' },
    },
    footerLine: '<span class="m-bar">of · from · interval · timer · range · fromEvent · defer</span>',
  },
};
