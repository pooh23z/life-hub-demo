// Vercel Serverless Function: /api/send-line.js
// Handles:
// 1. LINE Official Account Webhook (2-way AI Chat: Food Photo Scanner, Calorie Calculator, Expense Digital Slip)
// 2. Direct LINE Broadcast & Vercel Daily Cron Reports

const https = require("https");

const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN || "";
const SALES_CSV_URL = process.env.SALES_CSV_URL || "";
const COST_CSV_URL = process.env.COST_CSV_URL || "";
const SYNC_ROOM_CODE = process.env.SYNC_ROOM_CODE || "DEMO-2026";
const FIREBASE_BASE_URL = `https://lifehub-7420d-default-rtdb.asia-southeast1.firebasedatabase.app/rooms/${SYNC_ROOM_CODE}.json`;

// =========================================================================
// 🥗 THAI CALORIE KNOWLEDGE BASE (ฐานข้อมูลแคลอรี่อาหารไทยยอดนิยม)
// =========================================================================
const THAI_CALORIE_DATABASE = [
    // ข้าว & อาหารจานเดียว
    { keywords: ["กะเพราหมูกรอบ", "กะเพรากรอบ"], name: "ข้าวกะเพราหมูกรอบ", cal: 680, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กะเพราหมูสับ", "กะเพราหมู"], name: "ข้าวกะเพราหมูสับ", cal: 580, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กะเพราไก่"], name: "ข้าวกะเพราไก่", cal: 550, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กะเพราเนื้อ"], name: "ข้าวกะเพราเนื้อ", cal: 600, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กะเพราทะเล", "กะเพรากุ้ง", "กะเพราปลาหมึก"], name: "ข้าวกะเพราทะเล", cal: 520, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กะเพรา"], name: "ข้าวกะเพรา", cal: 580, cat: "🍔 อาหาร & เครื่องดื่ม" },
    
    { keywords: ["ข้าวมันไก่ทอด"], name: "ข้าวมันไก่ทอด", cal: 690, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวมันไก่ผสม", "ข้าวมันไก่ทูโทน"], name: "ข้าวมันไก่ผสม", cal: 650, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวมันไก่ต้ม", "ข้าวมันไก่"], name: "ข้าวมันไก่", cal: 590, cat: "🍔 อาหาร & เครื่องดื่ม" },
    
    { keywords: ["ข้าวขาหมู"], name: "ข้าวขาหมู", cal: 690, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวหมูกรอบ"], name: "ข้าวหมูกรอบ", cal: 650, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวหมูแดง"], name: "ข้าวหมูแดง", cal: 540, cat: "🍔 อาหาร & เครื่องดื่ม" },
    
    { keywords: ["ข้าวผัดกุ้ง", "ข้าวผัดปู", "ข้าวผัดทะเล"], name: "ข้าวผัดทะเล", cal: 560, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวผัดหมู", "ข้าวผัดไก่", "ข้าวผัด"], name: "ข้าวผัด", cal: 550, cat: "🍔 อาหาร & เครื่องดื่ม" },
    
    { keywords: ["ข้าวไข่เจียวหมูสับ", "ข้าวไข่เจียวทรงเครื่อง"], name: "ข้าวไข่เจียวหมูสับ", cal: 580, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวไข่เจียว"], name: "ข้าวไข่เจียว", cal: 490, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวไข่ข้น"], name: "ข้าวไข่ข้น", cal: 450, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวไข่ต้ม"], name: "ข้าวไข่ต้ม", cal: 320, cat: "🍔 อาหาร & เครื่องดื่ม" },
    
    { keywords: ["ข้าวหมูทอด", "ข้าวไก่ทอด"], name: "ข้าวหมู/ไก่ทอด", cal: 620, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวแกงกะหรี่"], name: "ข้าวแกงกะหรี่", cal: 720, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวหน้าเป็ด"], name: "ข้าวหน้าเป็ด", cal: 520, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวคลุกกะปิ"], name: "ข้าวคลุกกะปิ", cal: 580, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวเหนียวหมูปิ้ง", "หมูปิ้ง"], name: "ข้าวเหนียวหมูปิ้ง", cal: 380, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวเหนียวไก่ทอด"], name: "ข้าวเหนียวไก่ทอด", cal: 480, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ข้าวต้มกุ้ง", "ข้าวต้มปลา", "ข้าวต้มหมู", "ข้าวต้ม"], name: "ข้าวต้ม", cal: 320, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["โจ๊กหมูใส่ไข่", "โจ๊กหมูไข่"], name: "โจ๊กหมูใส่ไข่", cal: 350, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["โจ๊กหมู", "โจ๊ก"], name: "โจ๊กหมู", cal: 260, cat: "🍔 อาหาร & เครื่องดื่ม" },

    // ก๋วยเตี๋ยว & เส้น
    { keywords: ["ผัดไทยกุ้งสด", "ผัดไทย"], name: "ผัดไทย", cal: 590, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ผัดซีอิ๊วหมู", "ผัดซีอิ๊ว"], name: "ผัดซีอิ๊ว", cal: 600, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ราดหน้าหมู", "ราดหน้า"], name: "ราดหน้า", cal: 420, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ผัดขี้เมา"], name: "ก๋วยเตี๋ยวผัดขี้เมา", cal: 540, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ก๋วยเตี๋ยวเรือ", "ก๋วยเตี๋ยวน้ำตก", "เตี๋ยวเรือ"], name: "ก๋วยเตี๋ยวน้ำตก", cal: 420, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ก๋วยเตี๋ยวต้มยำ", "เตี๋ยวต้มยำ"], name: "ก๋วยเตี๋ยวต้มยำ", cal: 450, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ก๋วยเตี๋ยวน้ำใส", "ก๋วยเตี๋ยวไก่", "ก๋วยเตี๋ยว"], name: "ก๋วยเตี๋ยว", cal: 360, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["บะหมี่เกี๊ยวหมูแดง", "บะหมี่เกี๊ยว", "เกี๊ยวน้ำ"], name: "บะหมี่เกี๊ยว", cal: 420, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สปาเก็ตตี้คาโบนาร่า", "คาโบนาร่า"], name: "สปาเก็ตตี้คาโบนาร่า", cal: 650, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สปาเก็ตตี้ขี้เมา", "สปาเก็ตตี้"], name: "สปาเก็ตตี้", cal: 480, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["มาม่าต้มยำ", "มาม่าผัด", "มาม่า"], name: "บะหมี่กึ่งสำเร็จรูป/มาม่า", cal: 320, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สุกี้แห้ง"], name: "สุกี้แห้ง", cal: 450, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สุกี้น้ำ"], name: "สุกี้น้ำ", cal: 300, cat: "🍔 อาหาร & เครื่องดื่ม" },

    // ส้มตำ & อีสาน & สุขภาพ
    { keywords: ["ส้มตำปูปลาร้า", "ส้มตำไทย", "ส้มตำ"], name: "ส้มตำ", cal: 120, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ส้มตำคอหมูย่าง", "ส้มตำปู"], name: "ส้มตำ", cal: 180, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ลาบหมู", "ลาบไก่", "ลาบ"], name: "ลาบ", cal: 160, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["น้ำตกหมู", "น้ำตกเนื้อ", "น้ำตก"], name: "น้ำตก", cal: 180, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["คอหมูย่าง"], name: "คอหมูย่าง", cal: 350, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ไก่ย่าง"], name: "ไก่ย่าง (1 น่อง/สะโพก)", cal: 220, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ไก่ทอด"], name: "ไก่ทอด (1 ชิ้น)", cal: 320, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ต้มแซ่บ"], name: "ต้มแซ่บกระดูกหมู", cal: 180, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ต้มยำกุ้ง", "ต้มยำ"], name: "ต้มยำกุ้ง", cal: 160, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["แกงจืดเต้าหู้หมูสับ", "แกงจืด"], name: "แกงจืดเต้าหู้หมูสับ", cal: 150, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สลัดผักอกไก่", "สลัดอกไก่"], name: "สลัดอกไก่", cal: 220, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["สลัดผัก", "สลัด"], name: "สลัดผัก", cal: 140, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["อกไก่ต้ม", "อกไก่"], name: "อกไก่", cal: 160, cat: "🍔 อาหาร & เครื่องดื่ม" },

    // เครื่องดื่ม
    { keywords: ["อเมริกาโน่ไม่หวาน", "อเมริกาโน่เย็น", "อเมริกาโน่"], name: "อเมริกาโน่", cal: 15, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ลาเต้เย็น", "ลาเต้"], name: "ลาเต้", cal: 180, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["คาปูชิโน่เย็น", "คาปูชิโน่"], name: "คาปูชิโน่", cal: 170, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["มอคค่าเย็น", "มอคค่า"], name: "มอคค่า", cal: 260, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["กาแฟโบราณ", "กาแฟเย็น", "กาแฟ"], name: "กาแฟเย็น", cal: 220, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ชานมไข่มุก", "ชาไข่มุก"], name: "ชานมไข่มุก", cal: 360, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ชาเขียวมัทฉะ", "ชาเขียวเย็น", "ชาเขียว"], name: "ชาเขียวเย็น", cal: 220, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ชาไทย", "ชาเย็น", "ชาดำเย็น"], name: "ชาเย็น/ชาไทย", cal: 230, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ชามะนาว"], name: "ชามะนาว", cal: 150, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["น้ำส้มปั่น", "น้ำผลไม้ปั่น", "สมูทตี้"], name: "น้ำผลไม้ปั่น", cal: 200, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["น้ำอัดลม", "โค้ก", "เป๊ปซี่", "สไปรท์"], name: "น้ำอัดลม", cal: 140, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ช็อกโกแลตเย็น", "โกโก้เย็น", "โกโก้"], name: "โกโก้เย็น", cal: 260, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["นมสดปั่น", "นมสดเย็น", "นมสด"], name: "นมสด", cal: 200, cat: "🍔 อาหาร & เครื่องดื่ม" },

    // ฟาสต์ฟู้ด & ของทานเล่น & บุฟเฟต์
    { keywords: ["เบอร์เกอร์", "แฮมเบอร์เกอร์"], name: "แฮมเบอร์เกอร์", cal: 480, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["พิซซ่า"], name: "พิซซ่า (1 ชิ้น)", cal: 280, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["เฟรนช์ฟรายส์", "เฟรนฟราย"], name: "เฟรนช์ฟรายส์", cal: 340, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["นักเก็ต"], name: "นักเก็ตไก่ (6 ชิ้น)", cal: 270, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["โดนัท"], name: "โดนัท", cal: 250, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ชาบู", "สุกี้บุฟเฟต์", "หมูกระทะ"], name: "หมูกระทะ/ชาบู", cal: 850, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["แซลมอน", "ซูชิ"], name: "ซูชิ/แซลมอน", cal: 350, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["ขนมปังปิ้ง", "ขนมปัง"], name: "ขนมปัง", cal: 180, cat: "🍔 อาหาร & เครื่องดื่ม" },
    { keywords: ["เค้ก"], name: "เค้ก (1 ชิ้น)", cal: 380, cat: "🍔 อาหาร & เครื่องดื่ม" }
];

function calculateFoodCalories(foodText) {
    const lower = String(foodText || "").toLowerCase().trim();
    let baseCal = 0;
    let matchedName = foodText;
    let isFood = false;

    // Search Database
    for (const item of THAI_CALORIE_DATABASE) {
        if (item.keywords.some(k => lower.includes(k))) {
            baseCal = item.cal;
            matchedName = item.name;
            isFood = true;
            break;
        }
    }

    // Heuristic Fallback Estimation
    if (!isFood) {
        if (lower.includes("ข้าว") || lower.includes("อาหาร") || lower.includes("มื้อ")) {
            baseCal = 520; isFood = true;
        } else if (lower.includes("ผัด")) {
            baseCal = 500; isFood = true;
        } else if (lower.includes("ทอด")) {
            baseCal = 480; isFood = true;
        } else if (lower.includes("ต้ม") || lower.includes("แกง")) {
            baseCal = 280; isFood = true;
        } else if (lower.includes("ชา") || lower.includes("กาแฟ") || lower.includes("นม") || lower.includes("น้ำ")) {
            baseCal = 180; isFood = true;
        } else if (lower.includes("ขนม") || lower.includes("เค้ก") || lower.includes("ปัง")) {
            baseCal = 300; isFood = true;
        }
    }

    // Addons & Modifiers
    let addonNote = "";
    if (lower.includes("ไข่ดาว")) {
        baseCal += 120;
        addonNote = "(รวมไข่ดาว +120 kcal)";
    } else if (lower.includes("ไข่เจียว") && !lower.includes("ข้าวไข่เจียว")) {
        baseCal += 200;
        addonNote = "(รวมไข่เจียว +200 kcal)";
    } else if (lower.includes("ไข่ต้ม") && !lower.includes("ข้าวไข่ต้ม")) {
        baseCal += 75;
        addonNote = "(รวมไข่ต้ม +75 kcal)";
    }

    if (lower.includes("พิเศษ")) {
        baseCal += 150;
        addonNote += " (พิเศษ +150 kcal)";
    }

    if (lower.includes("หวานน้อย")) {
        baseCal = Math.max(10, baseCal - 50);
        addonNote += " (หวานน้อย -50 kcal)";
    } else if (lower.includes("ไม่หวาน") || lower.includes("หวาน 0%")) {
        baseCal = Math.max(5, baseCal - 80);
        addonNote += " (ไม่หวาน -80 kcal)";
    }

    return {
        isFood,
        calories: baseCal,
        name: matchedName,
        addonNote: addonNote.trim()
    };
}

// 🎯 Smart Food, Income & Expense Extractor from free-text
function extractFoodAndAmount(text) {
    if (!text) return null;
    const clean = String(text).trim();

    // Guard against calendar/task expressions like "ไม่ว่างวันที่ 5"
    if (/(?:ไม่ว่างวันที่|ว่างวันที่|ลงปฏิทิน|ตารางงาน|นัดประชุม|งานค้าง|งานที่ส่ง)/i.test(clean)) {
        return null;
    }

    // 1. Check if user is asking for daily summary (e.g. "วันนี้กินไปกี่แคล")
    const summaryKeywords = ["วันนี้", "เมื่อวาน", "กินไป", "ทานไป", "สรุป", "เช็ก", "รวม"];
    const calOnlyMatch = clean.toLowerCase().match(/^([ก-๙a-zA-Z\s]+?)\s*(?:กี่แคลอรี่|กี่แคล|แคลอรี่เท่าไหร่|แคลเท่าไหร่|มีกี่แคล)\??$/i);
    if (calOnlyMatch) {
        const queryFood = calOnlyMatch[1].trim();
        if (summaryKeywords.some(k => queryFood.includes(k))) {
            return null;
        }
        return { isQueryOnly: true, food: queryFood };
    }

    const isIncome = /(?:รายรับ|เงินเข้า|รับเงิน|โอนเข้า|ได้เงิน|เงินเดือน|โบนัส|ได้ค่าขนม|เติมเงินเข้า)/i.test(clean);

    // 2. Flexible Thai/THB amount matcher (50, 1,200, 50.-, ฿50, 50฿, 50 บาท, 50 บ.)
    const numRegex = /(?:฿\s*(\d+(?:,\d{3})*(?:\.\d+)?))|(?:(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:บาท|฿|\.-|บ\.|บ\b))|(?:(?:ราคา|ไป|จำนวน|จ่าย|รับ|เข้า|เป็นเงิน)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)(?!\s*(?:วัน|เดือน|ปี|นาที|ชั่วโมง|ชม\.|แคล|kcal|%|:|\.\d)))/i;
    const numMatch = clean.match(numRegex);
    if (!numMatch) return null;

    const rawNum = (numMatch[1] || numMatch[2] || numMatch[3] || "").replace(/,/g, "");
    const amount = parseFloat(rawNum);
    if (!amount || amount <= 0 || amount > 10000000) return null;

    const remaining = clean
        .replace(numMatch[0], " ")
        .replace(/(?:฿\s*\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:,\d{3})*(?:\.\d+)?\s*(?:บาท|฿|\.-|บ\.|บ\b))/gi, " ")
        .replace(/(?:ช่วย|ให้หน่อย|คำนวณแคลอรี่|คำนวณแคล|คำนวณเงิน|คำนวณ|หักเงิน|หัก|ลบเงิน|ลบ|คิดเงิน|คิด|เพิ่ม|บันทึก|แคลอรี่|แคล|กี่แคล|ลบลงในรายรับรายจ่าย|ลงในรายรับรายจ่าย|บันทึกลงในรายรับรายจ่าย|ในรายรับรายจ่าย|รายรับรายจ่าย|รายจ่าย|รายรับ|เงินเข้า|รับเงิน|แล้วก็|และ|นะ|ค่ะ|ครับ|ดิฉัน|ฉัน|ผม|กิน|ทาน|ซื้อ|จ่าย|ค่า)/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    let foodTitle = remaining;
    if (!foodTitle || foodTitle.length < 2) {
        if (isIncome) {
            foodTitle = "รายรับส่วนตัว";
        } else {
            const prefixMatch = clean.match(/([ก-๙a-zA-Z\s]+?)\s*\d+/);
            if (prefixMatch) {
                foodTitle = prefixMatch[1].replace(/(?:กิน|ทาน|ซื้อ|จ่าย|ค่า|ช่วย|หักเงิน|หัก|ลบ|บันทึก|คำนวณ)/gi, "").trim();
            }
        }
    }

    if (!foodTitle || foodTitle.length < 2) return null;

    return {
        isQueryOnly: false,
        isIncome: isIncome,
        food: foodTitle,
        amount: amount
    };
}

function detectGeneralCategory(title) {
    const t = String(title || "").toLowerCase();
    if (t.includes("หอ") || t.includes("ห้อง") || t.includes("คอนโด") || t.includes("บ้าน") || t.includes("ค่าเช่า")) return "🏠 ค่าที่พัก & ค่าห้อง";
    if (t.includes("รถ") || t.includes("น้ำมัน") || t.includes("แท็กซี่") || t.includes("วิน") || t.includes("bts") || t.includes("mrt") || t.includes("ตั๋ว")) return "🚗 ค่าเดินทาง & ค่ารถ";
    if (t.includes("ไฟ") || t.includes("เน็ต") || t.includes("บิล") || t.includes("โทรศัพท์") || t.includes("มือถือ")) return "💡 บิล & ค่าสาธารณูปโภค";
    if (t.includes("เสื้อ") || t.includes("ช้อป") || t.includes("กระเป๋า") || t.includes("รองเท้า") || t.includes("ของใช้")) return "🛍️ ช้อปปิ้ง & ของใช้";
    if (t.includes("ตัดผม") || t.includes("ยา") || t.includes("หมอ") || t.includes("คลินิก")) return "💊 สุขภาพ & รักษาพยาบาล";
    return "📦 อื่นๆ";
}

// =========================================================================
// 🌐 HTTP & FIREBASE HELPERS (WITH STRICT SERVERLESS TIMEOUTS)
// =========================================================================
function requestHttpsWithTimeout(targetUrl, options = {}, bodyStr = null, timeoutMs = 4500) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(targetUrl);
        const reqOpts = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || "GET",
            headers: Object.assign({}, options.headers || {})
        };
        if (bodyStr !== null && reqOpts.headers["Content-Length"] === undefined) {
            reqOpts.headers["Content-Length"] = Buffer.byteLength(bodyStr);
        }

        let settled = false;
        const req = https.request(reqOpts, (res) => {
            const chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => {
                if (settled) return;
                settled = true;
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat(chunks).toString("utf8")
                });
            });
        });

        req.setTimeout(timeoutMs, () => {
            if (settled) return;
            settled = true;
            req.destroy(new Error(`HTTPS timeout after ${timeoutMs}ms: ${urlObj.hostname}`));
            reject(new Error(`HTTPS timeout after ${timeoutMs}ms`));
        });

        req.on("error", (err) => {
            if (settled) return;
            settled = true;
            reject(err);
        });

        if (bodyStr !== null) req.write(bodyStr);
        req.end();
    });
}

async function fetchUrl(url, timeoutMs = 4500) {
    const res = await requestHttpsWithTimeout(url, { method: "GET" }, null, timeoutMs);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeoutMs);
    }
    if (res.statusCode >= 400) {
        throw new Error(`HTTP ${res.statusCode} fetching ${url}`);
    }
    return res.body;
}

async function patchFirebaseData(url, data, timeoutMs = 4500) {
    const payload = JSON.stringify(data);
    const res = await requestHttpsWithTimeout(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
    }, payload, timeoutMs);
    if (res.statusCode >= 200 && res.statusCode < 300) {
        try { return JSON.parse(res.body); } catch (e) { return res.body; }
    }
    throw new Error(`Firebase HTTP ${res.statusCode}: ${res.body}`);
}

function formatMoney(n) {
    return Number(n || 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(v => v !== null && v !== undefined);
    if (typeof value === "object") return Object.values(value).filter(v => v !== null && v !== undefined);
    return [];
}

function splitCsv(row) {
    const parts = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (c === '"') inQuotes = !inQuotes;
        else if (c === "," && !inQuotes) {
            parts.push(cur.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
            cur = "";
        } else cur += c;
    }
    parts.push(cur.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
    return parts;
}

// =========================================================================
// 💬 LINE API: REPLY, PUSH, BROADCAST & FAILSAFE WRAPPER
// =========================================================================
function formatLineMessages(messages) {
    const arr = Array.isArray(messages) ? messages : [messages];
    return arr.slice(0, 5).map(m => {
        if (typeof m === "string") return { type: "text", text: m.trim() || "-" };
        if (m && m.type === "flex" && m.altText) {
            return Object.assign({}, m, { altText: String(m.altText).slice(0, 390) });
        }
        return m;
    });
}

async function sendLineReply(replyToken, messages, token) {
    const activeToken = token || LINE_TOKEN;
    const payload = JSON.stringify({
        replyToken,
        messages: formatLineMessages(messages)
    });
    const res = await requestHttpsWithTimeout("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
        }
    }, payload, 4000);
    if (res.statusCode !== 200) {
        throw new Error(`LINE Reply HTTP ${res.statusCode}: ${res.body}`);
    }
    return res.body;
}

async function sendLinePush(toUserId, messages, token) {
    const activeToken = token || LINE_TOKEN;
    const payload = JSON.stringify({
        to: toUserId,
        messages: formatLineMessages(messages)
    });
    const res = await requestHttpsWithTimeout("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
        }
    }, payload, 4000);
    if (res.statusCode !== 200) {
        throw new Error(`LINE Push HTTP ${res.statusCode}: ${res.body}`);
    }
    return res.body;
}

async function safeReplyOrPush(event, messages, token) {
    const hasValidReplyToken = event && event.replyToken && !/^0+$/.test(event.replyToken);
    if (hasValidReplyToken) {
        try {
            return await sendLineReply(event.replyToken, messages, token);
        } catch (rErr) {
            console.error("sendLineReply error (falling back to Push):", rErr.message);
        }
    }
    const userId = event && event.source && (event.source.userId || event.source.groupId || event.source.roomId);
    if (userId) {
        try {
            return await sendLinePush(userId, messages, token);
        } catch (pErr) {
            console.error("sendLinePush fallback error:", pErr.message);
        }
    }
    return null;
}

async function sendLineBroadcast(messages, token) {
    const activeToken = token || LINE_TOKEN;
    const payload = JSON.stringify({ messages: formatLineMessages(messages) });
    const res = await requestHttpsWithTimeout("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
        }
    }, payload, 4500);
    if (res.statusCode !== 200) {
        throw new Error(`LINE Broadcast HTTP ${res.statusCode}: ${res.body}`);
    }
    return res.body;
}

// =========================================================================
// 📸 LINE CONTENT DOWNLOAD & GEMINI VISION + NLP ENGINE
// =========================================================================
function downloadLineContent(messageId, token) {
    return new Promise((resolve, reject) => {
        const activeToken = token || LINE_TOKEN;
        let settled = false;

        function getUrl(targetUrl, maxRedirects = 3) {
            if (maxRedirects < 0) {
                settled = true;
                return reject(new Error("Too many redirects downloading LINE content"));
            }
            const req = https.get(targetUrl, {
                headers: { "Authorization": `Bearer ${activeToken}` }
            }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    res.resume();
                    return getUrl(res.headers.location, maxRedirects - 1);
                }
                if (res.statusCode !== 200) {
                    res.resume();
                    settled = true;
                    return reject(new Error(`Failed to download LINE content: HTTP ${res.statusCode}`));
                }
                const contentType = String(res.headers["content-type"] || "image/jpeg").split(";")[0].trim();
                const chunks = [];
                res.on("data", chunk => chunks.push(chunk));
                res.on("end", () => {
                    if (settled) return;
                    settled = true;
                    resolve({ buffer: Buffer.concat(chunks), mimeType: contentType });
                });
            });
            req.setTimeout(5000, () => {
                if (settled) return;
                settled = true;
                req.destroy(new Error("LINE content download timeout"));
                reject(new Error("LINE content download timeout"));
            });
            req.on("error", (err) => {
                if (settled) return;
                settled = true;
                reject(err);
            });
        }

        getUrl(`https://api-data.line.me/v2/bot/message/${messageId}/content`);
    });
}

function parseCleanJson(rawText) {
    if (!rawText) return null;
    const stripped = String(rawText)
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
    try {
        return JSON.parse(stripped);
    } catch (e) {
        const match = stripped.match(/\{[\s\S]*\}/);
        if (match) {
            try { return JSON.parse(match[0]); } catch (e2) { return null; }
        }
        return null;
    }
}

async function callGeminiJson(parts, timeoutMs = 5000) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return null;

    const candidates = [
        { model: "gemini-flash-latest", genConfig: { temperature: 0.1, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } }, timeout: timeoutMs },
        { model: "gemini-flash-lite-latest", genConfig: { temperature: 0.1, responseMimeType: "application/json" }, timeout: 3000 }
    ];

    for (const c of candidates) {
        try {
            const payload = JSON.stringify({
                contents: [{ parts }],
                generationConfig: c.genConfig
            });
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${c.model}:generateContent?key=${geminiKey}`;
            const res = await requestHttpsWithTimeout(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            }, payload, c.timeout);
            if (res.statusCode !== 200) {
                console.warn(`Gemini ${c.model} HTTP ${res.statusCode}:`, res.body.substring(0, 150));
                continue;
            }
            const parsed = JSON.parse(res.body);
            const text = parsed && parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content &&
                parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0] && parsed.candidates[0].content.parts[0].text;
            const jsonObj = parseCleanJson(text);
            if (jsonObj) return jsonObj;
        } catch (err) {
            console.warn(`Gemini ${c.model} error:`, err.message);
        }
    }
    return null;
}

async function analyzeFoodImageWithGemini(imageBuffer, mimeType = "image/jpeg", userHint = "") {
    const base64Data = imageBuffer.toString("base64");
    const safeMime = /^image\/(jpeg|jpg|png|webp|gif|heic)$/i.test(mimeType) ? mimeType : "image/jpeg";
    const prompt = `คุณคือระบบ AI สแกนอาหารและสลิปธนาคารไทยสำหรับ "น้องธิดา"
กรุณาวิเคราะห์รูปภาพนี้อย่างแม่นยำ${userHint ? ` (ข้อความผู้ใช้: "${userHint}")` : ""}:
1. หากเป็นภาพอาหาร จานข้าว ขนม หรือเครื่องดื่ม:
   - type: "food"
   - foodName: ชื่อเมนูภาษาไทยให้ชัดเจน (เช่น "ข้าวกะเพราหมูสับไข่ดาว", "ไก่ทอด", "ชานมไข่มุก")
   - calories: พลังงานโดยประมาณ (ตัวเลขเต็ม kcal เช่น 650)
   - price: ราคาที่มองเห็นในภาพ/เมนู หรือจากข้อความผู้ใช้ (ถ้าไม่เห็นใส่ 0)
   - category: "🍔 อาหาร & เครื่องดื่ม"
   - description: คำอธิบายส่วนประกอบสั้นๆ 1 บรรทัด
2. หากเป็นสลิปโอนเงินธนาคารไทย (KBank, SCB, Bangkok Bank, Krungthai, Krungsri, TrueMoney) หรือใบเสร็จร้านค้า/7-11/ร้านอาหาร:
   - type: "slip"
   - slipType: "income" ถ้าระบุชัดว่าเป็นยอดรับเข้า หรือ "expense" หากเป็นการโอนจ่าย/ชำระสินค้า
   - price: ยอดเงินรวมสุทธิในสลิป (ตัวเลขทศนิยมหรือจำนวนเต็ม ห้ามใส่ 0 ถ้ามองเห็นยอด)
   - foodName: ชื่อร้านค้า / ผู้รับโอน / สรุปรายการในใบเสร็จสั้นๆ
   - calories: ถ้าเป็นใบเสร็จอาหารให้ประมาณ kcal ถ้าไม่ใช่ใส่ 0
   - category: หมวดหมู่ที่เหมาะสม (เช่น "🍔 อาหาร & เครื่องดื่ม" หรือ "🧾 บิล/ค่าใช้จ่าย")
   - description: รายละเอียดสั้นๆ เช่น "โอนเงิน KBank ไปยัง ..."
3. หากเป็นภาพเอกสาร/ภาพอื่นๆ:
   - type: "other"
   - description: สรุปใจความสำคัญจากภาพเป็นภาษาไทยสุภาพแบบน้องธิดา

ตอบกลับเป็น JSON รูปแบบนี้เท่านั้น:
{
  "type": "food",
  "slipType": "expense",
  "foodName": "ชื่อเมนูหรือร้านค้า",
  "calories": 550,
  "price": 0,
  "category": "🍔 อาหาร & เครื่องดื่ม",
  "description": "คำอธิบายสั้นๆ"
}`;

    return callGeminiJson([
        { inlineData: { mimeType: safeMime, data: base64Data } },
        { text: prompt }
    ], 5200);
}

async function askGeminiLineAssistant(userText, context = {}) {
    const prompt = `คุณคือ "น้องธิดา" เลขา AI ส่วนตัวของคุณเจ้าของร้าน พูดจาสุภาพ อบอุ่น ฉลาด กระชับ (แทนตัวเองว่า "ธิดา" หรือ "น้องธิดา")
ข้อมูลปัจจุบันของผู้ใช้:
- วันที่: ${context.todayStr || "วันนี้"}
- เงินคงเหลือส่วนตัว: ฿${formatMoney(context.netBalance || 0)}
- แคลอรี่อาหารวันนี้: ${context.todayCalories || 0} / 2,000 kcal
- งานค้างในระบบ: ${context.pendingTasks || 0} รายการ

ข้อความผู้ใช้: "${userText}"

หากผู้ใช้กำลังบอกรายจ่ายหรือรายรับที่ระบบคำสั้นจับไม่ทัน (เช่น "เพิ่งจ่ายค่ากาแฟให้ลูกค้าไป 120", "วันนี้ได้ค่าขนมมา 500") ให้ระบุ action เป็น "finance" พร้อม financeType ("expense"|"income"), title, amount, calories (ถ้าเป็นอาหาร)
หากผู้ใช้ขอลบ/ยกเลิกรายการล่าสุด ให้ระบุ action เป็น "undo"
มิฉะนั้นระบุ action เป็น "chat" และตอบคำถามหรือแนะนำอย่างเป็นธรรมชาติ (ไม่เกิน 4 บรรทัด)

ตอบกลับเป็น JSON เท่านั้น:
{
  "action": "chat",
  "financeType": "expense",
  "title": "",
  "amount": 0,
  "calories": 0,
  "replyText": "ข้อความตอบกลับภาษาไทย"
}`;

    return callGeminiJson([{ text: prompt }], 4800);
}

// =========================================================================
// 🧾 LINE FLEX MESSAGE BUILDERS (DIGITAL SLIP & RECEIPT AESTHETIC)
// =========================================================================
function buildSlipQuickReply() {
    return {
        items: [
            { type: "action", action: { type: "message", label: "↩️ ลบรายการเมื่อกี้", text: "ลบรายการล่าสุด" } },
            { type: "action", action: { type: "message", label: "🥗 แคลอรี่วันนี้", text: "วันนี้กินไปกี่แคล" } },
            { type: "action", action: { type: "message", label: "💵 เงินคงเหลือ", text: "เงินเหลือเท่าไหร่" } }
        ]
    };
}

function buildFoodSlipFlexMessage({ title, amount, calories, balance, dateStr, totalCalories, remainingCal, isFood = true, category = "🍔 อาหาร & เครื่องดื่ม", txType = "expense" }) {
    const isIncome = txType === "income";
    const safeTitle = String(title || "รายการส่วนตัว").trim() || "รายการส่วนตัว";
    const safeCat = String(category || (isIncome ? "💰 รายรับส่วนตัว" : "📦 อื่นๆ")).trim() || "📦 อื่นๆ";
    const safeDate = String(dateStr || "วันนี้").trim() || "วันนี้";
    const percent = Math.min(100, Math.round(((totalCalories || 0) / 2000) * 100));
    const safeRemaining = Math.max(0, remainingCal !== undefined ? remainingCal : (2000 - (totalCalories || 0)));

    const bubbleContents = [
        {
            type: "box",
            layout: "horizontal",
            contents: [
                { type: "text", text: "หมวดหมู่", size: "xs", color: "#94a3b8" },
                { type: "text", text: safeCat, size: "xs", color: "#e2e8f0", align: "end", weight: "bold" }
            ]
        },
        {
            type: "box",
            layout: "horizontal",
            contents: [
                { type: "text", text: "วันที่บันทึก", size: "xs", color: "#94a3b8" },
                { type: "text", text: safeDate, size: "xs", color: "#e2e8f0", align: "end" }
            ]
        },
        {
            type: "box",
            layout: "horizontal",
            contents: [
                { type: "text", text: "💵 เงินส่วนตัวคงเหลือ", size: "xs", color: "#94a3b8" },
                { type: "text", text: `฿${formatMoney(balance)}`, size: "sm", color: "#38bdf8", align: "end", weight: "bold" }
            ]
        }
    ];

    if (!isIncome && isFood && calories) {
        const progressTrackContents = percent > 0
            ? [{
                type: "box",
                layout: "vertical",
                backgroundColor: (totalCalories || 0) > 2000 ? "#ef4444" : "#10b981",
                width: `${percent}%`,
                height: "6px",
                cornerRadius: "3px",
                contents: [{ type: "filler" }]
            }]
            : [{ type: "filler" }];

        bubbleContents.push(
            { type: "separator", margin: "md", color: "#2d2d3f" },
            {
                type: "box",
                layout: "vertical",
                margin: "md",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "🥗 แคลอรี่วันนี้", size: "xs", color: "#94a3b8" },
                            { type: "text", text: `${(totalCalories || 0).toLocaleString()} / 2,000 kcal`, size: "xs", color: "#f59e0b", align: "end", weight: "bold" }
                        ]
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#2d2d3f",
                        height: "6px",
                        cornerRadius: "3px",
                        margin: "sm",
                        contents: progressTrackContents
                    },
                    {
                        type: "text",
                        text: `ทานได้อีก ~${safeRemaining.toLocaleString()} kcal`,
                        size: "xxs",
                        color: "#64748b",
                        align: "end",
                        margin: "xs"
                    }
                ]
            }
        );
    }

    return {
        type: "flex",
        altText: isIncome
            ? `💰 สลิปเงินเข้า: ${safeTitle} (+฿${formatMoney(amount)})`
            : `🧾 สลิปตัดเงิน: ${safeTitle} (-฿${formatMoney(amount)})${calories ? ` 🔥 ${calories} kcal` : ""}`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#1e1e2d",
                paddingAll: "20px",
                paddingBottom: "15px",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: isIncome ? "💰 DIGITAL INCOME SLIP" : "🧾 DIGITAL EXPENSE SLIP",
                                weight: "bold",
                                color: isIncome ? "#10b981" : "#38bdf8",
                                size: "xxs"
                            },
                            {
                                type: "text",
                                text: isIncome ? "✅ รับเงินเข้าแล้ว" : "✅ หักลบเงินแล้ว",
                                weight: "bold",
                                color: "#10b981",
                                size: "xxs",
                                align: "end"
                            }
                        ]
                    },
                    {
                        type: "text",
                        text: safeTitle,
                        weight: "bold",
                        size: "xl",
                        color: "#ffffff",
                        margin: "md",
                        wrap: true
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        margin: "sm",
                        contents: [
                            {
                                type: "text",
                                text: `${isIncome ? "+" : "-"}฿${formatMoney(amount)}`,
                                weight: "bold",
                                size: "xxl",
                                color: isIncome ? "#10b981" : "#fb7185",
                                flex: 0
                            },
                            (!isIncome && calories) ? {
                                type: "box",
                                layout: "horizontal",
                                backgroundColor: "#3a2818",
                                cornerRadius: "6px",
                                paddingStart: "8px",
                                paddingEnd: "8px",
                                paddingTop: "4px",
                                paddingBottom: "4px",
                                margin: "md",
                                flex: 0,
                                contents: [
                                    {
                                        type: "text",
                                        text: `🔥 ~${calories} kcal`,
                                        color: "#f59e0b",
                                        weight: "bold",
                                        size: "xs"
                                    }
                                ]
                            } : { type: "filler" }
                        ]
                    }
                ]
            },
            body: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "20px",
                spacing: "md",
                contents: bubbleContents
            },
            footer: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "15px",
                paddingTop: "0px",
                contents: [
                    {
                        type: "text",
                        text: "🔒 บันทึกเฉพาะบัญชีส่วนตัว ไม่ปะปนกับรายได้ร้านค้า",
                        size: "xxs",
                        color: "#64748b",
                        align: "center",
                        margin: "sm"
                    }
                ]
            }
        },
        quickReply: buildSlipQuickReply()
    };
}

function buildPhotoScanFlexMessage({ foodName, calories, description, dateStr }) {
    return {
        type: "flex",
        altText: `📸 ตรวจพบเมนูอาหาร: ${foodName} (~${calories} kcal)`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#1e1e2d",
                paddingAll: "20px",
                paddingBottom: "15px",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "📸 AI FOOD SCANNER", weight: "bold", color: "#f59e0b", size: "xxs" },
                            { type: "text", text: "✨ ตรวจจับเมนูสำเร็จ", weight: "bold", color: "#10b981", size: "xxs", align: "end" }
                        ]
                    },
                    {
                        type: "text",
                        text: foodName,
                        weight: "bold",
                        size: "xl",
                        color: "#ffffff",
                        margin: "md",
                        wrap: true
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        margin: "sm",
                        contents: [
                            {
                                type: "box",
                                layout: "horizontal",
                                backgroundColor: "#3a2818",
                                cornerRadius: "6px",
                                paddingStart: "10px",
                                paddingEnd: "10px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                flex: 0,
                                contents: [
                                    { type: "text", text: `🔥 ประมาณ ~${calories} kcal`, color: "#f59e0b", weight: "bold", size: "sm" }
                                ]
                            }
                        ]
                    }
                ]
            },
            body: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "20px",
                spacing: "md",
                contents: [
                    {
                        type: "text",
                        text: description || "ระบบตรวจพบและคำนวณพลังงานเรียบร้อยแล้วค่ะ",
                        size: "xs",
                        color: "#94a3b8",
                        wrap: true
                    },
                    { type: "separator", margin: "md", color: "#2d2d3f" },
                    {
                        type: "text",
                        text: "💰 กรุณาพิมพ์ราคา (เช่น 50 หรือ 50 บาท) หรือกดเลือกปุ่มด้านล่าง เพื่อหักเงินทันทีค่ะ:",
                        size: "xs",
                        color: "#38bdf8",
                        weight: "bold",
                        wrap: true,
                        margin: "sm"
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "15px",
                paddingTop: "0px",
                contents: [
                    {
                        type: "text",
                        text: "💡 ตอบกลับด้วยตัวเลขราคา เช่น \"50\", \"60\", \"75 บาท\"",
                        size: "xxs",
                        color: "#64748b",
                        align: "center",
                        margin: "sm"
                    }
                ]
            }
        },
        quickReply: {
            items: [
                { type: "action", action: { type: "message", label: "฿40", text: "40" } },
                { type: "action", action: { type: "message", label: "฿50", text: "50" } },
                { type: "action", action: { type: "message", label: "฿60", text: "60" } },
                { type: "action", action: { type: "message", label: "฿70", text: "70" } },
                { type: "action", action: { type: "message", label: "฿80", text: "80" } },
                { type: "action", action: { type: "message", label: "฿100", text: "100" } }
            ]
        }
    };
}

function buildDailyCaloriesFlexMessage({ dateStr, totalCalories, remainingCal, mealCount, meals, totalCost }) {
    const percent = Math.min(100, Math.round((totalCalories / 2000) * 100));

    const mealItemsBoxes = meals.slice(0, 5).map(m => ({
        type: "box",
        layout: "horizontal",
        margin: "sm",
        contents: [
            { type: "text", text: `• ${m.title}`, size: "xs", color: "#cbd5e1", flex: 3, wrap: true },
            { type: "text", text: `${m.calories || 450} kcal`, size: "xs", color: "#f59e0b", flex: 1, align: "end", weight: "bold" },
            { type: "text", text: `฿${formatMoney(m.amount)}`, size: "xs", color: "#fb7185", flex: 1, align: "end" }
        ]
    }));

    if (meals.length === 0) {
        mealItemsBoxes.push({
            type: "text",
            text: "ยังไม่มีมื้ออาหารที่บันทึกวันนี้",
            size: "xs",
            color: "#64748b",
            align: "center"
        });
    }

    return {
        type: "flex",
        altText: `🥗 สรุปแคลอรี่วันนี้: ${totalCalories.toLocaleString()} / 2,000 kcal (${mealCount} มื้อ)`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#1e1e2d",
                paddingAll: "20px",
                paddingBottom: "15px",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "🥗 DAILY CALORIE REPORT", weight: "bold", color: "#10b981", size: "xxs" },
                            { type: "text", text: dateStr, size: "xxs", color: "#94a3b8", align: "end" }
                        ]
                    },
                    {
                        type: "text",
                        text: `${totalCalories.toLocaleString()} / 2,000 kcal`,
                        weight: "bold",
                        size: "xxl",
                        color: "#f59e0b",
                        margin: "md"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#2d2d3f",
                        height: "8px",
                        cornerRadius: "4px",
                        margin: "sm",
                        contents: percent > 0 ? [
                            {
                                type: "box",
                                layout: "vertical",
                                backgroundColor: totalCalories > 2000 ? "#ef4444" : "#10b981",
                                width: `${percent}%`,
                                height: "8px",
                                cornerRadius: "4px",
                                contents: [{ type: "filler" }]
                            }
                        ] : [{ type: "filler" }]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        margin: "xs",
                        contents: [
                            { type: "text", text: `ทานไปแล้ว ${percent}%`, size: "xxs", color: "#94a3b8" },
                            { type: "text", text: `เหลือทานได้อีก ~${remainingCal.toLocaleString()} kcal`, size: "xxs", color: "#10b981", align: "end", weight: "bold" }
                        ]
                    }
                ]
            },
            body: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "20px",
                spacing: "sm",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: `📋 มื้ออาหารวันนี้ (${mealCount} มื้อ)`, size: "xs", color: "#38bdf8", weight: "bold" },
                            { type: "text", text: `รวม ฿${formatMoney(totalCost)}`, size: "xs", color: "#fb7185", align: "end", weight: "bold" }
                        ]
                    },
                    { type: "separator", margin: "sm", color: "#2d2d3f" },
                    ...mealItemsBoxes
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "15px",
                paddingTop: "0px",
                contents: [
                    {
                        type: "text",
                        text: "💡 ถ่ายรูปหรือพิมพ์มื้อถัดไปได้ทันที เช่น \"ข้าวมันไก่ 50\"",
                        size: "xxs",
                        color: "#64748b",
                        align: "center",
                        margin: "sm"
                    }
                ]
            }
        }
    };
}

function buildPersonalBalanceFlexMessage({ balance, income, expense, dateStr }) {
    return {
        type: "flex",
        altText: `💵 สรุปเงินคงเหลือส่วนตัว: ฿${formatMoney(balance)}`,
        contents: {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#1e1e2d",
                paddingAll: "20px",
                paddingBottom: "15px",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "💵 PERSONAL WALLET", weight: "bold", color: "#38bdf8", size: "xxs" },
                            { type: "text", text: dateStr, size: "xxs", color: "#94a3b8", align: "end" }
                        ]
                    },
                    {
                        type: "text",
                        text: `฿${formatMoney(balance)}`,
                        weight: "bold",
                        size: "xxl",
                        color: "#38bdf8",
                        margin: "md"
                    },
                    {
                        type: "text",
                        text: "เงินคงเหลือสุทธิ (บัญชีส่วนตัว)",
                        size: "xs",
                        color: "#94a3b8"
                    }
                ]
            },
            body: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#161622",
                paddingAll: "20px",
                spacing: "md",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "➕ รายรับสะสม", size: "xs", color: "#94a3b8" },
                            { type: "text", text: `+฿${formatMoney(income)}`, size: "sm", color: "#10b981", align: "end", weight: "bold" }
                        ]
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            { type: "text", text: "➖ รายจ่ายสะสม", size: "xs", color: "#94a3b8" },
                            { type: "text", text: `-฿${formatMoney(expense)}`, size: "sm", color: "#fb7185", align: "end", weight: "bold" }
                        ]
                    },
                    { type: "separator", margin: "md", color: "#2d2d3f" },
                    {
                        type: "text",
                        text: "🔒 แยกบัญชี 100% ไม่ปะปนกับรายได้ร้านค้าหรือ Google Sheets ค่ะ",
                        size: "xxs",
                        color: "#64748b",
                        align: "center",
                        margin: "sm"
                    }
                ]
            }
        }
    };
}

// =========================================================================
// 🛍️ REPORT BUILDERS (SHOP & PERSONAL — TEXT + SLEEK FLEX CARDS)
// =========================================================================
async function fetchShopReportData() {
    let salesCsv = "";
    let costCsv = "";

    if (SALES_CSV_URL && COST_CSV_URL) {
        try {
            [salesCsv, costCsv] = await Promise.all([fetchUrl(SALES_CSV_URL), fetchUrl(COST_CSV_URL)]);
        } catch (e) {
            console.warn("Could not fetch remote CSV, using sample demo fallback:", e.message);
        }
    }

    let totalSales = 0;
    let salesCount = 0;
    const salesItems = [];

    const sLines = salesCsv ? salesCsv.split("\n").filter(l => l.trim()) : [];
    if (sLines.length > 1) {
        const sHeaders = splitCsv(sLines[0]);
        const sMap = {};
        sHeaders.forEach((h, i) => sMap[h] = i);

        sLines.slice(1).forEach(line => {
            const parts = splitCsv(line.trim().replace(/\r/g, ""));
            const revIdx = sMap["ยอดเงิน"] !== undefined ? sMap["ยอดเงิน"] : (sMap["รายได้รวม"] !== undefined ? sMap["รายได้รวม"] : 2);
            const qtyIdx = sMap["จำนวนไม้"] !== undefined ? sMap["จำนวนไม้"] : (sMap["จำนวนที่ขาย"] !== undefined ? sMap["จำนวนที่ขาย"] : 1);
            const itemIdx = sMap["รายการ"] !== undefined ? sMap["รายการ"] : (sMap["ชื่อรายการ"] !== undefined ? sMap["ชื่อรายการ"] : 0);

            const revenue = parseFloat(String(parts[revIdx] || "").replace(/,/g, "")) || 0;
            const qty = parseInt(String(parts[qtyIdx] || "").replace(/,/g, ""), 10) || 0;
            const name = parts[itemIdx] || parts[0] || "ออเดอร์";

            if (revenue > 0) {
                totalSales += revenue;
                salesCount++;
                salesItems.push({ name, qty, revenue });
            }
        });
    }

    let totalCosts = 0;
    let costCount = 0;
    const cLines = costCsv ? costCsv.split("\n").filter(l => l.trim()) : [];
    if (cLines.length > 1) {
        const cHeaders = splitCsv(cLines[0]);
        const cMap = {};
        cHeaders.forEach((h, i) => cMap[h] = i);

        cLines.slice(1).forEach(line => {
            const parts = splitCsv(line.trim().replace(/\r/g, ""));
            const totalIdx = cMap["รวม"] !== undefined ? cMap["รวม"] : (cMap["ยอดรวม (บาท)"] !== undefined ? cMap["ยอดรวม (บาท)"] : 1);
            const cost = parseFloat(String(parts[totalIdx] || "").replace(/,/g, "")) || 0;
            if (cost > 0) {
                totalCosts += cost;
                costCount++;
            }
        });
    }

    // Showcase fallback when no live Google Sheets are connected
    if (salesItems.length === 0) {
        const demoSales = [
            { name: "หมูสามชั้น", qty: 190, revenue: 2470 },
            { name: "มันฝรั่ง", qty: 390, revenue: 2340 },
            { name: "เต้าหู้ชีส", qty: 135, revenue: 1755 },
            { name: "ปลาดอลลี่", qty: 142, revenue: 1420 },
            { name: "ปูอัด", qty: 125, revenue: 1250 }
        ];
        demoSales.forEach(x => {
            totalSales += x.revenue;
            salesCount++;
            salesItems.push(x);
        });
        totalCosts = 4500;
        costCount = 5;
    }

    const netProfit = totalSales - totalCosts;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : "0.0";
    salesItems.sort((a, b) => b.revenue - a.revenue);
    const dateStr = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

    return {
        totalSales,
        salesCount,
        totalCosts,
        costCount,
        netProfit,
        profitMargin,
        top5Items: salesItems.slice(0, 5),
        dateStr
    };
}

async function fetchPersonalReportData(preloadedRoot = null) {
    let root = preloadedRoot || {};
    if (!preloadedRoot) {
        try {
            const raw = await fetchUrl(FIREBASE_BASE_URL);
            root = JSON.parse(raw) || {};
        } catch (e) {
            console.error("Firebase read error in report:", e);
        }
    }

    const finance = toArray(root.finance);
    const tasks = toArray(root.tasks);
    const calendar = (root.calendar && typeof root.calendar === "object" && !Array.isArray(root.calendar)) ? root.calendar : {};
    const savings = toArray(root.savings);

    const personalIncome = finance.filter(x => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalExpense = finance.filter(x => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalBalance = personalIncome - personalExpense;

    const catExpense = {};
    finance.filter(x => x.type === "expense").forEach(x => {
        const c = x.category || "อื่นๆ";
        catExpense[c] = (catExpense[c] || 0) + Number(x.amount || 0);
    });
    const topCats = Object.entries(catExpense).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const thaiDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayStr = thaiDate.toISOString().split("T")[0];

    const todayCal = calendar[todayStr];
    let statusStr = "🟢 วันนี้เป็นวันว่าง (ไม่มีนัดหมาย)";
    if (todayCal && (todayCal.status === "busy" || todayCal.status === "partial")) {
        statusStr = todayCal.status === "busy"
            ? `🔴 วันไม่ว่าง (${todayCal.title || "ติดธุระ"})`
            : `🟡 ว่างบางช่วง (${todayCal.title || "มีนัดหมาย"})`;
    }

    const futureDates = Object.keys(calendar).filter(d => d > todayStr && calendar[d] && (calendar[d].status === "busy" || calendar[d].status === "partial")).sort();
    const busyDays = futureDates.slice(0, 3).map(d => {
        const item = calendar[d];
        const icon = item.status === "busy" ? "🔴" : "🟡";
        return `${icon} ${d}: ${item.title || "ติดธุระ"}`;
    });

    const todayMeals = finance.filter(x => x.type === "expense" && x.date === todayStr && (x.calories || (x.category && x.category.includes("อาหาร"))));
    const todayCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
    const todayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== "completed");
    const pendingTasks = tasks.filter(t => t.status !== "completed");
    const dateStr = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

    return {
        personalIncome,
        personalExpense,
        personalBalance,
        topCats,
        savings,
        statusStr,
        busyDays,
        todayMeals,
        todayCalories,
        todayTasks,
        pendingTasks,
        dateStr
    };
}

function buildShopReportBubble(d) {
    const topRows = d.top5Items.length > 0
        ? d.top5Items.map(x => ({
            type: "box",
            layout: "horizontal",
            margin: "xs",
            contents: [
                { type: "text", text: `• ${x.name} (${x.qty})`, size: "xs", color: "#cbd5e1", flex: 3, wrap: true },
                { type: "text", text: `฿${formatMoney(x.revenue)}`, size: "xs", color: "#10b981", align: "end", weight: "bold", flex: 2 }
            ]
        }))
        : [{ type: "text", text: "ยังไม่มีรายการขาย", size: "xs", color: "#64748b" }];

    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#1e1e2d",
            paddingAll: "20px",
            paddingBottom: "14px",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: "🛍️ SHOP SUMMARY", weight: "bold", color: "#f59e0b", size: "xxs" },
                        { type: "text", text: `Margin ${d.profitMargin}%`, weight: "bold", color: "#10b981", size: "xxs", align: "end" }
                    ]
                },
                { type: "text", text: `฿${formatMoney(d.netProfit)}`, weight: "bold", size: "xxl", color: "#10b981", margin: "md" },
                { type: "text", text: "กำไรสุทธิร้านค้า (Google Sheets)", size: "xs", color: "#94a3b8" }
            ]
        },
        body: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#161622",
            paddingAll: "20px",
            spacing: "sm",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: `💰 ยอดขาย (${d.salesCount} รายการ)`, size: "xs", color: "#94a3b8" },
                        { type: "text", text: `฿${formatMoney(d.totalSales)}`, size: "sm", color: "#38bdf8", align: "end", weight: "bold" }
                    ]
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: `📦 ต้นทุน (${d.costCount} รายการ)`, size: "xs", color: "#94a3b8" },
                        { type: "text", text: `฿${formatMoney(d.totalCosts)}`, size: "sm", color: "#fb7185", align: "end", weight: "bold" }
                    ]
                },
                { type: "separator", margin: "md", color: "#2d2d3f" },
                { type: "text", text: "🏆 5 สินค้าขายดีที่สุด", size: "xs", color: "#f59e0b", weight: "bold", margin: "sm" },
                ...topRows
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#161622",
            paddingAll: "14px",
            paddingTop: "0px",
            contents: [
                { type: "text", text: "📊 แยกบัญชีร้านค้าจากรายจ่ายส่วนตัว 100%", size: "xxs", color: "#64748b", align: "center" }
            ]
        }
    };
}

function buildPersonalReportBubble(p) {
    const catRows = p.topCats.length > 0
        ? p.topCats.map(([c, amt]) => ({
            type: "box",
            layout: "horizontal",
            margin: "xs",
            contents: [
                { type: "text", text: String(c || "อื่นๆ"), size: "xs", color: "#cbd5e1", flex: 3, wrap: true },
                { type: "text", text: `-฿${formatMoney(amt)}`, size: "xs", color: "#fb7185", align: "end", flex: 2 }
            ]
        }))
        : [{ type: "text", text: "ไม่มีรายจ่ายในหมวดหมู่", size: "xs", color: "#64748b" }];

    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#1e1e2d",
            paddingAll: "20px",
            paddingBottom: "14px",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: "👤 PERSONAL LIFEHUB", weight: "bold", color: "#38bdf8", size: "xxs" },
                        { type: "text", text: `ห้อง ${SYNC_ROOM_CODE}`, size: "xxs", color: "#10b981", align: "end", weight: "bold" }
                    ]
                },
                { type: "text", text: `฿${formatMoney(p.personalBalance)}`, weight: "bold", size: "xxl", color: "#38bdf8", margin: "md" },
                { type: "text", text: `รายรับ +฿${formatMoney(p.personalIncome)} | รายจ่าย -฿${formatMoney(p.personalExpense)}`, size: "xxs", color: "#94a3b8", wrap: true }
            ]
        },
        body: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#161622",
            paddingAll: "20px",
            spacing: "sm",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: "🥗 แคลอรี่วันนี้", size: "xs", color: "#94a3b8" },
                        { type: "text", text: `${p.todayCalories.toLocaleString()} / 2,000 kcal (${p.todayMeals.length} มื้อ)`, size: "xs", color: "#f59e0b", align: "end", weight: "bold" }
                    ]
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        { type: "text", text: "📋 งานค้างทั้งหมด", size: "xs", color: "#94a3b8" },
                        { type: "text", text: `วันนี้ ${p.todayTasks.length} / รวม ${p.pendingTasks.length} งาน`, size: "xs", color: "#e2e8f0", align: "end", weight: "bold" }
                    ]
                },
                { type: "text", text: p.statusStr, size: "xs", color: "#cbd5e1", wrap: true, margin: "xs" },
                { type: "separator", margin: "md", color: "#2d2d3f" },
                { type: "text", text: "🏷️ รายจ่ายตามหมวดหมู่", size: "xs", color: "#38bdf8", weight: "bold", margin: "sm" },
                ...catRows
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#161622",
            paddingAll: "14px",
            paddingTop: "0px",
            contents: [
                { type: "text", text: p.busyDays.length > 0 ? `📅 ถัดไป: ${p.busyDays[0]}` : "✅ คิวว่างพร้อมใช้งาน Cloud Sync 100%", size: "xxs", color: "#64748b", align: "center", wrap: true }
            ]
        }
    };
}

async function buildShopReportFlexMessage() {
    const d = await fetchShopReportData();
    return {
        type: "flex",
        altText: `📊 ยอดขายร้าน: ฿${formatMoney(d.totalSales)} | กำไรสุทธิ: ฿${formatMoney(d.netProfit)}`,
        contents: buildShopReportBubble(d)
    };
}

async function buildPersonalReportFlexMessage(preloadedRoot = null) {
    const p = await fetchPersonalReportData(preloadedRoot);
    return {
        type: "flex",
        altText: `👤 ส่วนตัว: คงเหลือ ฿${formatMoney(p.personalBalance)} | 🔥 ${p.todayCalories} kcal | 📋 ${p.pendingTasks.length} งาน`,
        contents: buildPersonalReportBubble(p)
    };
}

async function buildCombinedReportFlexMessage(preloadedRoot = null) {
    const [d, p] = await Promise.all([fetchShopReportData(), fetchPersonalReportData(preloadedRoot)]);
    return {
        type: "flex",
        altText: `🌟 สรุปรวม: ส่วนตัว ฿${formatMoney(p.personalBalance)} | ร้านค้ากำไร ฿${formatMoney(d.netProfit)}`,
        contents: {
            type: "carousel",
            contents: [buildPersonalReportBubble(p), buildShopReportBubble(d)]
        }
    };
}

// =========================================================================
// 🤖 LINE WEBHOOK INCOMING EVENT HANDLER
// =========================================================================
function isDuplicateWebhookEvent(event, root) {
    const msgId = event && event.message && event.message.id;
    if (!msgId) return false;
    if (event.deliveryContext && event.deliveryContext.isRedelivery && root && root.lastEventMsgId === msgId) {
        return true;
    }
    if (!global.__processedLineMsgIds) {
        global.__processedLineMsgIds = new Set();
    }
    if (global.__processedLineMsgIds.has(msgId) || (root && root.lastEventMsgId === msgId)) {
        return true;
    }
    global.__processedLineMsgIds.add(msgId);
    if (global.__processedLineMsgIds.size > 120) {
        const first = global.__processedLineMsgIds.values().next().value;
        global.__processedLineMsgIds.delete(first);
    }
    return false;
}

async function recordFinanceAndReply({ event, finance, todayISO, dateFormatted, title, amount, calories, category, txType = "expense", note, token, clearPending = false }) {
    const isIncome = txType === "income";
    const newItem = {
        id: "fin-" + Date.now(),
        date: todayISO,
        type: isIncome ? "income" : "expense",
        category: category || (isIncome ? "💰 รายรับส่วนตัว" : "📦 อื่นๆ"),
        title: title,
        amount: Number(amount),
        calories: (!isIncome && calories) ? Number(calories) : null,
        note: note || `LINE บันทึก: ${title}`
    };
    finance.unshift(newItem);

    const patchPayload = {
        finance: finance,
        updatedAt: Date.now()
    };
    if (clearPending) patchPayload.pendingMealScan = null;
    if (event && event.message && event.message.id) patchPayload.lastEventMsgId = event.message.id;

    await patchFirebaseData(FIREBASE_BASE_URL, patchPayload);

    const personalIncome = finance.filter(x => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalExpense = finance.filter(x => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalBalance = personalIncome - personalExpense;

    const todayMeals = finance.filter(x => x.type === "expense" && x.date === todayISO && (x.calories || (x.category && x.category.includes("อาหาร"))));
    const totalCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
    const remainingCal = Math.max(0, 2000 - totalCalories);

    const flexMsg = buildFoodSlipFlexMessage({
        title: title,
        amount: amount,
        calories: (!isIncome && calories) ? Number(calories) : null,
        balance: personalBalance,
        dateStr: dateFormatted,
        totalCalories: totalCalories,
        remainingCal: remainingCal,
        isFood: !isIncome && !!calories,
        category: newItem.category,
        txType: newItem.type
    });

    await safeReplyOrPush(event, [flexMsg], token);
}

async function handleUndoFinanceCommand(event, finance, token) {
    if (!finance || finance.length === 0) {
        await safeReplyOrPush(event, ["📭 ยังไม่มีรายการรายรับ-รายจ่ายให้ลบในขณะนี้ค่ะ"], token);
        return;
    }
    const removed = finance.shift();
    const now = Date.now();
    const patchPayload = {
        finance: finance,
        updatedAt: now
    };
    if (finance.length === 0) {
        patchPayload.financeResetAt = now;
    }
    if (event && event.message && event.message.id) patchPayload.lastEventMsgId = event.message.id;
    await patchFirebaseData(FIREBASE_BASE_URL, patchPayload);

    const personalIncome = finance.filter(x => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalExpense = finance.filter(x => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
    const personalBalance = personalIncome - personalExpense;

    const msg = `↩️ ยกเลิกและลบรายการล่าสุดเรียบร้อยค่ะ!\n• รายการที่ลบ: ${removed.title} (${removed.type === "income" ? "+" : "-"}฿${formatMoney(removed.amount)})\n• 💵 เงินคงเหลือส่วนตัวตอนนี้: ฿${formatMoney(personalBalance)}`;
    await safeReplyOrPush(event, [msg], token);
}

async function handleLineIncomingMessage(event, token) {
    const thaiDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayISO = thaiDate.toISOString().split("T")[0];
    const dateFormatted = thaiDate.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });

    let root = {};
    try {
        const raw = await fetchUrl(FIREBASE_BASE_URL);
        root = JSON.parse(raw) || {};
    } catch (e) {
        console.error("Firebase read error in LINE webhook:", e);
    }

    if (isDuplicateWebhookEvent(event, root)) {
        console.log("Skipping duplicate LINE webhook event:", event.message.id);
        return;
    }

    const finance = toArray(root.finance);

    // 📸 CASE A: Incoming Image (Food photo, Bank Slip, or Receipt)
    if (event.message && event.message.type === "image") {
        try {
            const { buffer: imageBuffer, mimeType } = await downloadLineContent(event.message.id, token);
            const vision = await analyzeFoodImageWithGemini(imageBuffer, mimeType);

            if (vision && vision.type === "food") {
                const detectedName = vision.foodName || "เมนูอาหาร";
                const detectedCal = Number(vision.calories) || 550;
                const detectedPrice = Number(vision.price) || 0;
                const desc = vision.description || "";

                if (detectedPrice > 0) {
                    await recordFinanceAndReply({
                        event,
                        finance,
                        todayISO,
                        dateFormatted,
                        title: detectedName,
                        amount: detectedPrice,
                        calories: detectedCal,
                        category: "🍔 อาหาร & เครื่องดื่ม",
                        txType: "expense",
                        note: `LINE ภาพถ่าย AI: ${detectedName} (~${detectedCal} kcal)`,
                        token,
                        clearPending: true
                    });
                    return;
                }

                await patchFirebaseData(FIREBASE_BASE_URL, {
                    pendingMealScan: {
                        foodName: detectedName,
                        calories: detectedCal,
                        category: "🍔 อาหาร & เครื่องดื่ม",
                        txType: "expense",
                        time: Date.now()
                    },
                    updatedAt: Date.now()
                });

                const flexScan = buildPhotoScanFlexMessage({
                    foodName: detectedName,
                    calories: detectedCal,
                    description: desc,
                    dateStr: dateFormatted
                });
                await safeReplyOrPush(event, [flexScan], token);
                return;
            }

            if (vision && (vision.type === "slip" || vision.type === "receipt")) {
                const price = Number(vision.price) || 0;
                const title = vision.foodName || vision.description || "สลิปค่าใช้จ่าย";
                const calVal = Number(vision.calories) || 0;
                const slipType = vision.slipType === "income" ? "income" : "expense";
                const cat = vision.category || (calVal > 0 ? "🍔 อาหาร & เครื่องดื่ม" : (slipType === "income" ? "💰 รายรับส่วนตัว" : "🧾 บิล/ค่าใช้จ่าย"));

                if (price > 0) {
                    await recordFinanceAndReply({
                        event,
                        finance,
                        todayISO,
                        dateFormatted,
                        title,
                        amount: price,
                        calories: calVal > 0 ? calVal : null,
                        category: cat,
                        txType: slipType,
                        note: `LINE สลิป AI: ${vision.description || title}`,
                        token,
                        clearPending: true
                    });
                    return;
                }
            }

            if (vision && vision.type === "other" && vision.description) {
                await safeReplyOrPush(event, [`📸 ${vision.description}\n\n💡 หากต้องการบันทึกเป็นรายรับ-รายจ่าย สามารถพิมพ์ชื่อรายการและยอดเงินได้เลยนะคะ เช่น "กาแฟ 65"`], token);
                return;
            }

            const promptMsg = "📸 น้องธิดาได้รับรูปภาพเรียบร้อยแล้วค่ะ! หากเป็นรูปอาหารหรือสลิป คุณสามารถพิมพ์ชื่อเมนูพร้อมราคามาได้เลยนะคะ เช่น \"กะเพรา 50 บาท\" ธิดาจะช่วยคำนวณแคลอรี่และหักลบรายจ่ายให้อัตโนมัติค่ะ 😊";
            await safeReplyOrPush(event, [promptMsg], token);
        } catch (imgErr) {
            console.error("Error processing LINE image:", imgErr);
            const fallbackMsg = "📸 ได้รับรูปภาพแล้วค่ะ หากต้องการบันทึกด่วน สามารถพิมพ์ \"ชื่อเมนู ราคา\" เช่น \"ข้าวมันไก่ 50\" ได้เลยนะคะ 😊";
            await safeReplyOrPush(event, [fallbackMsg], token);
        }
        return;
    }

    // 💬 CASE B: Incoming Text Message
    const userText = (event.message && event.message.text ? event.message.text : "").trim();
    if (!userText) return;

    const lower = userText.toLowerCase();

    // 0. Undo last entry command
    if (/(?:ลบรายการล่าสุด|ยกเลิกรายการล่าสุด|ยกเลิกเมื่อกี้|ลบล่าสุด|ลบอันเมื่อกี้|ยกเลิกอันเมื่อกี้)/i.test(lower)) {
        await handleUndoFinanceCommand(event, finance, token);
        return;
    }

    // 1. Check if user is replying with a Price to a pending meal scan (within 15 mins)
    const pendingScan = root.pendingMealScan;
    const isPendingFresh = pendingScan && (Date.now() - (pendingScan.time || 0) < 15 * 60 * 1000);
    const parsedPriceMatch = userText.match(/^(?:฿\s*|บาท\s*|ราคา\s*)?(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:บาท|฿|\.-|บ\.?)?$/i);

    if (isPendingFresh && parsedPriceMatch && parsedPriceMatch[1]) {
        const priceAmount = parseFloat(parsedPriceMatch[1].replace(/,/g, ""));
        if (priceAmount > 0 && priceAmount < 1000000) {
            await recordFinanceAndReply({
                event,
                finance,
                todayISO,
                dateFormatted,
                title: pendingScan.foodName || "มื้ออาหาร",
                amount: priceAmount,
                calories: pendingScan.calories || 550,
                category: pendingScan.category || "🍔 อาหาร & เครื่องดื่ม",
                txType: pendingScan.txType || "expense",
                note: `LINE สแกนอาหาร: ${pendingScan.foodName} (~${pendingScan.calories || 550} kcal)`,
                token,
                clearPending: true
            });
            return;
        }
    }

    // 2. Check if user is logging Expense or Income via text (e.g. "กะเพรา 25 บาท", "ซื้อขนม 200", "รายรับ 500")
    const extracted = extractFoodAndAmount(userText);
    if (extracted && !extracted.isQueryOnly) {
        if (extracted.isIncome) {
            await recordFinanceAndReply({
                event,
                finance,
                todayISO,
                dateFormatted,
                title: extracted.food,
                amount: extracted.amount,
                calories: null,
                category: "💰 รายรับส่วนตัว",
                txType: "income",
                note: `LINE รายรับส่วนตัว: ${extracted.food}`,
                token
            });
            return;
        }

        const cal = calculateFoodCalories(extracted.food);
        const category = cal.isFood ? "🍔 อาหาร & เครื่องดื่ม" : detectGeneralCategory(extracted.food);
        const displayTitle = cal.isFood ? (cal.name || extracted.food) : extracted.food;

        await recordFinanceAndReply({
            event,
            finance,
            todayISO,
            dateFormatted,
            title: displayTitle,
            amount: extracted.amount,
            calories: cal.isFood ? cal.calories : null,
            category,
            txType: "expense",
            note: cal.isFood
                ? `LINE บันทึก: ${displayTitle} (~${cal.calories} kcal)`
                : `LINE บันทึก: ${displayTitle}`,
            token
        });
        return;
    }

    // 3. Calorie-only query (e.g. "กะเพรากี่แคล")
    if (extracted && extracted.isQueryOnly) {
        const cal = calculateFoodCalories(extracted.food);
        const promptMsg = `🍽️ 【ข้อมูลแคลอรี่】\n` +
            `• เมนู: ${cal.name || extracted.food}\n` +
            `• พลังงานประมาณ: ~${cal.calories} kcal 🔥 ${cal.addonNote}\n\n` +
            `💡 หากทานเมนูนี้ พิมพ์ราคาต่อท้ายได้เลยนะคะ เช่น "${cal.name || extracted.food} 45 บาท"`;
        await safeReplyOrPush(event, [promptMsg], token);
        return;
    }

    // 4. Today calories summary
    if (lower.includes("กินไปกี่แคล") || lower.includes("กี่แคล") || lower.includes("สรุปแคล") || lower.includes("แคลอรี่วันนี้")) {
        const todayMeals = finance.filter(x => x.type === "expense" && x.date === todayISO && (x.calories || (x.category && x.category.includes("อาหาร"))));
        const totalCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
        const totalMealCost = todayMeals.reduce((sum, m) => sum + Number(m.amount || 0), 0);
        const flexCal = buildDailyCaloriesFlexMessage({
            dateStr: dateFormatted,
            totalCalories,
            remainingCal: Math.max(0, 2000 - totalCalories),
            mealCount: todayMeals.length,
            meals: todayMeals,
            totalCost: totalMealCost
        });
        await safeReplyOrPush(event, [flexCal], token);
        return;
    }

    // 5. Personal balance check
    if (lower.includes("เงินเหลือ") || lower.includes("เช็กเงิน") || lower.includes("เงินคงเหลือ") || lower.includes("สรุปการเงิน")) {
        const personalIncome = finance.filter(x => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
        const personalExpense = finance.filter(x => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
        const flexWallet = buildPersonalBalanceFlexMessage({
            balance: personalIncome - personalExpense,
            income: personalIncome,
            expense: personalExpense,
            dateStr: dateFormatted
        });
        await safeReplyOrPush(event, [flexWallet], token);
        return;
    }

    // 6. Full report Flex Carousel
    if (lower.includes("รายงาน") || lower.includes("สรุปภาพรวม")) {
        try {
            const combinedFlex = await buildCombinedReportFlexMessage(root);
            await safeReplyOrPush(event, [combinedFlex], token);
        } catch (repErr) {
            console.error("Combined report error, sending personal report:", repErr.message);
            const personalFlex = await buildPersonalReportFlexMessage(root);
            await safeReplyOrPush(event, [personalFlex], token);
        }
        return;
    }

    // 7. Natural Language Gemini AI Fallback (handles conversational Thai & complex finance phrasing!)
    try {
        const personalIncome = finance.filter(x => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
        const personalExpense = finance.filter(x => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
        const todayMeals = finance.filter(x => x.type === "expense" && x.date === todayISO && (x.calories || (x.category && x.category.includes("อาหาร"))));
        const todayCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);

        const aiRes = await askGeminiLineAssistant(userText, {
            todayStr: dateFormatted,
            netBalance: personalIncome - personalExpense,
            todayCalories,
            pendingTasks: toArray(root.tasks).filter(t => t.status !== "completed").length
        });

        if (aiRes) {
            if (aiRes.action === "undo") {
                await handleUndoFinanceCommand(event, finance, token);
                return;
            }
            if (aiRes.action === "finance" && Number(aiRes.amount) > 0) {
                const isIncome = aiRes.financeType === "income";
                const calVal = Number(aiRes.calories) || 0;
                const title = aiRes.title || userText;
                await recordFinanceAndReply({
                    event,
                    finance,
                    todayISO,
                    dateFormatted,
                    title,
                    amount: Number(aiRes.amount),
                    calories: (!isIncome && calVal > 0) ? calVal : null,
                    category: isIncome ? "💰 รายรับส่วนตัว" : (calVal > 0 ? "🍔 อาหาร & เครื่องดื่ม" : detectGeneralCategory(title)),
                    txType: isIncome ? "income" : "expense",
                    note: `LINE AI: ${title}`,
                    token
                });
                return;
            }
            if (aiRes.replyText) {
                await safeReplyOrPush(event, [aiRes.replyText], token);
                return;
            }
        }
    } catch (aiErr) {
        console.warn("Gemini LINE NLP fallback skipped:", aiErr.message);
    }

    // 8. Friendly Usage Guide Fallback (if Gemini offline/unavailable)
    const helpMsg = `✨ สวัสดีค่ะคุณเจ้าของร้าน! ดิฉันคือน้องธิดาค่ะ 👩‍💼😊\n\n` +
        `ส่งรูปอาหาร/สลิป หรือพิมพ์สั้นๆ ได้เลยนะคะ:\n` +
        `• "กะเพรา 25 บาท" (คำนวณแคลอรี่ + หักรายจ่าย)\n` +
        `• "รายรับ 500" (เพิ่มรายรับส่วนตัว)\n` +
        `• "ลบรายการล่าสุด" (ยกเลิกรายการเมื่อกี้)\n` +
        `• "วันนี้กินไปกี่แคล" / "เงินเหลือเท่าไหร่" / "รายงาน"`;
    await safeReplyOrPush(event, [helpMsg], token);
}

// =========================================================================
// 🚀 VERCEL SERVERLESS FUNCTION EXPORT
// =========================================================================
module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-line-signature");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};
        const query = req.query || {};
        const customToken = query.token || body.token || LINE_TOKEN;

        // 🎯 Diagnostic Checks
        if (query.checkToken === "1") {
            const tokenToTest = process.env.LINE_CHANNEL_ACCESS_TOKEN || LINE_TOKEN;
            let testRes;
            try {
                const r = await requestHttpsWithTimeout("https://api.line.me/v2/bot/info", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${tokenToTest}` }
                }, null, 4000);
                testRes = { status: r.statusCode, body: r.body };
            } catch (err) {
                testRes = { status: 500, error: err.message };
            }
            return res.status(200).json({
                hasEnvToken: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
                tokenPrefix: tokenToTest.substring(0, 10) + "...",
                hasGeminiKey: !!process.env.GEMINI_API_KEY,
                lineApiResult: testRes
            });
        }

        if (query.checkGemini === "1") {
            const geminiKey = process.env.GEMINI_API_KEY || "";
            try {
                const r = await requestHttpsWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`, { method: "GET" }, null, 4500);
                const parsed = JSON.parse(r.body);
                const names = (parsed.models || []).map(m => m.name);
                return res.status(200).json({ status: r.statusCode, modelCount: names.length, models: names.slice(0, 10) });
            } catch (err) {
                return res.status(200).json({ status: 500, error: err.message });
            }
        }

        // 🎯 Web App API Actions: Real Gemini Vision & Chat from Safari/file://
        if (body.action === "analyzeImage" && body.imageBase64) {
            const rawStr = String(body.imageBase64);
            const dataUriMatch = rawStr.match(/^data:([^;]+);base64,([\s\S]+)$/);
            const mimeType = dataUriMatch ? dataUriMatch[1] : "image/jpeg";
            const base64Data = dataUriMatch ? dataUriMatch[2] : rawStr;
            const buffer = Buffer.from(base64Data, "base64");
            const vision = await analyzeFoodImageWithGemini(buffer, mimeType, body.prompt || "");
            if (!vision) {
                return res.status(503).json({ success: false, error: "Gemini Vision timeout or unavailable" });
            }
            return res.status(200).json({
                success: true,
                result: {
                    type: vision.type === "receipt" ? "slip" : (vision.type || "food"),
                    slipType: vision.slipType || "expense",
                    dishName: vision.foodName || "อาหารจานเดียว",
                    merchant: vision.foodName || vision.description || "",
                    calories: Number(vision.calories) || 0,
                    amount: Number(vision.price) || 0,
                    replyText: vision.description || ""
                }
            });
        }

        if (body.action === "aiChat" && body.text) {
            const aiRes = await askGeminiLineAssistant(String(body.text), body.context || {});
            if (!aiRes) {
                return res.status(503).json({ success: false, error: "Gemini AI timeout or unavailable" });
            }
            return res.status(200).json({
                success: true,
                replyText: aiRes.replyText || "รับทราบค่ะคุณเจ้าของร้าน 😊",
                parsedAction: aiRes.action === "finance" ? {
                    type: "finance",
                    financeType: aiRes.financeType || "expense",
                    title: aiRes.title,
                    amount: aiRes.amount,
                    calories: aiRes.calories
                } : null
            });
        }

        // 🎯 CASE 1: Incoming LINE Webhook Event from LINE Platform
        if (body.events && Array.isArray(body.events)) {
            for (const event of body.events) {
                if (event.type === "message" && event.message) {
                    try {
                        await handleLineIncomingMessage(event, customToken);
                    } catch (err) {
                        console.error("Error handling incoming LINE event:", err);
                    }
                }
            }
            return res.status(200).json({
                success: true,
                message: "LINE Webhook processed successfully",
                processedCount: body.events.length
            });
        }

        // 🎯 CASE 2: Broadcast / Cron / Manual Web Report Sender (Flex Cards by default!)
        const explicitReportType = query.type || body.reportType || body.type;
        const customText = query.text || body.text;
        const customMessages = body.messages;

        let messagesToSend = [];
        if (explicitReportType === "shop") {
            messagesToSend = [await buildShopReportFlexMessage()];
        } else if (explicitReportType === "personal") {
            messagesToSend = [await buildPersonalReportFlexMessage()];
        } else if (explicitReportType === "all") {
            messagesToSend = [await buildCombinedReportFlexMessage()];
        } else if (customMessages && Array.isArray(customMessages) && customMessages.length > 0) {
            messagesToSend = customMessages;
        } else if (customText) {
            messagesToSend = [customText];
        } else {
            messagesToSend = [await buildCombinedReportFlexMessage()];
        }

        await sendLineBroadcast(messagesToSend, customToken);
        return res.status(200).json({
            success: true,
            message: "ส่งการ์ดรายงานเข้า LINE สำเร็จเรียบร้อยแล้ว!",
            sentCount: messagesToSend.length
        });
    } catch (err) {
        console.error("Vercel API error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports.extractFoodAndAmount = extractFoodAndAmount;
module.exports.calculateFoodCalories = calculateFoodCalories;
module.exports.toArray = toArray;
module.exports.buildFoodSlipFlexMessage = buildFoodSlipFlexMessage;
module.exports.buildPhotoScanFlexMessage = buildPhotoScanFlexMessage;
module.exports.buildDailyCaloriesFlexMessage = buildDailyCaloriesFlexMessage;
module.exports.buildPersonalBalanceFlexMessage = buildPersonalBalanceFlexMessage;
module.exports.buildShopReportBubble = buildShopReportBubble;
module.exports.buildPersonalReportBubble = buildPersonalReportBubble;
