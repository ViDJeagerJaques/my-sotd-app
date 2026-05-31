"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { MapPin, Sun, Check, X, Snowflake, Home, TreePine, Dumbbell, Activity, Heart, Briefcase, Sunrise, Sunset, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- KABEL DATABASE ---
import { allPerfumes } from "../data/perfumeDB";
import { PerfumeEntry } from "../data/types";

// ==========================================
// --- UI DICTIONARY (EN / ID) ---
// ==========================================
const UI_DICT: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    navBeranda: "BERANDA",
    navVault: "VAULT",
    navStylist: "STYLIST",
    navTracker: "TRACKER",
    navTrivia: "TRIVIA",
    langToggle: "ENG",
    loginBtn: "LOGIN",
    logoutBtn: "LOGOUT",
    hiUser: "HI,",
    // Hero
    heroIntro: "00 â€” INTRODUCTION",
    heroBody: "Curate your collection. Contextualize your day. Arrive at the perfect olfactory conclusion based on your local environment.",
    heroCtaBtn: "OPEN THE VAULT",
    // Vault section
    vaultLabel: "01 â€” PRIVATE VAULT",
    vaultTitle: "The Closet.",
    vaultSubtitle: "Select your archive to begin analysis.",
    vaultClearBtn: "[ CLEAR ALL VAULT ]",
    vaultFilterLabel: "FILTER BY CATEGORY",
    // Stylist Engine section
    stylistLabel: "02 â€” STYLIST ENGINE",
    stylistTitle: "GENERATE YOUR SOTD",
    envSetup: "ENVIRONMENT SETUP",
    locationLabel: "LAYER 1: LOCATION",
    activityLabel: "LAYER 2: ACTIVITY",
    detectingLocation: "DETECTING...",
    tapLocation: "TAP TO SHOW LOCATION",
    setWeatherFirst: "SET WEATHER FIRST",
    makeSOTDBtn: "MAKE YOUR SOTD",
    recToday: "YOUR PERFUME RECOMMENDATION TODAY",
    alternatives: "ALTERNATIVES",
    notRecommended: "CRITICAL WARNING: NOT RECOMMENDED FOR TODAY",
    tooHeavy: "TOO HEAVY",
    tooLight: "TOO LIGHT",
    hotWeatherWarning: "HOT WEATHER WILL RUIN THIS PERFORMANCE AND PROJECT TOO AGGRESSIVELY.",
    coldWeatherWarning: "COLD WEATHER WILL MUTE THIS SCENT PROFILE.",
    actualSpraysLabel: "ACTUAL SPRAYS USED",
    layerBtn: "[ LAYER WITH ANOTHER SCENT? ]",
    layeringWith: "Layering with:",
    awaitingGen: "[ AWAITING GENERATION ]",
    vizPending: "[ VISUALIZATION PENDING ]",
    logSotdBtn: "+ LOG AS TODAY'S SOTD",
    houseOf: "HOUSE OF",
    topNotes: "TOP NOTES:",
    // Tracker / Journal section
    trackerLabel: "03 â€” DAILY TRACKER",
    trackerTitle: "SOTD Journal.",
    trackerSubtitle: "Your personal olfactory footprint.",
    monthlyCalendar: "MONTHLY SCENT CALENDAR",
    calNoEntry: "NO ENTRY",
    calLogged: "SOTD LOGGED",
    totalWearings: "TOTAL WEARINGS",
    uniqueScents: "UNIQUE SCENTS",
    activeStreak: "ACTIVE STREAK",
    vaultValuation: "VAULT VALUATION",
    noJournal: "No scent recorded yet.",
    noJournalSub: "GENERATE AND LOG YOUR SOTD ABOVE.",
    ratePerformance: "ðŸ“Š RATE PERFORMANCE",
    warningAvoidOud: "[ WARNING: AVOID HEAVY OUD ]",
    idealOud: "[ IDEAL FOR HEAVY OUD ]",
    // Discovery Modal
    discoveryTitle: "DISCOVERY",
    closeBtn: "CLOSE",
    tabSearch: "SEARCH DATABASE",
    tabCustom: "ADD CUSTOM SCENT",
    searchPlaceholder: "Search perfume...",
    archiveBtn: "+ ARCHIVE",
    addedToVaultMsg: "ADDED TO VAULT",
    addedToVaultSub: "Saved to your inventory.",
    // Custom Scent Form
    uploadBtn: "UPLOAD IMAGE",
    saveVaultBtn: "SAVE TO VAULT",
    // Layer Modal
    layerModalTitle: "MINI-VAULT",
    layerModalSub: "SELECT A SCENT TO LAYER.",
    vaultEmpty: "VAULT EMPTY. ADD PERFUME FIRST.",
    selectedLabel: "SELECTED",
    clearLayering: "CLEAR LAYERING",
    // Auth Modal
    authSignIn: "SIGN IN",
    authSignUp: "CREATE ACCOUNT",
    authTabSignIn: "SIGN IN",
    authTabSignUp: "SIGN UP",
    authSubline: "SOTD STUDIO â€” IDENTITY CHECK",
    authUsernamePlaceholder: "USERNAME",
    authEmailPlaceholder: "EMAIL ADDRESS",
    authPasswordPlaceholder: "PASSWORD",
    authConfirmPlaceholder: "CONFIRM PASSWORD",
    authSignInBtn: "ENTER VAULT â†’",
    authSignUpBtn: "CREATE ACCOUNT â†’",
    authGoogleBtn: "CONTINUE WITH GOOGLE",
    authOrDivider: "OR",
    authSwitchToSignUp: "NO ACCOUNT YET?",
    authSwitchToSignUpLink: "CREATE ONE.",
    authSwitchToSignIn: "ALREADY HAVE AN ACCOUNT?",
    authSwitchToSignInLink: "SIGN IN.",
    authErrUsername: "USERNAME IS REQUIRED.",
    authErrEmail: "ENTER A VALID EMAIL ADDRESS.",
    authErrEmailBlocked: "TEMPORARY / DISPOSABLE EMAIL NOT ALLOWED.",
    authErrPassword: "PASSWORD MUST BE AT LEAST 6 CHARACTERS.",
    authErrConfirm: "PASSWORDS DO NOT MATCH.",
    authFinePrint: "Your scent data is stored locally on this device.",
    // Dupe Alert
    dupeAlertTitle: "PERFUME ALREADY IN VAULT.",
    dupeAlertSub: "This scent is already in your collection.",
    // Log Toast
    loggedSuccessfully: "SOTD LOGGED SUCCESSFULLY",
    // Footer
    footer: "Â© 2026 SOTD STUDIO â€” ALL RIGHTS RESERVED.",
  },
  id: {
    // Navigation
    navBeranda: "BERANDA",
    navVault: "VAULT",
    navStylist: "STYLIST",
    navTracker: "TRACKER",
    navTrivia: "TRIVIA",
    langToggle: "IDN",
    loginBtn: "MASUK",
    logoutBtn: "KELUAR",
    hiUser: "HAI,",
    // Hero
    heroIntro: "00 â€” PENGENALAN",
    heroBody: "Kurasi koleksimu. Kontekstualisasikan harimu. Temukan kesimpulan penciuman sempurna berdasarkan lingkungan lokalmu.",
    heroCtaBtn: "BUKA BRANKAS",
    // Vault section
    vaultLabel: "01 â€” BRANKAS PRIBADI",
    vaultTitle: "Lemari Parfum.",
    vaultSubtitle: "PILIH ARSIPMU UNTUK MEMULAI ANALISIS.",
    vaultClearBtn: "[ KOSONGKAN BRANKAS ]",
    vaultFilterLabel: "FILTER BERDASARKAN KATEGORI",
    // Stylist Engine section
    stylistLabel: "02 â€” MESIN STYLIST",
    stylistTitle: "BUAT SOTD KAMU",
    envSetup: "PENGATURAN LINGKUNGAN",
    locationLabel: "LAPISAN 1: LOKASI",
    activityLabel: "LAPISAN 2: AKTIVITAS",
    detectingLocation: "MENDETEKSI...",
    tapLocation: "KETUK UNTUK TAMPILKAN LOKASI",
    setWeatherFirst: "ATUR CUACA DULU",
    makeSOTDBtn: "BUAT SOTD KAMU",
    recToday: "REKOMENDASI PARFUM KAMU HARI INI",
    alternatives: "ALTERNATIF",
    notRecommended: "PERINGATAN KRITIS: TIDAK DIREKOMENDASIKAN HARI INI",
    tooHeavy: "TERLALU BERAT",
    tooLight: "TERLALU RINGAN",
    hotWeatherWarning: "CUACA PANAS AKAN MERUSAK PERFORMA DAN PROYEKSI TERLALU AGRESIF.",
    coldWeatherWarning: "CUACA DINGIN AKAN MEREDAM PROFIL WANGI INI.",
    actualSpraysLabel: "SEMPROTAN AKTUAL",
    layerBtn: "[ LAYER DENGAN WANGI LAIN? ]",
    layeringWith: "Dilayer dengan:",
    awaitingGen: "[ MENUNGGU GENERASI ]",
    vizPending: "[ VISUALISASI TERTUNDA ]",
    logSotdBtn: "+ LOG SEBAGAI SOTD HARI INI",
    houseOf: "DARI RUMAH",
    topNotes: "TOP NOTES:",
    // Tracker / Journal section
    trackerLabel: "03 â€” PELACAK HARIAN",
    trackerTitle: "Jurnal SOTD.",
    trackerSubtitle: "Jejak olfaktori pribadimu.",
    monthlyCalendar: "KALENDER WANGI BULANAN",
    calNoEntry: "TIDAK ADA ENTRI",
    calLogged: "SOTD DICATAT",
    totalWearings: "TOTAL PEMAKAIAN",
    uniqueScents: "WANGI UNIK",
    activeStreak: "STREAK AKTIF",
    vaultValuation: "NILAI BRANKAS",
    noJournal: "Belum ada wangi yang dicatat.",
    noJournalSub: "GENERATE DAN LOG SOTD KAMU DI ATAS.",
    ratePerformance: "ðŸ“Š NILAI PERFORMA",
    warningAvoidOud: "[ PERINGATAN: HINDARI OUD BERAT ]",
    idealOud: "[ IDEAL UNTUK OUD BERAT ]",
    // Discovery Modal
    discoveryTitle: "DISCOVERY",
    closeBtn: "TUTUP",
    tabSearch: "CARI DATABASE",
    tabCustom: "TAMBAH WANGI CUSTOM",
    searchPlaceholder: "Cari parfum...",
    archiveBtn: "+ ARSIPKAN",
    addedToVaultMsg: "DITAMBAHKAN KE BRANKAS",
    addedToVaultSub: "Tersimpan di inventori kamu.",
    // Custom Scent Form
    uploadBtn: "UNGGAH GAMBAR",
    saveVaultBtn: "SIMPAN KE BRANKAS",
    // Layer Modal
    layerModalTitle: "MINI-BRANKAS",
    layerModalSub: "PILIH WANGI UNTUK DILAYER.",
    vaultEmpty: "BRANKAS KOSONG. TAMBAH PARFUM DULU.",
    selectedLabel: "DIPILIH",
    clearLayering: "HAPUS LAYERING",
    // Auth Modal
    authSignIn: "MASUK",
    authSignUp: "BUAT AKUN",
    authTabSignIn: "MASUK",
    authTabSignUp: "DAFTAR",
    authSubline: "SOTD STUDIO â€” VERIFIKASI IDENTITAS",
    authUsernamePlaceholder: "USERNAME",
    authEmailPlaceholder: "ALAMAT EMAIL",
    authPasswordPlaceholder: "KATA SANDI",
    authConfirmPlaceholder: "KONFIRMASI KATA SANDI",
    authSignInBtn: "MASUK KE BRANKAS â†’",
    authSignUpBtn: "BUAT AKUN â†’",
    authGoogleBtn: "LANJUTKAN DENGAN GOOGLE",
    authOrDivider: "ATAU",
    authSwitchToSignUp: "BELUM PUNYA AKUN?",
    authSwitchToSignUpLink: "DAFTAR SEKARANG.",
    authSwitchToSignIn: "SUDAH PUNYA AKUN?",
    authSwitchToSignInLink: "MASUK DI SINI.",
    authErrUsername: "USERNAME WAJIB DIISI.",
    authErrEmail: "MASUKKAN ALAMAT EMAIL YANG VALID.",
    authErrEmailBlocked: "EMAIL SEMENTARA / DISPOSABLE TIDAK DIIZINKAN.",
    authErrPassword: "KATA SANDI MINIMAL 6 KARAKTER.",
    authErrConfirm: "KATA SANDI TIDAK COCOK.",
    authFinePrint: "Data wangimu tersimpan secara lokal di perangkat ini.",
    // Dupe Alert
    dupeAlertTitle: "PARFUM SUDAH ADA DI BRANKAS.",
    dupeAlertSub: "Wangi ini sudah ada di koleksimu.",
    // Log Toast
    loggedSuccessfully: "SOTD BERHASIL DICATAT",
    // Footer
    footer: "Â© 2026 SOTD STUDIO â€” SEMUA HAK DILINDUNGI.",
  },
};

// ==========================================
// --- DISPOSABLE EMAIL BLOCKLIST ---
// ==========================================
const BLOCKED_DOMAINS = new Set([
  // Major temp-mail services
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.info', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.biz',
  'throwam.com', 'throwam.net', 'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  'monmail.fr.nf', '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.nl', '10minutemail.de',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.org', 'trashmail.at', 'trashmail.io', 'trashmail.xyz',
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org', 'mailnull.com', 'dispostable.com', 'discard.email',
  'spambox.us', 'spambox.org', 'spam4.me', 'spamfree24.org', 'spamfree.eu', 'maildrop.cc', 'spamspot.com',
  'fakeinbox.com', 'fakeinbox.net', 'fake-box.com', 'tempmail.com', 'temp-mail.org', 'tempr.email', 'tempinbox.com',
  'tempinbox.co.uk', 'tempemail.net', 'tempemail.co', 'tempemail.com', 'tmpmail.org', 'tmpmail.net', 'tmpeml.com',
  'getairmail.com', 'filzmail.com', 'filzmail.de', 'discard.email', 'discardmail.com', 'discardmail.de',
  'spamherelots.com', 'spamhereplease.com', 'herp.in', 'mailismagic.com', 'magicmail.com', 'mailme.lv',
  'mailme.gq', 'mailfreeonline.com', 'mailnew.com', 'mailandftp.com', 'mailseal.de', 'mailsiphon.com',
  'throwaway.email', 'burner.kz', 'mailbucket.org', 'mailcat.biz', 'mailforspam.com', 'mailimate.com',
  'mailmoat.com', 'mailnew.com', 'mailnull.com', 'mailpick.biz', 'mailrock.biz', 'mailscrap.com',
  'mailshell.com', 'mailsiphon.com', 'mailsiphon.com', 'mailslite.com', 'mailtome.de', 'mailtothis.com',
  'mailtrash.net', 'mailtrix.net', 'mailzilla.com', 'mailzilla.org', 'meltmail.com', 'mierdamail.com',
  'mintemail.com', 'mmmmail.com', 'moburl.com', 'mytempemail.com', 'nwldx.com', 'objectmail.com',
  'obobbo.com', 'odaymail.com', 'oneoffemail.com', 'onewaymail.com', 'oopi.org', 'ordinaryamerican.net',
  'owlpic.com', 'pepbot.com', 'pookmail.com', 'privacy.net', 'proxymail.eu', 'punkass.com', 'put2.net',
  'qq.com', 'quickinbox.com', 'recode.me', 'recursor.net', 'recyclemail.dk', 'regbypass.com', 'safetymail.info',
  'safetypost.de', 'sendspamhere.com', 'sharklasers.com', 'sharedmailbox.org', 'shieldemail.com',
  'shiftmail.com', 'shitmail.me', 'sify.com', 'skeefmail.com', 'slaskpost.se', 'slopsbox.com', 'slushmail.com',
  'smapfree24.com', 'smapfree24.de', 'smapfree24.eu', 'smapfree24.info', 'smapfree24.net', 'smapfree24.org',
  'smellfear.com', 'snakemail.com', 'sneakemail.com', 'snkmail.com', 'sofimail.com', 'sogetthis.com',
  'sohu.com', 'spam.la', 'spam.su', 'spam4.me', 'spamavert.com', 'spamboar.com', 'spamcon.org',
  'spamcorpse.com', 'spamday.com', 'spamex.com', 'spamfree.eu', 'spamgoes.in', 'spamgourmet.com',
  'spamgourmet.net', 'spamgourmet.org', 'spamherelots.com', 'spamhereplease.com', 'spamhole.com',
  'spamify.com', 'spaminator.de', 'spamkill.info', 'spaml.com', 'spaml.de', 'spammotel.com',
  'spamoff.de', 'spamspot.com', 'spamthisplease.com', 'spamtrail.com', 'speed.1s.fr', 'spikio.com',
  'spoofmail.de', 'stuffmail.de', 'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp',
  'superrito.com', 'superstachel.de', 'suremail.info', 'svk.jp', 'sweetxxx.de', 'tafmail.com',
  'tagertag.com', 'tagyourself.com', 'talkinator.com', 'tapchief.com', 'tech69.com', 'teewars.org',
  'teleworm.com', 'teleworm.us', 'telebot.net', 'tempalias.com', 'tempe-mail.com', 'tempemailaddress.com',
  'tempimbox.com', 'temporarioemail.com.br', 'temporaryemail.net', 'temporaryemail.us', 'temporaryforwarding.com',
  'temporaryinbox.com', 'temporarymailaddress.com', 'thankyou2010.com', 'thisisnotmyrealemail.com',
  'throwam.com', 'throwam.net', 'throwjunk.com', 'tittbit.in', 'tmail.com', 'tmicha.net',
  'tmailinator.com', 'toiea.com', 'token.com', 'toolsbox.net', 'top.msk.ru', 'topranklist.de',
  'tpwlkbm.com', 'trash-mail.at', 'trash-mail.com', 'trash-mail.de', 'trash-mail.ga', 'trash-mail.io',
  'trash-mail.xyz', 'trash2009.com', 'trashdevil.com', 'trashdevil.de', 'trashemail.de', 'trashmail.at',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.org', 'trashmailer.com', 'trashme.com',
  'trashymail.com', 'trayna.com', 'trbvm.com', 'trbvn.com', 'trg.pw', 'trickmail.net',
  'trillianpro.com', 'tritium.net', 'tronante.com', 'tryalert.com', 'turual.com', 'twinmail.de',
  'twoweirdtricks.com', 'tyldd.com', 'uggsrock.com', 'ukr.net', 'umail.net', 'unmail.ru',
  'uroid.com', 'us.af', 'valemail.net', 'veryrealemail.com', 'vidchart.com', 'viditag.com',
  'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org', 'viralplays.com', 'vpn.st',
  'vsimcard.com', 'vubby.com', 'w3internet.co.uk', 'walala.org', 'walkmail.net', 'walkmail.ru',
  'webemail.me', 'weg-werf-email.de', 'wegwerf-email.at', 'wegwerf-email.de', 'wegwerf-email.net',
  'wegwerf-email.org', 'wegwerfadresse.de', 'wegwerfemail.com', 'wegwerfemail.de', 'wegwerfemail.net',
  'wegwerfemail.org', 'wh4f.org', 'whyspam.me', 'wickmail.net', 'winemaven.info', 'wmail.cf',
  'wollan.info', 'wwwnew.eu', 'wudet.men', 'yapped.net', 'yepmail.net', 'yert.ye.vc',
  'yogamaven.com', 'yopmail.com', 'yopmail.fr', 'youcankeepit.info', 'yourdomain.com',
  'ypmail.webarnak.fr.eu.org', 'yuurok.com', 'z0d.eu', 'za.com', 'zehnminutenmail.de',
  'zippymail.info', 'zoemail.net', 'zoemail.org', 'zomg.info', 'zxcv.com', 'zxcvbnm.com',
  // Common TLD temp variations
  'getnada.com', 'mohmal.com', 'mailnesia.com', 'mailnull.com', 'spamgourmet.com',
  'tempm.com', 'tempsky.com', 'spamdecoy.net', 'fakemailgenerator.com', 'inoutmail.eu',
  'inoutmail.net', 'inoutmail.info', 'inoutmail.de', 'dispostable.com', 'armyspy.com',
  'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com',
  'rhyta.com', 'superrito.com', 'teleworm.us', 'emz.net', 'rku.us', 'mt2015.com',
]);

function isDisposableDomain(email: string): boolean {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return true;
  const domain = parts[1].trim();
  return BLOCKED_DOMAINS.has(domain);
}

export default function BrutalistSOTDpamungkas() {
  // ==========================================
  // --- STATES & REFS ---
  // ==========================================
  const [closet, setCloset] = useState<any[]>(Array(12).fill(null));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("INDOOR AC");
  const [selectedActivity, setSelectedActivity] = useState<string>("DATE");
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);

  // Weather & Location
  const [weather, setWeather] = useState<"Panas" | "Dingin" | null>(null);
  const [actualTemp, setActualTemp] = useState<number | null>(null);
  const [location, setLocation] = useState("Ketuk untuk akses lokasi & cuaca");
  const [isLocating, setIsLocating] = useState(false);

  // Engine
  const [isGenerated, setIsGenerated] = useState(false);
  const [mainRec, setMainRec] = useState<any>(null);
  const [altRecs, setAltRecs] = useState<any[]>([]);
  const [notRec, setNotRec] = useState<any>(null);

  // Daily Tracker
  const [journal, setJournal] = useState<any[]>([]);
  const [expandedRatingId, setExpandedRatingId] = useState<number | null>(null);
  const [journalPage, setJournalPage] = useState(0);

  // Misc
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const d = UI_DICT[lang];
  const [user, setUser] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authErrors, setAuthErrors] = useState<Record<string, string | null>>({
    username: null, email: null, password: null, confirm: null,
  });
  const [authShake, setAuthShake] = useState(false);

  // --- VAULT ANTI-DUPLICATE ALERT ---
  const [dupeAlert, setDupeAlert] = useState(false);
  const [dupeAlertKey, setDupeAlertKey] = useState(0);

  // --- ADDED TO VAULT SUCCESS FEEDBACK ---
  const [addedToVault, setAddedToVault] = useState<string | null>(null);

  // --- RECENT SOTD ---
  const [recentSOTD, setRecentSOTD] = useState<{ location: string; activity: string }[]>([]);

  // --- VAULT CATEGORY FILTER ---
  type VaultCategory = 'ALL' | 'CLEAN' | 'CITRUS' | 'GOURMAND' | 'BOLD' | 'FRUITY';
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState<VaultCategory>('ALL');

  // --- EXTENDED TRACKER METRICS ---
  const [actualSprays, setActualSprays] = useState(4);
  const [isLayered, setIsLayered] = useState(false);
  const [layeringPerfumeId, setLayeringPerfumeId] = useState<string>('');
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);

  // --- LOG SUCCESS TOAST ---
  const [logSuccessToast, setLogSuccessToast] = useState(false);
  const [emptyVaultAlert, setEmptyVaultAlert] = useState(false);

  // --- CUSTOM SCENT FORM ---
  const [discoveryMode, setDiscoveryMode] = useState<'search' | 'custom'>('search');
  const [customPerfumeName, setCustomPerfumeName] = useState('');
  const [customPerfumeBrand, setCustomPerfumeBrand] = useState('');
  const [customTopNotes, setCustomTopNotes] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customCategory, setCustomCategory] = useState<'CLEAN' | 'CITRUS' | 'GOURMAND' | 'BOLD' | 'FRUITY'>('CLEAN');
  const [customWeather, setCustomWeather] = useState<'Panas' | 'Dingin' | 'Versatile'>('Versatile');
  const [customImage, setCustomImage] = useState('');

  // ==========================================
  // --- TRANSLATION DICTIONARY ---
  // ==========================================
  const t = lang === 'en' ? {
    triviaSubtitle: 'Essential knowledge for the fragrance connoisseur.',
    funFacts: 'Fun Facts.',
    mythBusted: 'MYTH BUSTED',
    mythTitle1: 'Stop Rubbing',
    mythTitle2: 'Your Wrists.',
    mythBody: 'Rubbing your wrists together after spraying creates friction heat that breaks down the top notes prematurely.',
    mythDetail: 'The friction accelerates evaporation of the lightest molecules \u2014 citrus, aldehydes, and green notes vanish before they can develop naturally on your skin.',
    mythFix: '\u2192 THE FIX: Spray and let it dry. No touching. No rubbing. Just patience.',
    timingGuide: 'TIMING GUIDE',
    timingTitle1: 'Day vs. Night',
    timingTitle2: 'Scent Rules.',
    daytime: '\u2600 DAYTIME',
    nighttime: '\u263e NIGHTTIME',
    dayItems: ['\u2192 CITRUS & AQUATICS', '\u2192 GREEN & HERBAL', '\u2192 LIGHT FLORALS', '\u2192 FRESH MUSKS'],
    nightItems: ['\u2192 OUD & AMBER', '\u2192 LEATHER & TOBACCO', '\u2192 HEAVY ORIENTALS', '\u2192 SWEET GOURMANDS'],
    dayNote: 'Lower sillage. Skin-close projection.',
    nightNote: 'Higher sillage. Room-filling presence.',
    appRules: 'APPLICATION RULES',
    dosTitle: "Do & Dont's.",
    doLabel: '\u2713 DO THIS',
    dontLabel: '\u2717 NEVER DO THIS',
    doItems: [
      '\u2192 SPRAY ON PULSE POINTS (NECK, WRISTS, CHEST)',
      '\u2192 APPLY RIGHT AFTER A SHOWER ON MOISTURIZED SKIN',
      '\u2192 STORE IN A COOL, DARK PLACE AWAY FROM SUNLIGHT',
      '\u2192 LAYER WITH MATCHING UNSCENTED LOTION FOR LONGEVITY',
    ],
    dontItems: [
      "\u2192 DON'T RUB WRISTS TOGETHER AFTER APPLYING",
      "\u2192 DON'T SPRAY ON CLOTHES (STAINS & ALTERS SCENT)",
      "\u2192 DON'T KEEP BOTTLES IN THE BATHROOM (HEAT + HUMIDITY)",
      "\u2192 DON'T OVERSPRAY \u2014 4-5 IS THE MAX FOR MOST FRAGRANCES",
    ],
    warningDayNight: "[ \u26A0\uFE0F CRITICAL WARNING ] DON'T WEAR NIGHT SCENTS IN THE DAYTIME HEAT.",
    warningDayNightSub: "Wearing heavy Gourmands, Oud, or spicy leathers under the scorching sun is a disaster. Heat amplifies heavy molecules aggressively, turning them cloying and nauseating for everyone around you.",
    myth2Title1: "Post-Delivery",
    myth2Title2: "Shock.",
    myth2Body: "Don't judge a perfume immediately after it arrives from the courier.",
    myth2Detail: "Transit heat and aggressive shaking disturb the juice's molecules. The alcohol sits at the top, masking the true scent profile.",
    myth2Fix: "\u2192 THE FIX: Let it rest (macerate) in a cool, dark place for 24-48 hours before spraying.",
    myth3Title1: "Olfactory",
    myth3Title2: "Fatigue.",
    myth3Body: "\"My perfume disappeared after an hour!\" No, your nose just got tired.",
    myth3Detail: "The human brain is wired to ignore constant smells to detect new, potentially dangerous odors. You might be nose-blind, but others can still smell you.",
    myth3Fix: "\u2192 THE FIX: Don't overspray! Ask a friend if they can still smell it before reapplying.",
    myth4Title1: "Stop Blind",
    myth4Title2: "Buying.",
    myth4Body: "Never buy a full bottle just because an influencer hyped it up on social media.",
    myth4Detail: "Fragrance is highly subjective. What smells like a luxurious masterpiece to them might smell like bug spray or induce a headache for you. Don't fall for the hype blindly.",
    myth4Fix: "\u2192 THE FIX: Always buy a 2ml decant/sample first or sniff it directly at a store before committing.",
    guidePrefix: "Based on this perfume's profile, use ",
    guideMid: " for maximum scent impact. Focus on major pulse points: ",
    guidePulse: "neck, chest, and wrists",
    guideSuffix1: " (per the green indicators). An ideal choice for ",
    guideSuffix2: " weather in a ",
    guideSuffix3: " environment inside a ",
    guideSuffix4: " area.",
  } : {
    triviaSubtitle: 'Pengetahuan penting untuk pecinta wewangian.',
    funFacts: 'Fakta Menarik.',
    mythBusted: 'MITOS TERBANTAH',
    mythTitle1: 'Jangan Gosok',
    mythTitle2: 'Pergelangan.',
    mythBody: 'Menggosok pergelangan tangan setelah menyemprot menciptakan panas gesekan yang merusak top notes secara prematur.',
    mythDetail: 'Gesekan mempercepat penguapan molekul paling ringan \u2014 sitrus, aldehida, dan aroma hijau menghilang sebelum sempat berkembang secara alami di kulit.',
    mythFix: '\u2192 SOLUSI: Semprot dan biarkan mengering. Jangan sentuh. Jangan gosok. Cukup sabar.',
    timingGuide: 'PANDUAN WAKTU',
    timingTitle1: 'Siang vs. Malam',
    timingTitle2: 'Aturan Wangi.',
    daytime: '\u2600 SIANG HARI',
    nighttime: '\u263e MALAM HARI',
    dayItems: ['\u2192 SITRUS & AKUATIK', '\u2192 HIJAU & HERBAL', '\u2192 FLORAL RINGAN', '\u2192 MUSK SEGAR'],
    nightItems: ['\u2192 OUD & AMBER', '\u2192 KULIT & TEMBAKAU', '\u2192 ORIENTAL BERAT', '\u2192 GOURMAND MANIS'],
    dayNote: 'Sillage rendah. Proyeksi dekat kulit.',
    nightNote: 'Sillage tinggi. Memenuhi ruangan.',
    appRules: 'ATURAN PEMAKAIAN',
    dosTitle: 'Boleh & Jangan.',
    doLabel: '\u2713 LAKUKAN INI',
    dontLabel: '\u2717 JANGAN LAKUKAN',
    doItems: [
      '\u2192 SEMPROT DI TITIK NADI (LEHER, PERGELANGAN, DADA)',
      '\u2192 PAKAI SETELAH MANDI DI KULIT YANG SUDAH DILEMBAPKAN',
      '\u2192 SIMPAN DI TEMPAT SEJUK, GELAP, JAUH DARI SINAR MATAHARI',
      '\u2192 LAPISI DENGAN LOSION TANPA PEWANGI UNTUK KETAHANAN',
    ],
    dontItems: [
      '\u2192 JANGAN GOSOK PERGELANGAN SETELAH PEMAKAIAN',
      '\u2192 JANGAN SEMPROT DI BAJU (MENINGGALKAN NODA & MENGUBAH AROMA)',
      '\u2192 JANGAN SIMPAN DI KAMAR MANDI (PANAS + LEMBAP)',
      '\u2192 JANGAN BERLEBIHAN \u2014 4-5 SEMPROT MAKSIMAL UNTUK KEBANYAKAN PARFUM',
    ],
    warningDayNight: "[ \u26A0\uFE0F PERINGATAN KRITIS ] JANGAN PAKAI PARFUM MALAM DI SIANG PANAS.",
    warningDayNightSub: "Memakai parfum Gourmand, Oud, atau kulit pedas di bawah terik matahari adalah bencana. Suhu panas memuaikan molekul berat secara agresif, membuatnya jadi sangat enek dan mual bagi orang di sekitarmu.",
    myth2Title1: "Sindrom Paket",
    myth2Title2: "Kurir.",
    myth2Body: "Jangan langsung menilai parfum yang baru turun dari tangan kurir.",
    myth2Detail: "Panas di perjalanan dan guncangan hebat mengacaukan molekul juice. Alkohol akan naik ke atas, menutupi profil wangi aslinya.",
    myth2Fix: "\u2192 SOLUSI: Simpan di tempat sejuk & gelap (maserasi) selama 24-48 jam sebelum disemprot.",
    myth3Title1: "Hidung",
    myth3Title2: "Kebal.",
    myth3Body: "\"Kok baru 1 jam wanginya udah hilang?\" Bukan hilang, hidungmu yang capek.",
    myth3Detail: "Otak manusia dirancang untuk mengabaikan bau yang konstan agar bisa mendeteksi bau baru. Kamu mungkin tidak menciumnya, tapi orang lain masih menciumnya dengan jelas.",
    myth3Fix: "\u2192 SOLUSI: Jangan overspray! Tanya teman di sebelahmu sebelum semprot ulang.",
    myth4Title1: "Berhenti",
    myth4Title2: "Blind Buy.",
    myth4Body: "Jangan pernah beli full bottle cuma karena keracunan review influencer di sosmed.",
    myth4Detail: "Selera wangi itu sangat subjektif. Parfum yang dibilang 'masterpiece' sama orang lain bisa aja baunya kayak obat nyamuk atau bikin pusing di hidungmu.",
    myth4Fix: "\u2192 SOLUSI: Mending beli decant dulu atau sniff langsung di toko sebelum mutusin beli botol gedenya.",
    guidePrefix: 'Berdasarkan profil parfum ini, gunakan ',
    guideMid: ' aja biar wanginya maksimal. Fokus pada titik nadi utama: ',
    guidePulse: 'leher, dada, dan pergelangan tangan',
    guideSuffix1: ' (sesuai indikator hijau). Pilihan yang sangat ideal untuk cuaca ',
    guideSuffix2: ' di lingkungan ',
    guideSuffix3: ' di area ',
    guideSuffix4: '.',
  };

  // ==========================================
  // --- EFFECTS ---
  // ==========================================
  useEffect(() => {
    // NOTE: User session (name + avatar) is restored via onAuthStateChange below,
    // which fires on every page load with the correct Google profile metadata.
    // Do NOT restore 'sotd_user' from localStorage here â€” it may contain a stale
    // raw provider ID (e.g. "GOOGLE_MPT9V0KV") written by an older version of the app.

    // Restore vault from localStorage
    const savedCloset = localStorage.getItem('sotd_closet');
    if (savedCloset) {
      try {
        const parsed = JSON.parse(savedCloset);
        const filledCloset = [...parsed];
        while (filledCloset.length < 12) filledCloset.push(null);
        setCloset(filledCloset);
      } catch (e) {
        console.error('Failed to restore vault from localStorage', e);
      }
    }

    // Restore journal from localStorage
    const savedJournal = localStorage.getItem('sotd_journal');
    if (savedJournal) {
      try {
        setJournal(JSON.parse(savedJournal));
      } catch (e) {
        console.error('Failed to restore journal from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);


  // --- KODE ANTI-HILANG SAKTI ---
  useEffect(() => {
    // Abaikan penyimpanan kalau closet masih kosong bawaan (kosong melompong awal)
    const hasData = closet.some(item => item !== null);
    if (hasData) {
      localStorage.setItem("sotd_closet", JSON.stringify(closet));
    }
  }, [closet]);

  // --- AUTO-CLEAR DUPE ALERT after 3 seconds ---
  useEffect(() => {
    if (dupeAlert) {
      const timer = setTimeout(() => {
        setDupeAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dupeAlert, dupeAlertKey]);

  // ==========================================
  // --- LOGIC FUNCTIONS ---
  // ==========================================
  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthErrors({ username: null, email: null, password: null, confirm: null });
  };

  const triggerAuthShake = () => {
    setAuthShake(true);
    setTimeout(() => setAuthShake(false), 600);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: Record<string, string | null> = { username: null, email: null, password: null, confirm: null };
    let hasError = false;

    if (authMode === 'signup') {
      if (!authUsername.trim()) { newErrors.username = d.authErrUsername; hasError = true; }
      if (!authEmail.trim() || !emailRegex.test(authEmail)) {
        newErrors.email = d.authErrEmail; hasError = true;
      } else if (isDisposableDomain(authEmail)) {
        newErrors.email = d.authErrEmailBlocked; hasError = true;
      }
      if (authPassword.length < 6) { newErrors.password = d.authErrPassword; hasError = true; }
      if (authPassword !== authConfirmPassword) { newErrors.confirm = d.authErrConfirm; hasError = true; }
    } else {
      if (!authEmail.trim() || !emailRegex.test(authEmail)) {
        newErrors.email = d.authErrEmail; hasError = true;
      }
      if (!authPassword) { newErrors.password = d.authErrPassword; hasError = true; }
    }

    setAuthErrors(newErrors);
    if (hasError) { triggerAuthShake(); return; }

    const displayUser = authMode === 'signup' ? authUsername.trim() : authEmail.split('@')[0];
    const safeEmailKey = authEmail.trim().toLowerCase();
    performLoginSync(displayUser, safeEmailKey);
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://my-sotd-app-460699291343.asia-southeast2.run.app/auth/callback`,
        scopes: 'openid email profile',
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      }
    });

    if (error) {
      console.error("Supabase Google Auth Error:", error);
    }
  };

  const performLoginSync = (displayUser: string, emailKey: string) => {
    const localClosetRaw = localStorage.getItem("sotd_closet");
    let guestItems: any[] = [];
    if (localClosetRaw) {
      try {
        const parsed = JSON.parse(localClosetRaw);
        guestItems = parsed.filter((item: any) => item !== null).slice(0, 3);
      } catch (e) {
        console.error("Sync parse error", e);
      }
    }

    // USE EMAIL AS THE UNIQUE KEY FOR BACKUPS
    const userBackupCloset = localStorage.getItem(`sotd_closet_${emailKey}`);
    const userBackupJournal = localStorage.getItem(`sotd_journal_${emailKey}`);

    setCloset((prevCloset) => {
      let merged: any[] = [];
      if (userBackupCloset) {
        merged = JSON.parse(userBackupCloset).filter((item: any) => item !== null);
      }
      for (const gItem of guestItems) {
        const alreadyExists = merged.some(
          (existing) => existing && (existing.id === gItem.id || existing.name === gItem.name)
        );
        if (!alreadyExists) merged.push(gItem);
      }

      const slotCount = Math.max(12, Math.ceil((merged.length + 1) / 4) * 4);
      const newCloset = [...merged];
      while (newCloset.length < slotCount) newCloset.push(null);

      localStorage.setItem("sotd_closet", JSON.stringify(newCloset));
      return newCloset;
    });

    if (userBackupJournal) {
      const parsedJournal = JSON.parse(userBackupJournal);
      setJournal(parsedJournal);
      localStorage.setItem("sotd_journal", JSON.stringify(parsedJournal));
    }

    setUser(displayUser);
    localStorage.setItem("sotd_user", displayUser);
    localStorage.setItem("sotd_user_email", emailKey);

    setShowAuthModal(false);
    setAuthUsername("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthConfirmPassword("");
    setAuthErrors({ username: null, email: null, password: null, confirm: null });
  };

  const handleLogout = async () => {
    const currentUserEmail = localStorage.getItem("sotd_user_email");

    if (currentUserEmail) {
      // BACKUP USING THE SAVED EMAIL KEY
      localStorage.setItem(`sotd_closet_${currentUserEmail}`, JSON.stringify(closet));
      localStorage.setItem(`sotd_journal_${currentUserEmail}`, JSON.stringify(journal));
    }

    setUser(null);
    setUserAvatar(null);
    localStorage.removeItem("sotd_user");
    localStorage.removeItem("sotd_user_email");

    setCloset(Array(12).fill(null));
    setJournal([]);

    localStorage.removeItem("sotd_closet");
    localStorage.removeItem("sotd_journal");

    await supabase.auth.signOut();
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('EVENT:', event)
      console.log('METADATA:', session?.user?.user_metadata)
      if (session?.user) {
        // Clear stale google_xxx provider IDs from localStorage
        const storedUser = localStorage.getItem('sotd_user');
        if (storedUser && storedUser.toLowerCase().startsWith('google_')) {
          localStorage.removeItem('sotd_user');
          localStorage.removeItem('sotd_user_email');
        }
        // Prefer full_name â†’ name â†’ email prefix
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.identities?.[0]?.identity_data?.full_name ||
          session.user.identities?.[0]?.identity_data?.name ||
          session.user.email?.split('@')[0] ||
          "User";
        const emailKey = session.user.email?.trim().toLowerCase() || 'unknown';
        setUser(name);
        setUserAvatar(session.user.user_metadata?.avatar_url || null);
        // Always write the correct name back to localStorage so any stale
        // raw provider ID (e.g. "GOOGLE_MPT9V0KV") gets overwritten immediately.
        localStorage.setItem('sotd_user', name);

        if (event === 'SIGNED_IN') {
          performLoginSync(name, emailKey);
        }
      } else {
        setUser(null);
        setUserAvatar(null);
        localStorage.removeItem('sotd_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocation("Mencari sinyal satelit...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
            const geoData = await geoRes.json();
            const city = geoData.city || geoData.locality || "Kota Diketahui";
            const country = geoData.countryName || "";

            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`);
            const weatherData = await weatherRes.json();
            const currentTemp = Math.round(weatherData.current_weather.temperature);

            setLocation(`${city}, ${country}`);
            setActualTemp(currentTemp);
            setWeather(currentTemp >= 26 ? "Panas" : "Dingin");
          } catch (error) {
            setLocation("Gagal memuat data");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setLocation("Akses lokasi ditolak pengguna");
          setIsLocating(false);
        }
      );
    } else {
      setLocation("Geolokasi tidak didukung");
      setIsLocating(false);
    }
  };

  const addToCloset = (perfume: any) => {
    // --- ANTI-DUPLICATE CHECK ---
    const isDuplicate = closet.some(
      (item) => item !== null && (item.id === perfume.id || (item.name === perfume.name && item.brand === perfume.brand))
    );
    if (isDuplicate) {
      setDupeAlert(true);
      setDupeAlertKey((prev) => prev + 1);
      return;
    }

    // --- AUTH HOOK: limit non-logged-in users to 3 local vault slots ---
    const currentCount = closet.filter((item) => item !== null).length;
    if (user === null && currentCount >= 3) {
      setIsModalOpen(false);
      setShowAuthModal(true);
      return;
    }

    // Assign a random price if DB perfume has no price property
    const perfumeWithPrice = perfume.price != null
      ? perfume
      : { ...perfume, price: Math.floor(Math.random() * (1500000 - 300000 + 1)) + 300000 };

    // --- UPDATE STATE UI (instant, no network call) ---
    const nextEmptyIndex = closet.findIndex((item) => item === null);
    let newCloset: any[];
    if (nextEmptyIndex !== -1) {
      newCloset = [...closet];
      newCloset[nextEmptyIndex] = perfumeWithPrice;
    } else {
      newCloset = [...closet, perfumeWithPrice];
    }
    setCloset(newCloset);
    localStorage.setItem('sotd_closet', JSON.stringify(newCloset));

    setAddedToVault(perfumeWithPrice.name);
    setTimeout(() => setAddedToVault(null), 2000);
  };

  const removeFromCloset = (itemToRemove: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // Remove directly from state and persist to localStorage â€” no network call
    setCloset((prev) => {
      const newCloset = [...prev];
      const idx = newCloset.findIndex(p => p !== null && (p.id === itemToRemove.id || p.name === itemToRemove.name));
      if (idx !== -1) newCloset[idx] = null;
      localStorage.setItem('sotd_closet', JSON.stringify(newCloset));
      return newCloset;
    });
  };

  const clearAllCloset = () => {
    // Clear state and localStorage â€” no network call
    setCloset(Array(12).fill(null));
    localStorage.removeItem('sotd_closet');
  };

  const resetCustomPerfumeForm = () => {
    setCustomPerfumeName('');
    setCustomPerfumeBrand('');
    setCustomTopNotes('');
    setCustomPrice('');
    setCustomCategory('CLEAN');
    setCustomWeather('Versatile');
    setCustomImage('');
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submitCustomPerfume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPerfumeName.trim() || !customPerfumeBrand.trim()) return;

    const topNotes = customTopNotes
      .split(',')
      .map((note) => note.trim())
      .filter(Boolean);

    const customPerfume = {
      id: Date.now(),
      name: customPerfumeName.trim(),
      brand: customPerfumeBrand.trim(),
      img: customImage || '/images/monaco.png',
      topNotes: customTopNotes.trim(),
      notes: { top: topNotes },
      price: customPrice ? Number(customPrice) : 0,
      category: customCategory,
      weather: customWeather,
    };

    addToCloset(customPerfume);
    resetCustomPerfumeForm();
    setDiscoveryMode('search');
    setSearchQuery('');
    setIsModalOpen(false);
  };


  const generateSOTD = () => {
    const availablePerfumes = closet.filter(item => item !== null);
    if (availablePerfumes.length === 0) {
      setEmptyVaultAlert(true);
      setTimeout(() => setEmptyVaultAlert(false), 3000);
      return;
    }

    const currentActiveWeather = weather || "Panas";
    const isHot = currentActiveWeather === "Panas";

    // --- CATEGORY PRIORITY based on weather + activity combo ---
    const priorityCategoriesSet = new Set<string>();
    const activeContexts = [selectedLocation, selectedActivity];
    for (const activeContext of activeContexts) {
      if (activeContext === "DATE" && isHot) {
        ["CLEAN", "CITRUS"].forEach(c => priorityCategoriesSet.add(c));
      } else if (activeContext === "DATE") {
        ["CLEAN", "FRUITY"].forEach(c => priorityCategoriesSet.add(c));
      } else if (activeContext === "SPORT" || activeContext === "GYM") {
        ["CLEAN", "CITRUS"].forEach(c => priorityCategoriesSet.add(c));
      } else if (activeContext === "FORMAL") {
        ["BOLD", "CLEAN"].forEach(c => priorityCategoriesSet.add(c));
      } else if (isHot) {
        ["CITRUS", "CLEAN", "FRUITY"].forEach(c => priorityCategoriesSet.add(c));
      } else {
        ["GOURMAND", "BOLD"].forEach(c => priorityCategoriesSet.add(c));
      }
    }
    const priorityCategories = Array.from(priorityCategoriesSet);

    // --- MAIN RECOMMENDATION ---
    // Step 1: Get weather-matched pool (Versatile counts for both)
    let weatherMatches = availablePerfumes.filter(p =>
      p.weather === currentActiveWeather || p.weather === "Versatile"
    );

    // Step 2: Try priority categories within weather-matched pool first
    let prioritized = weatherMatches.filter((p: any) =>
      priorityCategories.includes(p.category)
    );

    // Step 3: If no strict category+weather match, fall back to all priority-category perfumes in closet
    if (prioritized.length === 0) {
      prioritized = availablePerfumes.filter((p: any) =>
        priorityCategories.includes(p.category)
      );
    }

    // Step 4: Final fallback â€” use all available perfumes in closet seamlessly
    const matches = prioritized.length > 0 ? prioritized : availablePerfumes;

    const shuffled = [...matches].sort(() => 0.5 - Math.random());
    setMainRec(shuffled[0]);

    // Alts: pull from weather-matched pool (or full pool if empty), excluding the top pick
    const altPool = (weatherMatches.length > 0 ? weatherMatches : availablePerfumes)
      .filter((p: any) => p !== shuffled[0]);
    setAltRecs(altPool.sort(() => 0.5 - Math.random()).slice(0, 3));

    // --- NOT RECOMMENDED (inverse weather, non-Versatile) ---
    const inverseWeather = isHot ? "Dingin" : "Panas";
    const inverseMatches = availablePerfumes.filter(p =>
      p.weather === inverseWeather && p.weather !== "Versatile"
    );
    if (inverseMatches.length > 0) {
      setNotRec(inverseMatches.sort(() => 0.5 - Math.random()).slice(0, 3));
    } else {
      setNotRec(null);
    }

    // --- AUTO-SET SPRAY COUNT based on recommended perfume weather ---
    const recommendedPerfume = shuffled[0];
    if (recommendedPerfume?.weather === 'Panas') {
      setActualSprays(6);
    } else {
      setActualSprays(3);
    }

    setRecentSOTD((prev) => {
      const newEntry = { location: selectedLocation, activity: selectedActivity };
      return [newEntry, ...prev].slice(0, 3);
    });

    setIsGenerated(true);
  };

  const logToJournal = () => {
    if (!mainRec) return;
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour <= 10 ? 'Pagi' : hour <= 14 ? 'Siang' : hour <= 18 ? 'Sore' : 'Malam';
    const today = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const rawDateStr = now.toISOString().split('T')[0];
    const spraysStr = `${actualSprays}x Sprays`;
    const layeredStr = isLayered ? layeringPerfumeId : 'None';
    const weatherStr = actualTemp !== null ? `${actualTemp}\u00b0C - ${weather}` : (weather || 'Panas');
    const activityStr = `${selectedLocation} + ${selectedActivity}`;

    const newLog = {
      id: Date.now(),
      date: today,
      rawDate: rawDateStr,
      perfume: mainRec,
      timeOfDay,
      weather: weatherStr,
      activity: activityStr,
      sprays: spraysStr,
      layeredWith: layeredStr,
      userLongevity: 'moderate',
      userSillage: 'moderate',
    };

    const updatedJournal = [newLog, ...journal];
    setJournal(updatedJournal);
    // Persist journal to localStorage so it survives page refresh
    localStorage.setItem('sotd_journal', JSON.stringify(updatedJournal));

    setLogSuccessToast(true);
    setTimeout(() => setLogSuccessToast(false), 3000);
  };

  const updateJournalPerformance = (logId: number, field: 'userLongevity' | 'userSillage', value: string) => {
    const updatedJournal = journal.map((log) =>
      log.id === logId ? { ...log, [field]: value } : log
    );
    setJournal(updatedJournal);
    // Persist updated journal to localStorage
    localStorage.setItem('sotd_journal', JSON.stringify(updatedJournal));
  };

  const filteredSearch = useMemo((): PerfumeEntry[] => {
    if (!searchQuery) return allPerfumes;
    return allPerfumes.filter((p: PerfumeEntry) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // --- GROUP filteredSearch BY BRAND (A â†’ Z) ---
  const groupedByBrand = useMemo(() => {
    const groups = filteredSearch.reduce<Record<string, PerfumeEntry[]>>(
      (acc, perfume) => {
        const brand = perfume.brand || 'UNKNOWN';
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(perfume);
        return acc;
      },
      {}
    );
    // Sort brand names alphabetically A â†’ Z
    return Object.entries(groups).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
  }, [filteredSearch]);

  // --- DYNAMIC GRID SIZING ---
  const gridSize = useMemo(() => {
    const filledCount = closet.filter(item => item !== null).length;
    const MIN_SLOTS = 12;
    if (user === null || filledCount <= 11) return Math.max(MIN_SLOTS, closet.length);
    // Next multiple of 4 that exceeds filledCount â€” guarantees empty "+" slots
    return Math.ceil((filledCount + 1) / 4) * 4;
  }, [closet, user]);

  const displayCloset = useMemo(() => {
    const filled = closet.filter(item => item !== null);
    const display = [...filled];
    while (display.length < gridSize) display.push(null);
    return display.slice(0, gridSize);
  }, [closet, gridSize]);

  // ==========================================
  // --- MONTHLY CALENDAR COMPUTATION ---
  // ==========================================
  const calendarData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Build a map: YYYY-MM-DD -> journal entry (last one wins if multiple)
    const journalMap: Record<string, any> = {};
    journal.forEach((log) => {
      if (log.rawDate) journalMap[log.rawDate] = log;
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDay.getDate();

    // Monday-based week offset: Mon=0 â€¦ Sun=6
    const startDow = (firstDay.getDay() + 6) % 7;

    // Build cell array: nulls for leading blanks, then day numbers
    const cells: { day: number | null; dateStr: string | null; log: any | null }[] = [];
    for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: null, log: null });
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      cells.push({ day: d, dateStr, log: journalMap[dateStr] || null });
    }

    const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    return { cells, monthLabel, totalDaysInMonth };
  }, [journal]);

  // --- STATS COMPUTATION ---
  const trackerStats = useMemo(() => {
    const totalWearings = journal.length;
    const uniqueScents = new Set(journal.map((log) => log.perfume?.name)).size;

    // Active streak: count consecutive days from today backwards that have journal entries
    let streak = 0;
    if (journal.length > 0) {
      const journalDatesSet = new Set<string>();
      journal.forEach((log) => {
        if (log.rawDate) journalDatesSet.add(log.rawDate);
      });
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (journalDatesSet.has(dateStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    return { totalWearings, uniqueScents, streak };
  }, [journal]);

  // --- WARDROBE VALUATION ---
  const totalWardrobeValue = useMemo(() => {
    return closet
      .filter((item) => item !== null)
      .reduce((sum: number, item: any) => sum + (item.price || 0), 0);
  }, [closet]);

  // --- ACTIVITY ICON SHAPES ---
  const getActivityIcon = (act: string) => {
    switch (act) {
      case "INDOOR AC":
        // Snowflake / AC symbol
        return <path d="M50 5 L95 45 L85 45 L85 90 L15 90 L15 45 L5 45 Z" />;
      case "INDOOR NON-AC":
        return <circle cx="50" cy="50" r="40" />;
      case "OUTDOOR":
        return <path d="M50 20a30 30 0 110 60 30 30 0 010-60zM50 0v10M50 90v10M0 50h10M90 50h10M14 14l7 7M79 79l7 7M14 86l7-7M79 21l7-7" stroke="currentColor" strokeWidth="5" fill="none" />;
      case "ACTIVITY":
        // Diamond / dynamic shape
        return <polygon points="50,5 95,50 50,95 5,50" />;
      default:
        return <rect x="10" y="10" width="80" height="80" />;
    }
  };

  // ==========================================
  // --- HERO TYPEWRITER EFFECT ---
  // ==========================================
  const heroLines = ["Digital", "Fragrance", "Concierge"];
  const [typedText, setTypedText] = useState<string[]>(["", "", ""]);
  const [typewriterDone, setTypewriterDone] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    setTypedText(["", "", ""]);
    setTypewriterDone(false);

    const interval = setInterval(() => {
      if (lineIndex >= heroLines.length) {
        clearInterval(interval);
        setTypewriterDone(true);
        return;
      }
      const currentLine = heroLines[lineIndex];
      setTypedText((prev) => {
        const updated = [...prev];
        updated[lineIndex] = currentLine.slice(0, charIndex + 1);
        return updated;
      });
      charIndex++;
      if (charIndex >= currentLine.length) {
        lineIndex++;
        charIndex = 0;
      }
    }, 60);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // --- RENDER ---
  // ==========================================
  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 scroll-smooth ${isDark ? 'bg-[#0a0a0a] text-[#fafafa] selection:bg-[#fafafa] selection:text-[#0a0a0a]' : 'bg-[#fafafa] text-[#111111] selection:bg-[#111111] selection:text-white'}`}>

      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/80 border-[#333333]' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#beranda">
            <img
              src="/logo-sotd.png"
              alt="SOTD Studio"
              className="h-18 w-18 object-contain hover:scale-105 transition-transform duration-200"
            />
          </a>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 mr-4">
              {[
                { href: 'beranda', label: d.navBeranda },
                { href: 'vault', label: d.navVault },
                { href: 'stylist', label: d.navStylist },
                { href: 'tracker', label: d.navTracker },
              ].map(({ href, label }) => (
                <a key={href} href={`#${href}`} className="text-[10px] tracking-[0.3em] uppercase font-bold hover:line-through transition-all">{label}</a>
              ))}
              <a href="#trivia" className="text-[10px] tracking-[0.3em] uppercase font-bold hover:line-through transition-all">{d.navTrivia}</a>
              <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')} className={`inline-flex items-center text-[10px] tracking-[0.3em] uppercase font-black px-3 py-1 border-2 transition-all duration-300 hover:scale-105 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>{d.langToggle}</button>
            </div>
            <button onClick={() => setIsDark(!isDark)} className={`w-12 h-6 rounded-full border relative flex items-center px-1 transition-colors duration-300 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isDark ? 'translate-x-6 bg-[#fafafa]' : 'bg-[#111111]'}`}></div>
            </button>


            {user ? (
              <div className={`flex items-center gap-4 border-l pl-4 ${isDark ? 'border-[#333333]' : 'border-gray-400'}`}>
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user}
                    title={user}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 object-cover flex-shrink-0"
                    style={{ borderColor: isDark ? '#555' : '#ccc' }}
                  />
                ) : (
                  <div
                    title={user}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{ background: isDark ? '#333' : '#eee', color: isDark ? '#fafafa' : '#111' }}
                  >
                    {user.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={`text-[10px] tracking-widest uppercase font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {d.hiUser} {user}
                </span>
                <button onClick={handleLogout} className="text-[10px] uppercase font-bold text-red-500 hover:line-through">{d.logoutBtn}</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className={`text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-2 border transition-all duration-300 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>{d.loginBtn}</button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="beranda" className={`min-h-screen flex flex-col pt-32 px-6 border-b justify-end pb-24 transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto w-full">
          <p className={`text-[10px] tracking-[0.5em] uppercase font-bold mb-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.heroIntro}</p>
          <h1 id="typing-text" className="text-[12vw] font-medium tracking-tighter leading-[0.85] mb-20 uppercase transition-colors duration-500">
            {typedText[0]}<br />
            {typedText[1]}<br />
            {typedText[2]}<span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <p className={`max-w-md text-xl font-light leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.heroBody}</p>
            <a href="#vault" className={`px-12 py-5 border text-[10px] uppercase font-bold tracking-widest transition-all duration-500 hover:scale-105 ${isDark ? 'border-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] hover:bg-[#111111] hover:text-white'}`}>{d.heroCtaBtn}</a>
          </div>
        </div>
      </section>

      <main className="max-w-screen-2xl mx-auto px-6">

        {/* THE VAULT */}
        <section id="vault" className={`py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.vaultLabel}</span>
          </div>
          <div className="md:col-span-9">
            <div className="mb-12">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">{d.vaultTitle}</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.vaultSubtitle}</p>
              <button onClick={clearAllCloset} className={`mt-6 inline-block text-[10px] tracking-widest uppercase font-bold border-2 px-4 py-2 transition-all duration-300 hover:scale-105 ${isDark ? 'border-[#fafafa] text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white'}`}>{d.vaultClearBtn}</button>
            </div>

            {/* --- CATEGORY FILTER --- */}
            <div className="mb-8">
              <span className={`text-[10px] tracking-widest uppercase font-bold block mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.vaultFilterLabel}</span>
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'CLEAN', 'CITRUS', 'GOURMAND', 'BOLD', 'FRUITY'] as const).map((cat) => (
                  <button
                    key={`cat-${cat}`}
                    onClick={() => setVaultCategoryFilter(cat)}
                    className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 border-2 transition-all duration-200 hover:scale-105 ${vaultCategoryFilter === cat
                      ? (isDark ? 'bg-[#fafafa] text-[#0a0a0a] border-[#fafafa]' : 'bg-[#111111] text-white border-[#111111]')
                      : (isDark ? 'border-[#333333] text-gray-500 hover:border-[#fafafa] hover:text-[#fafafa]' : 'border-gray-300 text-gray-400 hover:border-[#111111] hover:text-[#111111]')
                      }`}
                  >
                    [ {cat} ]
                  </button>
                ))}
              </div>
            </div>

            {/* --- VAULT GRID (filtered) --- */}
            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border-t border-l transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
              {displayCloset
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => {
                  if (vaultCategoryFilter === 'ALL') return true;
                  if (!item) return true; // always show empty slots
                  return (item as any).category === vaultCategoryFilter;
                })
                .map(({ item, idx }) => (
                  <div key={`closet-${idx}`} onClick={() => {
                    if (!item) {
                      // --- AUTH HOOK: gate empty-slot clicks for non-logged-in users at 3 ---
                      const currentCount = closet.filter((c) => c !== null).length;
                      if (user === null && currentCount >= 3) {
                        setShowAuthModal(true);
                        return;
                      }
                      setIsModalOpen(true);
                    }
                  }} className={`aspect-[3/4] relative border-r border-b flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 group overflow-hidden ${isDark ? 'border-[#333333] bg-[#121212] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    {item ? (
                      <>
                        <img src={item.img} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" alt="" />
                        {(item as any).category && (
                          <span className={`absolute top-2 left-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 z-10 ${(item as any).category === 'CLEAN' ? 'bg-sky-500 text-white' :
                            (item as any).category === 'CITRUS' ? 'bg-yellow-400 text-black' :
                              (item as any).category === 'GOURMAND' ? 'bg-orange-500 text-white' :
                                (item as any).category === 'BOLD' ? 'bg-purple-700 text-white' :
                                  'bg-pink-500 text-white'
                            }`}>{(item as any).category}</span>
                        )}
                        <button onClick={(e) => removeFromCloset(item, e)} className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border ${isDark ? 'bg-[#121212] border-[#fafafa] text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'bg-white border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white'}`}><span className="text-[10px] uppercase font-black tracking-widest">[ X ]</span></button>
                        <div className={`absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm border-t transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isDark ? 'bg-[#0a0a0a]/90 border-[#333333]' : 'bg-white/90 border-gray-100'}`}>
                          <p className={`text-[8px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.brand.toUpperCase()}</p>
                          <p className="text-[10px] font-bold uppercase truncate transition-colors duration-300">{item.name}</p>
                        </div>
                      </>
                    ) : (
                      <span className={`font-light text-4xl transition-colors duration-300 ${isDark ? 'text-[#333333] group-hover:text-[#fafafa]' : 'text-gray-200 group-hover:text-[#111111]'}`}>+</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* STYLIST ENGINE */}
        <section id="stylist" className={`py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.stylistLabel}</span>
          </div>
          <div className="md:col-span-9 space-y-16">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">{d.stylistTitle}</h2>
            </div>

            {/* --- GENERATE SOTD / ENVIRONMENT SETUP --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-start">

              {/* LEFT COLUMN: ENVIRONMENT SETUP */}
              <div className="flex flex-col">
                <h2 className={`text-xs font-bold tracking-widest mb-6 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.envSetup}</h2>

                <div className="flex items-center gap-2 mb-4" onClick={handleGetLocation}>
                  <MapPin size={18} strokeWidth={2} className="shrink-0" />
                  <h3 className="font-semibold text-sm tracking-widest uppercase truncate cursor-pointer hover:opacity-70 transition-opacity">
                    {isLocating ? d.detectingLocation : (actualTemp !== null ? location.slice(0, 24) : d.tapLocation)}
                  </h3>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={(e) => { e.stopPropagation(); setWeather('Panas'); setActualTemp(32); setLocation('Pekanbaru, Indonesia'); }}
                      className={`text-[10px] font-bold border px-2 py-1 transition-colors ${weather === 'Panas' ? (isDark ? 'bg-[#fafafa] text-black border-[#fafafa]' : 'bg-black text-white border-black') : (isDark ? 'border-[#333] text-gray-500' : 'border-gray-300 text-gray-500')}`}>DRY PANAS</button>
                    <button onClick={(e) => { e.stopPropagation(); setWeather('Dingin'); setActualTemp(22); setLocation('Pekanbaru, Indonesia'); }}
                      className={`text-[10px] font-bold border px-2 py-1 transition-colors ${weather === 'Dingin' ? (isDark ? 'bg-[#fafafa] text-black border-[#fafafa]' : 'bg-black text-white border-black') : (isDark ? 'border-[#333] text-gray-500' : 'border-gray-300 text-gray-500')}`}>DRY DINGIN</button>
                  </div>
                </div>

                <div className="flex flex-col mb-8">
                  <div className="flex items-center gap-3">
                    <Sun size={32} strokeWidth={1.5} />
                    <span className="text-3xl font-light tracking-tight">
                      {weather === 'Panas' ? 'Sunny' : weather === 'Dingin' ? 'Rainy' : 'â€”'} {actualTemp !== null ? `/ ${actualTemp}Â°C` : ''}
                    </span>
                  </div>
                  {actualTemp !== null && actualTemp > 30 && (
                    <p className="text-xs font-bold text-red-600 mt-2 tracking-widest uppercase">{d.warningAvoidOud}</p>
                  )}
                  {actualTemp !== null && actualTemp <= 24 && (
                    <p className="text-xs font-bold text-emerald-600 mt-2 tracking-widest uppercase">{d.idealOud}</p>
                  )}
                </div>

                <div className="mb-6">
                  <p className={`text-[10px] font-bold tracking-widest mb-3 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.locationLabel}</p>
                  <div className="flex flex-col gap-2">
                    {['INDOOR AC', 'INDOOR NON-AC', 'OUTDOOR'].map((loc) => {
                      const isActive = selectedLocation === loc;
                      const LocationIcon = loc === 'INDOOR AC' ? Snowflake : loc === 'INDOOR NON-AC' ? Home : TreePine;
                      return (
                        <button
                          key={loc}
                          onClick={() => setSelectedLocation(loc)}
                          className={`text-left text-xs font-bold tracking-widest py-3 px-4 border transition-colors ${isActive ? (isDark ? 'border-[#fafafa] text-[#fafafa]' : 'border-black text-black') : (isDark ? 'border-[#333] text-gray-500' : 'border-gray-200 text-gray-400')}`}
                        >
                          {isActive ? (
                            <div className="flex items-center gap-2">
                              <LocationIcon size={14} strokeWidth={2.5} />
                              {loc}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <LocationIcon size={14} strokeWidth={2.5} />
                              {loc}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8 flex-1">
                  <p className={`text-[10px] font-bold tracking-widest mb-3 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.activityLabel}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['SPORT', 'GYM', 'DATE', 'FORMAL'].map((act) => {
                      const isActive = selectedActivity === act;
                      const ActivityIcon = act === 'SPORT' ? Activity : act === 'GYM' ? Dumbbell : act === 'DATE' ? Heart : Briefcase;
                      return (
                        <button
                          key={act}
                          onClick={() => setSelectedActivity(act)}
                          className={`flex items-center justify-between text-xs font-bold tracking-widest py-3 px-3 border transition-colors ${isActive ? (isDark ? 'border-[#fafafa] text-[#fafafa]' : 'border-black text-black') : (isDark ? 'border-[#333] text-gray-500' : 'border-gray-200 text-gray-400')}`}
                        >
                          <span className="flex items-center gap-2">
                            <ActivityIcon size={14} strokeWidth={2.5} />
                            {act}
                          </span>
                          {isActive && <Check size={14} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={generateSOTD} disabled={!weather}
                  className={`w-full text-xs font-bold tracking-[0.2em] uppercase py-4 mt-auto transition-colors ${!weather ? (isDark ? 'bg-[#333] text-gray-600' : 'bg-gray-100 text-gray-400') : (isDark ? 'bg-[#fafafa] text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')}`}>
                  {!weather ? d.setWeatherFirst : d.makeSOTDBtn}
                </button>
              </div>

              {/* CENTER COLUMN: PERFUME RECOMMENDATION */}
              <div className={`flex flex-col border-t lg:border-t-0 lg:border-l lg:border-r pt-8 lg:pt-0 lg:px-8 transition-opacity duration-700 ${isDark ? 'border-[#333]' : 'border-gray-200'} ${isGenerated && mainRec ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <h2 className={`text-xs font-bold tracking-widest mb-6 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.recToday}</h2>

                {isGenerated && mainRec ? (
                  <>
                    <div className="flex flex-col items-center mb-8">
                      <div className={`w-48 h-64 flex items-center justify-center mb-4 border ${isDark ? 'bg-[#121212] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                        <img src={mainRec.img} alt={mainRec.name}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-4" />
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight uppercase text-center line-clamp-2">{mainRec.name}</h3>
                      <p className={`text-xs font-bold tracking-[0.3em] uppercase mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.houseOf} {mainRec.brand}</p>
                      <div className={`w-full border-t border-dotted my-4 ${isDark ? 'border-[#555]' : 'border-gray-300'}`}></div>
                      <p className={`text-xs tracking-widest font-medium uppercase text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{d.topNotes} {mainRec.notes?.top?.join(', ') || 'Fresh, Citrus'}</p>
                    </div>

                    {altRecs.length > 0 && (
                      <div className="mb-8">
                        <p className={`text-[10px] font-bold tracking-widest mb-3 uppercase text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.alternatives}</p>
                        <div className="flex justify-center gap-4">
                          {altRecs.map((item, idx) => (
                            <div key={`alt-${idx}`} className="flex flex-col items-center cursor-pointer group">
                              <div className={`w-16 h-20 flex items-center justify-center mb-2 border transition-colors ${isDark ? 'bg-[#121212] border-[#333] group-hover:border-[#fafafa]' : 'bg-gray-50 border-gray-100 group-hover:border-black'}`}>
                                <img src={item.img} alt={item.name}
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }}
                                  className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal opacity-70 group-hover:opacity-100" />
                              </div>
                              <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${isDark ? 'group-hover:text-[#fafafa]' : 'group-hover:text-black'}`}>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {notRec && notRec.length > 0 && (
                      <div className="border-2 border-red-600 mb-8">
                        <div className="bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase p-2 text-center">
                          {d.notRecommended} [{weather === 'Panas' ? d.tooHeavy : d.tooLight}]
                        </div>
                        <div className="p-6 md:p-8 flex flex-col items-center bg-red-50 dark:bg-red-950/20">
                          <p className={`text-[10px] font-medium tracking-widest text-center uppercase mb-6 max-w-xs ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                            {weather === 'Panas' ? d.hotWeatherWarning : d.coldWeatherWarning}
                          </p>
                          <div className="flex gap-4">
                            {notRec.slice(0, 3).map((item: { img: string; name: string }, idx: number) => (
                              <div key={`notrec-${idx}`} className="flex flex-col items-center w-16">
                                <div className="relative w-12 h-16 bg-gray-300 dark:bg-gray-800 opacity-50 flex items-center justify-center border border-gray-400 dark:border-gray-700">
                                  <img src={item.img} alt={item.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }} className="absolute inset-0 w-full h-full object-contain grayscale p-1" />
                                  <X size={32} className="text-red-600 absolute z-10" strokeWidth={3} />
                                </div>
                                <span className={`mt-2 text-[8px] font-black uppercase tracking-wider text-center leading-tight ${isDark ? 'text-red-300' : 'text-red-900'}`}>{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto space-y-6">
                      <div>
                        <p className={`text-[10px] font-bold tracking-widest mb-2 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.actualSpraysLabel}</p>
                        <div className={`flex items-center border w-full ${isDark ? 'border-[#333]' : 'border-gray-300'}`}>
                          <button onClick={() => setActualSprays((s: number) => Math.max(1, s - 1))} className={`flex-1 py-2 font-black border-r hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${isDark ? 'border-[#333] text-gray-500' : 'border-gray-300 text-gray-500'}`}>-</button>
                          <div className="w-20 text-center font-bold text-sm tracking-widest">[ {actualSprays}x ]</div>
                          <button onClick={() => setActualSprays((s: number) => s + 1)} className={`flex-1 py-2 font-black border-l hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${isDark ? 'border-[#333] text-gray-500' : 'border-gray-300 text-gray-500'}`}>+</button>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsLayerModalOpen(true)}
                        className={`w-full flex items-center gap-3 border py-3 px-4 text-xs font-bold tracking-widest uppercase transition-colors ${isDark ? 'border-[#333] text-gray-500 hover:border-[#fafafa] hover:text-[#fafafa]' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`}
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center ${isLayered ? (isDark ? 'bg-[#fafafa] border-[#fafafa] text-black' : 'bg-black border-black text-white') : (isDark ? 'border-[#555]' : 'border-gray-400')}`}>
                          {isLayered && <Check size={12} strokeWidth={4} />}
                        </div>
                        {d.layerBtn}
                      </button>
                      {isLayered && layeringPerfumeId && (
                        <p className={`text-[9px] font-bold uppercase tracking-widest -mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {d.layeringWith} {layeringPerfumeId}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{d.awaitingGen}</p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: GUIDE & VISUALIZATION */}
              <div className={`flex flex-col border-t lg:border-t-0 pt-8 lg:pt-0 pb-8 transition-opacity duration-700 ${isDark ? 'border-[#333]' : 'border-gray-200'} ${isGenerated && mainRec ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                {isGenerated && mainRec ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Silhouette Container */}
                    <p className="text-[10px] font-bold tracking-widest mb-6 uppercase text-center text-gray-500">APPLICATION GUIDE (CRUTS)</p>
                    <div className="relative w-64 h-[420px] md:w-80 md:h-[500px] flex items-center justify-center mx-auto mb-8">
                      <img
                        src="/model-crut.png"
                        alt="Perfume application guide model"
                        className={`relative z-0 w-full h-full object-contain ${isDark ? 'invert opacity-70' : 'opacity-90'}`}
                      />

                      {/* Glowing Green Dots */}
                      <div className="absolute z-10 top-[30%] left-[45%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[28%] left-[46%] w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[30%] right-[45%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[28%] right-[46%] w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[38%] left-[50%] -translate-x-1/2 w-3.5 h-3.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[41%] left-[38%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[41%] left-[58%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[49%] left-[35%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <div className="absolute z-10 top-[49%] right-[35%] w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
                    </div>

                    <div className="w-full text-center px-4">
                      <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        Based on this perfume&apos;s profile, use <strong>{actualSprays}x sprays (fresh scent, lower longevity)</strong> for maximum scent impact. Focus on major pulse points: <strong>neck, chest, and wrists</strong> (per the green indicators). An ideal choice for <strong>{weather === 'Panas' ? 'Panas' : 'Dingin'}</strong> weather in a <strong>{selectedActivity.toLowerCase()}</strong> environment inside a <strong>{selectedLocation}</strong> area.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{d.vizPending}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM FIXED/SPANNING BUTTON */}
            <div className="mb-16">
              <button onClick={logToJournal} disabled={!isGenerated || !mainRec}
                className={`w-full py-5 text-lg font-bold uppercase tracking-widest border-[3px] transition-colors duration-300 ${!isGenerated || !mainRec ? (isDark ? 'border-[#333] text-gray-600 bg-[#121212]' : 'border-gray-200 text-gray-400 bg-gray-50') : (isDark ? 'border-[#fafafa] bg-[#121212] text-[#fafafa] hover:bg-[#fafafa] hover:text-black' : 'border-black bg-white text-black hover:bg-black hover:text-white')}`}>
                {d.logSotdBtn}
              </button>
            </div>
          </div>
        </section>

        {/* --- TRACKER --- */}
        <section id="tracker" className={`py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.trackerLabel}</span>
          </div>

          <div className="md:col-span-9">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none mb-8 transition-colors duration-500">{d.trackerTitle}</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.trackerSubtitle}</p>
            </div>


            {/* --- BRUTALIST MONTHLY SCENT CALENDAR --- */}
            <div className={`border p-6 md:p-8 mb-12 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <span className={`text-[10px] tracking-widest uppercase font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.monthlyCalendar}</span>
                <span className={`text-[10px] tracking-widest uppercase font-black ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{calendarData.monthLabel}</span>
              </div>

              {/* Day-of-week header: Mon â†’ Sun */}
              <div className="grid grid-cols-7 mb-1">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                  <div key={d} className={`text-center text-[8px] font-black tracking-widest uppercase py-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d}</div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-[2px]">
                {calendarData.cells.map((cell, idx) => (
                  <div
                    key={`cal-${idx}`}
                    title={cell.dateStr && cell.log ? `${cell.dateStr} â€” ${cell.log.perfume?.name}` : cell.dateStr || ''}
                    className={`relative aspect-square overflow-hidden transition-colors duration-200 ${!cell.day
                      ? 'invisible'
                      : cell.log
                        ? ''
                        : (isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100')
                      }`}
                    style={{ border: cell.day ? `1px solid ${isDark ? '#333333' : '#d1d5db'}` : 'none' }}
                  >
                    {cell.day && cell.log ? (
                      <>
                        <img
                          src={cell.log.perfume?.img}
                          alt={cell.log.perfume?.name}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }}
                          className="absolute inset-0 w-full h-full object-contain p-1"
                        />
                        <span className={`absolute top-[2px] right-[3px] text-[9px] font-black leading-none z-10 drop-shadow-md ${isDark ? 'text-white' : 'text-white'}`}
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                        >{cell.day}</span>
                      </>
                    ) : cell.day ? (
                      <span className={`absolute top-[2px] right-[3px] text-[9px] font-bold leading-none ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{cell.day}</span>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className={`flex items-center gap-4 mt-4 pt-4 border-t ${isDark ? 'border-[#333333]' : 'border-gray-100'}`}>
                <div className={`w-4 h-4 border ${isDark ? 'bg-[#1a1a1a] border-[#333333]' : 'bg-gray-100 border-gray-200'}`} />
                <span className={`text-[8px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.calNoEntry}</span>
                <div className={`w-4 h-4 border ${isDark ? 'border-[#333333] bg-cover' : 'border-gray-200'}`} style={{ background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)' }} />
                <span className={`text-[8px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.calLogged}</span>
              </div>

              {/* Stats Row */}
              <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-100'}`}>
                <div className={`border p-4 text-center transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-3xl md:text-4xl font-light tracking-tighter ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{trackerStats.totalWearings}</p>
                  <p className={`text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.totalWearings}</p>
                </div>
                <div className={`border p-4 text-center transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-3xl md:text-4xl font-light tracking-tighter ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{trackerStats.uniqueScents}</p>
                  <p className={`text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.uniqueScents}</p>
                </div>
                <div className={`border p-4 text-center transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-3xl md:text-4xl font-light tracking-tighter ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{trackerStats.streak}</p>
                  <p className={`text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.activeStreak}</p>
                </div>
                <div className={`border p-4 text-center transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-lg md:text-2xl font-light tracking-tighter leading-tight ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>Rp {totalWardrobeValue.toLocaleString('id-ID')}</p>
                  <p className={`text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.vaultValuation}</p>
                </div>
              </div>
            </div>

            {/* --- JOURNAL LIST (preserved exactly) --- */}
            {journal.length === 0 ? (
              <div className={`p-16 border text-center ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-gray-200 bg-white'}`}>
                <p className={`text-2xl font-light mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.noJournal}</p>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.noJournalSub}</p>
              </div>
            ) : (
              <div className="space-y-0">
                {journal.slice(journalPage * 5, (journalPage + 1) * 5).map((log) => {
                  const isExpanded = expandedRatingId === log.id;
                  const longevityOptions = ['Very Weak', 'Weak', 'Moderate', 'Long Lasting', 'Eternal'];
                  const sillageOptions = ['Intimate', 'Moderate', 'Strong', 'Enormous'];
                  const timeOfDay = log.timeOfDay || "Pagi";
                  const TimeIcon = timeOfDay === "Siang" ? Sun : timeOfDay === "Sore" ? Sunset : timeOfDay === "Malam" ? Moon : Sunrise;
                  return (
                    <div key={`journal-${log.id}`}>
                      <div className={`border-b border-l border-r first:border-t p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>

                        <div className="flex items-center gap-6">
                          <img src={log.perfume.img} alt={log.perfume.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }} className={`w-16 h-24 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                          <div>
                            <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{log.date}</p>
                            <h4 className="text-2xl font-medium leading-none mb-1">{log.perfume.name}</h4>
                            <p className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{log.perfume.brand}</p>
                            {/* --- RATE PERFORMANCE BUTTON --- */}
                            <button
                              onClick={() => setExpandedRatingId(isExpanded ? null : log.id)}
                              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border-2 transition-all duration-200 hover:scale-105 ${isExpanded
                                ? (isDark ? 'bg-[#fafafa] text-[#0a0a0a] border-[#fafafa]' : 'bg-[#111111] text-white border-[#111111]')
                                : (isDark ? 'border-[#333333] text-gray-400 hover:border-[#fafafa] hover:text-[#fafafa]' : 'border-gray-300 text-gray-500 hover:border-[#111111] hover:text-[#111111]')
                                }`}
                            >
                              {d.ratePerformance}
                            </button>
                          </div>
                        </div>

                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase font-bold tracking-widest md:justify-end ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="flex items-center gap-1.5">
                            <TimeIcon size={14} strokeWidth={2.5} />
                            {timeOfDay}
                          </span>
                          <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>&bull;</span>
                          <span>{log.weather || "Panas"}</span>
                          <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>&bull;</span>
                          <span>{log.activity}</span>
                          <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>&bull;</span>
                          <span className={isDark ? 'text-[#fafafa]' : 'text-[#111111]'}>{log.sprays}</span>
                        </div>
                      </div>

                      {/* --- EXPANDABLE PERFORMANCE VOTING PANEL --- */}
                      {isExpanded && (
                        <div className={`border-b border-l border-r p-6 md:p-8 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* LONGEVITY COLUMN */}
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 block mb-3">â± LONGEVITY</span>
                              <div className="space-y-1.5">
                                {longevityOptions.map((opt) => {
                                  const isActive = (log.userLongevity ?? 'moderate') === opt.toLowerCase().replace(' ', '_').replace(' ', '_');
                                  const optKey = opt.toLowerCase().replace(/ /g, '_');
                                  const isActiveCurrent = (log.userLongevity ?? 'moderate') === optKey;
                                  return (
                                    <button
                                      key={`lon-${log.id}-${opt}`}
                                      onClick={() => updateJournalPerformance(log.id, 'userLongevity', optKey)}
                                      className={`w-full flex items-center justify-between px-3 py-2 border text-left transition-all duration-150 ${isActiveCurrent
                                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500'
                                        : (isDark ? 'border-[#222222] text-gray-500 hover:border-cyan-500/40 hover:text-cyan-400' : 'border-gray-200 text-gray-500 hover:border-cyan-400 hover:text-cyan-600')
                                        }`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-widest">{opt}</span>
                                      {isActiveCurrent && <span className="text-[8px] font-black tracking-widest">âœ“ YOUR VOTE</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* SILLAGE COLUMN */}
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-green-500 block mb-3">ðŸŒ¬ SILLAGE</span>
                              <div className="space-y-1.5">
                                {sillageOptions.map((opt) => {
                                  const optKey = opt.toLowerCase().replace(/ /g, '_');
                                  const isActiveCurrent = (log.userSillage ?? 'moderate') === optKey;
                                  return (
                                    <button
                                      key={`sil-${log.id}-${opt}`}
                                      onClick={() => updateJournalPerformance(log.id, 'userSillage', optKey)}
                                      className={`w-full flex items-center justify-between px-3 py-2 border text-left transition-all duration-150 ${isActiveCurrent
                                        ? 'border-green-500 bg-green-500/10 text-green-500'
                                        : (isDark ? 'border-[#222222] text-gray-500 hover:border-green-500/40 hover:text-green-400' : 'border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600')
                                        }`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-widest">{opt}</span>
                                      {isActiveCurrent && <span className="text-[8px] font-black tracking-widest">âœ“ YOUR VOTE</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className={`mt-8 border-2 flex items-center justify-between transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-[#111111] bg-white'}`}>
                  <button
                    onClick={() => setJournalPage((page) => Math.max(0, page - 1))}
                    disabled={journalPage === 0}
                    className={`w-20 py-4 text-xl font-black border-r-2 transition-colors ${isDark ? 'border-[#333333]' : 'border-[#111111]'} ${journalPage === 0 ? (isDark ? 'text-gray-700' : 'text-gray-300') : (isDark ? 'text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'text-[#111111] hover:bg-[#111111] hover:text-white')}`}
                  >
                    &lt;
                  </button>
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Page {journalPage + 1} / {Math.ceil(journal.length / 5)}
                  </span>
                  <button
                    onClick={() => setJournalPage((page) => page + 1)}
                    disabled={(journalPage + 1) * 5 >= journal.length}
                    className={`w-20 py-4 text-xl font-black border-l-2 transition-colors ${isDark ? 'border-[#333333]' : 'border-[#111111]'} ${(journalPage + 1) * 5 >= journal.length ? (isDark ? 'text-gray-700' : 'text-gray-300') : (isDark ? 'text-[#fafafa] hover:bg-[#fafafa] hover:text-[#0a0a0a]' : 'text-[#111111] hover:bg-[#111111] hover:text-white')}`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- SCENT TRIVIA SECTION --- */}
        <section id="trivia" className={`relative w-full mt-16 py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-t-4 transition-colors duration-500 ${isDark ? 'border-[#333333] border-t-[#fafafa]' : 'border-gray-200 border-t-[#111111]'}`}>
          <div className="md:col-span-3">
            <span className={`text-[10px] tracking-[0.4em] uppercase font-bold sticky top-32 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>04 â€” SCENT TRIVIA</span>
          </div>
          <div className="md:col-span-9">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase transition-colors duration-500">{t.funFacts}</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.triviaSubtitle}</p>
            </div>

            {/* VIDEO BOX */}
            <div className={`border-4 border-b-0 p-8 md:p-12 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-[#111111] bg-white'}`}>
              <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>
                {lang === 'en' ? 'WATCH & LEARN' : 'TONTON & PELAJARI'}
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-8">
                {lang === 'en' ? <>The Art of<br />Fragrance.</> : <>Seni<br />Memakai Parfum.</>}
              </h3>
              <div className={`border-t-4 pt-8 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                <div className={`relative w-full border-4 overflow-hidden ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`} style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={lang === 'en'
                      ? 'https://www.youtube.com/embed/flM8LXAF9XI'
                      : 'https://www.youtube.com/embed/ATroCElosF8'}
                    title={lang === 'en' ? 'Fragrance Guide Video' : 'Video Panduan Parfum'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>
                <p className={`mt-4 text-[9px] font-bold uppercase tracking-[0.25em] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {lang === 'en' ? 'â–¶ PRESS PLAY TO BEGIN' : 'â–¶ TEKAN PUTAR UNTUK MULAI'}
                </p>
              </div>
            </div>

            {/* TIMING GUIDE (Full Width) */}
            <div className={`border-4 border-b-0 p-8 md:p-12 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-[#111111] bg-gray-50'}`}>
              <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.timingGuide}</div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-6">{t.timingTitle1}<br />{t.timingTitle2}</h3>
              <div className={`border-t-4 pt-6 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-8">
                  {/* DAY */}
                  <div className={`border-b-4 md:border-b-0 md:border-r-4 pb-6 md:pb-0 md:pr-6 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.daytime}</p>
                    <ul className="space-y-3">
                      {t.dayItems.map((item, i) => (
                        <li key={`day-${i}`} className={`text-[11px] font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
                      ))}
                    </ul>
                    <p className={`text-[9px] mt-4 font-light ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.dayNote}</p>
                  </div>
                  {/* NIGHT */}
                  <div className="pt-6 md:pt-0 md:pl-6">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.nighttime}</p>
                    <ul className="space-y-3">
                      {t.nightItems.map((item, i) => (
                        <li key={`night-${i}`} className={`text-[11px] font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
                      ))}
                    </ul>
                    <p className={`text-[9px] mt-4 font-light ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.nightNote}</p>
                  </div>
                </div>

                {/* DAY/NIGHT WARNING (Brutalist Red Box) */}
                <div className={`border-4 p-6 ${isDark ? 'border-red-900 bg-red-950/30' : 'border-red-600 bg-red-50'}`}>
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-red-500' : 'text-red-700'}`}>{t.warningDayNight}</p>
                  <p className={`text-[10px] font-bold leading-relaxed uppercase ${isDark ? 'text-red-400/80' : 'text-red-800'}`}>{t.warningDayNightSub}</p>
                </div>
              </div>
            </div>

            {/* FRAGHEAD WISDOM GRID (2-column) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-b-0 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
              {/* Myth 1: Rubbing Wrists */}
              <div className={`p-8 md:p-12 border-b-4 md:border-r-4 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-[#111111] bg-white'}`}>
                <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.mythBusted}</div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-6">{t.mythTitle1}<br />{t.mythTitle2}</h3>
                <div className={`border-t-4 pt-6 space-y-4 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                  <p className={`text-sm font-bold leading-relaxed uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.mythBody}</p>
                  <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.mythDetail}</p>
                  <div className={`mt-6 p-4 border-l-4 ${isDark ? 'border-[#fafafa] bg-[#0a0a0a]' : 'border-[#111111] bg-gray-50'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{t.mythFix}</p>
                  </div>
                </div>
              </div>

              {/* Myth 2: Post-Delivery Shock */}
              <div className={`p-8 md:p-12 border-b-4 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-[#111111] bg-gray-50'}`}>
                <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.mythBusted}</div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-6">{t.myth2Title1}<br />{t.myth2Title2}</h3>
                <div className={`border-t-4 pt-6 space-y-4 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                  <p className={`text-sm font-bold leading-relaxed uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.myth2Body}</p>
                  <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.myth2Detail}</p>
                  <div className={`mt-6 p-4 border-l-4 ${isDark ? 'border-[#fafafa] bg-[#0a0a0a]' : 'border-[#111111] bg-white'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{t.myth2Fix}</p>
                  </div>
                </div>
              </div>

              {/* Myth 3: Olfactory Fatigue */}
              <div className={`p-8 md:p-12 border-b-4 md:border-r-4 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-[#111111] bg-white'}`}>
                <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.mythBusted}</div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-6">{t.myth3Title1}<br />{t.myth3Title2}</h3>
                <div className={`border-t-4 pt-6 space-y-4 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                  <p className={`text-sm font-bold leading-relaxed uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.myth3Body}</p>
                  <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.myth3Detail}</p>
                  <div className={`mt-6 p-4 border-l-4 ${isDark ? 'border-[#fafafa] bg-[#0a0a0a]' : 'border-[#111111] bg-gray-50'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{t.myth3Fix}</p>
                  </div>
                </div>
              </div>

              {/* Myth 4: Stop Blind Buying */}
              <div className={`p-8 md:p-12 border-b-4 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#0f0f0f]' : 'border-[#111111] bg-gray-50'}`}>
                <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.mythBusted}</div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-6">{t.myth4Title1}<br />{t.myth4Title2}</h3>
                <div className={`border-t-4 pt-6 space-y-4 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                  <p className={`text-sm font-bold leading-relaxed uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.myth4Body}</p>
                  <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.myth4Detail}</p>
                  <div className={`mt-6 p-4 border-l-4 ${isDark ? 'border-[#fafafa] bg-[#0a0a0a]' : 'border-[#111111] bg-white'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{t.myth4Fix}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DOS & DON'TS */}
            <div className={`border-4 border-t-0 p-8 md:p-12 transition-colors duration-500 ${isDark ? 'border-[#333333] bg-[#121212]' : 'border-[#111111] bg-white'}`}>
              <div className={`inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white'}`}>{t.appRules}</div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-8">{t.dosTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* DOS */}
                <div className={`border-r-0 md:border-r-4 pr-0 md:pr-8 pb-8 md:pb-0 border-b-4 md:border-b-0 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? 'text-green-400' : 'text-green-700'}`}>{t.doLabel}</p>
                  <ul className="space-y-3">
                    {t.doItems.map((item, i) => (
                      <li key={`do-${i}`} className={`text-[11px] font-bold uppercase leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* DONTS */}
                <div className="pl-0 md:pl-8 pt-8 md:pt-0">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>{t.dontLabel}</p>
                  <ul className="space-y-3">
                    {t.dontItems.map((item, i) => (
                      <li key={`dont-${i}`} className={`text-[11px] font-bold uppercase leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* --- AUTHENTICATION MODAL (CLEAN EDITORIAL STYLE) --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">

          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-black/80' : 'bg-black/40'}`}
            onClick={closeAuthModal}
          />

          {/* Modal Panel - No borders, clean box */}
          <div
            className={`relative w-full max-w-md p-8 md:p-12 shadow-2xl transition-all duration-300 ${authShake ? 'shake-brutal' : ''
              } ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}
          >

            {/* Header: Title on Left, TUTUP on Right */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                {authMode === 'signin' ? d.authSignIn : d.authSignUp}
              </h2>
              <button
                type="button"
                onClick={closeAuthModal}
                className={`text-[10px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}
              >
                {d.closeBtn}
              </button>
            </div>

            {/* Clean Form */}
            <form onSubmit={handleAuth} noValidate className="space-y-8">

              {/* USERNAME (Signup Only) */}
              {authMode === 'signup' && (
                <div className="relative">
                  <label htmlFor="auth-username" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                    {d.authUsernamePlaceholder}
                  </label>
                  <input
                    id="auth-username"
                    type="text"
                    value={authUsername}
                    onChange={(e) => { setAuthUsername(e.target.value); setAuthErrors(prev => ({ ...prev, username: null })); }}
                    className={`w-full bg-transparent border-b py-2 text-lg focus:outline-none transition-colors ${authErrors.username ? 'border-red-500 text-red-500' : (isDark ? 'border-gray-700 focus:border-white' : 'border-gray-300 focus:border-black')
                      }`}
                  />
                  {authErrors.username && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.username}</p>}
                </div>
              )}

              {/* EMAIL */}
              <div className="relative">
                <label htmlFor="auth-email" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                  {d.authEmailPlaceholder}
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => { setAuthEmail(e.target.value); setAuthErrors(prev => ({ ...prev, email: null })); }}
                  className={`w-full bg-transparent border-b py-2 text-lg focus:outline-none transition-colors ${authErrors.email ? 'border-red-500 text-red-500' : (isDark ? 'border-gray-700 focus:border-white' : 'border-gray-300 focus:border-black')
                    }`}
                />
                {authErrors.email && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.email}</p>}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label htmlFor="auth-password" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                  {d.authPasswordPlaceholder}
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={authPassword}
                    onChange={(e) => { setAuthPassword(e.target.value); setAuthErrors(prev => ({ ...prev, password: null })); }}
                    className={`w-full bg-transparent border-b py-2 text-lg pr-16 focus:outline-none transition-colors ${authErrors.password ? 'border-red-500 text-red-500' : (isDark ? 'border-gray-700 focus:border-white' : 'border-gray-300 focus:border-black')
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {authErrors.password && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.password}</p>}
              </div>

              {/* CONFIRM PASSWORD (Signup Only) */}
              {authMode === 'signup' && (
                <div className="relative">
                  <label htmlFor="auth-confirm" className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                    {d.authConfirmPlaceholder}
                  </label>
                  <div className="relative">
                    <input
                      id="auth-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={authConfirmPassword}
                      onChange={(e) => { setAuthConfirmPassword(e.target.value); setAuthErrors(prev => ({ ...prev, confirm: null })); }}
                      className={`w-full bg-transparent border-b py-2 text-lg pr-16 focus:outline-none transition-colors ${authErrors.confirm ? 'border-red-500 text-red-500' : (isDark ? 'border-gray-700 focus:border-white' : 'border-gray-300 focus:border-black')
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 bottom-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {authErrors.confirm && <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-widest">{authErrors.confirm}</p>}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full mt-4 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111] text-white hover:bg-black'
                  }`}
              >
                {authMode === 'signin' ? d.authSignInBtn : d.authSignUpBtn}
              </button>

            </form>

            {/* Footer Links & Google */}
            <div className="mt-10 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setAuthErrors({ username: null, email: null, password: null, confirm: null });
                }}
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
              >
                {authMode === 'signin' ? 'NO ACCOUNT? REGISTER HERE.' : 'ALREADY HAVE AN ACCOUNT? SIGN IN.'}
              </button>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className={`w-full py-3 mt-2 flex items-center justify-center gap-3 border text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'border-gray-800 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {d.authGoogleBtn}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- LAYERING MINI-VAULT MODAL --- */}
      {isLayerModalOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center">
          <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'}`} onClick={() => setIsLayerModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl border p-12 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-500 ${isDark ? 'bg-[#121212] border-[#333333]' : 'bg-white border-gray-200'}`}>
            <header className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h3 className="text-4xl font-medium tracking-tighter uppercase transition-colors duration-500">{d.layerModalTitle}</h3>
                <p className={`text-[10px] uppercase font-bold tracking-widest mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{d.layerModalSub}</p>
              </div>
              <button onClick={() => setIsLayerModalOpen(false)} className="text-xs uppercase font-bold tracking-widest hover:line-through transition-colors duration-300">{d.closeBtn}</button>
            </header>

            <div className="space-y-2 overflow-y-auto pr-4 flex-1">
              {closet.filter((item) => item !== null).length === 0 ? (
                <div className={`p-10 border text-center ${isDark ? 'border-[#333333] bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.vaultEmpty}</p>
                </div>
              ) : (
                closet.filter((item) => item !== null).map((p, index) => {
                  const isSelected = isLayered && layeringPerfumeId === p.name;
                  return (
                    <button
                      key={`layer-${p.id || p.name}-${index}`}
                      onClick={() => {
                        setLayeringPerfumeId(p.name);
                        setIsLayered(true);
                        setIsLayerModalOpen(false);
                      }}
                      className={`w-full group py-4 border-b flex justify-between items-center px-4 text-left transition-colors duration-300 ${isSelected ? (isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white') : (isDark ? 'border-[#333333] hover:bg-[#1a1a1a]' : 'border-gray-100 hover:bg-gray-50')}`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={p.img} alt={p.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }} className={`w-10 h-14 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`} />
                        <div>
                          <p className="text-lg font-medium leading-none transition-colors duration-300">{p.name}</p>
                          <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 transition-colors duration-500 ${isSelected ? 'opacity-70' : (isDark ? 'text-gray-600' : 'text-gray-400')}`}>{p.brand}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest border px-3 py-1 transition-all duration-500 ${isSelected ? 'border-current' : (isDark ? 'border-[#fafafa] opacity-0 group-hover:opacity-100 group-hover:bg-[#fafafa] group-hover:text-[#0a0a0a]' : 'border-[#111111] opacity-0 group-hover:opacity-100 group-hover:bg-[#111111] group-hover:text-white')}`}>
                        {isSelected ? d.selectedLabel : 'LAYER'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {isLayered && (
              <button
                onClick={() => {
                  setIsLayered(false);
                  setLayeringPerfumeId('');
                  setIsLayerModalOpen(false);
                }}
                className={`mt-8 w-full py-3 text-[10px] uppercase font-black tracking-[0.25em] border transition-colors ${isDark ? 'border-[#333333] text-gray-500 hover:border-red-500 hover:text-red-400' : 'border-gray-200 text-gray-500 hover:border-red-600 hover:text-red-600'}`}
              >
                {d.clearLayering}
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- DISCOVERY / VAULT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'}`} onClick={() => setIsModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl border p-12 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-500 ${isDark ? 'bg-[#121212] border-[#333333]' : 'bg-white border-gray-200'}`}>
            <header className="flex justify-between items-start mb-8 shrink-0">
              <h3 className="text-4xl font-medium tracking-tighter uppercase transition-colors duration-500">{d.discoveryTitle}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xs uppercase font-bold tracking-widest hover:line-through transition-colors duration-300">{d.closeBtn}</button>
            </header>

            {/* --- SUCCESS FEEDBACK TOAST --- */}
            {addedToVault && (
              <div className="mb-6 shrink-0 px-4 py-3 bg-green-500 text-white flex items-center gap-3 border-2 border-green-700">
                <span className="text-lg font-black">âœ“</span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest leading-tight">{addedToVault} â€” {d.addedToVaultMsg}</p>
                  <p className="text-[9px] uppercase tracking-wider mt-0.5 opacity-80">{d.addedToVaultSub}</p>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-2 border-2 mb-8 shrink-0 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
              {([
                { key: 'search' as const, label: d.tabSearch },
                { key: 'custom' as const, label: d.tabCustom },
              ]).map((tab) => {
                const isActive = discoveryMode === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDiscoveryMode(tab.key)}
                    className={`py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${tab.key === 'search' ? 'border-r-2' : ''} ${isDark ? 'border-[#333333]' : 'border-[#111111]'} ${isActive ? (isDark ? 'bg-[#fafafa] text-[#0a0a0a]' : 'bg-[#111111] text-white') : (isDark ? 'text-gray-500 hover:text-[#fafafa]' : 'text-gray-500 hover:text-[#111111]')}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {discoveryMode === 'search' ? (
              <>
                <input type="text" placeholder={d.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-transparent border-b pb-4 text-2xl font-light focus:outline-none mb-6 transition-colors duration-500 shrink-0 ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-gray-200 focus:border-[#111111]'}`} />

                <div className="relative flex-1 flex min-h-0">
                  <div className="space-y-0 overflow-y-auto pr-8 flex-1 custom-scrollbar" id="discovery-scroll-container">
                    {groupedByBrand.length === 0 ? (
                      <p className={`text-[10px] uppercase font-bold tracking-widest py-8 text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>NO RESULTS FOUND</p>
                    ) : (
                      groupedByBrand.map(([brand, perfumes]) => (
                        <div key={`brand-group-${brand}`} id={`brand-${brand}`}>
                          {/* BRAND HEADER */}
                          <div className={`sticky top-0 z-10 px-4 py-2 flex items-center justify-between border-b-2 ${isDark ? 'bg-[#121212] border-[#333333]' : 'bg-white border-[#111111]'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-[0.35em] ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`}>{brand}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{perfumes.length} {perfumes.length === 1 ? 'SCENT' : 'SCENTS'}</span>
                          </div>
                          {/* PERFUMES UNDER THIS BRAND */}
                          {perfumes.map((p, index) => (
                            <div
                              key={`search-${brand}-${index}`}
                              onClick={() => addToCloset(p)}
                              className={`group py-4 border-b flex justify-between items-center px-4 pl-6 transition-colors duration-300 cursor-pointer ${isDark ? 'border-[#222222] hover:bg-[#1a1a1a]' : 'border-gray-100 hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/monaco.png'; }}
                                  className={`w-10 h-14 object-cover border bg-white shadow-sm shrink-0 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}
                                />
                                <div>
                                  <p className="text-lg font-medium leading-none transition-colors duration-300">{p.name}</p>
                                  {p.topNotes && <p className={`text-[8px] uppercase mt-1 italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{p.topNotes}</p>}
                                </div>
                              </div>
                              <span className={`text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 border px-3 py-1 transition-all duration-500 hover:scale-105 ${isDark ? 'border-[#fafafa] group-hover:bg-[#fafafa] group-hover:text-[#0a0a0a]' : 'border-[#111111] group-hover:bg-[#111111] group-hover:text-white'}`}>{d.archiveBtn}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>

                  {/* ALPHABETICAL INDEX SIDEBAR */}
                  <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-2 pointer-events-none">
                    <div className="flex flex-col items-center pointer-events-auto">
                      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                        const isActive = groupedByBrand.some(([brand]) => brand[0].toUpperCase() === letter);
                        return (
                          <div
                            key={letter}
                            onClick={() => {
                              if (!isActive) return;
                              const firstBrand = groupedByBrand.find(([brand]) => brand[0].toUpperCase() === letter)?.[0];
                              if (firstBrand) {
                                const el = document.getElementById(`brand-${firstBrand}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }
                            }}
                            className={`text-[9px] font-black leading-tight w-5 py-[1px] text-center transition-transform duration-200 ${isActive
                              ? `cursor-pointer hover:scale-150 ${isDark ? 'text-[#fafafa]' : 'text-[#111111]'}`
                              : `cursor-not-allowed opacity-30 ${isDark ? 'text-gray-600' : 'text-gray-400'}`
                              }`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={submitCustomPerfume} className="space-y-5 overflow-y-auto pr-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="PERFUME NAME" value={customPerfumeName} onChange={(e) => setCustomPerfumeName(e.target.value)}
                    className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-[#111111] focus:bg-gray-50'}`} />
                  <input type="text" required placeholder="BRAND" value={customPerfumeBrand} onChange={(e) => setCustomPerfumeBrand(e.target.value)}
                    className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-[#111111] focus:bg-gray-50'}`} />
                </div>

                <input type="text" placeholder="TOP NOTES, COMMA SEPARATED" value={customTopNotes} onChange={(e) => setCustomTopNotes(e.target.value)}
                  className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-[#111111] focus:bg-gray-50'}`} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="number" min="0" placeholder="PRICE" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
                    className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] focus:border-[#fafafa]' : 'border-[#111111] focus:bg-gray-50'}`} />
                  <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                    className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] text-[#fafafa] focus:border-[#fafafa]' : 'border-[#111111] text-[#111111] focus:bg-gray-50'}`}>
                    {(['CLEAN', 'CITRUS', 'GOURMAND', 'BOLD', 'FRUITY'] as const).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select value={customWeather} onChange={(e) => setCustomWeather(e.target.value as typeof customWeather)}
                    className={`w-full bg-transparent border-2 p-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-colors ${isDark ? 'border-[#333333] text-[#fafafa] focus:border-[#fafafa]' : 'border-[#111111] text-[#111111] focus:bg-gray-50'}`}>
                    {(['Panas', 'Dingin', 'Versatile'] as const).map((weatherOption) => (
                      <option key={weatherOption} value={weatherOption}>{weatherOption}</option>
                    ))}
                  </select>
                </div>

                <label className={`block border-2 p-5 cursor-pointer transition-colors ${isDark ? 'border-[#333333] hover:border-[#fafafa]' : 'border-[#111111] hover:bg-gray-50'}`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{d.uploadBtn}</span>
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload}
                    className={`w-full text-[10px] font-black uppercase tracking-widest file:mr-4 file:border-0 file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-widest ${isDark ? 'file:bg-[#fafafa] file:text-[#0a0a0a] text-gray-500' : 'file:bg-[#111111] file:text-white text-gray-500'}`} />
                </label>

                {customImage && (
                  <div className={`border-2 p-4 flex items-center gap-4 ${isDark ? 'border-[#333333]' : 'border-[#111111]'}`}>
                    <img src={customImage} alt="Custom perfume preview" className="w-14 h-20 object-cover border bg-white shrink-0" />
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Image encoded for local vault storage.</p>
                  </div>
                )}

                <button type="submit" className={`w-full py-4 border-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-[1.02] ${isDark ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a] hover:bg-gray-300' : 'border-[#111111] bg-[#111111] text-white hover:bg-white hover:text-[#111111]'}`}>
                  {d.saveVaultBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- VAULT ANTI-DUPLICATE ALERT (Brutalist Shake) --- */}
      {dupeAlert && (
        <div
          key={`dupe-alert-${dupeAlertKey}`}
          className="fixed bottom-6 right-6 z-[300] bg-[#ff3333] text-white px-6 py-4 border-4 border-black shadow-2xl shake-brutal"
          style={{ maxWidth: '360px' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black">âœ•</span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-tight">{d.dupeAlertTitle}</p>
              <p className="text-[9px] uppercase tracking-wider mt-1 opacity-80">{d.dupeAlertSub}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`p-12 border-t text-center transition-colors duration-500 ${isDark ? 'border-[#333333]' : 'border-gray-200'}`}>
        <span className={`text-[8px] tracking-[0.5em] uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          {d.footer}
        </span>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        html { scroll-behavior: smooth; }
        @keyframes shake-brutal-anim {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .shake-brutal { animation: shake-brutal-anim 0.5s ease-in-out; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-dots span {
          display: inline;
          font-weight: inherit;
          font-size: inherit;
          line-height: 1;
          opacity: 0;
          animation: blink 1.2s step-start infinite;
        }
        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.3s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.6s; }
      `}</style>

      {/* === PREMIUM LOG SUCCESS TOAST === */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${logSuccessToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        style={{ animation: logSuccessToast ? 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' : 'none' }}
      >
        <div className={`flex items-center gap-4 px-6 py-4 border-2 shadow-2xl ${isDark ? 'bg-[#0a0a0a] border-[#fafafa] text-[#fafafa]' : 'bg-[#111111] border-[#111111] text-white'
          }`}>
          <span className="text-xl">&#10003;</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em]">{d.loggedSuccessfully}</p>
            <p className={`text-[8px] uppercase tracking-widest mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
              {actualSprays}x sprays{isLayered && layeringPerfumeId ? ` Â· layered with ${layeringPerfumeId}` : ''}
            </p>
          </div>
        </div>
      </div>
      {/* === EMPTY VAULT ALERT TOAST === */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${emptyVaultAlert ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        <div className={`flex items-center gap-4 px-6 py-4 border-2 shadow-2xl ${isDark ? 'bg-[#0a0a0a] border-red-500 text-red-500' : 'bg-white border-red-600 text-red-600'
          }`}>
          <span className="text-xl font-black">âœ•</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em]">{d.vaultEmpty}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
