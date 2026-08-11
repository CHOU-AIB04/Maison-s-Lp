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

export type Variant = { key: string; label: L; img: string; gallery?: string[]; desc?: L };
export type Bundle = { qty: number; total: number; badge?: L };
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

/**
 * Packs. save2 / save3 = remise TOTALE du pack en DH (pas par pièce).
 * bundlesFor(139, 30, 50) → 1×139 · 2×139−30 = 248 · 3×139−50 = 367
 */
const bundlesFor = (price: number, save2: number, save3: number): Bundle[] => [
  { qty: 1, total: price },
  { qty: 2, total: price * 2 - save2, badge: { fr: "Le plus populaire", ar: "الأكثر طلبًا" } },
  { qty: 3, total: price * 3 - save3, badge: { fr: "Meilleure valeur", ar: "أحسن قيمة" } },
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
  /* ═══════════════════════════════════════════════════════
     1. ENSEMBLE TULIP — 5 modèles réunis sur une seule LP
     ═══════════════════════════════════════════════════════ */
  {
    slug: "ensemble-tulip",
    id: "tulip",
    type: "Tulip",
    emoji: "🌷",
    name: { fr: "Ensemble Tulip", ar: "طقم Tulip" },
    category: { fr: "Parures Tulip", ar: "أطقم Tulip" },
    headline: {
      fr: "Collier + bracelet assortis — 5 modèles, un seul prix",
      ar: "عقد + سوار متناسقين — 5 موديلات، ثمن واحد",
    },
    subheadline: {
      fr: "Parures florales serties de cristaux sur acier inoxydable plaqué or 18K ou argent rhodié. Choisissez votre modèle, on vous le livre en coffret — vous payez à la réception.",
      ar: "أطقم زهرية مرصّعة بالكريستال على فولاذ مطلي بذهب 18 قيراط ولا فضة. ختاري الموديل ديالك، وكيوصلك فعلبة — وكتخلصي عند الاستلام.",
    },
    price: 139,
    compareAt: 209,
    rating: 4.9,
    reviewCount: 536,
    stock: 7,
    hero: "v1782485773/prod5_white_C_c0yb8p.jpg",
    gallery: [
      "v1782485773/prod5_white_C_c0yb8p.jpg",
      "v1782146330/product_1_eufnps.png",
      "v1782485762/prod7_black_C_tlt0av.jpg",
      "v1782485785/prod9_white_c_b55akf.jpg",
      "v1782485761/prod1_black_caree_dddkql.jpg",
    ],
    variants: [
      {
        key: "bicolore",
        label: { fr: "Bicolore · Améthyste", ar: "ثنائي اللون · أميتيست" },
        img: "v1782485773/prod5_white_C_c0yb8p.jpg",
        desc: {
          fr: "Collier V et bracelet sertis de cristaux améthyste en cascade, sur monture dorée aux motifs feuillage.",
          ar: "عقد V وسوار مرصّعين بكريستال الأميتيست على شكل شلال، على قاعدة ذهبية بتصميم أوراق.",
        },
        gallery: [
          "v1782485773/prod5_white_C_c0yb8p.jpg",
          "v1782485767/prod4_black_C_r8wqhk.jpg",
          "v1782146354/product_12_lskeyt.png",
        ],
      },
      {
        key: "prestige",
        label: { fr: "Prestige · Améthyste & Rosé", ar: "برستيج · أميتيست وزهري" },
        img: "v1782485786/prod10_white_c_ffubmd.jpg",
        desc: {
          fr: "Le modèle le plus travaillé : deux teintes de cristaux et motifs végétaux sculptés dans la monture.",
          ar: "الموديل الأكثر تفصيلًا: لونين من الكريستال ونقوش نباتية منحوتة فالقاعدة.",
        },
        gallery: [
          "v1782485786/prod10_white_c_ffubmd.jpg",
          "v1782146330/product_1_eufnps.png",
          "v1782485784/prod10_black_c_fwk74g.jpg",
        ],
      },
      {
        key: "doree",
        label: { fr: "Dorée · Cristal", ar: "ذهبي · كريستال" },
        img: "v1782485761/prod7_white_c_qfwvfm.jpg",
        desc: {
          fr: "Vigne dorée et cristaux transparents : aucune couleur à assortir, il va avec toutes les tenues.",
          ar: "أغصان ذهبية وكريستال شفاف: بلا لون خاصك تناسبيه، كيمشي مع كل الملابس.",
        },
        gallery: [
          "v1782485761/prod7_white_c_qfwvfm.jpg",
          "v1782485762/prod7_black_C_tlt0av.jpg",
          "v1782146339/product_7_jyzzbg.png",
          "v1782146338/product_4_c1mlob.png",
        ],
      },
      {
        key: "argentee",
        label: { fr: "Argentée · Cristal", ar: "فضي · كريستال" },
        img: "v1782485785/prod9_white_c_b55akf.jpg",
        desc: {
          fr: "Argent rhodié et cristaux taille marquise, pour celles qui préfèrent l'argent au doré.",
          ar: "فضة وكريستال، لللي كتفضل الفضي على الذهبي.",
        },
        gallery: ["v1782485785/prod9_white_c_b55akf.jpg", "v1782485777/prod9_black_c_m47wyw.jpg"],
      },
      {
        key: "rouge",
        label: { fr: "Rouge · Rubis", ar: "أحمر · ياقوتي" },
        img: "v1782513698/image_1782513620489_7rhkph_vjjjbk.jpg",
        desc: {
          fr: "Cristaux rouge rubis sur monture argentée — le modèle des caftans et des soirées.",
          ar: "كريستال أحمر ياقوتي على قاعدة فضية — موديل القفاطن والسهرات.",
        },
        gallery: [
          "v1782513698/image_1782513620489_7rhkph_vjjjbk.jpg",
          "v1782485761/prod1_black_caree_dddkql.jpg",
        ],
      },
    ],
    bundles: bundlesFor(139, 30, 50),
    usps: [
      { fr: "5 modèles au même prix", ar: "5 موديلات بنفس الثمن" },
      { fr: "Collier + bracelet en coffret", ar: "عقد + سوار فعلبة" },
      { fr: "Ne noircit pas, ne verdit pas", ar: "ما كيسودش وما كيخضّرش" },
      { fr: "Livraison gratuite · paiement à la réception", ar: "توصيل مجاني · الخلاص عند الاستلام" },
    ],
    benefits: BENEFITS_BASE,
    included: INCLUDED_PARURE,
    story: {
      title: { fr: "Quel modèle Tulip choisir ?", ar: "شنو الموديل Tulip اللي تختاري؟" },
      body: {
        fr: "Les cinq modèles partagent exactement la même fabrication : base en acier inoxydable, plaquage or 18K ou rhodiage argent, cristaux sertis un par un. La différence est purement esthétique. Bicolore et Prestige sont les plus habillés, avec leurs cristaux améthyste et rosé — ce sont ceux qu'on choisit pour un mariage ou un cadeau. Dorée est le plus polyvalent : cristal transparent, aucune couleur à assortir, c'est notre plus grosse vente. Argentée s'adresse à celles qui portent déjà de l'argent ou une montre en acier. Rouge est le plus affirmé, pensé pour le caftan et les soirées. Si vous hésitez, prenez Dorée : c'est celui qui se porte le plus souvent.",
        ar: "الخمسة موديلات عندهم نفس الصناعة: قاعدة من الفولاذ المقاوم للصدأ، طلاء ذهبي 18 قيراط ولا فضي، وكريستال مرصّع حبة بحبة. الفرق غير جمالي. ثنائي اللون والبرستيج هوما الأكثر أناقة بالأميتيست والزهري — هوما اللي كيتختارو للعرس ولا للهدية. الذهبي هو الأكثر استعمالًا: كريستال شفاف، بلا لون خاصك تناسبيه، وهو الأكثر مبيعًا عندنا. الفضي لللي كتلبس الفضة ولا ماكينة ديال الفولاذ. والأحمر هو الأقوى، مصمم للقفطان والسهرات. إلى حتارتي، خدي الذهبي.",
      },
    },
    specs: SPECS_ACIER,
    faq: [
      {
        q: { fr: "Les 5 modèles sont-ils au même prix ?", ar: "واش الخمسة موديلات بنفس الثمن؟" },
        a: {
          fr: "Oui, 139 dh quel que soit le modèle choisi, livraison comprise. Le pack de 2 ou 3 peut mélanger les modèles : indiquez-le simplement lors de l'appel de confirmation.",
          ar: "إيه، 139 درهم لأي موديل، والتوصيل داخل. الباك ديال 2 ولا 3 تقدري تخلطي فيه الموديلات: غير قوليها للمكلف منين نعيطو ليك باش نأكدو.",
        },
      },
      ...FAQ_BASE,
    ],
    reviews: [
      rev("Sara B.", "سارة ب.", "Casablanca", "الدار البيضاء", "J'ai pris la Bicolore, reçue en 24h et ouverte devant le livreur. Pour 139 dh je m'attendais à moins bien 🥰", "خديت ثنائي اللون، وصلاتني ف24 ساعة وحليتها قدام الموصّل. ب139 درهم كنت كنتسنى أقل 🥰", 3),
      rev("Imane K.", "إيمان ك.", "Marrakech", "مراكش", "2 mois de port quotidien avec la Dorée, douche comprise, aucune trace de noir. J'ai repris la Rouge après.", "شهرين وأنا لابسة الذهبي كل نهار، حتى فالدوش، بلا سواد. من بعد خديت الأحمر.", 8),
      rev("Meryem L.", "مريم ل.", "Rabat", "الرباط", "La Prestige au mariage de ma cousine : 4 personnes m'ont demandé où je l'avais achetée 😅", "البرستيج فعرس بنت عمي: 4 نسا سولوني منين شريتها 😅", 5),
      rev("Btissam O.", "ابتسام و.", "Fès", "فاس", "Enfin une parure argentée qui ne noircit pas au bout d'un mois. Ça faisait longtemps que je cherchais.", "أخيرًا طقم فضي ما كيسودش من بعد شهر. هادي مدة وأنا كنقلب.", 11),
      rev("Kenza M.", "كنزة م.", "Tanger", "طنجة", "La Rouge sur un caftan blanc, effet garanti. Le rouge est vraiment profond, pas orange.", "الأحمر على قفطان أبيض، النتيجة مضمونة. الأحمر عميق بصح، ماشي برتقالي.", 16),
      rev("Amal S.", "أمل س.", "Agadir", "أكادير", "Pack de 2 avec ma sœur : elle a pris la Prestige, moi la Dorée. Livré ensemble, payé au livreur.", "باك ديال 2 مع ختي: هي خديت البرستيج وأنا الذهبي. وصلونا مع بعض، وخلصنا للموصّل.", 22),
    ],
    upsell: "ensemble-swan",
    seo: {
      title: "Ensemble Tulip 🌷 Collier + Bracelet — 5 modèles, 139 dh | Maison d'Or",
      description:
        "Parure Tulip : collier + bracelet sertis de cristaux, 5 modèles au choix (Bicolore, Prestige, Dorée, Argentée, Rouge). Ne ternit pas, hypoallergénique. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },

  /* ═══════════════════════════════════════════════════════
     2. ENSEMBLE SWAN — 2 modèles réunis
     ═══════════════════════════════════════════════════════ */
  {
    slug: "ensemble-swan",
    id: "swan",
    type: "Swan",
    emoji: "🦢",
    name: { fr: "Ensemble Swan", ar: "طقم Swan" },
    category: { fr: "Parures Swan", ar: "أطقم Swan" },
    headline: {
      fr: "Le pendentif cygne qu'on vous demandera d'où il vient",
      ar: "دلاية البجعة اللي غادي يسولوك منين جبتيها",
    },
    subheadline: {
      fr: "Collier à pendentif cygne sculpté et bracelet assorti. 6 coloris au choix, tous au même prix. Livré en coffret, payé à la réception.",
      ar: "عقد بدلاية بجعة منحوتة وسوار متناسق. 6 ألوان على اختيارك، كلهم بنفس الثمن. كيوصل فعلبة، والخلاص عند الاستلام.",
    },
    price: 129,
    compareAt: 199,
    rating: 4.9,
    reviewCount: 251,
    stock: 6,
    hero: "v1782485765/prod3_white_C_agk2ln.jpg",
    gallery: [
      "v1782485765/prod3_white_C_agk2ln.jpg",
      "v1782497783/prod13_white_c_oruw4c.jpg",
      "v1782485788/prod12_black_c_nqjzw6.jpg",
      "v1782498863/image_1782498828281_jnc8yf_kmfzqo.jpg",
      "v1782485781/prod6_whie_c_ne2gnl.jpg",
      "v1782485766/prod2_white_C_gvnwin.jpg",
    ],
    variants: [
      {
        key: "amethyste",
        label: { fr: "Améthyste", ar: "أميتيست" },
        img: "v1782485765/prod3_white_C_agk2ln.jpg",
        desc: {
          fr: "Cristaux violets sur argent rhodié — le violet met particulièrement en valeur les peaux mates.",
          ar: "كريستال بنفسجي على الفضة — البنفسجي كيبرز البشرة القمحية بزاف.",
        },
        gallery: [
          "v1782485765/prod3_white_C_agk2ln.jpg",
          "v1782146353/product_11_hr9u2c.png",
          "v1782146355/product_10_gebr70.png",
        ],
      },
      {
        key: "blanc",
        label: { fr: "Blanc", ar: "أبيض" },
        img: "v1782497783/prod13_white_c_oruw4c.jpg",
        desc: {
          fr: "Cristaux transparents : la version qu'on offre, elle va à toutes les tenues et à tous les âges.",
          ar: "كريستال شفاف: النسخة اللي كتنهدى، كتمشي مع كل الملابس وكل الأعمار.",
        },
        gallery: [
          "v1782497783/prod13_white_c_oruw4c.jpg",
          "v1782146354/product_9_d9gry9.png",
        ],
      },
      {
        key: "noir-dore",
        label: { fr: "Noir & Doré", ar: "أسود · ذهبي" },
        img: "v1782485789/prod12_white_c_cg7zrs.jpg",
        desc: {
          fr: "Cristaux noirs sur monture dorée — le contraste le plus fort de la collection Swan.",
          ar: "كريستال أسود على قاعدة ذهبية — أقوى تباين فمجموعة Swan.",
        },
        gallery: [
          "v1782485789/prod12_white_c_cg7zrs.jpg",
          "v1782485788/prod12_black_c_nqjzw6.jpg",
        ],
      },
      {
        key: "rose-argent",
        label: { fr: "Rose & Argent", ar: "زهري · فضي" },
        img: "v1782498863/image_1782498175677_w6b338_kjhxey.jpg",
        desc: {
          fr: "Rose poudré sur argent rhodié : la version la plus douce, très demandée en cadeau.",
          ar: "زهري ناعم على الفضة: النسخة الأكثر هدوءًا، ومطلوبة بزاف كهدية.",
        },
        gallery: [
          "v1782498863/image_1782498175677_w6b338_kjhxey.jpg",
          "v1782498863/image_1782498828281_jnc8yf_kmfzqo.jpg",
        ],
      },
      {
        key: "argent-violet",
        label: { fr: "Argent & Violet", ar: "فضي · بنفسجي" },
        img: "v1782485781/prod6_whie_c_ne2gnl.jpg",
        desc: {
          fr: "Violet profond serti sur argent : élégant de jour comme en soirée.",
          ar: "بنفسجي عميق مرصّع على الفضة: أنيق فالنهار وفالسهرة.",
        },
        gallery: [
          "v1782485781/prod6_whie_c_ne2gnl.jpg",
          "v1782146347/product_8_zydnr8.png",
        ],
      },
      {
        key: "rose",
        label: { fr: "Rose", ar: "زهري" },
        img: "v1782485766/prod2_white_C_gvnwin.jpg",
        desc: {
          fr: "Cristaux rosés en dégradé — le modèle le plus féminin de la gamme.",
          ar: "كريستال زهري متدرج — الموديل الأكثر أنوثة فالمجموعة.",
        },
        gallery: ["v1782485766/prod2_white_C_gvnwin.jpg"],
      },
    ],
    bundles: bundlesFor(129, 30, 50),
    usps: [
      { fr: "6 coloris au même prix", ar: "6 ألوان بنفس الثمن" },
      { fr: "Collier + bracelet en coffret", ar: "عقد + سوار فعلبة" },
      { fr: "Argent rhodié, ne noircit pas", ar: "فضة ما كتسودش" },
      { fr: "Livraison gratuite · paiement à la réception", ar: "توصيل مجاني · الخلاص عند الاستلام" },
    ],
    benefits: [
      {
        icon: "🦢",
        title: { fr: "Un pendentif, pas un simple pendentif", ar: "دلاية، ماشي غير دلاية" },
        desc: {
          fr: "Le cygne est sculpté en volume, cou et ailes détaillés. C'est ce relief qui déclenche la question « il vient d'où ? ».",
          ar: "البجعة منحوتة بحجم كامل، بالعنق والجوانح مفصلين. هاد البروز هو اللي كيخلي الناس تسول «منين هادي؟».",
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
      title: { fr: "Quel coloris Swan choisir ?", ar: "شنو اللون Swan اللي تختاري؟" },
      body: {
        fr: "Les six coloris partagent la même fabrication : argent rhodié ou monture dorée, pendentif cygne sculpté en volume, bracelet assorti, coffret inclus. Seule la teinte des cristaux change, et le prix reste identique. Le Blanc est le plus offert — sur dix commandes, sept partent en cadeau, parce que le cristal transparent ne dépend ni du teint, ni de la garde-robe, ni de l'âge. L'Améthyste et l'Argent & Violet sont les choix « pour soi » : le violet ressort sur les peaux mates. Le Rose et le Rose & Argent sont les plus doux, très demandés pour un anniversaire. Le Noir & Doré offre le contraste le plus marqué de la gamme. Si vous hésitez, prenez le Blanc : c'est celui qui se porte le plus souvent.",
        ar: "الستة ألوان عندهم نفس الصناعة: فضة ولا قاعدة ذهبية، دلاية بجعة منحوتة، سوار متناسق، والعلبة داخلة. غير لون الكريستال هو اللي كيتبدل، والثمن كيبقى نفسو. الأبيض هو الأكثر إهداءً — من كل 10 طلبيات، 7 كيمشيو هدية، حيت الكريستال الشفاف ما كيعتمدش على لون البشرة ولا على الملابس ولا على العمر. الأميتيست والفضي · بنفسجي هوما الاختيار «ليك»: البنفسجي كيبان على البشرة القمحية. الزهري والزهري · فضي هوما الأنعم، ومطلوبين بزاف لعيد الميلاد. الأسود · ذهبي عندو أقوى تباين فالمجموعة. إلى حتارتي، خدي الأبيض.",
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
      rev("Fadwa L.", "فدوى ل.", "Rabat", "الرباط", "Commandé le blanc pour l'anniversaire de ma sœur, elle a pleuré 🥹 Le coffret aide beaucoup.", "طلبت الأبيض لعيد ميلاد ختي، بكات 🥹 العلبة عاونات بزاف.", 6),
      rev("Aya B.", "آية ب.", "Marrakech", "مراكش", "L'améthyste est magnifique sur la peau mate. Je confirme ce qui est écrit.", "الأميتيست زوين بزاف على البشرة القمحية. كنأكد اللي مكتوب.", 12),
      rev("Latifa H.", "لطيفة ح.", "Meknès", "مكناس", "Reçu en 48h, tout conforme, payé sur place. Rien à redire.", "وصلني ف48 ساعة، كلشي مطابق، خلصت فبلاصتي. ما عندي ما نقول.", 15),
      rev("Zahra A.", "زهرة أ.", "Tanger", "طنجة", "Ma fille de 16 ans porte le blanc tous les jours, aucune allergie. C'est ce qui m'importait.", "بنتي عندها 16 عام كتلبس الأبيض كل نهار، بلا حساسية. وهادشي هو اللي كان يهمني.", 20),
      rev("Chaima N.", "شيماء ن.", "Oujda", "وجدة", "3ème commande, jamais déçue. Cette fois j'ai pris le pack de 2, un de chaque.", "ثالث طلبية، عمري ما تخيبت. هاد المرة خديت باك ديال 2، وحدة من كل نوع.", 25),
    ],
    upsell: "ensemble-tulip",
    seo: {
      title: "Ensemble Swan 🦢 Collier Pendentif Cygne — 6 coloris, 129 dh | Maison d'Or",
      description:
        "Parure Swan : collier à pendentif cygne + bracelet assorti, 6 coloris au choix. Ne ternit pas, hypoallergénique. Livraison gratuite au Maroc, paiement à la livraison.",
    },
  },
  /* ═══════════════════════════════════════════════════════
     3. BRACELET TULIP — 7 coloris
     ═══════════════════════════════════════════════════════ */
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
    bundles: bundlesFor(99, 20, 40),
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
    upsell: "ensemble-tulip",
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

/** Photos affichées pour la variante sélectionnée (galerie propre, sinon celle du produit). */
export const variantGallery = (product: LPProduct, variant: Variant) =>
  Array.from(new Set([variant.img, ...(variant.gallery ?? product.gallery)]));

/** Anciennes URLs (annonces déjà lancées) → LP actuelle. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  swan: "ensemble-swan",
  tulip: "ensemble-tulip",
  "parure-swan": "ensemble-swan",
  "parure-tulip": "ensemble-tulip",
  "parure-swan-noir": "ensemble-swan",
  "parure-swan-blanc": "ensemble-swan",
  "parure-tulip-bicolore": "ensemble-tulip",
  "parure-tulip-prestige": "ensemble-tulip",
  "parure-tulip-doree": "ensemble-tulip",
  "parure-tulip-argentee": "ensemble-tulip",
  "parure-tulip-rouge": "ensemble-tulip",
};

export const bundleTotal = (b: Bundle) => b.total;
export const bundleSaving = (b: Bundle, price: number) => price * b.qty - bundleTotal(b);
