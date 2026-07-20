// Team name -> flag code, for rendering via flagcdn.com/{code}.svg.
//
// Deliberately covers every FIFA member association rather than a guessed
// World Cup 2026 field of 48 — the actual qualified list isn't something
// this file should have to track, and an unmatched team should still get a
// sane fallback (see <Flag> below) rather than a broken image either way.
//
// Keys are normalized with normalizeTeamName() before lookup, so casing,
// accents and punctuation in whatever the API sends back don't matter.
const CODES = {
  // UEFA
  albania: 'al', andorra: 'ad', armenia: 'am', austria: 'at', azerbaijan: 'az',
  belarus: 'by', belgium: 'be', 'bosnia and herzegovina': 'ba', bosnia: 'ba',
  bulgaria: 'bg', croatia: 'hr', cyprus: 'cy', czechia: 'cz', 'czech republic': 'cz',
  denmark: 'dk', england: 'gb-eng', estonia: 'ee', 'faroe islands': 'fo',
  finland: 'fi', france: 'fr', georgia: 'ge', germany: 'de', gibraltar: 'gi',
  greece: 'gr', hungary: 'hu', iceland: 'is', 'republic of ireland': 'ie',
  ireland: 'ie', israel: 'il', italy: 'it', kazakhstan: 'kz', kosovo: 'xk',
  latvia: 'lv', liechtenstein: 'li', lithuania: 'lt', luxembourg: 'lu',
  malta: 'mt', moldova: 'md', monaco: 'mc', montenegro: 'me', netherlands: 'nl',
  holland: 'nl', 'north macedonia': 'mk', macedonia: 'mk', 'northern ireland': 'gb-nir',
  norway: 'no', poland: 'pl', portugal: 'pt', romania: 'ro', russia: 'ru',
  'san marino': 'sm', scotland: 'gb-sct', serbia: 'rs', slovakia: 'sk',
  slovenia: 'si', spain: 'es', sweden: 'se', switzerland: 'ch', turkey: 'tr',
  turkiye: 'tr', ukraine: 'ua', wales: 'gb-wls', 'great britain': 'gb',
  'united kingdom': 'gb',

  // CONMEBOL
  argentina: 'ar', bolivia: 'bo', brazil: 'br', chile: 'cl', colombia: 'co',
  ecuador: 'ec', paraguay: 'py', peru: 'pe', uruguay: 'uy', venezuela: 've',

  // CONCACAF
  'antigua and barbuda': 'ag', aruba: 'aw', bahamas: 'bs', barbados: 'bb',
  belize: 'bz', bermuda: 'bm', canada: 'ca', 'costa rica': 'cr', cuba: 'cu',
  curacao: 'cw', dominica: 'dm', 'dominican republic': 'do', 'el salvador': 'sv',
  grenada: 'gd', guatemala: 'gt', guyana: 'gy', haiti: 'ht', honduras: 'hn',
  jamaica: 'jm', mexico: 'mx', montserrat: 'ms', nicaragua: 'ni', panama: 'pa',
  'puerto rico': 'pr', 'st kitts and nevis': 'kn', 'st lucia': 'lc',
  'st vincent and the grenadines': 'vc', suriname: 'sr', 'trinidad and tobago': 'tt',
  usa: 'us', 'united states': 'us', 'us virgin islands': 'vi',

  // CAF
  algeria: 'dz', angola: 'ao', benin: 'bj', botswana: 'bw', 'burkina faso': 'bf',
  burundi: 'bi', cameroon: 'cm', 'cape verde': 'cv', 'cabo verde': 'cv',
  'central african republic': 'cf', chad: 'td', comoros: 'km',
  'congo dr': 'cd', 'dr congo': 'cd', 'democratic republic of the congo': 'cd',
  congo: 'cg', 'republic of the congo': 'cg', djibouti: 'dj', egypt: 'eg',
  'equatorial guinea': 'gq', eritrea: 'er', eswatini: 'sz', swaziland: 'sz',
  ethiopia: 'et', gabon: 'ga', gambia: 'gm', ghana: 'gh', guinea: 'gn',
  'guinea-bissau': 'gw', 'ivory coast': 'ci', "cote d'ivoire": 'ci',
  kenya: 'ke', lesotho: 'ls', liberia: 'lr', libya: 'ly', madagascar: 'mg',
  malawi: 'mw', mali: 'ml', mauritania: 'mr', mauritius: 'mu', morocco: 'ma',
  mozambique: 'mz', namibia: 'na', niger: 'ne', nigeria: 'ng', rwanda: 'rw',
  'sao tome and principe': 'st', senegal: 'sn', seychelles: 'sc',
  'sierra leone': 'sl', somalia: 'so', 'south africa': 'za', 'south sudan': 'ss',
  sudan: 'sd', tanzania: 'tz', togo: 'tg', tunisia: 'tn', uganda: 'ug',
  zambia: 'zm', zimbabwe: 'zw',

  // AFC
  afghanistan: 'af', australia: 'au', bahrain: 'bh', bangladesh: 'bd',
  bhutan: 'bt', brunei: 'bn', cambodia: 'kh', china: 'cn', 'chinese taipei': 'tw',
  guam: 'gu', 'hong kong': 'hk', india: 'in', indonesia: 'id', iran: 'ir',
  iraq: 'iq', japan: 'jp', jordan: 'jo', kuwait: 'kw', kyrgyzstan: 'kg',
  laos: 'la', lebanon: 'lb', macau: 'mo', malaysia: 'my', maldives: 'mv',
  mongolia: 'mn', myanmar: 'mm', nepal: 'np', 'north korea': 'kp',
  oman: 'om', pakistan: 'pk', palestine: 'ps', philippines: 'ph', qatar: 'qa',
  'saudi arabia': 'sa', singapore: 'sg', 'south korea': 'kr', korea: 'kr',
  'korea republic': 'kr', 'sri lanka': 'lk', syria: 'sy', tajikistan: 'tj',
  thailand: 'th', 'timor-leste': 'tl', 'east timor': 'tl', turkmenistan: 'tm',
  'united arab emirates': 'ae', uae: 'ae', uzbekistan: 'uz', vietnam: 'vn',
  yemen: 'ye',

  // OFC
  'american samoa': 'as', 'cook islands': 'ck', fiji: 'fj', 'french polynesia': 'pf',
  kiribati: 'ki', 'new caledonia': 'nc', 'new zealand': 'nz', 'papua new guinea': 'pg',
  samoa: 'ws', 'solomon islands': 'sb', tahiti: 'pf', tonga: 'to', tuvalu: 'tv',
  vanuatu: 'vu',
}

export function normalizeTeamName(name) {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[.'']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Some of the raw keys above (e.g. "cote d'ivoire", "guinea-bissau") contain
// punctuation that normalizeTeamName() strips from *input* — so they need
// to be run through the same normalization here too, otherwise a key would
// never match its own normalized lookup.
const NORMALIZED_CODES = Object.fromEntries(
  Object.entries(CODES).map(([name, code]) => [normalizeTeamName(name), code])
)

export function flagCodeForTeam(name) {
  return NORMALIZED_CODES[normalizeTeamName(name)] ?? null
}

export function flagUrlForTeam(name, format = 'svg') {
  const code = flagCodeForTeam(name)
  return code ? `https://flagcdn.com/${code}.${format}` : null
}
