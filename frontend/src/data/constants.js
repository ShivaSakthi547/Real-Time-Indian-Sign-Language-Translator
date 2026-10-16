// SignBridge Constants and Default Data

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hindi)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം (Malayalam)' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Kannada)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)' },
];

export const GESTURES = [
  {
    id: 'HELLO',
    label: 'HELLO',
    meaning: 'Friendly greeting or salutation',
    category: 'Social',
    hands: 1,
    icon: '🖐️',
    description: 'Open palm facing camera with all five fingers extended upward and spread naturally.',
    rule: 'Thumb, index, middle, ring, and pinky are all extended beyond their respective PIP joints.',
    translations: {
      en: 'Hello',
      hi: 'नमस्ते',
      te: 'హలో',
      ta: 'வணக்கம்',
      ml: 'ഹലോ',
      kn: 'ನಮಸ್ಕಾರ',
      bn: 'হ্যালো'
    }
  },
  {
    id: 'STOP',
    label: 'STOP',
    meaning: 'Halt, pause, or warning signal',
    category: 'Commands',
    hands: 1,
    icon: '✊',
    description: 'Closed fist with all fingers curled into the palm facing the camera.',
    rule: 'All five fingers are retracted; Euclidean wrist-to-tip distances are shorter than wrist-to-PIP.',
    translations: {
      en: 'Stop',
      hi: 'रुको',
      te: 'ఆపు',
      ta: 'நிறுத்து',
      ml: 'നിർത്തുക',
      kn: 'ನಿಲ್ಲಿಸು',
      bn: 'থামুন'
    }
  },
  {
    id: 'THANK YOU',
    label: 'THANK YOU',
    meaning: 'Expression of gratitude and appreciation',
    category: 'Social',
    hands: 2,
    icon: '🙏',
    description: 'Both hands brought together near chest level with open palms facing each other (Namaste).',
    rule: 'Two hands detected with open fingers and wrists positioned close together horizontally.',
    translations: {
      en: 'Thank you',
      hi: 'धन्यवाद',
      te: 'ధన్యవాదాలు',
      ta: 'நன்றி',
      ml: 'നന്ദി',
      kn: 'ಧನ್ಯವಾದಗಳು',
      bn: 'ধন্যবাদ'
    }
  },
  {
    id: 'YES',
    label: 'YES',
    meaning: 'Affirmative response, agreement, or confirmation',
    category: 'Responses',
    hands: 1,
    icon: '👍',
    description: 'Thumbs-up gesture with thumb extended vertically and all four fingers closed in a fist.',
    rule: 'Thumb tip extended upward (lower y than CMC joint) while index, middle, ring, pinky remain folded.',
    translations: {
      en: 'Yes',
      hi: 'हाँ',
      te: 'అవును',
      ta: 'ஆம்',
      ml: 'അതെ',
      kn: 'ಹೌದು',
      bn: 'হ্যাঁ'
    }
  },
  {
    id: 'NO',
    label: 'NO',
    meaning: 'Negative response, disagreement, or rejection',
    category: 'Responses',
    hands: 1,
    icon: '👎',
    description: 'Thumbs-down gesture with thumb extended downward and four fingers curled into the fist.',
    rule: 'Thumb tip pointing downward (greater y than wrist/CMC) with other four fingers curled.',
    translations: {
      en: 'No',
      hi: 'नहीं',
      te: 'కాదు',
      ta: 'இல்லை',
      ml: 'ഇല്ല',
      kn: 'ಇಲ್ಲ',
      bn: 'না'
    }
  },
  {
    id: 'PLEASE',
    label: 'PLEASE',
    meaning: 'Polite request, plea, or inquiry',
    category: 'Social',
    hands: 1,
    icon: '🤌',
    description: 'Pinched hand with tips of index, middle, and ring fingers grouped touching the thumb tip.',
    rule: 'Small Euclidean distance between thumb tip (landmark 4) and index/middle finger tips (8, 12).',
    translations: {
      en: 'Please',
      hi: 'कृपया',
      te: 'దయచేసి',
      ta: 'தயவுசெய்து',
      ml: 'ദയവായി',
      kn: 'ದಯವಿಟ್ಟು',
      bn: 'দয়া করে'
    }
  },
  {
    id: 'FRIEND',
    label: 'FRIEND',
    meaning: 'Companion, ally, or peace symbol',
    category: 'Social',
    hands: 1,
    icon: '✌️',
    description: 'V-sign: Index and middle fingers extended upward and separated, other fingers folded.',
    rule: 'Index and middle fingers are extended while thumb, ring, and pinky fingers are curled.',
    translations: {
      en: 'Friend',
      hi: 'दोस्त',
      te: 'స్నేహితుడు',
      ta: 'நண்பர்',
      ml: 'സുഹൃത്ത്',
      kn: 'ಸ್ನೇಹಿತ',
      bn: 'বন্ধু'
    }
  },
  {
    id: 'EAT',
    label: 'EAT',
    meaning: 'Food, meal, hunger, or dining action',
    category: 'Actions',
    hands: 1,
    icon: '🍱',
    description: 'Three fingers (thumb, index, and middle) extended and bunched upwards near mouth level.',
    rule: 'Thumb, index, and middle fingers extended with ring and pinky fingers folded.',
    translations: {
      en: 'Eat',
      hi: 'खाना',
      te: 'తిను',
      ta: 'சாப்பிடு',
      ml: 'ഭക്ഷണം കഴിക്കുക',
      kn: 'ಊಟ',
      bn: 'খাওয়া'
    }
  },
  {
    id: 'DRINK',
    label: 'DRINK',
    meaning: 'Water, beverage, thirst, or hydration',
    category: 'Actions',
    hands: 1,
    icon: '🥤',
    description: 'Hand forming a C-shape with thumb and curved index finger as if grasping a cup.',
    rule: 'Thumb and index open in curved cup shape while middle, ring, and pinky fingers are retracted.',
    translations: {
      en: 'Drink',
      hi: 'पानी पीना',
      te: 'త్రాగు',
      ta: 'குடி',
      ml: 'കുടിക്കുക',
      kn: 'ಕುಡಿ',
      bn: 'পান করা'
    }
  },
  {
    id: 'HELP',
    label: 'HELP',
    meaning: 'Assistance requested or urgent support needed',
    category: 'Commands',
    hands: 2,
    icon: '👐',
    description: 'Two open hands held side by side facing forward with all fingers extended.',
    rule: 'Two hands detected simultaneously, both having all 5 open fingers held apart.',
    translations: {
      en: 'Help',
      hi: 'मदद',
      te: 'సహాయం',
      ta: 'உதவி',
      ml: 'സഹായം',
      kn: 'ಸಹಾಯ',
      bn: 'সাহায্য'
    }
  }
];

export const INITIAL_EVALUATION_DATA = {
  total_trials: 100,
  correct_predictions: 93,
  incorrect_predictions: 7,
  overall_accuracy: 93.0,
  average_confidence: 0.942,
  average_latency_ms: 31.8,
  per_gesture: [
    { gesture: 'HELLO', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.942 },
    { gesture: 'STOP', total_tests: 10, correct: 10, incorrect: 0, accuracy: 100.0, avg_confidence: 0.970 },
    { gesture: 'THANK YOU', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.923 },
    { gesture: 'YES', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.947 },
    { gesture: 'NO', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.948 },
    { gesture: 'PLEASE', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.915 },
    { gesture: 'FRIEND', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.947 },
    { gesture: 'EAT', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.932 },
    { gesture: 'DRINK', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.935 },
    { gesture: 'HELP', total_tests: 10, correct: 9, incorrect: 1, accuracy: 90.0, avg_confidence: 0.946 }
  ],
  lighting_breakdown: [
    { condition: 'Studio Illumination', total: 40, correct: 40, accuracy: 100.0 },
    { condition: 'Normal Indoor Daylight', total: 40, correct: 39, accuracy: 97.5 },
    { condition: 'Low Ambient Light', total: 20, correct: 14, accuracy: 70.0 }
  ]
};
