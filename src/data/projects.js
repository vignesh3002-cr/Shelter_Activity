export const PROJECTS = [
  {
    id: 'PRJ-001',
    name: 'Metro Rail Project',
    customer: 'ABC Infrastructure Group',
    status: 'Active',
    progress: 72,
    activities: [
      { name: 'Site Preparation', A: 88, B: 74, C: 65, D: 82, E: 91 },
      { name: 'Foundation Work',  A: 76, B: 88, C: 72, D: 68, E: 80 },
      { name: 'Structural Works', A: 92, B: 85, C: 79, D: 88, E: 95 },
      { name: 'MEP Installation', A: 68, B: 72, C: 84, D: 76, E: 70 },
      { name: 'Safety & QA',      A: 95, B: 90, C: 88, D: 92, E: 97 },
      { name: 'Finishing',        A: 80, B: 76, C: 72, D: 84, E: 88 },
    ],
  },
  {
    id: 'PRJ-002',
    name: 'Housing Project',
    customer: 'XYZ Builders Ltd',
    status: 'Completed',
    progress: 100,
    activities: [
      { name: 'Architecture',     A: 95, B: 92, C: 88, D: 91, E: 96 },
      { name: 'Foundation Work',  A: 90, B: 94, C: 87, D: 93, E: 98 },
      { name: 'Structural Works', A: 98, B: 96, C: 94, D: 97, E: 100 },
      { name: 'MEP Installation', A: 88, B: 91, C: 90, D: 89, E: 93 },
      { name: 'Safety & QA',      A: 100,B: 98, C: 97, D: 99, E: 100 },
      { name: 'Finishing',        A: 96, B: 94, C: 92, D: 95, E: 97 },
    ],
  },
  {
    id: 'PRJ-003',
    name: 'Smart Grid Expansion',
    customer: 'NovaPower Corp',
    status: 'Active',
    progress: 48,
    activities: [
      { name: 'Electrical Sys.',  A: 62, B: 58, C: 55, D: 60, E: 64 },
      { name: 'Foundation Work',  A: 50, B: 54, C: 48, D: 52, E: 56 },
      { name: 'Structural Works', A: 70, B: 65, C: 62, D: 68, E: 72 },
      { name: 'MEP Installation', A: 45, B: 50, C: 55, D: 48, E: 52 },
      { name: 'Safety & QA',      A: 78, B: 75, C: 72, D: 76, E: 80 },
      { name: 'Finishing',        A: 38, B: 42, C: 36, D: 40, E: 44 },
    ],
  },
  {
    id: 'PRJ-004',
    name: 'Coastal Bridge Upgrade',
    customer: 'StateWorks Dept',
    status: 'On Hold',
    progress: 33,
    activities: [
      { name: 'Structural Eng.',  A: 44, B: 40, C: 38, D: 42, E: 46 },
      { name: 'Foundation Work',  A: 38, B: 35, C: 32, D: 36, E: 40 },
      { name: 'Civil Works',      A: 50, B: 46, C: 44, D: 48, E: 52 },
      { name: 'MEP Installation', A: 28, B: 32, C: 30, D: 26, E: 34 },
      { name: 'Safety & QA',      A: 70, B: 68, C: 65, D: 72, E: 74 },
      { name: 'Finishing',        A: 20, B: 22, C: 18, D: 24, E: 26 },
    ],
  },
  {
    id: 'PRJ-005',
    name: 'Airport Terminal Retrofit',
    customer: 'AAI Infra Ltd',
    status: 'Completed',
    progress: 100,
    activities: [
      { name: 'MEP Works',        A: 96, B: 94, C: 92, D: 95, E: 98 },
      { name: 'Foundation Work',  A: 88, B: 90, C: 87, D: 89, E: 92 },
      { name: 'Structural Works', A: 100,B: 98, C: 96, D: 99, E: 100 },
      { name: 'Electrical Sys.',  A: 94, B: 92, C: 90, D: 93, E: 96 },
      { name: 'Safety & QA',      A: 100,B: 100,C: 98, D: 100,E: 100 },
      { name: 'Finishing',        A: 98, B: 96, C: 94, D: 97, E: 99 },
    ],
  },
  {
    id: 'PRJ-006',
    name: 'Solar Farm Phase II',
    customer: 'GreenHorizon Energy',
    status: 'Planning',
    progress: 12,
    activities: [
      { name: 'Land Acquisition', A: 22, B: 18, C: 15, D: 20, E: 24 },
      { name: 'Foundation Work',  A: 10, B: 12, C: 8,  D: 14, E: 16 },
      { name: 'Structural Works', A: 15, B: 12, C: 10, D: 14, E: 18 },
      { name: 'Electrical Sys.',  A: 8,  B: 10, C: 6,  D: 12, E: 14 },
      { name: 'Safety & QA',      A: 45, B: 42, C: 38, D: 44, E: 48 },
      { name: 'Finishing',        A: 5,  B: 6,  C: 4,  D: 8,  E: 10 },
    ],
  },
]

export const STATUS_STYLES = {
  'InProcess': {bg:'bg-emerald-50', text:'text-emerald-700', dot:'bg-emerald-500'},
  'Created': { bg: 'bg-gray-100', text:'text-gray-600', dot:'bg-gray-400'},
  'Estimated':   { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Scheduled':  { bg: 'bg-blue-50', text:'text-blue-700', dot: 'bg-blue-400' },
  'Finished' : { bg: 'bg-blue-50', text:'text-blue-700', dot: 'bg-blue-400' }
}

export const CODES = ['A', 'B', 'C', 'D', 'E']

export const BAR_COLORS = [
  '#1A1A1A', '#484848', '#717171', '#9E9E9E', '#C0C0C0', '#E0E0E0'
]
