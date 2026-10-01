import { CALIPSDimension, CategoryInfo, Question, CALIPSScores } from '../types';

export const CALIPS_CATEGORIES: Record<CALIPSDimension, CategoryInfo> = {
  C: {
    code: 'C',
    title: 'Conventional',
    archetype: 'The Organizer',
    tagline: 'Detail-oriented & structured',
    description: 'Detail-oriented and structured. You like clear systems, accurate data, and organized processes, and you take pride in doing precise, dependable work.',
    accentColor: '#38bdf8', // sky
    inDemandCareers: [
      'Accountant / Bookkeeper',
      'Data or Business Analyst',
      'Supply Chain / Logistics Coordinator',
      'Health Information Technician',
      'Compliance or Risk Analyst',
      'Paralegal',
      'Project Coordinator',
      'Actuarial Assistant'
    ],
    relatedMajors: [
      'Accounting / Finance',
      'Business Analytics',
      'Supply Chain Management',
      'Health Information Management',
      'Legal Studies / Paralegal Studies',
      'Information Systems',
      'Public Administration'
    ],
    careerClusters: [
      'Business Management & Administration',
      'Finance',
      'Information Technology',
      'Government & Public Administration',
      'Law, Public Safety, Corrections & Security'
    ],
    skillsToBuild: [
      'Spreadsheets & data entry accuracy',
      'Organization & time management',
      'Basic accounting / bookkeeping',
      'Attention to detail & documentation'
    ]
  },
  A: {
    code: 'A',
    title: 'Artistic',
    archetype: 'The Creator',
    tagline: 'Imaginative & expressive',
    description: 'Imaginative and expressive. You like original ideas, design, performance, and self-expression, and you prefer flexible, unstructured environments.',
    accentColor: '#f43f5e', // rose
    inDemandCareers: [
      'UX/UI or Graphic Designer',
      'Game Designer / 3D Animator',
      'Content Creator / Digital Media Producer',
      'Architect / Interior Designer',
      'Music Producer / Performing Artist',
      'Creative Director',
      'Film & Video Editor',
      'Fashion Designer'
    ],
    relatedMajors: [
      'Graphic / UX Design or Digital Media',
      'Film, Animation & Game Design',
      'Architecture',
      'Fine & Performing Arts',
      'Fashion Design & Merchandising',
      'Music Production & Technology',
      'Journalism & Communications'
    ],
    careerClusters: [
      'Arts, Audio/Video Technology & Communications',
      'Marketing',
      'Architecture & Construction'
    ],
    skillsToBuild: [
      'Design / editing software (Adobe, Figma, Canva)',
      'Portfolio building & storytelling',
      'Basic video / audio production',
      'Giving and receiving creative feedback'
    ]
  },
  L: {
    code: 'L',
    title: 'Leadership',
    archetype: 'The Leader',
    tagline: 'Confident, driven & enterprising',
    description: 'Confident and driven. You like leading, pitching ideas, taking initiative, and influencing people, whether that is building a business or closing a deal.',
    accentColor: '#fbbf24', // amber
    inDemandCareers: [
      'Entrepreneur / Startup Founder',
      'Digital Marketing or Brand Manager',
      'Product Manager',
      'Sales Manager / Account Executive',
      'Real Estate Agent',
      'Financial Advisor',
      'Attorney',
      'Political or Public Policy Strategist'
    ],
    relatedMajors: [
      'Business Administration / Entrepreneurship',
      'Marketing / Digital Marketing',
      'Finance or Economics',
      'Political Science / Public Policy',
      'Communications',
      'International Business',
      'Sports Management'
    ],
    careerClusters: [
      'Business Management & Administration',
      'Marketing',
      'Finance',
      'Government & Public Administration',
      'Law, Public Safety, Corrections & Security'
    ],
    skillsToBuild: [
      'Pitching & negotiation',
      'Project & team leadership',
      'Social media / personal branding',
      'Basic budgeting & financial literacy'
    ]
  },
  I: {
    code: 'I',
    title: 'Investigative',
    archetype: 'The Analyst',
    tagline: 'Curious & analytical',
    description: 'Curious and analytical. You like asking why, digging into data, running experiments, and solving complex problems using logic and evidence.',
    accentColor: '#818cf8', // indigo
    inDemandCareers: [
      'Data Scientist / Data Analyst',
      'Software or AI/ML Engineer',
      'Biomedical or Environmental Engineer',
      'Cybersecurity Analyst',
      'Physician / Genetic Counselor',
      'Actuary',
      'Research Scientist',
      'UX Researcher'
    ],
    relatedMajors: [
      'Computer Science / Data Science',
      'Biology, Chemistry, or Biotechnology',
      'Environmental Science',
      'Statistics or Applied Mathematics',
      'Biomedical Engineering',
      'Public Health',
      'Psychology (Research Track)'
    ],
    careerClusters: [
      'Information Technology',
      'Science, Technology, Engineering & Mathematics',
      'Health Science',
      'Agriculture, Food & Natural Resources'
    ],
    skillsToBuild: [
      'Data analysis & spreadsheets / SQL',
      'Scientific method & experimental design',
      'Python or R programming basics',
      'Critical thinking & research writing'
    ]
  },
  P: {
    code: 'P',
    title: 'Practical',
    archetype: 'The Doer',
    tagline: 'Hands-on & pragmatic',
    description: 'Hands-on and practical. You like working with tools, machines, technology, plants, animals, or the outdoors, and you learn best by doing rather than reading about it.',
    accentColor: '#34d399', // emerald
    inDemandCareers: [
      'Electrician / HVAC or Solar Technician',
      'Automotive & EV Technician',
      'Robotics or Mechatronics Technician',
      'Construction Manager / Skilled Trades',
      'Precision Agriculture Technician',
      'Drone Pilot / Field Service Technician',
      'Culinary Arts & Food Production',
      'Athletic Trainer / EMT-Paramedic'
    ],
    relatedMajors: [
      'Skilled Trades & Applied Technology',
      'Mechanical or Electrical Engineering Technology',
      'Renewable Energy Technology',
      'Automotive / Diesel Technology',
      'Agricultural Science',
      'Kinesiology & Exercise Science',
      'Culinary Arts'
    ],
    careerClusters: [
      'Agriculture, Food & Natural Resources',
      'Architecture & Construction',
      'Manufacturing',
      'Transportation, Distribution & Logistics',
      'Health Science'
    ],
    skillsToBuild: [
      'Technical / mechanical troubleshooting',
      'Reading blueprints or spec sheets',
      'Basic coding for automation (PLC / Arduino)',
      'Physical stamina & safety protocols'
    ]
  },
  S: {
    code: 'S',
    title: 'Social',
    archetype: 'The Helper',
    tagline: 'People-focused & empathetic',
    description: 'People-focused and empathetic. You like teaching, coaching, counseling, and working directly with others to support their growth or well-being.',
    accentColor: '#a78bfa', // violet
    inDemandCareers: [
      'Nurse / Nurse Practitioner',
      'Teacher or Instructional Coach',
      'Mental Health or School Counselor',
      'Social Worker',
      'Human Resources Specialist',
      'Physical or Occupational Therapist',
      'Community Health Worker',
      'Nonprofit Program Coordinator'
    ],
    relatedMajors: [
      'Nursing / Health Sciences',
      'Education',
      'Psychology / Counseling',
      'Social Work',
      'Human Resources / Organizational Development',
      'Public Health',
      'Physical Therapy'
    ],
    careerClusters: [
      'Human Services',
      'Education & Training',
      'Health Science',
      'Government & Public Administration'
    ],
    skillsToBuild: [
      'Active listening & empathy',
      'Conflict resolution',
      'Public speaking & facilitation',
      'Cultural competence'
    ]
  }
};

export const CALIPS_QUESTIONS: Question[] = [
  // C — Conventional: The Organizer (1-10)
  { id: 1, category: 'C', text: 'Do you enjoy organizing files, documents, or information?' },
  { id: 2, category: 'C', text: 'Do you like following clear instructions when completing a task?' },
  { id: 3, category: 'C', text: 'Do you enjoy keeping records of your work or activities?' },
  { id: 4, category: 'C', text: 'Do you like working with numbers, tables, or charts?' },
  { id: 5, category: 'C', text: 'Do you pay close attention to small details?' },
  { id: 6, category: 'C', text: 'Do you prefer having a structured schedule for your day?' },
  { id: 7, category: 'C', text: 'Do you enjoy arranging information in an orderly way?' },
  { id: 8, category: 'C', text: 'Do you like completing tasks according to a specific procedure?' },
  { id: 9, category: 'C', text: 'Do you enjoy checking work to make sure there are no mistakes?' },
  { id: 10, category: 'C', text: 'Do you prefer organized and predictable working environments?' },

  // A — Artistic: The Creator (11-20)
  { id: 11, category: 'A', text: 'Do you enjoy drawing or creating visual artwork?' },
  { id: 12, category: 'A', text: 'Do you enjoy writing stories, poems, or creative content?' },
  { id: 13, category: 'A', text: 'Do you like attending art exhibitions, concerts, or theatrical performances?' },
  { id: 14, category: 'A', text: 'Do you enjoy playing a musical instrument or singing?' },
  { id: 15, category: 'A', text: 'Do you like acting or performing in front of others?' },
  { id: 16, category: 'A', text: 'Do you enjoy coming up with original ideas?' },
  { id: 17, category: 'A', text: 'Do you prefer tasks where you can use your imagination?' },
  { id: 18, category: 'A', text: 'Do you enjoy designing things in your own style?' },
  { id: 19, category: 'A', text: 'Do you like expressing your feelings through art, music, writing, or design?' },
  { id: 20, category: 'A', text: 'Do you prefer having freedom rather than following strict instructions when creating something?' },

  // L — Leadership: The Leader (21-30)
  { id: 21, category: 'L', text: 'Do you enjoy taking the lead when working with a group?' },
  { id: 22, category: 'L', text: 'Do you like persuading people to accept your ideas?' },
  { id: 23, category: 'L', text: 'Do you enjoy setting goals and working toward achieving them?' },
  { id: 24, category: 'L', text: 'Would you enjoy starting and managing your own business?' },
  { id: 25, category: 'L', text: 'Do you like taking responsibility for important decisions?' },
  { id: 26, category: 'L', text: 'Do you enjoy giving presentations or speeches?' },
  { id: 27, category: 'L', text: 'Do you feel comfortable motivating other people?' },
  { id: 28, category: 'L', text: 'Do you enjoy organizing people to accomplish a common goal?' },
  { id: 29, category: 'L', text: 'Do you like situations where you can influence or negotiate with others?' },
  { id: 30, category: 'L', text: 'Would you enjoy managing a team or project?' },

  // I — Investigative: The Analyst (31-40)
  { id: 31, category: 'I', text: 'Do you enjoy solving puzzles or challenging problems?' },
  { id: 32, category: 'I', text: 'Do you like conducting experiments to find answers?' },
  { id: 33, category: 'I', text: 'Do you enjoy learning how things work?' },
  { id: 34, category: 'I', text: 'Do you like analyzing problems before deciding what to do?' },
  { id: 35, category: 'I', text: 'Do you enjoy mathematics or scientific subjects?' },
  { id: 36, category: 'I', text: 'Do you like researching topics that interest you?' },
  { id: 37, category: 'I', text: 'Do you enjoy examining information to find patterns?' },
  { id: 38, category: 'I', text: 'Do you prefer solving problems independently?' },
  { id: 39, category: 'I', text: 'Do you like asking questions and investigating their answers?' },
  { id: 40, category: 'I', text: 'Do you enjoy analyzing data, situations, or trends?' },

  // P — Practical: The Doer (41-50)
  { id: 41, category: 'P', text: 'Do you enjoy building or making physical things?' },
  { id: 42, category: 'P', text: 'Do you like repairing machines, equipment, or objects?' },
  { id: 43, category: 'P', text: 'Do you enjoy assembling models or putting things together?' },
  { id: 44, category: 'P', text: 'Do you like working with tools?' },
  { id: 45, category: 'P', text: 'Do you prefer learning by actually doing something rather than only reading about it?' },
  { id: 46, category: 'P', text: 'Do you enjoy working outdoors?' },
  { id: 47, category: 'P', text: 'Do you like working with machines or technology in a hands-on way?' },
  { id: 48, category: 'P', text: 'Do you enjoy cooking or preparing things yourself?' },
  { id: 49, category: 'P', text: 'Do you like solving practical, real-world problems?' },
  { id: 50, category: 'P', text: 'Would you enjoy a career where you can see a physical result from your work?' },

  // S — Social: The Helper (51-60)
  { id: 51, category: 'S', text: 'Do you enjoy helping people solve their problems?' },
  { id: 52, category: 'S', text: 'Do you like teaching or training other people?' },
  { id: 53, category: 'S', text: 'Do you enjoy working as part of a team?' },
  { id: 54, category: 'S', text: 'Do you like listening to people when they need someone to talk to?' },
  { id: 55, category: 'S', text: 'Do you enjoy explaining difficult ideas to others?' },
  { id: 56, category: 'S', text: 'Would you enjoy helping people improve their skills?' },
  { id: 57, category: 'S', text: 'Do you like learning about different people and cultures?' },
  { id: 58, category: 'S', text: 'Do you enjoy cooperating with others to achieve a goal?' },
  { id: 59, category: 'S', text: 'Would you enjoy a career where you regularly help or support people?' },
  { id: 60, category: 'S', text: 'Do you consider yourself understanding and empathetic toward others?' }
];

export function calculateScores(answers: Record<number, boolean>): CALIPSScores {
  const scores: CALIPSScores = { C: 0, A: 0, L: 0, I: 0, P: 0, S: 0 };
  
  for (const q of CALIPS_QUESTIONS) {
    if (answers[q.id] === true) {
      scores[q.category] += 1;
    }
  }
  return scores;
}

export function rankCategories(scores: CALIPSScores): CALIPSDimension[] {
  const order: CALIPSDimension[] = ['C', 'A', 'L', 'I', 'P', 'S'];
  return order.sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
}

export function getPathCodeTitle(code: string): string {
  const titles: Record<string, string> = {
    IAC: 'The Algorithmic Architect',
    IAS: 'The Human-Centered Scientist',
    IAL: 'The Tech Visionary',
    IAP: 'The Digital Inventor',
    ICA: 'The Data Systems Designer',
    ICP: 'The Applied Systems Engineer',
    ICL: 'The Quant Strategist',
    ICS: 'The Clinical Analyst',
    ILA: 'The Innovation Director',
    ILC: 'The Enterprise Strategist',
    ILS: 'The Social Impact Leader',
    ILP: 'The Engineering Operations Lead',
    IPA: 'The Creative Technologist',
    IPC: 'The Precision Technologist',
    IPL: 'The Hardware Founder',
    IPS: 'The Medical Technologist',
    ISA: 'The Behavioral Designer',
    ISC: 'The Healthcare Informaticist',
    ISL: 'The Public Health Director',
    ISP: 'The Clinical Practitioner',

    AIC: 'The Digital Product Designer',
    AIS: 'The Creative Communications Lead',
    AIL: 'The Creative Technologist Entrepreneur',
    AIP: 'The Game & Virtual Worlds Creator',
    ALI: 'The Brand & Creative Strategist',
    ALS: 'The Cultural Movement Leader',
    ALC: 'The Creative Operations Executive',
    ALP: 'The Industrial Design Producer',
    ASI: 'The Educational Media Creator',
    ASL: 'The Arts & Advocacy Director',
    ASC: 'The Editorial & Publishing Producer',
    ASP: 'The Applied Arts Craftsman',
    API: 'The Interactive Spatial Designer',
    APL: 'The Studio Production Director',
    APS: 'The Art Therapist / Community Artist',
    APC: 'The Technical Production Designer',
    ACI: 'The UI Systems & Data Designer',
    ACL: 'The Advertising Accounts Director',
    ACS: 'The Educational Content Developer',
    ACP: 'The Architectural Draftsperson',

    LIC: 'The Fintech & Tech Venture Executive',
    LIA: 'The Digital Transformation Leader',
    LIS: 'The Biotech & Research Director',
    LIP: 'The Industrial Technology CEO',
    LCA: 'The Marketing & Brand Director',
    LCI: 'The Financial Services Executive',
    LCS: 'The Corporate Operations Officer',
    LCP: 'The Supply Chain & Logistics Director',
    LSA: 'The Non-Profit Executive Director',
    LSI: 'The Healthcare Administration Leader',
    LSC: 'The Institutional General Manager',
    LSP: 'The Emergency & Community Ops Leader',
    LPA: 'The Construction & Real Estate Developer',
    LPI: 'The Engineering Project Director',
    LPC: 'The Manufacturing Operations Executive',
    LPS: 'The Sports & Athletics Program Director',

    CIA: 'The Information Architect',
    CIL: 'The Enterprise Risk & Analytics Officer',
    CIP: 'The Database & Systems Specialist',
    CIS: 'The Healthcare Systems Analyst',
    CLI: 'The Chief Financial Officer',
    CLA: 'The Corporate Brand Comptroller',
    CLC: 'The Governance & Legal Director',
    CLS: 'The Human Resources Operations Lead',
    CLP: 'The Global Logistics Planner',
    CAI: 'The Technical Writer & Documentarian',
    CAL: 'The Creative Business Manager',
    CAS: 'The Museum Registrar & Archivist',
    CAP: 'The Architectural Specifications Specialist',
    CSI: 'The Clinical Research Coordinator',
    CSL: 'The Public Policy Administrator',
    CSA: 'The Academic Affairs Registrar',
    CSP: 'The Facilities & Records Manager',
    CPI: 'The Quality Assurance Specialist',
    CPL: 'The Construction Compliance Officer',
    CPA: 'The Print & Media Production Coordinator',
    CPS: 'The Environmental Safety Coordinator',

    PIA: 'The Robotics & Mechatronics Builder',
    PIL: 'The Engineering Operations Entrepreneur',
    PIC: 'The Technical Automation Specialist',
    PIS: 'The Biomedical Field Engineer',
    PAI: 'The Industrial Prototyper & 3D Modeler',
    PAL: 'The Creative Construction Director',
    PAC: 'The Architectural Model Maker',
    PAS: 'The Landscape & Living Space Artisan',
    PLI: 'The Renewable Infrastructure Builder',
    PLC: 'The Project Superintendent',
    PLA: 'The Commercial Production Fabricator',
    PLS: 'The Community Emergency Coordinator',
    PCI: 'The Precision Instrument Technician',
    PCL: 'The Plant Operations Manager',
    PCA: 'The Digital Fabrication Specialist',
    PCS: 'The Agricultural Logistics Specialist',
    PSI: 'The Sports Medicine Physical Therapist',
    PSL: 'The Rescue & Safety Operations Trainer',
    PSA: 'The Recreational Arts Instructor',
    PSC: 'The Hospital Equipment Specialist',

    SIA: 'The Cognitive Psychologist & Researcher',
    SIL: 'The Health Policy Analyst',
    SIC: 'The Epidemiologist & Health Data Analyst',
    SIP: 'The Physical Rehabilitation Specialist',
    SAI: 'The Expressive Arts Therapist',
    SAL: 'The Social Media Community Leader',
    SAC: 'The Creative Arts Educator',
    SAP: 'The Occupational Therapy Practitioner',
    SLI: 'The Educational Institution Dean',
    SLC: 'The Human Resources Director',
    SLA: 'The Community Outreach Director',
    SLP: 'The Youth Sports & Development Coach',
    SCI: 'The Medical Social Worker',
    SCL: 'The Non-Profit Program Manager',
    SCA: 'The Special Education Coordinator',
    SCP: 'The Vocational Training Specialist',
    SPI: 'The Kinesiologist & Athletic Trainer',
    SPL: 'The Community Emergency Responder',
    SPA: 'The Outdoor Education Specialist',
    SPC: 'The Clinical Laboratory Assistant'
  };

  return titles[code] || `${CALIPS_CATEGORIES[code[0] as CALIPSDimension]?.archetype || 'Explorer'} & ${CALIPS_CATEGORIES[code[1] as CALIPSDimension]?.archetype || 'Strategist'}`;
}

export const DEPARTMENTS = [
  'Computer Science & IT',
  'Business & Management',
  'Engineering & Technology',
  'Art, Design & Media',
  'Health Sciences & Medicine',
  'Social Sciences & Psychology',
  'Natural Sciences & Biotechnology',
  'Law & Public Policy',
  'Education & Training',
  'Trades, Agriculture & Practical Fields'
] as const;

export const POPULAR_INTEREST_TAGS = [
  'Artificial Intelligence & ML',
  'Cybersecurity & Ethical Hacking',
  'UX/UI Design & Product Design',
  'Startup & Entrepreneurship',
  'Biotechnology & Genetics',
  'Game Design & 3D Animation',
  'Digital Marketing & Social Media',
  'Mental Health & Counseling',
  'Robotics & Drone Tech',
  'Renewable Energy & Climate',
  'Accounting & Financial Analytics',
  'Nursing & Patient Care',
  'Film, Video & Creative Direction',
  'Software Development & Web Apps'
];
