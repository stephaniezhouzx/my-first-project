// Mock data for the BD Management System

export interface Creator {
  id: string
  tkId: string
  account: string
  priority: 'S' | 'A' | 'B' | 'C'
  shop: string
  category: string
  language: string
  followers: number
  gmv: number
  netProfit: number
  cooperationCount: number
  cooperationType: string
  voiceAuthorization: boolean
}

export interface SampleRecord {
  id: string
  creatorId: string
  creatorAccount: string
  contactDate: string
  shop: string
  sampleName: string
  isFree: boolean
  receivedStatus: '已收到' | '已寄出' | '未寄出'
  videoPublished: boolean
  daysToPublish: number | null
  cooperationStatus: '合作中' | '已完成' | '待跟进' | '已终止'
}

export interface ContentPerformance {
  id: string
  creatorAccount: string
  product: string
  publishDate: string
  views: number
  engagementRate: number
  gpm: number
  gmv: number
  isHit: boolean
  adStatus: '未投流' | '投流中' | '已结束'
}

export interface SalesConversion {
  id: string
  creatorAccount: string
  product: string
  month: string
  attributedGmv: number
  netProfit: number
  roi: number
  commission: number
  rating: 'S' | 'A' | 'B' | 'C'
}

// Creators Data
export const creators: Creator[] = [
  {
    id: '1',
    tkId: 'TK001',
    account: '@beauty_queen',
    priority: 'S',
    shop: '美妆旗舰店',
    category: '美妆护肤',
    language: '英语',
    followers: 2850000,
    gmv: 458000,
    netProfit: 89000,
    cooperationCount: 12,
    cooperationType: '纯佣',
    voiceAuthorization: true,
  },
  {
    id: '2',
    tkId: 'TK002',
    account: '@fitness_life',
    priority: 'A',
    shop: '运动户外店',
    category: '运动健身',
    language: '英语',
    followers: 1560000,
    gmv: 325000,
    netProfit: 67500,
    cooperationCount: 8,
    cooperationType: '坑位费+佣金',
    voiceAuthorization: true,
  },
  {
    id: '3',
    tkId: 'TK003',
    account: '@home_living',
    priority: 'A',
    shop: '家居生活馆',
    category: '家居日用',
    language: '英语',
    followers: 980000,
    gmv: 198000,
    netProfit: 42000,
    cooperationCount: 6,
    cooperationType: '纯佣',
    voiceAuthorization: false,
  },
  {
    id: '4',
    tkId: 'TK004',
    account: '@fashion_style',
    priority: 'S',
    shop: '潮流服饰店',
    category: '服装配饰',
    language: '英语',
    followers: 3200000,
    gmv: 562000,
    netProfit: 112000,
    cooperationCount: 15,
    cooperationType: '坑位费+佣金',
    voiceAuthorization: true,
  },
  {
    id: '5',
    tkId: 'TK005',
    account: '@tech_guru',
    priority: 'B',
    shop: '数码科技店',
    category: '3C数码',
    language: '英语',
    followers: 720000,
    gmv: 145000,
    netProfit: 28500,
    cooperationCount: 4,
    cooperationType: '纯佣',
    voiceAuthorization: true,
  },
  {
    id: '6',
    tkId: 'TK006',
    account: '@food_lover',
    priority: 'B',
    shop: '食品零食店',
    category: '食品饮料',
    language: '西班牙语',
    followers: 890000,
    gmv: 178000,
    netProfit: 35600,
    cooperationCount: 5,
    cooperationType: '纯佣',
    voiceAuthorization: false,
  },
  {
    id: '7',
    tkId: 'TK007',
    account: '@pet_paradise',
    priority: 'C',
    shop: '宠物用品店',
    category: '宠物用品',
    language: '英语',
    followers: 450000,
    gmv: 89000,
    netProfit: 17800,
    cooperationCount: 3,
    cooperationType: '纯佣',
    voiceAuthorization: true,
  },
  {
    id: '8',
    tkId: 'TK008',
    account: '@mom_daily',
    priority: 'A',
    shop: '母婴用品店',
    category: '母婴用品',
    language: '英语',
    followers: 1350000,
    gmv: 289000,
    netProfit: 57800,
    cooperationCount: 9,
    cooperationType: '坑位费+佣金',
    voiceAuthorization: true,
  },
  {
    id: '9',
    tkId: 'TK009',
    account: '@outdoor_adv',
    priority: 'B',
    shop: '运动户外店',
    category: '户外装备',
    language: '英语',
    followers: 680000,
    gmv: 156000,
    netProfit: 31200,
    cooperationCount: 4,
    cooperationType: '纯佣',
    voiceAuthorization: false,
  },
  {
    id: '10',
    tkId: 'TK010',
    account: '@jewelry_box',
    priority: 'C',
    shop: '饰品珠宝店',
    category: '珠宝饰品',
    language: '法语',
    followers: 380000,
    gmv: 67000,
    netProfit: 13400,
    cooperationCount: 2,
    cooperationType: '纯佣',
    voiceAuthorization: true,
  },
]

// Sample Records Data
export const sampleRecords: SampleRecord[] = [
  {
    id: 's1',
    creatorId: '1',
    creatorAccount: '@beauty_queen',
    contactDate: '2024-01-15',
    shop: '美妆旗舰店',
    sampleName: '精华液套装',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: true,
    daysToPublish: 5,
    cooperationStatus: '已完成',
  },
  {
    id: 's2',
    creatorId: '2',
    creatorAccount: '@fitness_life',
    contactDate: '2024-01-18',
    shop: '运动户外店',
    sampleName: '瑜伽垫套装',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: false,
    daysToPublish: null,
    cooperationStatus: '待跟进',
  },
  {
    id: 's3',
    creatorId: '3',
    creatorAccount: '@home_living',
    contactDate: '2024-01-20',
    shop: '家居生活馆',
    sampleName: '香薰蜡烛',
    isFree: false,
    receivedStatus: '已收到',
    videoPublished: true,
    daysToPublish: 8,
    cooperationStatus: '已完成',
  },
  {
    id: 's4',
    creatorId: '4',
    creatorAccount: '@fashion_style',
    contactDate: '2024-01-22',
    shop: '潮流服饰店',
    sampleName: '春季新款连衣裙',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: true,
    daysToPublish: 3,
    cooperationStatus: '合作中',
  },
  {
    id: 's5',
    creatorId: '5',
    creatorAccount: '@tech_guru',
    contactDate: '2024-01-25',
    shop: '数码科技店',
    sampleName: '蓝牙耳机',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: false,
    daysToPublish: null,
    cooperationStatus: '待跟进',
  },
  {
    id: 's6',
    creatorId: '6',
    creatorAccount: '@food_lover',
    contactDate: '2024-01-28',
    shop: '食品零食店',
    sampleName: '坚果礼盒',
    isFree: true,
    receivedStatus: '已寄出',
    videoPublished: false,
    daysToPublish: null,
    cooperationStatus: '合作中',
  },
  {
    id: 's7',
    creatorId: '7',
    creatorAccount: '@pet_paradise',
    contactDate: '2024-02-01',
    shop: '宠物用品店',
    sampleName: '宠物零食大礼包',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: true,
    daysToPublish: 12,
    cooperationStatus: '已完成',
  },
  {
    id: 's8',
    creatorId: '8',
    creatorAccount: '@mom_daily',
    contactDate: '2024-02-05',
    shop: '母婴用品店',
    sampleName: '婴儿护肤套装',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: false,
    daysToPublish: null,
    cooperationStatus: '待跟进',
  },
  {
    id: 's9',
    creatorId: '9',
    creatorAccount: '@outdoor_adv',
    contactDate: '2024-02-08',
    shop: '运动户外店',
    sampleName: '登山背包',
    isFree: false,
    receivedStatus: '未寄出',
    videoPublished: false,
    daysToPublish: null,
    cooperationStatus: '已终止',
  },
  {
    id: 's10',
    creatorId: '1',
    creatorAccount: '@beauty_queen',
    contactDate: '2024-02-10',
    shop: '美妆旗舰店',
    sampleName: '口红色号套装',
    isFree: true,
    receivedStatus: '已收到',
    videoPublished: true,
    daysToPublish: 4,
    cooperationStatus: '合作中',
  },
]

// Content Performance Data
export const contentPerformances: ContentPerformance[] = [
  {
    id: 'c1',
    creatorAccount: '@beauty_queen',
    product: '精华液套装',
    publishDate: '2024-01-20',
    views: 1250000,
    engagementRate: 8.5,
    gpm: 450,
    gmv: 56250,
    isHit: true,
    adStatus: '投流中',
  },
  {
    id: 'c2',
    creatorAccount: '@fashion_style',
    product: '春季新款连衣裙',
    publishDate: '2024-01-25',
    views: 2100000,
    engagementRate: 9.2,
    gpm: 520,
    gmv: 109200,
    isHit: true,
    adStatus: '投流中',
  },
  {
    id: 'c3',
    creatorAccount: '@home_living',
    product: '香薰蜡烛',
    publishDate: '2024-01-28',
    views: 450000,
    engagementRate: 5.8,
    gpm: 280,
    gmv: 12600,
    isHit: false,
    adStatus: '未投流',
  },
  {
    id: 'c4',
    creatorAccount: '@pet_paradise',
    product: '宠物零食大礼包',
    publishDate: '2024-02-13',
    views: 380000,
    engagementRate: 7.2,
    gpm: 320,
    gmv: 12160,
    isHit: false,
    adStatus: '已结束',
  },
  {
    id: 'c5',
    creatorAccount: '@beauty_queen',
    product: '口红色号套装',
    publishDate: '2024-02-14',
    views: 1850000,
    engagementRate: 10.1,
    gpm: 580,
    gmv: 107300,
    isHit: true,
    adStatus: '投流中',
  },
  {
    id: 'c6',
    creatorAccount: '@fitness_life',
    product: '运动水杯',
    publishDate: '2024-02-18',
    views: 680000,
    engagementRate: 6.5,
    gpm: 350,
    gmv: 23800,
    isHit: false,
    adStatus: '未投流',
  },
  {
    id: 'c7',
    creatorAccount: '@mom_daily',
    product: '婴儿湿巾',
    publishDate: '2024-02-20',
    views: 920000,
    engagementRate: 7.8,
    gpm: 420,
    gmv: 38640,
    isHit: true,
    adStatus: '投流中',
  },
  {
    id: 'c8',
    creatorAccount: '@tech_guru',
    product: '手机支架',
    publishDate: '2024-02-22',
    views: 520000,
    engagementRate: 5.2,
    gpm: 290,
    gmv: 15080,
    isHit: false,
    adStatus: '未投流',
  },
  {
    id: 'c9',
    creatorAccount: '@food_lover',
    product: '即食麦片',
    publishDate: '2024-02-25',
    views: 750000,
    engagementRate: 8.0,
    gpm: 380,
    gmv: 28500,
    isHit: false,
    adStatus: '已结束',
  },
  {
    id: 'c10',
    creatorAccount: '@fashion_style',
    product: '设计师手提包',
    publishDate: '2024-02-28',
    views: 1680000,
    engagementRate: 8.8,
    gpm: 490,
    gmv: 82320,
    isHit: true,
    adStatus: '投流中',
  },
]

// Sales Conversion Data
export const salesConversions: SalesConversion[] = [
  {
    id: 'sc1',
    creatorAccount: '@beauty_queen',
    product: '精华液套装',
    month: '2024-01',
    attributedGmv: 125000,
    netProfit: 37500,
    roi: 375,
    commission: 12500,
    rating: 'S',
  },
  {
    id: 'sc2',
    creatorAccount: '@fashion_style',
    product: '春季新款连衣裙',
    month: '2024-01',
    attributedGmv: 189000,
    netProfit: 47250,
    roi: 315,
    commission: 18900,
    rating: 'S',
  },
  {
    id: 'sc3',
    creatorAccount: '@home_living',
    product: '香薰蜡烛',
    month: '2024-01',
    attributedGmv: 45000,
    netProfit: 9000,
    roi: 150,
    commission: 4500,
    rating: 'B',
  },
  {
    id: 'sc4',
    creatorAccount: '@fitness_life',
    product: '瑜伽垫套装',
    month: '2024-02',
    attributedGmv: 78000,
    netProfit: 15600,
    roi: 195,
    commission: 7800,
    rating: 'A',
  },
  {
    id: 'sc5',
    creatorAccount: '@beauty_queen',
    product: '口红色号套装',
    month: '2024-02',
    attributedGmv: 156000,
    netProfit: 46800,
    roi: 390,
    commission: 15600,
    rating: 'S',
  },
  {
    id: 'sc6',
    creatorAccount: '@tech_guru',
    product: '蓝牙耳机',
    month: '2024-02',
    attributedGmv: 32000,
    netProfit: 4800,
    roi: 80,
    commission: 3200,
    rating: 'C',
  },
  {
    id: 'sc7',
    creatorAccount: '@mom_daily',
    product: '婴儿护肤套装',
    month: '2024-02',
    attributedGmv: 98000,
    netProfit: 24500,
    roi: 245,
    commission: 9800,
    rating: 'A',
  },
  {
    id: 'sc8',
    creatorAccount: '@pet_paradise',
    product: '宠物零食大礼包',
    month: '2024-02',
    attributedGmv: 28000,
    netProfit: 5600,
    roi: 140,
    commission: 2800,
    rating: 'B',
  },
  {
    id: 'sc9',
    creatorAccount: '@fashion_style',
    product: '设计师手提包',
    month: '2024-02',
    attributedGmv: 210000,
    netProfit: 63000,
    roi: 420,
    commission: 21000,
    rating: 'S',
  },
  {
    id: 'sc10',
    creatorAccount: '@food_lover',
    product: '坚果礼盒',
    month: '2024-02',
    attributedGmv: 42000,
    netProfit: 8400,
    roi: 168,
    commission: 4200,
    rating: 'B',
  },
]

// Monthly GMV Trend Data
export const monthlyGmvTrend = [
  { month: '2023-07', gmv: 520000 },
  { month: '2023-08', gmv: 680000 },
  { month: '2023-09', gmv: 750000 },
  { month: '2023-10', gmv: 920000 },
  { month: '2023-11', gmv: 1150000 },
  { month: '2023-12', gmv: 1380000 },
  { month: '2024-01', gmv: 1250000 },
  { month: '2024-02', gmv: 1420000 },
]

// Top Creators by GMV
export const topCreatorsByGmv = [
  { account: '@fashion_style', gmv: 562000 },
  { account: '@beauty_queen', gmv: 458000 },
  { account: '@fitness_life', gmv: 325000 },
  { account: '@mom_daily', gmv: 289000 },
  { account: '@home_living', gmv: 198000 },
  { account: '@food_lover', gmv: 178000 },
  { account: '@outdoor_adv', gmv: 156000 },
  { account: '@tech_guru', gmv: 145000 },
  { account: '@pet_paradise', gmv: 89000 },
  { account: '@jewelry_box', gmv: 67000 },
]

// Helper functions
export function formatNumber(num: number | null | undefined): string {
  const n = num ?? 0
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M'
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K'
  }
  return n.toString()
}

export function formatCurrency(num: number | null | undefined): string {
  return '$' + (num ?? 0).toLocaleString()
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'S':
      return 'bg-status-danger text-status-danger-foreground'
    case 'A':
      return 'bg-status-warning text-status-warning-foreground'
    case 'B':
      return 'bg-status-info text-status-info-foreground'
    case 'C':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case '合作中':
      return 'bg-chart-1/20 text-chart-1 border-chart-1/30'
    case '已完成':
      return 'bg-status-success/20 text-status-success border-status-success/30'
    case '待跟进':
      return 'bg-status-warning/20 text-status-warning border-status-warning/30'
    case '已终止':
      return 'bg-muted text-muted-foreground border-muted'
    default:
      return 'bg-muted text-muted-foreground border-muted'
  }
}

export function getRoiColor(roi: number): string {
  if (roi >= 300) return 'text-status-success'
  if (roi >= 100) return 'text-status-warning'
  return 'text-status-danger'
}
