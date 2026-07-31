import type { AppLanguage } from "./settings";

export const strings = {
  en: {
    appName: "AccessPH",
    tagline: "Your accessibility companion",
    readText: "Read Text",
    readTextSub: "Scan and hear documents, signs, or labels",
    voiceCommands: "Voice Commands",
    voiceCommandsSub: "Tap the mic and speak",
    emergency: "Emergency",
    emergencySub: "Share location and alert your contact",
    settings: "Settings",
    settingsSub: "Language, voice, emergency contact",
    listening: "Listening…",
    tapMicToSpeak: "Tap the microphone and speak a command",
    didNotUnderstand: "Sorry, I didn't catch that. Try again.",
    micNotSupported: "Voice commands aren't supported in this browser.",
    micPermissionDenied:
      "Microphone access was denied. Allow microphone access for this site in your browser settings, then try again.",
    micPermissionDeniedIOS:
      "Microphone blocked. In Safari, tap the \"Aa\" icon in the address bar → Website Settings → Microphone → Allow. If that's not there, go to the Settings app → Safari → Settings for Websites → Microphone.",
    micPermissionDeniedAndroid:
      "Microphone blocked. Tap the lock or info icon next to the address bar → Permissions → Microphone → Allow, then reload the page.",
    micNoMicrophone: "No microphone was found on this device.",
    micNetworkError: "Voice recognition needs an internet connection. Check your connection and try again.",
    captureAndRead: "Capture & Read",
    choosePhoto: "Choose Photo Instead",
    readAgain: "Read Again",
    retake: "Retake",
    scanning: "Reading text…",
    noTextFound: "No text found. Try moving closer or improving lighting.",
    ocrError: "Something went wrong while reading the text. Please try again.",
    cameraError: "Couldn't access the camera. Check permissions and try again.",
    cameraPermissionDenied:
      "Camera access was denied. Allow camera access for this site in your browser settings, then try again.",
    cameraNotFound: "No camera was found on this device.",
    cameraInUse: "The camera is already being used by another app. Close it and try again.",
    cameraNotSupported: "This browser doesn't support camera access.",
    tryAgain: "Try Again",
    somethingWentWrong: "Something went wrong.",
    reloadPage: "Reload Page",
    emergencyConfirmTitle: "Send emergency alert?",
    emergencyConfirmBody:
      "This opens a text message to your emergency contact with your location. You'll need to press send.",
    noContactSet: "No emergency contact set yet.",
    goToSettings: "Go to Settings",
    call: "Call",
    sendSms: "Send SMS with location",
    contactName: "Contact name",
    contactPhone: "Contact phone number",
    language: "App language",
    speechRate: "Voice speed",
    save: "Save",
    saved: "Saved",
    back: "Back",
    locatingYou: "Getting your location…",
    locationUnavailable: "Location unavailable. Sending without it.",
    benefits: "Government Benefits",
    benefitsSub: "PWD ID, discounts, PhilHealth, and more",
    benefitsDisclaimer:
      "General information only — requirements and offices can vary by city. Confirm current details with your local PDAO or the agency listed.",
    whereToGo: "Where to go",
    readAloud: "Read Aloud",
    viewDetails: "View Details",
    voiceCheckHeading: "Filipino voice check",
    checkingVoice: "Checking your device for a Filipino voice…",
    voiceFoundGood: "Found a Filipino voice on this device — narration should sound natural:",
    voiceMissingWarning:
      "No dedicated Filipino voice was found on this device. Tagalog text is being read with an English voice, which will sound off. This is a device setting, not something the app can fix directly.",
    voiceInstructionsIOS:
      "To fix: open Settings → Accessibility → Spoken Content → Voices → Filipino, then download it. If more than one quality option appears, choose Enhanced or Premium for clearer speech.",
    voiceInstructionsAndroid:
      "To fix: open your phone's Settings → System → Languages & input → Text-to-speech output, open your TTS engine's settings, and install the Filipino voice data.",
    voiceInstructionsGeneric:
      "To fix: check your device's text-to-speech or accessibility settings for a downloadable Filipino/Tagalog voice.",
    testVoice: "Test This Voice",
    framingHint: "Fill the frame with the text. Hold steady, and use good lighting.",
    lowConfidenceWarning: "I'm not fully sure I read this correctly — please double-check:",
    lowConfidenceSpokenPrefix: "I'm not fully sure about this, but here's what I read.",
    preparingModel: "Getting ready — downloading reading files (first time only, needs internet)…",
    preparingModelHint: "Getting ready in the background…",
    reportProblem: "Report a Problem",
    privacy: "Privacy & Your Data",
    privacySub: "What this app does — and doesn't do — with your information",
    privacyIntro:
      "In plain language: AccessPH runs entirely on your device. There is no account, no company server, and nothing about you is collected or sold.",
    privacyCameraHeading: "Camera",
    privacyCameraBody:
      "Your camera only turns on when you open Read Text, and only to read text aloud to you. Photos are processed on your device and are never uploaded anywhere — not even to us.",
    privacyMicHeading: "Microphone",
    privacyMicBody:
      "The microphone only listens after you tap the mic button, for one voice command at a time. Nothing is recorded or saved.",
    privacyLocationHeading: "Location",
    privacyLocationBody:
      "Your location is only requested when you tap \"Send SMS\" on the Emergency screen, so it can be included in the message to your emergency contact. It's never stored or sent anywhere else.",
    privacyStorageHeading: "What's saved on your device",
    privacyStorageBody:
      "Your language, voice speed, and emergency contact are saved only in your browser's local storage, on your device. This app has no server to send them to.",
    privacyNoAccountsHeading: "No accounts, no tracking",
    privacyNoAccountsBody: "There's no sign-up, no account, and no analytics or tracking of any kind.",
    privacyDeletionHeading: "Removing your data",
    privacyDeletionBody:
      "To erase everything AccessPH has stored, clear this site's data in your browser settings, or uninstall it if you added it to your home screen.",
  },
  fil: {
    appName: "AccessPH",
    tagline: "Kasama mo sa accessibility",
    readText: "Basahin ang Teksto",
    readTextSub: "I-scan at pakinggan ang dokumento, karatula, o label",
    voiceCommands: "Voice Commands",
    voiceCommandsSub: "Pindutin ang mic at magsalita",
    emergency: "Emergency",
    emergencySub: "Ibahagi ang lokasyon at alertuhan ang contact mo",
    settings: "Settings",
    settingsSub: "Wika, boses, emergency contact",
    listening: "Nakikinig…",
    tapMicToSpeak: "Pindutin ang mikropono at magsalita ng utos",
    didNotUnderstand: "Pasensya, hindi ko nakuha. Subukan ulit.",
    micNotSupported: "Hindi suportado ang voice commands sa browser na ito.",
    micPermissionDenied:
      "Na-deny ang microphone access. I-allow ang mic para sa site na ito sa settings ng browser mo, tapos subukan ulit.",
    micPermissionDeniedIOS:
      "Naka-block ang mikropono. Sa Safari, pindutin ang \"Aa\" icon sa address bar → Website Settings → Microphone → Allow. Kung wala iyon, pumunta sa Settings app → Safari → Settings for Websites → Microphone.",
    micPermissionDeniedAndroid:
      "Naka-block ang mikropono. Pindutin ang lock o info icon sa tabi ng address bar → Permissions → Microphone → Allow, tapos i-reload ang page.",
    micNoMicrophone: "Walang nahanap na microphone sa device na ito.",
    micNetworkError: "Kailangan ng internet ang voice recognition. Suriin ang connection mo at subukan ulit.",
    captureAndRead: "Kumuha ng Litrato",
    choosePhoto: "Pumili na lang ng Litrato",
    readAgain: "Basahin Ulit",
    retake: "Ulitin",
    scanning: "Binabasa ang teksto…",
    noTextFound: "Walang nahanap na teksto. Lumapit pa o pahusayin ang ilaw.",
    ocrError: "May problema sa pagbasa ng teksto. Subukan ulit.",
    cameraError: "Hindi ma-access ang camera. Suriin ang permissions.",
    cameraPermissionDenied:
      "Na-deny ang camera access. I-allow ang camera para sa site na ito sa settings ng browser mo, tapos subukan ulit.",
    cameraNotFound: "Walang nahanap na camera sa device na ito.",
    cameraInUse: "Ginagamit na ng ibang app ang camera. Isara ito at subukan ulit.",
    cameraNotSupported: "Hindi suportado ng browser na ito ang camera access.",
    tryAgain: "Subukan Ulit",
    somethingWentWrong: "May nagkamali.",
    reloadPage: "I-reload ang Page",
    emergencyConfirmTitle: "Magpadala ng emergency alert?",
    emergencyConfirmBody:
      "Magbubukas ito ng text message sa emergency contact mo kasama ang lokasyon mo. Kailangan mo pa ring pindutin ang send.",
    noContactSet: "Wala pang naka-set na emergency contact.",
    goToSettings: "Pumunta sa Settings",
    call: "Tumawag",
    sendSms: "Magpadala ng SMS na may lokasyon",
    contactName: "Pangalan ng contact",
    contactPhone: "Numero ng telepono",
    language: "Wika ng app",
    speechRate: "Bilis ng boses",
    save: "I-save",
    saved: "Na-save",
    back: "Bumalik",
    locatingYou: "Kinukuha ang lokasyon mo…",
    locationUnavailable: "Hindi makuha ang lokasyon. Ipapadala na lang.",
    benefits: "Government Benefits",
    benefitsSub: "PWD ID, discounts, PhilHealth, at iba pa",
    benefitsDisclaimer:
      "Pangkalahatang impormasyon lamang — maaaring iba-iba ang requirements at opisina bawat lungsod. Kumpirmahin ang kasalukuyang detalye sa PDAO ng LGU mo o sa nakalistang ahensya.",
    whereToGo: "Saan pumunta",
    readAloud: "Basahin nang Malakas",
    viewDetails: "Tingnan ang Detalye",
    voiceCheckHeading: "Filipino voice check",
    checkingVoice: "Sinusuri kung may Filipino voice sa device mo…",
    voiceFoundGood: "May nahanap na Filipino voice sa device na ito — dapat malinaw ang pagbigkas:",
    voiceMissingWarning:
      "Walang nahanap na dedikadong Filipino voice sa device na ito. Binabasa ang Tagalog gamit ang English voice, kaya mababanggit ito nang mali. Setting ito ng device, hindi direktang maaayos ng app.",
    voiceInstructionsIOS:
      "Para ayusin: buksan ang Settings → Accessibility → Spoken Content → Voices → Filipino, tapos i-download. Kung may piliin pang quality, piliin ang Enhanced o Premium para mas malinaw.",
    voiceInstructionsAndroid:
      "Para ayusin: buksan ang Settings ng phone mo → System → Languages & input → Text-to-speech output, buksan ang settings ng TTS engine mo, at i-install ang Filipino voice data.",
    voiceInstructionsGeneric:
      "Para ayusin: tingnan ang text-to-speech o accessibility settings ng device mo para sa madodownload na Filipino/Tagalog voice.",
    testVoice: "Subukan ang Boses na Ito",
    framingHint: "Punuin ng teksto ang frame. Manatiling steady, at gumamit ng magandang ilaw.",
    lowConfidenceWarning: "Hindi ako sigurado kung tama ang pagkabasa ko nito — pakisuri ulit:",
    lowConfidenceSpokenPrefix: "Hindi ako sigurado dito, pero ito ang nabasa ko.",
    preparingModel: "Naghahanda — dina-download ang reading files (isang beses lang, kailangan ng internet)…",
    preparingModelHint: "Naghahanda sa background…",
    reportProblem: "Mag-report ng Problema",
    privacy: "Privacy at Data Mo",
    privacySub: "Ano ang ginagawa — at hindi ginagawa — ng app na ito sa impormasyon mo",
    privacyIntro:
      "Sa simpleng salita: gumagana ang AccessPH nang buo sa device mo. Walang account, walang company server, at walang kinokolekta o ibinebenta tungkol sa iyo.",
    privacyCameraHeading: "Camera",
    privacyCameraBody:
      "Bubukas lang ang camera mo kapag binuksan mo ang Basahin ang Teksto, at para lang basahin nang malakas ang teksto. Pinoproseso ang mga litrato sa device mo at hindi ito ina-upload kahit saan — kahit sa amin.",
    privacyMicHeading: "Mikropono",
    privacyMicBody:
      "Nakikinig lang ang mikropono pagkatapos mong pindutin ang mic button, para sa isang voice command lang. Walang ni-rerecord o ni-sesave.",
    privacyLocationHeading: "Lokasyon",
    privacyLocationBody:
      "Hihilingin lang ang lokasyon mo kapag pinindot mo ang \"Send SMS\" sa Emergency screen, para maisama ito sa mensahe sa emergency contact mo. Hindi ito ni-sesave o ipinapadala kahit saan pa.",
    privacyStorageHeading: "Ano ang naka-save sa device mo",
    privacyStorageBody:
      "Ang wika, bilis ng boses, at emergency contact mo ay naka-save lang sa local storage ng browser mo, sa device mo. Walang server ang app na ito na pagpapadalhan ng mga ito.",
    privacyNoAccountsHeading: "Walang account, walang tracking",
    privacyNoAccountsBody: "Walang sign-up, walang account, at walang analytics o tracking na anuman.",
    privacyDeletionHeading: "Pag-alis ng data mo",
    privacyDeletionBody:
      "Para tanggalin lahat ng naka-save ng AccessPH, i-clear ang site data nito sa settings ng browser mo, o i-uninstall kung idinagdag mo ito sa home screen mo.",
  },
} satisfies Record<AppLanguage, Record<string, string>>;

export type TranslationKey = keyof typeof strings.en;

export function t(language: AppLanguage, key: TranslationKey): string {
  return strings[language][key] ?? strings.en[key];
}
