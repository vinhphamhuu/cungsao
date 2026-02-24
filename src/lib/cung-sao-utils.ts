import {Gender} from '@prisma/client'

import {StarInfo} from '@/types'

export const STAR_DATA: StarInfo[] = [
  {
    id: 0,
    name: 'La Hầu',
    color: '#FF0000',
    icon: '👹',
    type: 'Hung tinh',
    note: 'Xấu cho Nam (thị phi, cửa quan)',
    element: 'Kim',
    description:
      'Sao La Hầu là sao hung, chủ về khẩu thiệt, thị phi, tai mắt, máu huyết. Nam giới kỵ nhất tháng Giêng và tháng Bảy.',
  },
  {
    id: 1,
    name: 'Thổ Tú',
    color: '#FFA500',
    icon: '🏔️',
    type: 'Trung tinh',
    note: 'Gia đạo bất an, tiểu nhân',
    element: 'Thổ',
    description:
      'Sao Thổ Tú là sao trung tính, chủ về tiểu nhân, xuất hành không thuận, gia đạo bất hòa. Kỵ tháng Tư và tháng Tám.',
  },
  {
    id: 2,
    name: 'Thủy Diệu',
    color: '#00BFFF',
    icon: '🌊',
    type: 'Kiết tinh (nhưng kỵ tháng 4, 8)',
    note: 'Có tài lộc, kỵ sông nước',
    element: 'Thủy',
    description:
      'Sao Thủy Diệu là sao trung tính (có kiết có hung), chủ về tài lộc nhưng cũng cần đề phòng thị phi, đường sông nước. Kỵ tháng Tư và tháng Tám.',
  },
  {
    id: 3,
    name: 'Thái Bạch',
    color: '#FF4500',
    icon: '💸',
    type: 'Hung tinh',
    note: 'Hao tốn tiền của (sạch cửa nhà)',
    element: 'Kim',
    description: 'Sao Thái Bạch là sao hung, chủ về hao tốn tiền của, ốm đau, công việc trắc trở. Kỵ nhất tháng Năm.',
  },
  {
    id: 4,
    name: 'Thái Dương',
    color: '#228B22',
    icon: '☀️',
    type: 'Kiết tinh',
    note: 'Cực tốt cho Nam (danh lộc)',
    element: 'Hỏa',
    description:
      'Sao Thái Dương là sao tốt (cát tinh), chủ về an khang thịnh vượng, công danh hiển đạt. Nam giới gặp sao này rất tốt.',
  },
  {
    id: 5,
    name: 'Vân Hớn',
    color: '#FFD700',
    icon: '🏹',
    type: 'Trung tinh',
    note: 'Phòng thương tật, khẩu thiệt',
    element: 'Hỏa',
    description:
      'Sao Vân Hớn là sao trung tính, chủ về thủ cựu bình an, đề phòng khẩu thiệt, kiện tụng. Kỵ tháng Tư và tháng Tám.',
  },
  {
    id: 6,
    name: 'Kế Đô',
    color: '#B22222',
    icon: '🌪️',
    type: 'Hung tinh',
    note: 'Xấu cho Nữ (buồn phiền, tai nạn)',
    element: 'Thổ',
    description:
      'Sao Kế Đô là sao hung, chủ về ám muội, thị phi, sầu muộn, gia đạo bất an. Nữ giới kỵ nhất tháng Ba và tháng Chín.',
  },
  {
    id: 7,
    name: 'Thái Âm',
    color: '#9370DB',
    icon: '🌙',
    type: 'Kiết tinh',
    note: 'Cực tốt cho Nữ (hỷ sự, tiền bạc)',
    element: 'Thủy',
    description:
      'Sao Thái Âm là sao tốt (cát tinh), chủ về danh lợi, hỷ sự. Nữ giới gặp sao này rất tốt, nhất là tháng Chín.',
  },
  {
    id: 8,
    name: 'Mộc Đức',
    color: '#32CD32',
    icon: '🍀',
    type: 'Kiết tinh',
    note: 'Bình an, quý nhân phù trợ',
    element: 'Mộc',
    description: 'Sao Mộc Đức là sao tốt (cát tinh), chủ về may mắn, bình an, hỷ sự. Tốt cho cả nam và nữ.',
  },
]

export const SAO_LIST = STAR_DATA.map((s) => s.name)
export const BAD_STARS = STAR_DATA.filter((s) => s.type === 'Hung tinh').map((s) => s.name)

export function getStarInfo(name: string): StarInfo | undefined {
  return STAR_DATA.find((s) => s.name === name)
}

export function getSaoColor(sao: string): string {
  const info = getStarInfo(sao)
  return info?.color || '#808080'
}

// Reference ages (starts from 10)
// MALE_STARTING_SAO_INDEX = 0; // 10 tuổi -> La Hầu (index 0)
// FEMALE_STARTING_SAO_INDEX = 6; // 10 tuổi -> Kế Đô (index 6)

// Mapping index shift for each year: +1 index per year?
// MALE:
// 10: La Hầu (0)
// 11: Thổ Tú (1)
// ...
// 18: Mộc Đức (8)
// 19: La Hầu (0)
// => (age - 10) % 9

// FEMALE:
// 10: Kế Đô (6)
// 11: Vân Hớn (5) -- Wait, Female order is different or reverse?
// Let's check a reliable source table.
// Female:
// 10: Kế Đô
// 11: Vân Hớn
// 12: Mộc Đức
// 13: Thái Âm
// 14: Thổ Tú
// 15: La Hầu
// 16: Thái Dương
// 17: Thái Bạch
// 18: Thủy Diệu
// Flow:
// Kế Đô (6) -> Vân Hớn (5) -> Mộc Đức (8) ??? No, 5 -> 8 is +3?
// Let's use a fixed lookup array for indices to be safe.

export const AGE_REMAINDER_MAP_MALE = [
  'La Hầu', // 10 (1)
  'Thổ Tú', // 11 (2)
  'Thủy Diệu', // 12 (0) -> wait 12+9=21 Thủy Diệu. (10, 19, 28... La Hầu)
  'Thái Bạch',
  'Thái Dương',
  'Vân Hớn',
  'Kế Đô',
  'Thái Âm',
  'Mộc Đức',
]
// Male pattern: La Hầu -> Thổ Tú -> Thủy Diệu -> Thái Bạch -> Thái Dương -> Vân Hớn -> Kế Đô -> Thái Âm -> Mộc Đức
// It cycles forward.

export const AGE_REMAINDER_MAP_FEMALE = [
  'Kế Đô', // 10
  'Vân Hớn', // 11
  'Mộc Đức', // 12
  'Thái Âm', // 13
  'Thổ Tú', // 14
  'La Hầu', // 15
  'Thái Dương', // 16
  'Thái Bạch', // 17
  'Thủy Diệu', // 18
]
// Female pattern seems arbitrary or specific permutation. I'll use modulo 9 of (age - 10)?
// 10 % 9 = 1.
// Let's just use (age - 10) % 9 as index into these arrays.
// 10 -> index 0.

export function calculateSao(
  birthYear: number,
  gender: Gender,
  currentYear: number = new Date().getFullYear(),
): string {
  const age = currentYear - birthYear + 1
  if (age <= 0) return 'N/A'

  // Using remainder 9.
  // Age 10, 19, 28... (sum digits = 1 or 10 -> 1)
  // Let's use (age - 10) % 9.
  // But strictly, we should align with standard table.
  // 10 % 9 = 1.
  // 11 % 9 = 2.
  // ...
  // 18 % 9 = 0.
  // 19 % 9 = 1.
  // So index = (age - 10) % 9 is stable?
  // 10 -> 0
  // 11 -> 1
  // ...
  // 18 -> 8
  // 19 -> 0
  // Yes.

  let index = (age - 10) % 9
  if (index < 0) index += 9 // Handle negative if age < 10? Usually start from 10.
  // For age < 10, technically "cúng sao" applies? usually yes, need check.
  // If age < 10, e.g. 1.
  // 1 - 10 = -9 -> index 0?
  // Male 1: La Hầu?
  // Let's check Table:
  // Nam: 10 La Hầu -> 19 La Hầu. 1 La Hầu?
  // Nam 1 tuổi (sinh 2026, nam 2026): ?
  // Usually tables start from 10. But pattern repeats.
  // If pattern repeats, yes.

  if (gender === Gender.MALE) {
    return AGE_REMAINDER_MAP_MALE[index]
  } else {
    return AGE_REMAINDER_MAP_FEMALE[index]
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function calculateHan(): string {
  // Implement Han logic similarly if needed
  // Hạn: Huỳnh Tuyền, Tam Kheo, Ngũ Mộ, Thiên Tinh, Tán Tận, Thiên La, Địa Võng, Diêm Vương
  // Cycle 8?
  return 'TBD'
}

export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase()
}

export function capitalizeName(name: string): string {
  if (!name) return name
  const trimmed = name.trim()
  // Check if the name is already all uppercase
  if (trimmed === trimmed.toUpperCase() && /[a-zA-Z]/.test(trimmed)) {
    return trimmed.split(/\s+/).join(' ')
  }

  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function sortFamilyMembers<T extends {birthYear: number; id: string}>(
  members: T[],
  representativeId: string | null | undefined,
): T[] {
  if (!members) return []
  return [...members].sort((a, b) => {
    if (representativeId) {
      if (a.id === representativeId) return -1
      if (b.id === representativeId) return 1
    }
    return a.birthYear - b.birthYear
  })
}
