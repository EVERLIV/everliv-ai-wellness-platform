
export interface ExpandedBiomarker {
  id: number;
  code: string;
  name: string;
  nameRu: string;
  category: string;
  subcategory?: string;
  unit: string;
  normalRangeMaleMin: number;
  normalRangeMaleMax: number;
  normalRangeFemaleMin: number;
  normalRangeFemaleMax: number;
  ageRanges?: {
    [key: string]: {
      maleMin: number;
      maleMax: number;
      femaleMin: number;
      femaleMax: number;
    };
  };
  optimalRangeMaleMin?: number;
  optimalRangeMaleMax?: number;
  optimalRangeFemaleMin?: number;
  optimalRangeFemaleMax?: number;
  description: string;
  descriptionRu: string;
  clinicalSignificance: string;
  clinicalSignificanceRu: string;
  significanceHigh: string;
  significanceHighRu: string;
  significanceLow: string;
  significanceLowRu: string;
  associatedConditions: string[];
  associatedConditionsRu: string[];
  recommendations: string;
  recommendationsRu: string;
  laboratoryMethod?: string;
  interferences?: string[];
  interferencesRu?: string[];
  lastUpdated: string;
  references: string[];
  currentValue?: number;
  status?: 'optimal' | 'good' | 'attention' | 'high' | 'low' | 'critical';
}

export const expandedBiomarkersData: Record<string, ExpandedBiomarker> = {
  // Общий анализ крови - Эритроциты и гемоглобин
  hemoglobin: {
    id: 1,
    code: "HGB",
    name: "Hemoglobin",
    nameRu: "Гемоглобин",
    category: "Общий анализ крови",
    subcategory: "Эритроцитарные показатели",
    unit: "г/л",
    normalRangeMaleMin: 130,
    normalRangeMaleMax: 170,
    normalRangeFemaleMin: 120,
    normalRangeFemaleMax: 150,
    optimalRangeMaleMin: 140,
    optimalRangeMaleMax: 160,
    optimalRangeFemaleMin: 125,
    optimalRangeFemaleMax: 145,
    ageRanges: {
      "18-30": { maleMin: 132, maleMax: 173, femaleMin: 117, femaleMax: 155 },
      "31-50": { maleMin: 130, maleMax: 170, femaleMin: 120, femaleMax: 150 },
      "51-70": { maleMin: 125, maleMax: 165, femaleMin: 115, femaleMax: 145 },
      "70+": { maleMin: 120, maleMax: 160, femaleMin: 110, femaleMax: 140 }
    },
    description: "Iron-containing oxygen-transport metalloprotein in red blood cells",
    descriptionRu: "Железосодержащий белок эритроцитов, переносящий кислород от легких к тканям",
    clinicalSignificance: "Essential for oxygen transport; indicates oxygen-carrying capacity of blood",
    clinicalSignificanceRu: "Ключевой показатель кислородтransportной способности крови",
    significanceHigh: "Polycythemia, dehydration, chronic hypoxia, smoking, high altitude",
    significanceHighRu: "Полицитемия, обезвоживание, хроническая гипоксия, курение, высокогорье",
    significanceLow: "Iron deficiency anemia, chronic bleeding, hemolysis, chronic kidney disease",
    significanceLowRu: "Железодефицитная анемия, хронические кровотечения, гемолиз, ХБП",
    associatedConditions: [
      "Iron deficiency anemia", "Thalassemia", "Chronic kidney disease", 
      "Gastrointestinal bleeding", "Polycythemia vera"
    ],
    associatedConditionsRu: [
      "Железодефицитная анемия", "Талассемия", "Хроническая болезнь почек",
      "Желудочно-кишечные кровотечения", "Истинная полицитемия"
    ],
    recommendations: "Iron supplementation for deficiency, investigate bleeding sources, hydration assessment",
    recommendationsRu: "При дефиците - препараты железа, поиск источников кровотечения, оценка гидратации",
    laboratoryMethod: "Automated hematology analyzer, spectrophotometry",
    interferences: ["Lipemia", "High WBC count", "Hemolysis"],
    interferencesRu: ["Липемия", "Высокий лейкоцитоз", "Гемолиз"],
    lastUpdated: "2024-12-01",
    references: [
      "WHO. Haemoglobin concentrations for the diagnosis of anaemia. 2011",
      "Клинические рекомендации МЗ РФ по анемиям. 2023"
    ]
  },

  erythrocytes: {
    id: 2,
    code: "RBC",
    name: "Red Blood Cell Count",
    nameRu: "Эритроциты",
    category: "Общий анализ крови",
    subcategory: "Эритроцитарные показатели",
    unit: "×10¹²/л",
    normalRangeMaleMin: 4.2,
    normalRangeMaleMax: 5.6,
    normalRangeFemaleMin: 3.8,
    normalRangeFemaleMax: 5.0,
    optimalRangeMaleMin: 4.5,
    optimalRangeMaleMax: 5.3,
    optimalRangeFemaleMin: 4.0,
    optimalRangeFemaleMax: 4.7,
    description: "Number of red blood cells per unit volume of blood",
    descriptionRu: "Количество эритроцитов в единице объема крови",
    clinicalSignificance: "Reflects oxygen-carrying capacity and bone marrow function",
    clinicalSignificanceRu: "Отражает кислородную емкость крови и функцию костного мозга",
    significanceHigh: "Polycythemia, dehydration, high altitude adaptation, lung disease",
    significanceHighRu: "Полицитемия, дегидратация, адаптация к высокогорью, заболевания легких",
    significanceLow: "Anemia, blood loss, bone marrow disorders, chronic diseases",
    significanceLowRu: "Анемия, кровопотеря, заболевания костного мозга, хронические болезни",
    associatedConditions: [
      "Polycythemia vera", "Secondary polycythemia", "Iron deficiency anemia",
      "Chronic kidney disease", "Bone marrow failure"
    ],
    associatedConditionsRu: [
      "Истинная полицитемия", "Вторичная полицитемия", "Железодефицитная анемия",
      "Хроническая болезнь почек", "Недостаточность костного мозга"
    ],
    recommendations: "Evaluate with hemoglobin and hematocrit; investigate underlying causes",
    recommendationsRu: "Оценивать совместно с гемоглобином и гематокритом; поиск причин",
    lastUpdated: "2024-12-01",
    references: [
      "International Council for Standardization in Haematology. 2013",
      "Российские клинические рекомендации по гематологии. 2023"
    ]
  },

  // Биохимические показатели - Липидный профиль
  totalCholesterol: {
    id: 3,
    code: "CHOL",
    name: "Total Cholesterol",
    nameRu: "Холестерин общий",
    category: "Биохимический анализ",
    subcategory: "Липидный профиль",
    unit: "ммоль/л",
    normalRangeMaleMin: 3.0,
    normalRangeMaleMax: 5.2,
    normalRangeFemaleMin: 3.0,
    normalRangeFemaleMax: 5.2,
    optimalRangeMaleMin: 3.0,
    optimalRangeMaleMax: 4.5,
    optimalRangeFemaleMin: 3.0,
    optimalRangeFemaleMax: 4.5,
    description: "Total amount of cholesterol in blood including LDL, HDL, and VLDL",
    descriptionRu: "Общее количество холестерина в крови, включая ЛПНП, ЛПВП и ЛПОНП",
    clinicalSignificance: "Major risk factor for cardiovascular disease; essential for cell membrane function",
    clinicalSignificanceRu: "Основной фактор риска сердечно-сосудистых заболеваний",
    significanceHigh: "Increased cardiovascular risk, familial hypercholesterolemia, diabetes, hypothyroidism",
    significanceHighRu: "Повышенный сердечно-сосудистый риск, семейная гиперхолестеринемия, диабет, гипотиреоз",
    significanceLow: "Malnutrition, liver disease, hyperthyroidism, certain medications",
    significanceLowRu: "Недоедание, заболевания печени, гипертиреоз, некоторые лекарства",
    associatedConditions: [
      "Coronary artery disease", "Atherosclerosis", "Familial hypercholesterolemia",
      "Type 2 diabetes", "Metabolic syndrome"
    ],
    associatedConditionsRu: [
      "Ишемическая болезнь сердца", "Атеросклероз", "Семейная гиперхолестеринемия",
      "Сахарный диабет 2 типа", "Метаболический синдром"
    ],
    recommendations: "Dietary modification, statins if indicated, lifestyle changes, regular monitoring",
    recommendationsRu: "Диетотерапия, статины по показаниям, изменение образа жизни, регулярный контроль",
    laboratoryMethod: "Enzymatic colorimetric assay",
    interferences: ["Non-fasting state", "Recent meals", "Alcohol consumption"],
    interferencesRu: ["Недавний прием пищи", "Употребление алкоголя", "Нарушение голодания"],
    lastUpdated: "2024-12-01",
    references: [
      "ESC/EAS Guidelines for management of dyslipidaemias. 2019",
      "Клинические рекомендации по дислипидемиям МЗ РФ. 2023"
    ]
  },

  ldlCholesterol: {
    id: 4,
    code: "LDL",
    name: "LDL Cholesterol",
    nameRu: "Холестерин ЛПНП",
    category: "Биохимический анализ",
    subcategory: "Липидный профиль",
    unit: "ммоль/л",
    normalRangeMaleMin: 1.0,
    normalRangeMaleMax: 3.0,
    normalRangeFemaleMin: 1.0,
    normalRangeFemaleMax: 3.0,
    optimalRangeMaleMin: 1.0,
    optimalRangeMaleMax: 2.5,
    optimalRangeFemaleMin: 1.0,
    optimalRangeFemaleMax: 2.5,
    description: "Low-density lipoprotein cholesterol, 'bad' cholesterol",
    descriptionRu: "Холестерин липопротеинов низкой плотности, 'плохой' холестерин",
    clinicalSignificance: "Primary target for cardiovascular risk reduction",
    clinicalSignificanceRu: "Основная мишень для снижения сердечно-сосудистого риска",
    significanceHigh: "Increased atherosclerosis risk, requires immediate intervention",
    significanceHighRu: "Повышенный риск атеросклероза, требует немедленного вмешательства",
    significanceLow: "Generally protective, but very low levels may indicate malnutrition",
    significanceLowRu: "Обычно защитный эффект, но очень низкие уровни могут указывать на недоедание",
    associatedConditions: [
      "Atherosclerosis", "Coronary artery disease", "Stroke", "Peripheral artery disease"
    ],
    associatedConditionsRu: [
      "Атеросклероз", "Ишемическая болезнь сердца", "Инсульт", "Заболевания периферических артерий"
    ],
    recommendations: "Statin therapy, PCSK9 inhibitors for high-risk patients, lifestyle modification",
    recommendationsRu: "Статины, ингибиторы PCSK9 для пациентов высокого риска, изменение образа жизни",
    lastUpdated: "2024-12-01",
    references: [
      "2019 ESC/EAS Guidelines for the management of dyslipidaemias",
      "Российские рекомендации ВНОК по диагностике и коррекции нарушений липидного обмена. 2023"
    ]
  },

  // Гормоны щитовидной железы
  tsh: {
    id: 5,
    code: "TSH",
    name: "Thyroid Stimulating Hormone",
    nameRu: "Тиреотропный гормон",
    category: "Гормональные исследования",
    subcategory: "Гормоны щитовидной железы",
    unit: "мЕд/л",
    normalRangeMaleMin: 0.4,
    normalRangeMaleMax: 4.0,
    normalRangeFemaleMin: 0.4,
    normalRangeFemaleMax: 4.0,
    optimalRangeMaleMin: 0.5,
    optimalRangeMaleMax: 2.5,
    optimalRangeFemaleMin: 0.5,
    optimalRangeFemaleMax: 2.5,
    description: "Hormone that regulates thyroid function",
    descriptionRu: "Гормон, регулирующий функцию щитовидной железы",
    clinicalSignificance: "Primary screening test for thyroid dysfunction",
    clinicalSignificanceRu: "Основной скрининговый тест для оценки функции щитовидной железы",
    significanceHigh: "Primary hypothyroidism, thyroid hormone resistance, TSH-secreting tumors",
    significanceHighRu: "Первичный гипотиреоз, резистентность к тиреоидным гормонам, ТТГ-секретирующие опухоли",
    significanceLow: "Hyperthyroidism, central hypothyroidism, excess thyroid hormone",
    significanceLowRu: "Гипертиреоз, центральный гипотиреоз, избыток тиреоидных гормонов",
    associatedConditions: [
      "Hashimoto's thyroiditis", "Graves' disease", "Thyroid nodules", "Subclinical thyroid dysfunction"
    ],
    associatedConditionsRu: [
      "Тиреоидит Хашимото", "Болезнь Грейвса", "Узлы щитовидной железы", "Субклинические нарушения функции ЩЖ"
    ],
    recommendations: "Repeat testing, thyroid ultrasound, endocrinologist consultation if abnormal",
    recommendationsRu: "Повторное исследование, УЗИ щитовидной железы, консультация эндокринолога при отклонениях",
    laboratoryMethod: "Chemiluminescent microparticle immunoassay",
    interferences: ["Biotin supplementation", "Heterophile antibodies", "Recent contrast agents"],
    interferencesRu: ["Прием биотина", "Гетерофильные антитела", "Недавнее введение контрастных веществ"],
    lastUpdated: "2024-12-01",
    references: [
      "2016 American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism",
      "Клинические рекомендации РАЭ по диагностике и лечению заболеваний щитовидной железы. 2023"
    ]
  },

  // Витамины
  vitaminD: {
    id: 6,
    code: "25OHD",
    name: "25-Hydroxyvitamin D",
    nameRu: "Витамин D (25-OH)",
    category: "Витамины и микроэлементы",
    subcategory: "Жирорастворимые витамины",
    unit: "нг/мл",
    normalRangeMaleMin: 30,
    normalRangeMaleMax: 100,
    normalRangeFemaleMin: 30,
    normalRangeFemaleMax: 100,
    optimalRangeMaleMin: 40,
    optimalRangeMaleMax: 60,
    optimalRangeFemaleMin: 40,
    optimalRangeFemaleMax: 60,
    description: "Storage form of vitamin D, best indicator of vitamin D status",
    descriptionRu: "Транспортная форма витамина D, лучший показатель статуса витамина D",
    clinicalSignificance: "Essential for bone health, immune function, and calcium homeostasis",
    clinicalSignificanceRu: "Необходим для здоровья костей, иммунной функции и гомеостаза кальция",
    significanceHigh: "Generally not toxic unless >150 ng/mL; may indicate oversupplementation",
    significanceHighRu: "Обычно не токсичен до 150 нг/мл; может указывать на передозировку добавок",
    significanceLow: "Increased fracture risk, muscle weakness, immune dysfunction, seasonal depression",
    significanceLowRu: "Повышенный риск переломов, мышечная слабость, иммунная дисфункция, сезонная депрессия",
    associatedConditions: [
      "Osteoporosis", "Rickets", "Osteomalacia", "Autoimmune diseases", "Seasonal affective disorder"
    ],
    associatedConditionsRu: [
      "Остеопороз", "Рахит", "Остеомаляция", "Аутоиммунные заболевания", "Сезонное аффективное расстройство"
    ],
    recommendations: "Vitamin D3 supplementation 1000-4000 IU daily, sun exposure, dietary sources",
    recommendationsRu: "Добавки витамина D3 1000-4000 МЕ/день, солнечное облучение, пищевые источники",
    laboratoryMethod: "Liquid chromatography-tandem mass spectrometry (LC-MS/MS)",
    interferences: ["25-OH-D2 vs D3 forms", "Vitamin D binding protein variants"],
    interferencesRu: ["Различие форм D2 и D3", "Варианты витамин D-связывающего белка"],
    lastUpdated: "2024-12-01",
    references: [
      "Endocrine Society Clinical Practice Guideline on Vitamin D. 2024",
      "Российская ассоциация эндокринологов. Дефицит витамина D у взрослых. 2023"
    ]
  }
};
