/**
 * CATALOGUE LANDING PAGES — Maison d'Or
 * ─────────────────────────────────────────────────────────────
 * Une entrée = une landing page produit optimisée conversion.
 * Ajouter un produit = ajouter un objet dans PRODUCTS (la route
 * /[slug], le SEO, le JSON-LD et le sitemap suivent automatiquement).
 */

export const CDN = "https://res.cloudinary.com/drn1zdkwa/image/upload";
export const img = (path: string, w = 800) => `${CDN}/f_auto,q_auto,w_${w}/${path}`;

export const WHATSAPP = "212722474350";
export const INSTAGRAM = "https://www.instagram.com/maison_dor_accessoires/";

export type Lang = "fr" | "ar";
export type L = { fr: string; ar: string };

export type Variant = { key: string; label: L; img: string };
export type Bundle = { qty: number; unit: number; badge?: L };
export type Benefit = { icon: string; title: L; desc: L };
export type Faq = { q: L; a: L };
export type Review = { name: L; city: L; stars: number; text: L; ago: L };
export type Spec = { label: L; value: L };

export type LPProduct = {
  slug: string;
  id: string;
  type: "Tulip" | "Swan" | "Bracelet";
  emoji: string;
  name: L;
  category: L;
  headline: L;
  subheadline: L;
  price: number;
  compareAt: number;
  rating: number;
  reviewCount: number;
  stock: number;
  hero: string;
  gallery: string[];
  variants: Variant[];
  bundles: Bundle[];
  usps: L[];
  benefits: Benefit[];
  included: L[];
  story: { title: L; body: L };
  specs: Spec[];
  faq: Faq[];
  reviews: Review[];
  upsell: string;
  seo: { title: string; description: string };
};

/* ═══════════════════════════════════════════════════════════
   BLOCS PARTAGÉS — qualité, livraison, garantie
   ═══════════════════════════════════════════════════════════ */

const SPECS_ACIER: Spec[] = [
  { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable plaqué or 18K", ar: "فولاذ مقاوم للصدأ مطلي بذهب 18 قيراط" } },
  { label: { fr: "Pierres", ar: "الأحجار" }, value: { fr: "Cristaux taille marquise sertis à la main", ar: "كريستال مقصوص يدويًا" } },
  { label: { fr: "Contenu", ar: "المحتوى" }, value: { fr: "1 collier + 1 bracelet assorti", ar: "عقد + سوار متناسق" } },
  { label: { fr: "Peau sensible", ar: "البشرة الحساسة" }, value: { fr: "Hypoallergénique · sans nickel", ar: "لا يسبب الحساسية · بدون نيكل" } },
  { label: { fr: "Résistance", ar: "المقاومة" }, value: { fr: "Eau, parfum et crèmes", ar: "الماء والعطر والكريمات" } },
  { label: { fr: "Emballage", ar: "التغليف" }, value: { fr: "Coffret cadeau Maison d'Or offert", ar: "علبة هدية Maison d'Or مجانًا" } },
];

const BENEFITS_BASE: Benefit[] = [
  {
    icon: "✨",
    title: { fr: "Ne noircit pas, ne verdit pas", ar: "لا يسوّد ولا يخضّر" },
    desc: {
      fr: "Le plaquage or 18K sur acier inoxydable garde son éclat même après des mois de port quotidien — contrairement aux bijoux fantaisie du marché.",
      ar: "الطلاء الذهبي 18 قيراط على الفولاذ يحافظ على لمعانه حتى بعد شهور من الاستعمال اليومي — عكس المجوهرات العادية.",
    },
  },
  {
    icon: "💧",
    title: { fr: "Douche, parfum, crème : aucun risque", ar: "الدوش، العطر، الكريم: بلا خطر" },
    desc: {
      fr: "Vous ne l'enlevez plus. Résistant à l'eau et aux produits cosmétiques, il se porte du matin au soir sans précaution particulière.",
      ar: "ما غاديش تحتاجي تنزعيه. مقاوم للماء ومستحضرات التجميل، يتلبس من الصباح للّيل بلا احتياطات.",
    },
  },
  {
    icon: "🌿",
    title: { fr: "Sans nickel, pensé peaux sensibles", ar: "بدون نيكل، مناسب للبشرة الحساسة" },
    desc: {
      fr: "Hypoallergénique : pas de rougeurs, pas de démangeaisons, même si vous réagissez d'habitude aux bijoux.",
      ar: "لا يسبب الحساسية: بلا احمرار ولا حكة، حتى إلى كانت بشرتك حساسة على المجوهرات.",
    },
  },
  {
    icon: "🎁",
    title: { fr: "Livré en coffret cadeau", ar: "يصلك في علبة هدية" },
    desc: {
      fr: "Coffret Maison d'Or inclus, prêt à offrir. Anniversaire, fiançailles, Aïd : vous n'avez rien d'autre à préparer.",
      ar: "علبة Maison d'Or مجانًا، جاهزة للإهداء. عيد ميلاد، خطوبة، العيد: ما غاديش تحتاجي شي حاجة أخرى.",
    },
  },
];

const FAQ_BASE: Faq[] = [
  {
    q: { fr: "Est-ce que je paie à la livraison ?", ar: "واش نخلص عند التوصيل؟" },
    a: {
      fr: "Oui. Vous ne payez rien maintenant. Vous réglez en espèces au livreur, uniquement quand le colis est entre vos mains.",
      ar: "إيه. ما تخلصي والو دابا. تخلصي نقدًا للموصّل، غير منين يوصلك الطرد ليدك.",
    },
  },
  {
    q: { fr: "Combien de temps pour la livraison ?", ar: "شحال ياخد التوصيل؟" },
    a: {
      fr: "24h à 48h à Casablanca et Rabat, 48h à 72h pour le reste du Maroc. Vous êtes appelée pour confirmer avant l'expédition.",
      ar: "من 24 ل 48 ساعة فكازا والرباط، ومن 48 ل 72 ساعة لباقي المغرب. غادي نعيطو ليك باش نأكدو الطلب قبل الإرسال.",
    },
  },
  {
    q: { fr: "La livraison est vraiment gratuite ?", ar: "واش التوصيل مجاني بصح؟" },
    a: {
      fr: "Oui, partout au Maroc, sans montant minimum. Le prix affiché est le prix final que vous payez au livreur.",
      ar: "إيه، فكامل المغرب، بلا حد أدنى. الثمن اللي كتشوفي هو اللي غادي تخلصي للموصّل.",
    },
  },
  {
    q: { fr: "Et si le bijou ne me plaît pas ?", ar: "وإلى ما عجبنيش؟" },
    a: {
      fr: "Vous pouvez ouvrir le colis devant le livreur et vérifier la pièce avant de payer. Si elle ne vous convient pas, vous la refusez sur place.",
      ar: "تقدري تحلي الطرد قدام الموصّل وتشوفي البيجو قبل ما تخلصي. إلى ما عجبكش، ترجعيه فبلاصتو.",
    },
  },
  {
    q: { fr: "La taille convient-elle à tous les poignets ?", ar: "واش القياس كيجي ليكل اليدين؟" },
    a: {
      fr: "Oui. Le bracelet est ajustable avec une chaîne d'extension, et le collier se règle également. Taille unique adaptée à la majorité.",
      ar: "إيه. السوار قابل للتعديل بسلسلة إضافية، والعقد تاني كيتعدل. قياس واحد كيجي لغالبية النساء.",
    },
  },
  {
    q: { fr: "Comment je vous contacte après la commande ?", ar: "كيفاش نتواصل معكم بعد الطلب؟" },
    a: {
      fr: "Par WhatsApp, 7j/7. Notre équipe vous répond et suit votre colis jusqu'à la livraison.",
      ar: "عبر واتساب، 7 أيام فالأسبوع. الفريق ديالنا كيجاوبك وكيتبع الطرد ديالك حتى يوصلك.",
    },
  },
];

const INCLUDED_PARURE: L[] = [
  { fr: "1 collier ajustable serti de cristaux", ar: "عقد قابل للتعديل مرصّع بالكريستال" },
  { fr: "1 bracelet assorti au même motif", ar: "سوار متناسق بنفس التصميم" },
  { fr: "1 coffret cadeau Maison d'Or", ar: "علبة هدية Maison d'Or" },
  { fr: "1 chiffon de polissage offert", ar: "قطعة تلميع مجانية" },
];

/** Packs standards : -20 DH/pièce dès 2, -30 DH/pièce dès 3 */
const bundlesFor = (price: number, d2: number, d3: number): Bundle[] => [
  { qty: 1, unit: price },
  { qty: 2, unit: price - d2, badge: { fr: "Le plus populaire", ar: "الأكثر طلبًا" } },
  { qty: 3, unit: price - d3, badge: { fr: "Meilleure valeur", ar: "أحسن قيمة" } },
];

const rev = (
  nameFr: string,
  nameAr: string,
  cityFr: string,
  cityAr: string,
  textFr: string,
  textAr: string,
  ago: number,
  stars = 5
): Review => ({
  name: { fr: nameFr, ar: nameAr },
  city: { fr: cityFr, ar: cityAr },
  stars,
  text: { fr: textFr, ar: textAr },
  ago: { fr: `il y a ${ago} jours`, ar: `قبل ${ago} أيام` },
});

/* ═══════════════════════════════════════════════════════════
   PRODUITS
   ═══════════════════════════════════════════════════════════ */

export const PRODUCTS: LPProduct[] = [
  /* ── 1. TULIP BICOLORE ────────────────────────────────── */
  {
    slug: "parure-tulip-bicolore",
    id: "tulip-bicolore",
    type: "Tulip",
    emoji: "🌷",
    name: { fr: "Ensemble Tulip Bicolore", ar: "طقم Tulip ثنائي اللون" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "La parure qu'on vous remarque avant même de vous parler",
      ar: "الطقم اللي كيتلاحظ قبل ما تهضري",
    },
    subheadline: {
      fr: "Collier V et bracelet assortis, sertis de cristaux améthyste sur monture dorée feuillage. Plaqué or 18K qui ne ternit pas — livré en coffret, payé à la livraison.",
      ar: "عقد V وسوار متناسق، مرصّعين بكريستال الأميتيست على قاعدة ذهبية بتصميم أوراق. مطلي بذهب 18 قيراط ما كيتغيرش — كيوصل فعلبة، والخلاص عند الاستلام.",
    },
    price: 149,
    compareAt: 219,
    rating: 4.9,
    reviewCount: 127,
    stock: 6,
    hero: "v1782485773/prod5_white_C_c0yb8p.jpg",
    gallery: [
      "v1782485773/prod5_white_C_c0yb8p.jpg",
      "v1782485767/prod4_black_C_r8wqhk.jpg",
      "v1782146354/product_12_lskeyt.png",
      "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png",
    ],
    variants: [
      { key: "bicolore", label: { fr: "Doré · Améthyste", ar: "ذهبي · أميتيست" }, img: "v1782485773/prod5_white_C_c0yb8p.jpg" },
    ],
    bundles: bundlesFor(149, 20, 30),
    usps: [
      { fr: "Plaqué or 18K — ne noircit pas", ar: "مطلي بذهب 18 قيراط — ما كيسودش" },
      { fr: "Collier + bracelet dans un coffret", ar: "عقد + سوار فعلبة هدية" },
      { fr: "Livraison gratuite partout au Maroc", ar: "توصيل مجاني لكامل المغرب" },
      { fr: "Payez uniquement à la réception", ar: "الخلاص غير عند الاستلام" },
    ],
    benefits: [
      {
        icon: "💜",
        title: { fr: "L'améthyste qui capte la lumière", ar: "الأميتيست اللي كيلقط الضوء" },
        desc: {
          fr: "Les cristaux sont disposés en cascade, taille marquise : à chaque mouvement, la parure accroche la lumière et se voit sur les photos comme en vrai.",
          ar: "الكريستال مرتب على شكل شلال: مع كل حركة كيلقط الضو، وكيبان فالتصاور بحال فالحقيقة.",
        },
      },
      ...BENEFITS_BASE.slice(0, 3),
    ],
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Pourquoi elle plaît autant", ar: "علاش كيعجب هاد الطقم بزاف" },
      body: {
        fr: "La plupart des parures bicolores du marché se ternissent en quelques semaines : le laiton doré s'oxyde, la peau verdit, et le bijou finit au fond d'un tiroir. L'Ensemble Tulip Bicolore est construit autrement — une base en acier inoxydable chirurgical, un plaquage or 18K épais, et des cristaux sertis un par un plutôt que collés. Résultat : vous le portez au travail, en soirée, sous la douche, et il garde exactement le même éclat qu'au premier jour. C'est un bijou du quotidien qui se comporte comme un bijou de fête.",
        ar: "غالبية الأطقم ثنائية اللون فالسوق كتسود من بعد شي أسابيع: النحاس المطلي كيتأكسد، الجلد كيخضر، والبيجو كيسالي فقاع التيروار. Tulip ثنائي اللون مصنوع بطريقة أخرى — قاعدة من الفولاذ المقاوم للصدأ، طلاء ذهبي 18 قيراط سميك، وكريستال مرصّع حبة بحبة ماشي ملصوق. النتيجة: كتلبسيه فالخدمة، فالسهرة، وحتى فالدوش، وكيبقى بنفس اللمعان ديال النهار الأول.",
      },
    },
    specs: SPECS_ACIER,
    faq: FAQ_BASE,
    reviews: [
      rev("Sara B.", "سارة ب.", "Casablanca", "الدار البيضاء", "Reçu en 24h, je l'ai ouvert devant le livreur. Franchement pour 149 dh je m'attendais à moins bien. La couleur est exactement comme sur les photos 🥰", "وصلني ف24 ساعة، حليتو قدام الموصّل. بصراحة ب149 درهم كنت كنتسنى شي حاجة أقل. اللون بحال بحال فالتصاور 🥰", 3),
      rev("Imane K.", "إيمان ك.", "Marrakech", "مراكش", "Ça fait 2 mois que je le porte tous les jours, douche comprise, aucune trace de noir. J'ai commandé le 2ème pour ma sœur.", "هادي شهرين وأنا كنلبسو كل نهار، حتى فالدوش، ما كان لا سواد لا والو. طلبت الثاني لختي.", 8),
      rev("Yasmine T.", "ياسمين ت.", "Rabat", "الرباط", "Le coffret fait vraiment cadeau, j'ai rien eu à emballer. Ma mère a adoré ✨", "العلبة كتبان بحال هدية بصح، ما احتاجيتش نغلف والو. ماما عجبها بزاف ✨", 12),
      rev("Nawal A.", "نوال أ.", "Tanger", "طنجة", "J'ai la peau très sensible, je peux rien porter d'habitude. Là aucune rougeur au bout de 3 semaines.", "عندي بشرة حساسة بزاف، عادة ما كنقدرش نلبس والو. هنا ما كان حتى احمرار من بعد 3 سيمانات.", 15),
      rev("Hafsa M.", "حفصة م.", "Fès", "فاس", "Livraison rapide et le vendeur m'a appelée pour confirmer. Sérieux, je recommande.", "التوصيل زربان والبائع عيط ليا باش يأكد. جديين، كنصحكم بيهم.", 21),
      rev("Chaimae R.", "شيماء ر.", "Agadir", "أكادير", "Très joli mais la chaîne est un peu fine à mon goût. Ça reste top pour le prix.", "زوين بزاف ولكن السلسلة شوية رقيقة على ذوقي. ولكن يبقى ممتاز بهاد الثمن.", 26, 4),
    ],
    upsell: "parure-tulip-prestige",
    seo: {
      title: "Ensemble Tulip Bicolore 🌷 Collier + Bracelet Améthyste | Maison d'Or",
      description:
        "Parure Tulip bicolore : collier + bracelet plaqué or 18K sertis de cristaux améthyste. Ne ternit pas, hypoallergénique. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ── 2. TULIP PRESTIGE ────────────────────────────────── */
  {
    slug: "parure-tulip-prestige",
    id: "tulip-prestige",
    type: "Tulip",
    emoji: "👑",
    name: { fr: "Ensemble Tulip Prestige", ar: "طقم Tulip برستيج" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "La parure des grandes occasions, au prix du quotidien",
      ar: "طقم المناسبات الكبار، بثمن اليومي",
    },
    subheadline: {
      fr: "Cristaux améthyste et rosé montés sur monture dorée aux motifs végétaux sculptés. Le modèle Tulip le plus travaillé — et celui qui part le plus vite en fin de semaine.",
      ar: "كريستال أميتيست وزهري على قاعدة ذهبية بنقوش نباتية منحوتة. الموديل الأكثر تفصيلًا فمجموعة Tulip — وهو اللي كيسالي بسرعة فآخر الأسبوع.",
    },
    price: 149,
    compareAt: 229,
    rating: 4.9,
    reviewCount: 94,
    stock: 4,
    hero: "v1782146330/product_1_eufnps.png",
    gallery: [
      "v1782146330/product_1_eufnps.png",
      "v1782485786/prod10_white_c_ffubmd.jpg",
      "v1782485784/prod10_black_c_fwk74g.jpg",
    ],
    variants: [
      { key: "prestige", label: { fr: "Doré · Améthyste & Rose", ar: "ذهبي · أميتيست وزهري" }, img: "v1782146330/product_1_eufnps.png" },
    ],
    bundles: bundlesFor(149, 20, 30),
    usps: [
      { fr: "Sertissage main, motifs sculptés", ar: "ترصيع يدوي ونقوش منحوتة" },
      { fr: "Deux teintes de cristaux", ar: "لونين من الكريستال" },
      { fr: "Livraison gratuite 24h–72h", ar: "توصيل مجاني من 24 ل 72 ساعة" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🌸",
        title: { fr: "Deux teintes, un seul bijou", ar: "لونين، بيجو واحد" },
        desc: {
          fr: "L'alternance améthyste / rosé donne du relief à la parure : elle s'accorde aussi bien avec un caftan qu'avec une tenue de bureau.",
          ar: "التناوب بين الأميتيست والزهري كيعطي عمق للطقم: كيمشي مع القفطان بحال مع لباس الخدمة.",
        },
      },
      {
        icon: "🔍",
        title: { fr: "Le détail qu'on regarde de près", ar: "التفصيل اللي كيتشاف من قريب" },
        desc: {
          fr: "Les motifs végétaux sont sculptés dans la monture, pas imprimés. C'est ce qui fait la différence quand quelqu'un s'approche.",
          ar: "النقوش النباتية منحوتة فالقاعدة، ماشي مطبوعة. هادشي هو الفرق منين شي حد كيقرب.",
        },
      },
      ...BENEFITS_BASE.slice(0, 2),
    ],
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Pour quelles occasions ?", ar: "لأي مناسبات؟" },
      body: {
        fr: "Le Prestige a été pensé pour les moments où l'on veut être vue : fiançailles, mariage d'une amie, dîner de famille, séance photo. Mais comme il est en acier inoxydable plaqué or 18K et non en métal de fantaisie, rien ne vous empêche de le porter un mardi matin. C'est la différence entre un bijou d'occasion qui dort dans une boîte et un bijou que vous portez vraiment. Nos clientes commandent souvent le Prestige pour un événement précis — et finissent par le mettre toutes les semaines.",
        ar: "البرستيج تصمم للحظات اللي بغيتي تبان فيها: الخطوبة، عرس صاحبتك، عشاء العائلة، جلسة تصوير. ولكن حيت مصنوع من الفولاذ المطلي بذهب 18 قيراط ماشي معدن عادي، ما كايناش مشكلة تلبسيه نهار الثلاثاء الصباح. هادا هو الفرق بين بيجو المناسبات اللي كينعس فالعلبة وبيجو كتلبسيه بصح.",
      },
    },
    specs: SPECS_ACIER,
    faq: FAQ_BASE,
    reviews: [
      rev("Meryem L.", "مريم ل.", "Casablanca", "الدار البيضاء", "Je l'ai porté au mariage de ma cousine, 4 personnes m'ont demandé où je l'avais acheté 😅", "لبستو فعرس بنت عمي، 4 نسا سولوني منين شريتو 😅", 5),
      rev("Salma E.", "سلمى إ.", "Rabat", "الرباط", "Le rosé et le violet ensemble c'est vraiment beau en vrai, encore mieux que sur l'écran.", "الزهري والبنفسجي مع بعضهم زوينين بصح، حتى حسن من الشاشة.", 9),
      rev("Fatima Zahra", "فاطمة الزهراء", "Meknès", "مكناس", "Commandé lundi, reçu mercredi à Meknès. Payé au livreur, tout s'est bien passé.", "طلبتو نهار الاثنين، وصلني الأربعاء لمكناس. خلصت للموصّل، وكلشي مشى مزيان.", 14),
      rev("Khadija N.", "خديجة ن.", "Oujda", "وجدة", "La monture est vraiment travaillée, on sent que c'est pas du plastique doré. Très satisfaite.", "القاعدة مشغولة بصح، كيبان بللي ماشي بلاستيك مذهّب. راضية بزاف.", 19),
      rev("Ghita B.", "غيثة ب.", "Tanger", "طنجة", "Un peu attendu 3 jours mais le service WhatsApp était réactif. Le bijou vaut l'attente.", "تسنيت 3 أيام ولكن خدمة واتساب كانت سريعة. البيجو كيستاهل التسناو.", 23, 4),
      rev("Amal S.", "أمل س.", "Safi", "آسفي", "J'ai pris le pack de 2 avec ma sœur, on a économisé et on a la même 💕", "خديت باك ديال 2 مع ختي، وفرنا وولا عندنا بحال بحال 💕", 30),
    ],
    upsell: "parure-tulip-doree",
    seo: {
      title: "Ensemble Tulip Prestige 👑 Parure Améthyste & Rosé | Maison d'Or",
      description:
        "Parure Tulip Prestige : collier + bracelet en cristaux améthyste et rosé, monture dorée sculptée. Hypoallergénique, ne ternit pas. Livraison gratuite, paiement à la réception.",
    },
  },

  /* ── 3. TULIP DORÉE ───────────────────────────────────── */
  {
    slug: "parure-tulip-doree",
    id: "tulip-doree",
    type: "Tulip",
    emoji: "✨",
    name: { fr: "Ensemble Tulip Dorée", ar: "طقم Tulip الذهبي" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "Le doré et le cristal transparent : la combinaison qui va avec tout",
      ar: "الذهبي والكريستال الشفاف: التركيبة اللي كتمشي مع كلشي",
    },
    subheadline: {
      fr: "Collier et bracelet en vigne dorée sertis de cristaux transparents. Aucune couleur à assortir : il se marie avec n'importe quelle tenue, tous les jours de l'année.",
      ar: "عقد وسوار بتصميم أغصان ذهبية مرصّعة بكريستال شفاف. بلا ما تحتاري فاللون: كيمشي مع أي لباس، كل أيام العام.",
    },
    price: 149,
    compareAt: 219,
    rating: 4.8,
    reviewCount: 156,
    stock: 8,
    hero: "v1782485762/prod7_black_C_tlt0av.jpg",
    gallery: [
      "v1782485762/prod7_black_C_tlt0av.jpg",
      "v1782485761/prod7_white_c_qfwvfm.jpg",
      "v1782146339/product_7_jyzzbg.png",
      "v1782146338/product_4_c1mlob.png",
    ],
    variants: [
      { key: "doree", label: { fr: "Doré · Cristal", ar: "ذهبي · كريستال" }, img: "v1782485762/prod7_black_C_tlt0av.jpg" },
      { key: "doree-clair", label: { fr: "Doré · Cristal clair", ar: "ذهبي · كريستال فاتح" }, img: "v1782485761/prod7_white_c_qfwvfm.jpg" },
    ],
    bundles: bundlesFor(149, 20, 30),
    usps: [
      { fr: "Va avec toutes les tenues", ar: "كيمشي مع كل الملابس" },
      { fr: "Cristaux transparents ultra-brillants", ar: "كريستال شفاف لماع بزاف" },
      { fr: "Livraison gratuite au Maroc", ar: "توصيل مجاني فالمغرب" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🤍",
        title: { fr: "Zéro question de couleur", ar: "بلا مشكل ديال اللون" },
        desc: {
          fr: "Le cristal transparent ne rentre en conflit avec aucune couleur de vêtement. C'est la parure qu'on met sans réfléchir le matin.",
          ar: "الكريستال الشفاف ما كيتعاركش مع أي لون ديال الحوايج. هادا هو الطقم اللي كتلبسيه بلا ما تفكري فالصباح.",
        },
      },
      ...BENEFITS_BASE,
    ].slice(0, 4),
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Le bijou le plus porté de la collection", ar: "البيجو الأكثر لبسًا فالمجموعة" },
      body: {
        fr: "C'est notre modèle le plus vendu, et la raison est simple : il ne demande aucun effort. Pas de couleur à assortir, pas d'occasion à attendre. Les cristaux transparents en taille marquise renvoient la lumière comme des pierres bien plus chères, et la vigne dorée reste discrète sur la peau. Beaucoup de clientes le commandent en premier pour tester la qualité — et reviennent ensuite pour un modèle coloré. Si vous hésitez entre plusieurs parures Tulip, commencez par celle-ci.",
        ar: "هادا هو الموديل الأكثر مبيعًا عندنا، والسبب بسيط: ما كيطلب حتى مجهود. بلا لون خاصك تناسبيه، بلا مناسبة خاصك تسناها. الكريستال الشفاف كيرجع الضو بحال حجرة غالية بزاف، والأغصان الذهبية كتبقى هادية على الجلد. بزاف ديال الزبونات كيطلبوه الأول باش يجربو الجودة — ومن بعد كيرجعو لموديل ملون.",
      },
    },
    specs: SPECS_ACIER,
    faq: FAQ_BASE,
    reviews: [
      rev("Loubna H.", "لبنى ح.", "Casablanca", "الدار البيضاء", "Mon 3ème achat chez eux. Celui-là je le mets tous les jours au bureau, il passe partout.", "هادا ثالث شراء عندهم. هادا كنلبسو كل نهار فالخدمة، كيمشي مع كلشي.", 2),
      rev("Ikram D.", "إكرام د.", "Kénitra", "القنيطرة", "Les pierres brillent vraiment beaucoup, on dirait du vrai. Pour ce prix c'est imbattable.", "الحجرات كيبرقو بزاف، بحال الحقيقيين. بهاد الثمن ما كاين منو.", 6),
      rev("Zineb F.", "زينب ف.", "Marrakech", "مراكش", "Je l'ai offert à ma belle-mère, elle m'a appelée pour me remercier deux fois 😂", "أهديتو لعمتي، عيطات ليا باش تشكرني جوج مرات 😂", 11),
      rev("Hind M.", "هند م.", "Tétouan", "تطوان", "Emballage soigné, bijou conforme. Livreur arrivé le lendemain, rien à redire.", "التغليف مزيان، والبيجو مطابق. الموصّل جا غدا، ما عندي ما نقول.", 17),
      rev("Rania A.", "رانية أ.", "El Jadida", "الجديدة", "Simple et élégant. Je cherchais quelque chose de discret pour le travail, c'est parfait.", "بسيط وأنيق. كنت كنقلب على شي حاجة هادية للخدمة، وهادا مزيان بزاف.", 24),
      rev("Souad B.", "سعاد ب.", "Nador", "الناظور", "Reçu en 3 jours au lieu de 2, mais la qualité est là. Je recommande quand même.", "وصلني ف3 أيام عوض 2، ولكن الجودة كاينة. كنصح بيه على كل حال.", 29, 4),
    ],
    upsell: "parure-tulip-argentee",
    seo: {
      title: "Ensemble Tulip Dorée ✨ Collier + Bracelet Cristal | Maison d'Or",
      description:
        "Parure Tulip Dorée : collier + bracelet en vigne dorée sertis de cristaux transparents. Résiste à l'eau et au parfum. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ── 4. TULIP ARGENTÉE ────────────────────────────────── */
  {
    slug: "parure-tulip-argentee",
    id: "tulip-argentee",
    type: "Tulip",
    emoji: "🤍",
    name: { fr: "Ensemble Tulip Argentée", ar: "طقم Tulip الفضي" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "Pour celles qui préfèrent l'argent au doré",
      ar: "لللي كتفضل الفضي على الذهبي",
    },
    subheadline: {
      fr: "Argent rhodié et cristaux transparents taille marquise. Une élégance sobre, sans ostentation — le bijou qui se remarque sans crier.",
      ar: "فضة مرصّعة وكريستال شفاف. أناقة هادية بلا مبالغة — البيجو اللي كيتلاحظ بلا ما يغوّت.",
    },
    price: 149,
    compareAt: 219,
    rating: 4.8,
    reviewCount: 88,
    stock: 7,
    hero: "v1782485785/prod9_white_c_b55akf.jpg",
    gallery: [
      "v1782485785/prod9_white_c_b55akf.jpg",
      "v1782485777/prod9_black_c_m47wyw.jpg",
    ],
    variants: [
      { key: "argentee", label: { fr: "Argenté · Cristal", ar: "فضي · كريستال" }, img: "v1782485785/prod9_white_c_b55akf.jpg" },
    ],
    bundles: bundlesFor(149, 20, 30),
    usps: [
      { fr: "Argent rhodié, ne s'oxyde pas", ar: "فضة مرصّعة ما كتتأكسدش" },
      { fr: "Taille marquise, éclat maximal", ar: "قص مارکيز، لمعان أقصى" },
      { fr: "Livraison gratuite 24h–72h", ar: "توصيل مجاني من 24 ل 72 ساعة" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🌙",
        title: { fr: "L'argent qui ne noircit pas", ar: "الفضي اللي ما كيسودش" },
        desc: {
          fr: "Le rhodiage protège la surface : contrairement à l'argent classique, vous n'aurez jamais à le frotter pour lui rendre son éclat.",
          ar: "الطلاء كيحمي السطح: عكس الفضة العادية، عمرك ما غادي تحتاجي تحكيه باش يرجع ليه اللمعان.",
        },
      },
      ...BENEFITS_BASE.slice(1, 4),
    ],
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Argent ou doré : comment choisir", ar: "فضي ولا ذهبي: كيفاش تختاري" },
      body: {
        fr: "Règle simple : si les veines de votre poignet tirent vers le bleu, l'argent vous ira mieux ; si elles tirent vers le vert, c'est le doré. Mais au-delà de la théorie, l'argenté a un avantage pratique : il se marie avec une montre en acier, des lunettes fines, un sac à fermoir argenté — l'ensemble reste cohérent. C'est aussi le choix de celles qui trouvent le doré trop voyant au quotidien. La parure Tulip Argentée est notre réponse à cette demande : même travail de sertissage, même résistance, teinte plus discrète.",
        ar: "قاعدة بسيطة: إلى كانو العروق ديال يدك ضاربين للزرق، الفضي غادي يجيك حسن؛ وإلى ضاربين للخضر، الذهبي. ولكن بعيدًا على النظرية، الفضي عندو فايدة عملية: كيمشي مع ماكينة ديال الفولاذ، نظاظر رقاق، وساك بقفل فضي. وهو تاني اختيار لللي كيشوفو الذهبي بزاف فاليومي.",
      },
    },
    specs: [
      { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable rhodié argent", ar: "فولاذ مقاوم للصدأ مطلي بالفضة" } },
      ...SPECS_ACIER.slice(1),
    ],
    faq: FAQ_BASE,
    reviews: [
      rev("Btissam O.", "ابتسام و.", "Rabat", "الرباط", "Enfin une parure argentée qui ne noircit pas au bout d'un mois. Ça faisait longtemps que je cherchais.", "أخيرًا طقم فضي ما كيسودش من بعد شهر. هادي مدة وأنا كنقلب.", 4),
      rev("Nada C.", "ندى س.", "Casablanca", "الدار البيضاء", "Je porte une montre en acier, ça va parfaitement ensemble. Très contente.", "كنلبس ماكينة ديال الفولاذ، وكيمشيو مزيان مع بعضهم. راضية بزاف.", 7),
      rev("Oumaima Z.", "أميمة ز.", "Fès", "فاس", "Discret et classe, exactement ce que je voulais pour tous les jours.", "هادي وأنيقة، بالضبط اللي كنت بغيت لليومي.", 13),
      rev("Sanae K.", "سناء ك.", "Agadir", "أكادير", "Les cristaux brillent beaucoup plus que ce que je pensais. Bonne surprise.", "الكريستال كيبرق بزاف أكثر مما كنت كنتصور. مفاجأة زوينة.", 18),
      rev("Widad L.", "وداد ل.", "Beni Mellal", "بني ملال", "Livraison à Beni Mellal en 2 jours, payé au livreur. Aucun souci.", "التوصيل لبني ملال ف يومين، خلصت للموصّل. بلا حتى مشكل.", 22),
      rev("Asmae T.", "أسماء ت.", "Salé", "سلا", "Joli mais j'aurais aimé un fermoir un peu plus solide. Sinon rien à dire.", "زوين ولكن كنت نبغي القفل يكون شوية قوي. غير هادشي ما عندي ما نقول.", 27, 4),
    ],
    upsell: "parure-tulip-rouge",
    seo: {
      title: "Ensemble Tulip Argentée 🤍 Parure Cristal Argent | Maison d'Or",
      description:
        "Parure Tulip Argentée : collier + bracelet en argent rhodié sertis de cristaux marquise. Hypoallergénique, ne noircit pas. Livraison gratuite au Maroc, paiement à la réception.",
    },
  },

  /* ── 5. TULIP ROUGE ───────────────────────────────────── */
  {
    slug: "parure-tulip-rouge",
    id: "tulip-rouge",
    type: "Tulip",
    emoji: "❤️",
    name: { fr: "Ensemble Tulip Rouge", ar: "طقم Tulip الأحمر" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "Rouge rubis : le bijou qu'on ne peut pas ignorer",
      ar: "أحمر ياقوتي: البيجو اللي ما يمكنش تجاهلو",
    },
    subheadline: {
      fr: "Cristaux rouge rubis sur monture argentée, dessinés en motifs floraux. Pour les soirées, les caftans, et les femmes qui n'ont pas envie de passer inaperçues.",
      ar: "كريستال أحمر ياقوتي على قاعدة فضية، بتصميم زهري. للسهرات، للقفاطن، وللنساء اللي ما بغاوش يمرو بلا ما يتلاحظو.",
    },
    price: 149,
    compareAt: 229,
    rating: 4.9,
    reviewCount: 71,
    stock: 5,
    hero: "v1782485761/prod1_black_caree_dddkql.jpg",
    gallery: [
      "v1782485761/prod1_black_caree_dddkql.jpg",
      "v1782513698/image_1782513620489_7rhkph_vjjjbk.jpg",
    ],
    variants: [
      { key: "rouge", label: { fr: "Argenté · Rubis", ar: "فضي · ياقوتي" }, img: "v1782485761/prod1_black_caree_dddkql.jpg" },
    ],
    bundles: bundlesFor(149, 20, 30),
    usps: [
      { fr: "Rouge rubis intense", ar: "أحمر ياقوتي قوي" },
      { fr: "Parfait avec un caftan", ar: "مثالي مع القفطان" },
      { fr: "Livraison gratuite au Maroc", ar: "توصيل مجاني فالمغرب" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🔥",
        title: { fr: "La couleur qui structure une tenue", ar: "اللون اللي كينظم اللبسة" },
        desc: {
          fr: "Un rouge profond sur monture argentée : il suffit à donner du caractère à une tenue neutre, sans avoir besoin d'autre accessoire.",
          ar: "أحمر عميق على قاعدة فضية: كافي باش يعطي شخصية للبسة عادية، بلا ما تحتاجي أي إكسسوار آخر.",
        },
      },
      {
        icon: "👗",
        title: { fr: "Pensé pour le caftan et la soirée", ar: "مصمم للقفطان والسهرة" },
        desc: {
          fr: "Le rubis ressort particulièrement sur les tissus dorés, blancs et noirs — les trois bases du caftan marocain.",
          ar: "الياقوتي كيبان بزاف على الأثواب الذهبية، البيضة والكحلة — الثلاثة ديال القفطان المغربي.",
        },
      },
      ...BENEFITS_BASE.slice(0, 2),
    ],
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Un rouge qui ne vire pas au orange", ar: "أحمر ما كيولّيش برتقالي" },
      body: {
        fr: "Le problème des bijoux rouges bon marché, c'est la pierre : un verre teinté qui vire à l'orange sous la lumière artificielle et qui perd sa couleur en quelques mois. Ici, les cristaux sont teintés dans la masse et sertis griffe par griffe. Sous les lumières d'une salle de fête comme à la lumière du jour, le rouge reste profond, presque bordeaux. C'est ce qui permet à la parure de fonctionner aussi bien sur un caftan doré que sur une simple robe noire.",
        ar: "المشكل ديال المجوهرات الحمرة الرخيصة هو الحجرة: زاج ملون كيولي برتقالي تحت الضو الاصطناعي وكيسالي لونو من بعد شهور. هنا، الكريستال ملون فالعمق ومرصّع حبة بحبة. تحت أضواء قاعة الأعراس ولا فضو النهار، الأحمر كيبقى عميق، قريب للبوردو.",
      },
    },
    specs: [
      { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable rhodié argent", ar: "فولاذ مقاوم للصدأ مطلي بالفضة" } },
      { label: { fr: "Pierres", ar: "الأحجار" }, value: { fr: "Cristaux rouge rubis sertis griffes", ar: "كريستال أحمر ياقوتي مرصّع" } },
      ...SPECS_ACIER.slice(2),
    ],
    faq: FAQ_BASE,
    reviews: [
      rev("Kenza M.", "كنزة م.", "Casablanca", "الدار البيضاء", "Porté sur un caftan blanc pour un mariage, effet garanti. Le rouge est vraiment profond.", "لبستو على قفطان أبيض فعرس، والنتيجة مضمونة. الأحمر عميق بصح.", 3),
      rev("Rim A.", "ريم أ.", "Marrakech", "مراكش", "J'avais peur que ça fasse trop, mais non, c'est élégant. Beaucoup de compliments.", "كنت خايفة يكون بزاف، ولكن لا، أنيق. تلقيت بزاف ديال المجاملات.", 10),
      rev("Doha B.", "ضحى ب.", "Rabat", "الرباط", "Reçu très vite, coffret impeccable. Je le garde pour l'Aïd.", "وصلني بزربة، العلبة نقية. غادي نحتافظ بيه للعيد.", 16),
      rev("Hajar S.", "هاجر س.", "Tanger", "طنجة", "La couleur est fidèle aux photos, ça c'est important. Merci.", "اللون مطابق للتصاور، وهادشي مهم. شكرًا.", 20),
      rev("Nisrine K.", "نسرين ك.", "Khouribga", "خريبكة", "Très belle parure, ma fille me l'emprunte tout le temps 😅", "طقم زوين بزاف، بنتي ديما كتسلفو مني 😅", 25),
      rev("Maria E.", "ماريا إ.", "Mohammedia", "المحمدية", "Bien mais le collier est un peu court pour moi. Le bracelet par contre est parfait.", "مزيان ولكن العقد شوية قصير عليا. السوار بالعكس مزيان.", 28, 4),
    ],
    upsell: "parure-swan-noir",
    seo: {
      title: "Ensemble Tulip Rouge ❤️ Parure Cristal Rubis | Maison d'Or",
      description:
        "Parure Tulip Rouge : collier + bracelet en cristaux rouge rubis sur monture argentée. Idéale caftan et soirée. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ── 6. SWAN NOIR ─────────────────────────────────────── */
  {
    slug: "parure-swan-noir",
    id: "swan-noir",
    type: "Swan",
    emoji: "🦢",
    name: { fr: "Ensemble Swan Améthyste", ar: "طقم Swan أميتيست" },
    category: { fr: "Parures Swan", ar: "أطقم Swan" },
    headline: {
      fr: "Le pendentif cygne qu'on vous demandera d'où il vient",
      ar: "دلاية البجعة اللي غادي يسولوك منين جبتيها",
    },
    subheadline: {
      fr: "Collier et bracelet en cristaux violets sur argent rhodié, sublimés par un pendentif cygne sculpté. Une pièce qui raconte quelque chose — pas juste une pierre de plus.",
      ar: "عقد وسوار بكريستال بنفسجي على فضة، مع دلاية بجعة منحوتة. قطعة كتحكي شي حاجة — ماشي غير حجرة زايدة.",
    },
    price: 139,
    compareAt: 199,
    rating: 4.9,
    reviewCount: 143,
    stock: 6,
    hero: "v1782146353/product_11_hr9u2c.png",
    gallery: [
      "v1782146353/product_11_hr9u2c.png",
      "v1782485788/prod12_black_c_nqjzw6.jpg",
      "v1782485789/prod12_white_c_cg7zrs.jpg",
      "v1782146355/product_10_gebr70.png",
    ],
    variants: [
      { key: "noir", label: { fr: "Argenté · Améthyste", ar: "فضي · أميتيست" }, img: "v1782146353/product_11_hr9u2c.png" },
      { key: "noir-nuit", label: { fr: "Argenté · Nuit", ar: "فضي · ليلي" }, img: "v1782485788/prod12_black_c_nqjzw6.jpg" },
    ],
    bundles: bundlesFor(139, 20, 30),
    usps: [
      { fr: "Pendentif cygne sculpté", ar: "دلاية بجعة منحوتة" },
      { fr: "Cristaux améthyste sur argent", ar: "كريستال أميتيست على الفضة" },
      { fr: "Livraison gratuite au Maroc", ar: "توصيل مجاني فالمغرب" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🦢",
        title: { fr: "Un pendentif, pas un simple pendentif", ar: "دلاية، ماشي غير دلاية" },
        desc: {
          fr: "Le cygne est sculpté en volume, avec le cou et les ailes détaillés. C'est ce relief qui attire l'œil et déclenche la question « il vient d'où ? ».",
          ar: "البجعة منحوتة بحجم كامل، بالعنق والجوانح مفصلين. هاد البروز هو اللي كيجبد العين وكيخلي الناس تسول «منين هادي؟».",
        },
      },
      {
        icon: "💜",
        title: { fr: "Le violet qui va aux peaux mates", ar: "البنفسجي اللي كيجي للبشرة القمحية" },
        desc: {
          fr: "L'améthyste sur base argentée est l'une des rares associations qui met en valeur les carnations mates sans les éteindre.",
          ar: "الأميتيست على قاعدة فضية من قلال التركيبات اللي كتبرز البشرة القمحية بلا ما تطفيها.",
        },
      },
      ...BENEFITS_BASE.slice(0, 2),
    ],
    included: [
      { fr: "1 collier avec pendentif cygne", ar: "عقد بدلاية البجعة" },
      { fr: "1 bracelet assorti", ar: "سوار متناسق" },
      { fr: "1 coffret cadeau Maison d'Or", ar: "علبة هدية Maison d'Or" },
      { fr: "1 chiffon de polissage offert", ar: "قطعة تلميع مجانية" },
    ],
    story: {
      title: { fr: "Pourquoi le cygne", ar: "علاش البجعة" },
      body: {
        fr: "Le cygne est l'un des rares symboles universellement associés à la grâce et à la fidélité — c'est pour ça qu'il revient si souvent dans les cadeaux d'anniversaire et de fiançailles. Sur cette parure, il n'est pas décoratif : il est le point d'accroche du regard, posé au creux du cou, entouré de cristaux améthyste qui l'encadrent sans lui voler la vedette. C'est ce qui distingue l'Ensemble Swan d'une parure classique : on ne remarque pas d'abord les pierres, on remarque le motif. Et un motif, ça se retient.",
        ar: "البجعة من قلال الرموز المرتبطة عالميًا بالرشاقة والوفاء — وعلاش كتجي بزاف فهدايا عيد الميلاد والخطوبة. فهاد الطقم، ماشي غير للزينة: هي نقطة اللي كتجبد العين، محطوطة فوسط العنق، محاطة بكريستال الأميتيست اللي كيأطرها بلا ما يسرق منها الأضواء.",
      },
    },
    specs: [
      { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable rhodié argent", ar: "فولاذ مقاوم للصدأ مطلي بالفضة" } },
      { label: { fr: "Motif", ar: "التصميم" }, value: { fr: "Pendentif cygne sculpté en volume", ar: "دلاية بجعة منحوتة" } },
      ...SPECS_ACIER.slice(2),
    ],
    faq: FAQ_BASE,
    reviews: [
      rev("Soukaina R.", "سكينة ر.", "Casablanca", "الدار البيضاء", "Le cygne est vraiment détaillé, on le voit bien. Ma collègue m'a demandé le lien direct 😄", "البجعة مفصلة بصح، كتبان مزيان. صاحبتي فالخدمة طلبات مني اللينك ديريكت 😄", 2),
      rev("Fadwa L.", "فدوى ل.", "Rabat", "الرباط", "Je l'ai commandé pour l'anniversaire de ma sœur, elle a pleuré 🥹 Le coffret aide beaucoup.", "طلبتو لعيد ميلاد ختي، بكات 🥹 العلبة عاونات بزاف.", 6),
      rev("Aya B.", "آية ب.", "Marrakech", "مراكش", "Le violet est magnifique sur la peau mate. Je confirme ce qui est écrit.", "البنفسجي زوين بزاف على البشرة القمحية. كنأكد اللي مكتوب.", 12),
      rev("Latifa H.", "لطيفة ح.", "Meknès", "مكناس", "Reçu en 48h, tout conforme, payé sur place. Rien à redire.", "وصلني ف48 ساعة، كلشي مطابق، خلصت فبلاصتي. ما عندي ما نقول.", 15),
      rev("Chaima N.", "شيماء ن.", "Oujda", "وجدة", "3ème commande, jamais déçue. Cette fois j'ai pris le pack de 2.", "ثالث طلبية، عمري ما تخيبت. هاد المرة خديت باك ديال 2.", 19),
      rev("Ilham T.", "إلهام ت.", "Kénitra", "القنيطرة", "Très joli, mais je pensais que le pendentif serait un peu plus grand. Ça reste très beau.", "زوين بزاف، ولكن كنت كنضن الدلاية غادي تكون شوية كبيرة. ولكن يبقى زوين.", 24, 4),
    ],
    upsell: "parure-swan-blanc",
    seo: {
      title: "Ensemble Swan Améthyste 🦢 Collier Pendentif Cygne | Maison d'Or",
      description:
        "Parure Swan : collier pendentif cygne + bracelet en cristaux améthyste sur argent rhodié. Ne ternit pas, hypoallergénique. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ── 7. SWAN BLANC ────────────────────────────────────── */
  {
    slug: "parure-swan-blanc",
    id: "swan-blanc",
    type: "Swan",
    emoji: "🕊️",
    name: { fr: "Ensemble Swan Blanc", ar: "طقم Swan الأبيض" },
    category: { fr: "Parures Swan", ar: "أطقم Swan" },
    headline: {
      fr: "La version pure du cygne — celle qu'on offre",
      ar: "النسخة الصافية ديال البجعة — اللي كتنهدى",
    },
    subheadline: {
      fr: "Cristaux transparents et pendentif cygne en argent rhodié. Le cadeau qui ne prend aucun risque : il va à toutes les tenues, à tous les âges, à toutes les occasions.",
      ar: "كريستال شفاف ودلاية بجعة فضية. الهدية اللي ما فيها خطر: كتمشي مع كل الملابس، كل الأعمار، وكل المناسبات.",
    },
    price: 139,
    compareAt: 199,
    rating: 4.9,
    reviewCount: 108,
    stock: 9,
    hero: "v1782146354/product_9_d9gry9.png",
    gallery: [
      "v1782146354/product_9_d9gry9.png",
      "v1782146355/product_10_gebr70.png",
    ],
    variants: [
      { key: "blanc", label: { fr: "Argenté · Blanc", ar: "فضي · أبيض" }, img: "v1782146354/product_9_d9gry9.png" },
    ],
    bundles: bundlesFor(139, 20, 30),
    usps: [
      { fr: "Le cadeau qui plaît à coup sûr", ar: "الهدية اللي كتعجب ديما" },
      { fr: "Pendentif cygne + cristaux clairs", ar: "دلاية بجعة + كريستال شفاف" },
      { fr: "Coffret cadeau inclus", ar: "علبة هدية مجانية" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🎀",
        title: { fr: "Le cadeau sans risque de se tromper", ar: "الهدية بلا خطر ديال الغلط" },
        desc: {
          fr: "Blanc et argent : aucune couleur à deviner, aucune taille à demander. C'est le cadeau que vous pouvez commander sans poser de questions à la personne.",
          ar: "أبيض وفضي: بلا لون خاصك تخمن، بلا قياس خاصك تسول. هادي هي الهدية اللي تقدر تطلبها بلا ما تسول الشخص.",
        },
      },
      ...BENEFITS_BASE.slice(0, 3),
    ],
    included: [
      { fr: "1 collier avec pendentif cygne", ar: "عقد بدلاية البجعة" },
      { fr: "1 bracelet assorti", ar: "سوار متناسق" },
      { fr: "1 coffret cadeau Maison d'Or", ar: "علبة هدية Maison d'Or" },
      { fr: "1 chiffon de polissage offert", ar: "قطعة تلميع مجانية" },
    ],
    story: {
      title: { fr: "Le modèle le plus offert de la collection", ar: "الموديل الأكثر إهداءً فالمجموعة" },
      body: {
        fr: "Sur dix Ensembles Swan Blanc commandés, sept partent en cadeau. La raison est pratique autant qu'esthétique : le blanc et l'argent ne dépendent ni du teint, ni de la garde-robe, ni de l'âge de la personne. Une lycéenne, une jeune mariée et une mère de famille peuvent porter exactement la même pièce sans que ça détonne. Ajoutez le coffret Maison d'Or fourni et vous avez un cadeau prêt à offrir, livré chez vous en 24 à 72h, payé à la réception. C'est pour cette raison que ce modèle est notre plus gros volume à l'approche de l'Aïd et de la rentrée.",
        ar: "من كل 10 أطقم Swan أبيض مطلوبة، 7 كيمشيو هدية. السبب عملي بحال ما هو جمالي: الأبيض والفضي ما كيعتمدوش على لون البشرة، ولا على الملابس، ولا على العمر. تلميذة، عروسة جديدة، وأم ديال دار يقدرو يلبسو نفس القطعة بلا مشكل. زيد العلبة ديال Maison d'Or وعندك هدية جاهزة، كتوصلك ف24 ل72 ساعة، وكتخلص عند الاستلام.",
      },
    },
    specs: [
      { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable rhodié argent", ar: "فولاذ مقاوم للصدأ مطلي بالفضة" } },
      { label: { fr: "Motif", ar: "التصميم" }, value: { fr: "Pendentif cygne sculpté en volume", ar: "دلاية بجعة منحوتة" } },
      ...SPECS_ACIER.slice(2),
    ],
    faq: FAQ_BASE,
    reviews: [
      rev("Hanane B.", "حنان ب.", "Casablanca", "الدار البيضاء", "Offert à ma nièce pour sa réussite au bac, elle l'a mis direct. Coffret très propre.", "أهديتو لبنت ختي على نجاحها فالباك، لبساتو ديريكت. العلبة نقية بزاف.", 4),
      rev("Siham D.", "سهام د.", "Rabat", "الرباط", "Simple, propre, ça brille bien. Pour 139 dh avec livraison gratuite c'est correct.", "بسيط، نقي، وكيبرق مزيان. ب139 درهم مع التوصيل المجاني، معقول.", 8),
      rev("Wafa M.", "وفاء م.", "Tanger", "طنجة", "Je l'ai pris pour moi finalement 😂 le cygne est trop mignon.", "خديتو ليا أنا فالأخير 😂 البجعة زوينة بزاف.", 13),
      rev("Naima F.", "نعيمة ف.", "Safi", "آسفي", "Livraison en 3 jours à Safi, le livreur a appelé avant. Service correct.", "التوصيل ف3 أيام لآسفي، الموصّل عيط قبل. خدمة مزيانة.", 17),
      rev("Zahra A.", "زهرة أ.", "Marrakech", "مراكش", "Ma fille de 16 ans le porte tous les jours, aucune allergie. C'est ce qui m'importait.", "بنتي عندها 16 عام كتلبسو كل نهار، بلا حساسية. وهادشي هو اللي كان يهمني.", 22),
      rev("Sabrine K.", "صبرين ك.", "Nador", "الناظور", "Bien reçu, joli. Juste la chaîne du bracelet un peu fine mais ça va.", "توصلت، زوين. غير السلسلة ديال السوار شوية رقيقة ولكن لاباس.", 26, 4),
    ],
    upsell: "parure-tulip-bicolore",
    seo: {
      title: "Ensemble Swan Blanc 🕊️ Collier Cygne Cristal | Maison d'Or",
      description:
        "Parure Swan Blanc : collier pendentif cygne + bracelet en cristaux transparents sur argent rhodié. Cadeau idéal, coffret inclus. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ── 8. BRACELETS TULIP ───────────────────────────────── */
  {
    slug: "bracelet-tulip",
    id: "tulip-bracelets",
    type: "Bracelet",
    emoji: "🌸",
    name: { fr: "Bracelet Tulip", ar: "سوار Tulip" },
    category: { fr: "Bracelets", ar: "أساور" },
    headline: {
      fr: "7 coloris, 99 dh pièce — celui qu'on porte en accumulation",
      ar: "7 ألوان، 99 درهم للقطعة — اللي كيتلبس مركّب",
    },
    subheadline: {
      fr: "Bracelet en acier inoxydable serti de cristaux en motif floral. Assez fin pour s'empiler, assez solide pour ne jamais l'enlever. Choisissez votre coloris.",
      ar: "سوار من الفولاذ المقاوم للصدأ مرصّع بالكريستال بتصميم زهري. رقيق باش تركبي أكثر من واحد، وقوي باش ما تنزعيهش أبدًا. ختاري اللون ديالك.",
    },
    price: 99,
    compareAt: 169,
    rating: 4.8,
    reviewCount: 214,
    stock: 12,
    hero: "v1783970110/b03f100966953754e42c6a0362c26fc8_1_1783969577_7111_qeazz3.png",
    gallery: [
      "v1783970110/b03f100966953754e42c6a0362c26fc8_1_1783969577_7111_qeazz3.png",
      "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png",
      "v1783970532/1d4a9ad34ffcf503e5f00d7d382d5539_1783970466945_fjla1y.png",
      "v1783970789/7c8c9bed4a89e631817eb9b30b295f4c_1783970728862_ge8tku.png",
      "v1783975633/0df7fbff10510a6f9166dafb74476594_1_1783975529_3558_1_qaht3w.png",
      "v1783970333/923c021705d00157b6d5caca46c40f77_1_1783969874_6864_slrd7d.png",
      "v1783970701/4f65dcf49a67ed61428e243c172e7b67_1_1783970597_2135_h0dl2l.png",
    ],
    variants: [
      { key: "dore-amethyste", label: { fr: "Doré · Améthyste", ar: "ذهبي · أميتيست" }, img: "v1783970110/b03f100966953754e42c6a0362c26fc8_1_1783969577_7111_qeazz3.png" },
      { key: "gold-black", label: { fr: "Doré · Noir", ar: "ذهبي · أسود" }, img: "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png" },
      { key: "red-green", label: { fr: "Rouge · Vert", ar: "أحمر · أخضر" }, img: "v1783975633/0df7fbff10510a6f9166dafb74476594_1_1783975529_3558_1_qaht3w.png" },
      { key: "white-silver", label: { fr: "Blanc · Argent", ar: "أبيض · فضي" }, img: "v1783970333/923c021705d00157b6d5caca46c40f77_1_1783969874_6864_slrd7d.png" },
      { key: "pink-silver", label: { fr: "Rose · Argent", ar: "زهري · فضي" }, img: "v1783970532/1d4a9ad34ffcf503e5f00d7d382d5539_1783970466945_fjla1y.png" },
      { key: "black-silver", label: { fr: "Noir · Argent", ar: "أسود · فضي" }, img: "v1783970701/4f65dcf49a67ed61428e243c172e7b67_1_1783970597_2135_h0dl2l.png" },
      { key: "white-gold", label: { fr: "Blanc · Doré", ar: "أبيض · ذهبي" }, img: "v1783970789/7c8c9bed4a89e631817eb9b30b295f4c_1783970728862_ge8tku.png" },
    ],
    bundles: [
      { qty: 1, unit: 99 },
      { qty: 2, unit: 89, badge: { fr: "Le plus populaire", ar: "الأكثر طلبًا" } },
      { qty: 3, unit: 83, badge: { fr: "Meilleure valeur", ar: "أحسن قيمة" } },
    ],
    usps: [
      { fr: "7 coloris disponibles", ar: "7 ألوان متوفرة" },
      { fr: "Se porte en accumulation", ar: "كيتلبس مركّب" },
      { fr: "Résiste à l'eau et au parfum", ar: "مقاوم للماء والعطر" },
      { fr: "Paiement à la livraison", ar: "الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🪢",
        title: { fr: "Fait pour s'empiler", ar: "مصمم باش يتركب" },
        desc: {
          fr: "Son épaisseur fine permet d'en porter deux ou trois ensemble, ou de l'associer à votre montre sans que le poignet soit chargé.",
          ar: "الرقة ديالو كتخليك تلبسي جوج ولا تلاتة مع بعضهم، ولا تركبيه مع الماكينة بلا ما تثقل يدك.",
        },
      },
      {
        icon: "🎨",
        title: { fr: "Un coloris par tenue", ar: "لون لكل لبسة" },
        desc: {
          fr: "Sept coloris pensés pour couvrir toute une garde-robe : neutres pour le bureau, colorés pour les sorties.",
          ar: "سبعة ألوان مدروسة باش تغطي خزانة كاملة: هادية للخدمة، وملونة للخرجات.",
        },
      },
      ...BENEFITS_BASE.slice(1, 3),
    ],
    included: [
      { fr: "1 bracelet ajustable au coloris choisi", ar: "سوار قابل للتعديل باللون اللي ختاريتي" },
      { fr: "1 pochette Maison d'Or", ar: "كيس Maison d'Or" },
      { fr: "Chaîne d'extension incluse", ar: "سلسلة تمديد مرفقة" },
    ],
    story: {
      title: { fr: "Pourquoi nos clientes en prennent souvent 2 ou 3", ar: "علاش الزبونات ديالنا كياخدو 2 ولا 3" },
      body: {
        fr: "Un bracelet seul, on le porte. Deux ou trois, ça devient un style. C'est pour ça que le pack est notre option la plus choisie : à 89 dh pièce dès deux bracelets, la plupart des clientes prennent un neutre (blanc-argent ou doré-améthyste) pour le quotidien, et un coloré pour les sorties. Comme le bracelet résiste à l'eau et au parfum, il n'y a pas de gestion à faire : vous les mettez le matin, vous les laissez. Et si vous offrez, deux bracelets dans deux pochettes séparées font deux cadeaux pour moins de 180 dh.",
        ar: "سوار وحدو، كتلبسيه. جوج ولا تلاتة، كيولي ستايل. علاش الباك هو الخيار الأكثر اختيارًا: ب89 درهم للقطعة من جوج، غالبية الزبونات كياخدو واحد هادي (أبيض-فضي ولا ذهبي-أميتيست) لليومي، وواحد ملون للخرجات. وحيت السوار مقاوم للماء والعطر، ما كاين ما تديري: كتلبسيهم الصباح وكتخليهم.",
      },
    },
    specs: [
      { label: { fr: "Matière", ar: "المادة" }, value: { fr: "Acier inoxydable plaqué", ar: "فولاذ مقاوم للصدأ مطلي" } },
      { label: { fr: "Pierres", ar: "الأحجار" }, value: { fr: "Cristaux sertis, motif floral", ar: "كريستال مرصّع بتصميم زهري" } },
      { label: { fr: "Taille", ar: "القياس" }, value: { fr: "Ajustable, chaîne d'extension", ar: "قابل للتعديل بسلسلة تمديد" } },
      { label: { fr: "Peau sensible", ar: "البشرة الحساسة" }, value: { fr: "Hypoallergénique · sans nickel", ar: "لا يسبب الحساسية · بدون نيكل" } },
      { label: { fr: "Résistance", ar: "المقاومة" }, value: { fr: "Eau, parfum et crèmes", ar: "الماء والعطر والكريمات" } },
      { label: { fr: "Coloris", ar: "الألوان" }, value: { fr: "7 au choix", ar: "7 على اختيارك" } },
    ],
    faq: FAQ_BASE,
    reviews: [
      rev("Ghizlane A.", "غزلان أ.", "Casablanca", "الدار البيضاء", "J'en ai pris 3, un pour chaque humeur 😄 La qualité est la même sur les 3.", "خديت 3، وحدة لكل مزاج 😄 الجودة نفسها فالتلاتة.", 2),
      rev("Kaoutar B.", "كوثر ب.", "Rabat", "الرباط", "Je le porte avec ma montre, ça rend très bien. Et il ne bouge pas sous la douche.", "كنلبسو مع الماكينة ديالي، كيبان مزيان. وما كيتحركش فالدوش.", 5),
      rev("Salwa M.", "سلوى م.", "Fès", "فاس", "99 dh pour cette qualité, honnêtement je m'attendais à pire. Bonne surprise.", "99 درهم بهاد الجودة، بصراحة كنت كنتسنى أقل. مفاجأة زوينة.", 9),
      rev("Nouhaila S.", "نهيلة س.", "Agadir", "أكادير", "Le rose-argent est encore plus joli en vrai. J'ai commandé le blanc après.", "الزهري-فضي حتى أزوين فالحقيقة. طلبت الأبيض من بعد.", 14),
      rev("Hiba L.", "هبة ل.", "Tétouan", "تطوان", "Pack de 2 partagé avec ma copine, ça revient à rien. On les porte tous les jours.", "باك ديال 2 قسمتو مع صاحبتي، ما كيسوى والو. كنلبسوهم كل نهار.", 18),
      rev("Meriem K.", "مريم ك.", "Marrakech", "مراكش", "Bien mais la chaîne d'extension est courte pour les gros poignets. À voir.", "مزيان ولكن سلسلة التمديد قصيرة لليدين الكبار. خاص تشوفو.", 25, 4),
    ],
    upsell: "parure-tulip-bicolore",
    seo: {
      title: "Bracelet Tulip 🌸 7 coloris — 99 dh | Maison d'Or",
      description:
        "Bracelet Tulip en acier inoxydable serti de cristaux, 7 coloris au choix. Résiste à l'eau et au parfum, hypoallergénique. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getAllSlugs = () => PRODUCTS.map((p) => p.slug);

/** Redirections des anciennes URLs d'annonces vers les nouvelles LP */
export const LEGACY_REDIRECTS: Record<string, string> = {
  swan: "parure-swan-noir",
  tulip: "parure-tulip-bicolore",
};

export const bundleTotal = (b: Bundle) => b.unit * b.qty;
export const bundleSaving = (b: Bundle, price: number) => price * b.qty - bundleTotal(b);
