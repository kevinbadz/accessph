import type { AppLanguage } from "./settings";

export interface BenefitCategory {
  id: string;
  icon: string;
  title: Record<AppLanguage, string>;
  summary: Record<AppLanguage, string>;
  points: Record<AppLanguage, string[]>;
  whereToGo: Record<AppLanguage, string>;
}

export const BENEFIT_CATEGORIES: BenefitCategory[] = [
  {
    id: "pwd-id",
    icon: "🪪",
    title: { en: "Getting a PWD ID", fil: "Pagkuha ng PWD ID" },
    summary: {
      en: "Your PWD ID is what unlocks the discounts and benefits below. It's issued by your city or municipal government, not a national office.",
      fil: "Ang PWD ID mo ang gagamitin mo para sa mga discount at benepisyo sa ibaba. Ito ay inilalabas ng city o munisipyo mo, hindi ng national office.",
    },
    points: {
      en: [
        "Apply at your city or municipal Persons with Disability Affairs Office (PDAO), or the Social Welfare / DSWD office if your LGU has no PDAO yet.",
        "Typically needed: 2 recent 1x1 photos, a valid ID or birth certificate, barangay certificate of residency, and a medical certificate or clinical abstract from a licensed doctor describing your disability.",
        "For some disability types (e.g. learning disabilities, autism), a certification from a licensed teacher, school psychologist, or SPED specialist may be accepted instead of a doctor's certificate.",
        "The ID is usually free of charge and valid nationwide once issued.",
      ],
      fil: [
        "Mag-apply sa Persons with Disability Affairs Office (PDAO) ng city o munisipyo mo, o sa Social Welfare / DSWD office kung wala pang PDAO ang LGU mo.",
        "Karaniwang kailangan: 2 kopya ng 1x1 na litrato, valid ID o birth certificate, barangay certificate of residency, at medical certificate o clinical abstract mula sa doktor na naglalarawan ng disability mo.",
        "Para sa ilang uri ng disability (hal. learning disability, autism), maaaring tanggapin ang certification mula sa lisensyadong guro, school psychologist, o SPED specialist sa halip na doctor's certificate.",
        "Karaniwang libre ang ID at valid sa buong Pilipinas kapag naisyu na.",
      ],
    },
    whereToGo: {
      en: "Your city/municipal hall — ask for the PDAO or Social Welfare Office.",
      fil: "City o municipal hall — hanapin ang PDAO o Social Welfare Office.",
    },
  },
  {
    id: "discounts",
    icon: "🏷️",
    title: { en: "20% Discount & VAT Exemption", fil: "20% Discount at VAT Exemption" },
    summary: {
      en: "Under the Magna Carta for Persons with Disability (RA 10754), PWD ID holders get a 20% discount and VAT exemption on many everyday purchases.",
      fil: "Sa ilalim ng Magna Carta for Persons with Disability (RA 10754), may 20% discount at VAT exemption ang may PWD ID sa maraming pang-araw-araw na bilihin.",
    },
    points: {
      en: [
        "Medicines at drugstores and hospital pharmacies.",
        "Medical, dental, and diagnostic services in hospitals and clinics.",
        "Domestic land, air, and sea transportation fares — buses, jeepneys, taxis, ride-hailing, trains, planes, and ferries.",
        "Hotels, restaurants, and recreation centers (fast food included).",
        "Funeral and burial services for the immediate family of the PWD.",
        "Always show your PWD ID before paying — the discount applies at the point of sale.",
      ],
      fil: [
        "Gamot sa botika at hospital pharmacy.",
        "Medical, dental, at diagnostic services sa ospital at klinika.",
        "Pamasahe sa lupa, himpapawid, at dagat — bus, jeep, taxi, ride-hailing, tren, eroplano, at barko.",
        "Hotel, restaurant, at recreation center (kasama ang fast food).",
        "Funeral at burial services para sa agarang pamilya ng PWD.",
        "Ipakita palagi ang PWD ID bago magbayad — doon ibinibigay ang discount.",
      ],
    },
    whereToGo: {
      en: "No application needed — just present your PWD ID when paying.",
      fil: "Walang aplikasyon na kailangan — ipakita lang ang PWD ID mo kapag magbabayad.",
    },
  },
  {
    id: "philhealth",
    icon: "🏥",
    title: { en: "PhilHealth Coverage", fil: "Saklaw ng PhilHealth" },
    summary: {
      en: "Republic Act 11228 mandates automatic PhilHealth coverage for all registered PWDs, with the national government paying the premium.",
      fil: "Ayon sa Republic Act 11228, awtomatikong saklaw ng PhilHealth ang lahat ng rehistradong PWD, at ang national government ang nagbabayad ng premium.",
    },
    points: {
      en: [
        "Register your PWD ID with PhilHealth to be enrolled as a sponsored member — bring your PWD ID to the nearest PhilHealth office or your LGU's PDAO, which can assist with registration.",
        "Coverage includes inpatient and outpatient benefits under PhilHealth's regular benefit packages.",
        "If you're already covered as a dependent or through employment, check with PhilHealth on how PWD sponsorship interacts with your existing membership.",
      ],
      fil: [
        "I-rehistro ang PWD ID mo sa PhilHealth para maging sponsored member — dalhin ang PWD ID mo sa pinakamalapit na PhilHealth office o sa PDAO ng LGU mo, na makakatulong sa pagpaparehistro.",
        "Kasama sa saklaw ang inpatient at outpatient benefits sa regular benefit packages ng PhilHealth.",
        "Kung mayroon ka nang saklaw bilang dependent o sa pamamagitan ng trabaho, magtanong sa PhilHealth kung paano ito magkakasabay sa PWD sponsorship.",
      ],
    },
    whereToGo: {
      en: "Nearest PhilHealth Local Health Insurance Office, or your city/municipal PDAO.",
      fil: "Pinakamalapit na PhilHealth Local Health Insurance Office, o ang PDAO ng city/munisipyo mo.",
    },
  },
  {
    id: "education",
    icon: "🎓",
    title: { en: "Education & Scholarships", fil: "Edukasyon at Scholarship" },
    summary: {
      en: "DepEd, CHED, and TESDA all run programs specifically for PWD students and trainees.",
      fil: "May mga programa ang DepEd, CHED, at TESDA na partikular para sa mga estudyante at trainee na PWD.",
    },
    points: {
      en: [
        "DepEd Special Education (SPED) programs and inclusive-education support in public schools.",
        "CHED grants-in-aid and scholarship programs that include PWD applicants — ask your target university's admissions or student affairs office.",
        "TESDA offers free technical-vocational training courses, with some centers offering programs adapted for specific disabilities.",
        "State universities and colleges (SUCs) often waive tuition and miscellaneous fees for PWD students — requirements vary per school.",
      ],
      fil: [
        "DepEd Special Education (SPED) programs at inclusive-education support sa mga public school.",
        "CHED grants-in-aid at scholarship programs na bukas din sa mga PWD applicant — magtanong sa admissions o student affairs office ng target university.",
        "Libreng technical-vocational training courses mula sa TESDA, may ilang center na may adapted na programa para sa partikular na disability.",
        "Karaniwang wina-waive ng state universities and colleges (SUCs) ang tuition at miscellaneous fees para sa PWD students — iba-iba ang requirements bawat paaralan.",
      ],
    },
    whereToGo: {
      en: "Your school's guidance office, or the nearest DepEd/CHED/TESDA regional office.",
      fil: "Guidance office ng paaralan mo, o pinakamalapit na DepEd/CHED/TESDA regional office.",
    },
  },
  {
    id: "employment",
    icon: "💼",
    title: { en: "Employment Support", fil: "Suporta sa Trabaho" },
    summary: {
      en: "The law reserves government positions for PWDs and gives tax incentives to private employers who hire them.",
      fil: "Nagreresebra ang batas ng mga posisyon sa gobyerno para sa PWD, at may tax incentive ang mga pribadong employer na kumukuha ng PWD.",
    },
    points: {
      en: [
        "At least 1% of government agency positions are reserved for qualified PWDs (RA 7277).",
        "Private employers who hire PWDs may claim additional tax deductions for the salaries paid and for accessibility improvements made to the workplace.",
        "DOLE runs job fairs and a PWD-focused employment facilitation program — check your regional DOLE office or PESO (Public Employment Service Office) at your city hall.",
      ],
      fil: [
        "Kahit man lang 1% ng mga posisyon sa ahensya ng gobyerno ay nakalaan para sa kwalipikadong PWD (RA 7277).",
        "Maaaring mag-claim ng karagdagang tax deduction ang mga pribadong employer na kumukuha ng PWD, para sa sahod at sa mga pagpapabuti sa accessibility ng workplace.",
        "May job fair at employment facilitation program ang DOLE na para sa PWD — tanungin ang regional DOLE office o ang PESO (Public Employment Service Office) sa city hall mo.",
      ],
    },
    whereToGo: {
      en: "PESO (Public Employment Service Office) at your city or municipal hall.",
      fil: "PESO (Public Employment Service Office) sa city o municipal hall mo.",
    },
  },
];
