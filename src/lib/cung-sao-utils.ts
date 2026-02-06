import { Gender } from "@prisma/client"

export const SAO_LIST = [
  "La Hầu",    // 0
  "Thổ Tú",    // 1
  "Thủy Diệu", // 2
  "Thái Bạch", // 3
  "Thái Dương",// 4
  "Vân Hán",   // 5
  "Kế Đô",     // 6
  "Thái Âm",   // 7
  "Mộc Đức",   // 8
];

// La Hầu, Kế Đô, Thái Bạch are generally considered bad
// La Hầu, Kế Đô, Thái Bạch are generally considered bad
export const BAD_STARS = ["La Hầu", "Kế Đô", "Thái Bạch"];

export function getSaoColor(sao: string): string {
  if (BAD_STARS.includes(sao)) return "destructive"; // Red
  if (["Thái Dương", "Mộc Đức", "Thái Âm"].includes(sao)) return "default"; // Good - Black/Primary
  if (["Thái Dương", "Mộc Đức", "Thái Âm"].includes(sao)) return "default"; // Good - Black/Primary
  return "secondary"; // Neutral - Gray
}

export const SAO_DESCRIPTIONS: Record<string, string> = {
  "La Hầu": "Sao La Hầu là sao hung, chủ về khẩu thiệt, thị phi, tai mắt, máu huyết. Nam giới kỵ nhất tháng Giêng và tháng Bảy.",
  "Kế Đô": "Sao Kế Đô là sao hung, chủ về ám muội, thị phi, sầu muộn, gia đạo bất an. Nữ giới kỵ nhất tháng Ba và tháng Chín.",
  "Thái Bạch": "Sao Thái Bạch là sao hung, chủ về hao tốn tiền của, ốm đau, công việc trắc trở. Kỵ nhất tháng Năm.",
  "Thái Dương": "Sao Thái Dương là sao tốt (cát tinh), chủ về an khang thịnh vượng, công danh hiển đạt. Nam giới gặp sao này rất tốt.",
  "Thái Âm": "Sao Thái Âm là sao tốt (cát tinh), chủ về danh lợi, hỷ sự. Nữ giới gặp sao này rất tốt, nhất là tháng Chín.",
  "Mộc Đức": "Sao Mộc Đức là sao tốt (cát tinh), chủ về may mắn, bình an, hỷ sự. Tốt cho cả nam và nữ.",
  "Vân Hán": "Sao Vân Hán là sao trung tính, chủ về thủ cựu bình an, đề phòng khẩu thiệt, kiện tụng. Kỵ tháng Tư và tháng Tám.",
  "Thổ Tú": "Sao Thổ Tú là sao trung tính, chủ về tiểu nhân, xuất hành không thuận, gia đạo bất hòa. Kỵ tháng Tư và tháng Tám.",
  "Thủy Diệu": "Sao Thủy Diệu là sao trung tính (có kiết có hung), chủ về tài lộc nhưng cũng cần đề phòng thị phi, đường sông nước. Kỵ tháng Tư và tháng Tám.",
};

// Reference ages (starts from 10)
const MALE_STARTING_SAO_INDEX = 0; // 10 tuổi -> La Hầu (index 0)
const FEMALE_STARTING_SAO_INDEX = 6; // 10 tuổi -> Kế Đô (index 6)

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
// 11: Vân Hán (5) -- Wait, Female order is different or reverse?
// Let's check a reliable source table.
// Female:
// 10: Kế Đô
// 11: Vân Hán
// 12: Mộc Đức
// 13: Thái Âm
// 14: Thổ Tú
// 15: La Hầu
// 16: Thái Dương
// 17: Thái Bạch
// 18: Thủy Diệu
// Flow: 
// Kế Đô (6) -> Vân Hán (5) -> Mộc Đức (8) ??? No, 5 -> 8 is +3?
// Let's use a fixed lookup array for indices to be safe.

const AGE_REMAINDER_MAP_MALE = [
  "La Hầu",    // 10 (1)
  "Thổ Tú",    // 11 (2)
  "Thủy Diệu", // 12 (0) -> wait 12+9=21 Thủy Diệu. (10, 19, 28... La Hầu)
  "Thái Bạch",
  "Thái Dương",
  "Vân Hán",
  "Kế Đô",
  "Thái Âm",
  "Mộc Đức",
];
// Male pattern: La Hầu -> Thổ Tú -> Thủy Diệu -> Thái Bạch -> Thái Dương -> Vân Hán -> Kế Đô -> Thái Âm -> Mộc Đức
// It cycles forward.

const AGE_REMAINDER_MAP_FEMALE = [
  "Kế Đô",    // 10
  "Vân Hán",  // 11
  "Mộc Đức",  // 12
  "Thái Âm",  // 13
  "Thổ Tú",   // 14
  "La Hầu",   // 15
  "Thái Dương",// 16
  "Thái Bạch", // 17
  "Thủy Diệu", // 18
];
// Female pattern seems arbitrary or specific permutation. I'll use modulo 9 of (age - 10)?
// 10 % 9 = 1.
// Let's just use (age - 10) % 9 as index into these arrays.
// 10 -> index 0.

export function calculateSao(birthYear: number, gender: Gender, currentYear: number = new Date().getFullYear()): string {
  const age = currentYear - birthYear + 1;
  if (age <= 0) return "N/A";

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

  let index = (age - 10) % 9;
  if (index < 0) index += 9; // Handle negative if age < 10? Usually start from 10.
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
    return AGE_REMAINDER_MAP_MALE[index];
  } else {
    return AGE_REMAINDER_MAP_FEMALE[index];
  }
}

export function calculateHan(birthYear: number, gender: Gender, currentYear: number = new Date().getFullYear()): string {
  const age = currentYear - birthYear + 1;
  // Implement Han logic similarly if needed
  // Hạn: Huỳnh Tuyền, Tam Kheo, Ngũ Mộ, Thiên Tinh, Tán Tận, Thiên La, Địa Võng, Diêm Vương
  // Cycle 8?
  return "TBD";
}
