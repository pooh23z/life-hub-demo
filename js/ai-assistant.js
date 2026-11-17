/* ==========================================================================
   Life & Business Hub - Ultra-Smart Gemini 1.5 Pro AI Executive Assistant
   (Multi-Turn Memory, Voice Input, Thai Calorie Knowledge Base & Separate Finances)
   ========================================================================== */

// 🥗 THAI CALORIE KNOWLEDGE BASE (คำนวณแคลอรี่อาหารไทยยอดนิยม)
const THAI_CALORIE_DATABASE = window.THAI_CALORIE_DATABASE = [
    // ข้าว & อาหารจานเดียว
    { keywords: ['กะเพราหมูสับ', 'กะเพราหมู'], name: 'ข้าวกะเพราหมูสับ', cal: 580, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['กะเพราไก่'], name: 'ข้าวกะเพราไก่', cal: 550, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['กะเพราเนื้อ'], name: 'ข้าวกะเพราเนื้อ', cal: 600, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['กะเพราทะเล', 'กะเพรากุ้ง', 'กะเพราปลาหมึก'], name: 'ข้าวกะเพราทะเล', cal: 520, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['กะเพรา'], name: 'ข้าวกะเพรา', cal: 580, cat: '🍔 อาหาร & เครื่องดื่ม' },
    
    { keywords: ['ข้าวมันไก่ทอด'], name: 'ข้าวมันไก่ทอด', cal: 690, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวมันไก่ผสม', 'ข้าวมันไก่ทูโทน'], name: 'ข้าวมันไก่ผสม', cal: 650, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวมันไก่ต้ม', 'ข้าวมันไก่'], name: 'ข้าวมันไก่', cal: 590, cat: '🍔 อาหาร & เครื่องดื่ม' },
    
    { keywords: ['ข้าวขาหมู'], name: 'ข้าวขาหมู', cal: 690, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวหมูกรอบ'], name: 'ข้าวหมูกรอบ', cal: 650, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวหมูแดง'], name: 'ข้าวหมูแดง', cal: 540, cat: '🍔 อาหาร & เครื่องดื่ม' },
    
    { keywords: ['ข้าวผัดกุ้ง', 'ข้าวผัดปู', 'ข้าวผัดทะเล'], name: 'ข้าวผัดทะเล', cal: 560, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวผัดหมู', 'ข้าวผัดไก่', 'ข้าวผัด'], name: 'ข้าวผัด', cal: 550, cat: '🍔 อาหาร & เครื่องดื่ม' },
    
    { keywords: ['ข้าวไข่เจียวหมูสับ', 'ข้าวไข่เจียวทรงเครื่อง'], name: 'ข้าวไข่เจียวหมูสับ', cal: 580, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวไข่เจียว'], name: 'ข้าวไข่เจียว', cal: 490, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวไข่ข้น'], name: 'ข้าวไข่ข้น', cal: 450, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวไข่ต้ม'], name: 'ข้าวไข่ต้ม', cal: 320, cat: '🍔 อาหาร & เครื่องดื่ม' },
    
    { keywords: ['ข้าวหมูทอด', 'ข้าวไก่ทอด'], name: 'ข้าวหมู/ไก่ทอด', cal: 620, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวแกงกะหรี่'], name: 'ข้าวแกงกะหรี่', cal: 720, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวหน้าเป็ด'], name: 'ข้าวหน้าเป็ด', cal: 520, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวคลุกกะปิ'], name: 'ข้าวคลุกกะปิ', cal: 580, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวเหนียวหมูปิ้ง', 'หมูปิ้ง'], name: 'ข้าวเหนียวหมูปิ้ง', cal: 380, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวเหนียวไก่ทอด'], name: 'ข้าวเหนียวไก่ทอด', cal: 480, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ข้าวต้มกุ้ง', 'ข้าวต้มปลา', 'ข้าวต้มหมู', 'ข้าวต้ม'], name: 'ข้าวต้ม', cal: 320, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['โจ๊กหมูใส่ไข่', 'โจ๊กหมูไข่'], name: 'โจ๊กหมูใส่ไข่', cal: 350, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['โจ๊กหมู', 'โจ๊ก'], name: 'โจ๊กหมู', cal: 260, cat: '🍔 อาหาร & เครื่องดื่ม' },

    // ก๋วยเตี๋ยว & เส้น
    { keywords: ['ผัดไทยกุ้งสด', 'ผัดไทย'], name: 'ผัดไทย', cal: 590, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ผัดซีอิ๊วหมู', 'ผัดซีอิ๊ว'], name: 'ผัดซีอิ๊ว', cal: 600, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ราดหน้าหมู', 'ราดหน้า'], name: 'ราดหน้า', cal: 420, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ผัดขี้เมา'], name: 'ก๋วยเตี๋ยวผัดขี้เมา', cal: 540, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ก๋วยเตี๋ยวเรือ', 'ก๋วยเตี๋ยวน้ำตก', 'เตี๋ยวเรือ'], name: 'ก๋วยเตี๋ยวน้ำตก', cal: 420, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ก๋วยเตี๋ยวต้มยำ', 'เตี๋ยวต้มยำ'], name: 'ก๋วยเตี๋ยวต้มยำ', cal: 450, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ก๋วยเตี๋ยวน้ำใส', 'ก๋วยเตี๋ยวไก่', 'ก๋วยเตี๋ยว'], name: 'ก๋วยเตี๋ยว', cal: 360, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['บะหมี่เกี๊ยวหมูแดง', 'บะหมี่เกี๊ยว', 'เกี๊ยวน้ำ'], name: 'บะหมี่เกี๊ยว', cal: 420, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สปาเก็ตตี้คาโบนาร่า', 'คาโบนาร่า'], name: 'สปาเก็ตตี้คาโบนาร่า', cal: 650, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สปาเก็ตตี้ขี้เมา', 'สปาเก็ตตี้'], name: 'สปาเก็ตตี้', cal: 480, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['มาม่าต้มยำ', 'มาม่าผัด', 'มาม่า'], name: 'บะหมี่กึ่งสำเร็จรูป/มาม่า', cal: 320, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สุกี้แห้ง'], name: 'สุกี้แห้ง', cal: 450, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สุกี้น้ำ'], name: 'สุกี้น้ำ', cal: 300, cat: '🍔 อาหาร & เครื่องดื่ม' },

    // ส้มตำ & อีสาน & สุขภาพ
    { keywords: ['ส้มตำปูปลาร้า', 'ส้มตำไทย', 'ส้มตำ'], name: 'ส้มตำ', cal: 120, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ส้มตำคอหมูย่าง', 'ส้มตำปู'], name: 'ส้มตำ', cal: 180, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ลาบหมู', 'ลาบไก่', 'ลาบ'], name: 'ลาบ', cal: 160, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['น้ำตกหมู', 'น้ำตกเนื้อ', 'น้ำตก'], name: 'น้ำตก', cal: 180, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['คอหมูย่าง'], name: 'คอหมูย่าง', cal: 350, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ไก่ย่าง'], name: 'ไก่ย่าง (1 น่อง/สะโพก)', cal: 220, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ไก่ทอด'], name: 'ไก่ทอด (1 ชิ้น)', cal: 320, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ต้มแซ่บ'], name: 'ต้มแซ่บกระดูกหมู', cal: 180, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ต้มยำกุ้ง', 'ต้มยำ'], name: 'ต้มยำกุ้ง', cal: 160, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['แกงจืดเต้าหู้หมูสับ', 'แกงจืด'], name: 'แกงจืดเต้าหู้หมูสับ', cal: 150, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สลัดผักอกไก่', 'สลัดอกไก่'], name: 'สลัดอกไก่', cal: 220, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['สลัดผัก', 'สลัด'], name: 'สลัดผัก', cal: 140, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['อกไก่ต้ม', 'อกไก่'], name: 'อกไก่', cal: 160, cat: '🍔 อาหาร & เครื่องดื่ม' },

    // เครื่องดื่ม
    { keywords: ['อเมริกาโน่ไม่หวาน', 'อเมริกาโน่เย็น', 'อเมริกาโน่'], name: 'อเมริกาโน่', cal: 15, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ลาเต้เย็น', 'ลาเต้'], name: 'ลาเต้', cal: 180, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['คาปูชิโน่เย็น', 'คาปูชิโน่'], name: 'คาปูชิโน่', cal: 170, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['มอคค่าเย็น', 'มอคค่า'], name: 'มอคค่า', cal: 260, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['กาแฟโบราณ', 'กาแฟเย็น', 'กาแฟ'], name: 'กาแฟเย็น', cal: 220, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ชานมไข่มุก', 'ชาไข่มุก'], name: 'ชานมไข่มุก', cal: 360, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ชาเขียวมัทฉะ', 'ชาเขียวเย็น', 'ชาเขียว'], name: 'ชาเขียวเย็น', cal: 220, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ชาไทย', 'ชาเย็น', 'ชาดำเย็น'], name: 'ชาเย็น/ชาไทย', cal: 230, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ชามะนาว'], name: 'ชามะนาว', cal: 150, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['น้ำส้มปั่น', 'น้ำผลไม้ปั่น', 'สมูทตี้'], name: 'น้ำผลไม้ปั่น', cal: 200, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['น้ำอัดลม', 'โค้ก', 'เป๊ปซี่', 'สไปรท์'], name: 'น้ำอัดลม', cal: 140, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ช็อกโกแลตเย็น', 'โกโก้เย็น', 'โกโก้'], name: 'โกโก้เย็น', cal: 260, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['นมสดปั่น', 'นมสดเย็น', 'นมสด'], name: 'นมสด', cal: 200, cat: '🍔 อาหาร & เครื่องดื่ม' },

    // ฟาสต์ฟู้ด & ของทานเล่น & บุฟเฟต์
    { keywords: ['เบอร์เกอร์', 'แฮมเบอร์เกอร์'], name: 'แฮมเบอร์เกอร์', cal: 480, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['พิซซ่า'], name: 'พิซซ่า (1 ชิ้น)', cal: 280, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['เฟรนช์ฟรายส์', 'เฟรนฟราย'], name: 'เฟรนช์ฟรายส์', cal: 340, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['นักเก็ต'], name: 'นักเก็ตไก่ (6 ชิ้น)', cal: 280, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['แซนด์วิช', 'แซนวิช'], name: 'แซนด์วิช', cal: 260, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ขนมปังปิ้ง', 'ขนมปัง'], name: 'ขนมปัง', cal: 180, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ครัวซองต์', 'ครัวซอง'], name: 'ครัวซองต์', cal: 310, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['เค้ก'], name: 'เค้ก (1 ชิ้น)', cal: 350, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ไอศกรีม', 'ไอติม'], name: 'ไอศกรีม', cal: 220, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['โรตี'], name: 'โรตี', cal: 380, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['บิงซู'], name: 'บิงซู', cal: 550, cat: '🍔 อาหาร & เครื่องดื่ม' },
    { keywords: ['ชาบู', 'สุกี้ตี๋น้อย', 'หมูกระทะ'], name: 'ชาบู/หมูกระทะ', cal: 1200, cat: '🍔 อาหาร & เครื่องดื่ม' }
];

function calculateFoodCalories(foodText) {
    const lower = String(foodText || '').toLowerCase().trim();
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
        if (lower.includes('ข้าว') || lower.includes('อาหาร') || lower.includes('มื้อ')) {
            baseCal = 520; isFood = true;
        } else if (lower.includes('ผัด')) {
            baseCal = 500; isFood = true;
        } else if (lower.includes('ทอด')) {
            baseCal = 480; isFood = true;
        } else if (lower.includes('ต้ม') || lower.includes('แกง')) {
            baseCal = 280; isFood = true;
        } else if (lower.includes('ชา') || lower.includes('กาแฟ') || lower.includes('นม') || lower.includes('น้ำ')) {
            baseCal = 180; isFood = true;
        } else if (lower.includes('ขนม') || lower.includes('เค้ก') || lower.includes('ปัง')) {
            baseCal = 300; isFood = true;
        }
    }

    // Addons & Modifiers
    let addonNote = '';
    if (lower.includes('ไข่ดาว')) {
        baseCal += 120;
        addonNote = '(รวมไข่ดาว +120 kcal)';
    } else if (lower.includes('ไข่เจียว') && !lower.includes('ข้าวไข่เจียว')) {
        baseCal += 200;
        addonNote = '(รวมไข่เจียว +200 kcal)';
    } else if (lower.includes('ไข่ต้ม') && !lower.includes('ข้าวไข่ต้ม')) {
        baseCal += 75;
        addonNote = '(รวมไข่ต้ม +75 kcal)';
    }

    if (lower.includes('พิเศษ')) {
        baseCal += 150;
        addonNote += ' (พิเศษ +150 kcal)';
    }

    if (lower.includes('หวานน้อย')) {
        baseCal = Math.max(10, baseCal - 50);
        addonNote += ' (หวานน้อย -50 kcal)';
    } else if (lower.includes('ไม่หวาน') || lower.includes('หวาน 0%')) {
        baseCal = Math.max(5, baseCal - 80);
        addonNote += ' (ไม่หวาน -80 kcal)';
    }

    return {
        isFood,
        calories: baseCal,
        name: matchedName,
        addonNote: addonNote.trim()
    };
}

function extractFoodAndAmount(text) {
    if (!text) return null;
    let clean = String(text).trim();

    // Ignore calendar / time / task phrases so "ไม่ว่างวันที่ 5" never deducts 5 baht
    if (/(?:ไม่ว่างวันที่|ว่างวันที่|ลงปฏิทิน|นัด|ประชุม|ตารางงาน|งานค้าง|งานที่ส่ง)/i.test(clean)) {
        return null;
    }

    // 1. Check if user is asking for daily summary (e.g. "วันนี้กินไปกี่แคล")
    const summaryKeywords = ['วันนี้', 'เมื่อวาน', 'กินไป', 'ทานไป', 'สรุป', 'เช็ก', 'รวม'];
    const calOnlyMatch = clean.toLowerCase().match(/^([ก-๙a-zA-Z\s]+?)\s*(?:กี่แคลอรี่|กี่แคล|แคลอรี่เท่าไหร่|แคลเท่าไหร่|มีกี่แคล)\??$/i);
    if (calOnlyMatch) {
        const queryFood = calOnlyMatch[1].trim();
        if (summaryKeywords.some(k => queryFood.includes(k))) {
            return null;
        }
        return { isQueryOnly: true, food: queryFood };
    }

    // Detect explicit Income intent
    const isIncome = /(?:รายรับ|เงินเข้า|รับเงิน|โอนเข้า|ได้เงิน|เงินเดือน|โบนัส|ค่าขนมได้|เติมเงินเข้า|ทุน|กำไรเข้า)/i.test(clean);

    // 2. Extract amount cleanly (supports 50, 1,200, 50.-, ฿50, 50฿, 50 บาท, 50 บ.)
    const numRegex = /(?:฿\s*(\d+(?:,\d{3})*(?:\.\d+)?))|(?:(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:บาท|฿|\.-|บ\.|บ\b))|(?:(?:ราคา|ไป|จำนวน|จ่าย|รับ|เข้า|เป็นเงิน)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)(?!\s*(?:วัน|เดือน|ปี|นาที|ชั่วโมง|ชม\.|แคล|kcal|%|:|\.\d)))/i;
    const numMatch = clean.match(numRegex);
    if (!numMatch) return null;

    const rawNum = (numMatch[1] || numMatch[2] || numMatch[3] || '').replace(/,/g, '');
    const amount = parseFloat(rawNum);
    if (!amount || amount <= 0 || amount > 10000000) return null;

    let remaining = clean
        .replace(numMatch[0], ' ')
        .replace(/(?:฿\s*\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:,\d{3})*(?:\.\d+)?\s*(?:บาท|฿|\.-|บ\.|บ\b))/gi, ' ')
        .replace(/(?:ช่วย|ให้หน่อย|คำนวณแคลอรี่|คำนวณแคล|คำนวณเงิน|คำนวณ|หักเงิน|หัก|ลบเงิน|ลบ|คิดเงิน|คิด|เพิ่ม|บันทึก|แคลอรี่|แคล|กี่แคล|ลบลงในรายรับรายจ่าย|ลงในรายรับรายจ่าย|บันทึกลงในรายรับรายจ่าย|ในรายรับรายจ่าย|รายรับรายจ่าย|รายจ่าย|รายรับ|เงินเข้า|รับเงิน|แล้วก็|และ|นะ|ค่ะ|ครับ|ดิฉัน|ฉัน|ผม|กิน|ทาน|ซื้อ|จ่าย|ค่า)/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    let foodTitle = remaining;
    if (!foodTitle || foodTitle.length < 2) {
        if (isIncome) {
            foodTitle = 'รายรับส่วนตัว';
        } else {
            const prefixMatch = clean.match(/([ก-๙a-zA-Z\s]+?)\s*\d+/);
            if (prefixMatch) {
                foodTitle = prefixMatch[1].replace(/(?:กิน|ทาน|ซื้อ|จ่าย|ค่า|ช่วย|หักเงิน|หัก|ลบ|บันทึก|คำนวณ)/gi, '').trim();
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

window.calculateFoodCalories = calculateFoodCalories;
window.extractFoodAndAmount = extractFoodAndAmount;

class AIAssistantController {
    constructor() {
        this.chatMessagesContainer = null;
        this.inputElem = null;
        this.currentChatImageBase64 = null;
        this.geminiApiKey = localStorage.getItem('lifehub_gemini_api_key') || '';
        
        // Multi-Turn Conversation History Memory
        this.conversationHistory = [];

        // Voice Recognition Properties
        this.recognition = null;
        this.isListening = false;

        // Context state for multi-turn followup questions
        this.activeContext = {
            awaitingReasonDateRange: null,
            lastAddedTransactions: []
        };
    }

    init() {
        if (this._initialized) return;
        this._initialized = true;

        this.chatMessagesContainer = document.getElementById('ai-chat-messages');
        this.inputElem = document.getElementById('ai-chat-input');
        
        this.bindEvents();
        this.bindImageUploadEvents();
        this.bindGeminiKeyEvents();
        this.initVoiceRecognition();
        this.updateGeminiKeyStatusUI();
    }

    // 🎙️ THAI VOICE RECOGNITION (WEB SPEECH API)
    initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.log('Web Speech API is not supported in this browser version.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'th-TH'; // Thai language recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        const voiceBtn = document.getElementById('btn-voice-input');
        const voiceIcon = document.getElementById('voice-icon');
        const voiceStatusText = document.getElementById('voice-status-text');

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                if (this.isListening) {
                    this.stopVoiceRecognition();
                } else {
                    this.startVoiceRecognition();
                }
            });
        }

        this.recognition.onstart = () => {
            this.isListening = true;
            if (voiceBtn) voiceBtn.classList.add('mic-listening');
            if (voiceIcon) voiceIcon.textContent = '🔴';
            if (voiceStatusText) voiceStatusText.textContent = 'กำลังฟัง...';
            if (window.appController) window.appController.showToast('🎙️ กำลังฟังเสียงภาษาไทยของคุณอยู่ พูดสั่งงานได้เลยค่ะ!');
        };

        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (this.inputElem) {
                this.inputElem.value = transcript;
            }
        };

        this.recognition.onerror = (event) => {
            console.warn('Voice recognition error:', event.error);
            this.stopVoiceRecognition();
            if (event.error === 'not-allowed') {
                alert('เบราว์เซอร์ยังไม่อนุญาตให้ใช้ไมโครโฟน กรุณากดอนุญาต (Allow) การใช้ไมโครโฟนที่ไอคอนรูปแม่กุญแจ 🔒 ข้าง URL ครับ');
            }
        };

        this.recognition.onend = () => {
            this.stopVoiceRecognition();
        };
    }

    startVoiceRecognition() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (e) {
                console.error(e);
            }
        }
    }

    stopVoiceRecognition() {
        this.isListening = false;
        const voiceBtn = document.getElementById('btn-voice-input');
        const voiceIcon = document.getElementById('voice-icon');
        const voiceStatusText = document.getElementById('voice-status-text');

        if (voiceBtn) voiceBtn.classList.remove('mic-listening');
        if (voiceIcon) voiceIcon.textContent = '🎙️';
        if (voiceStatusText) voiceStatusText.textContent = 'พูดสั่งงาน';

        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) {}
        }
    }

    bindEvents() {
        const aiBall = document.getElementById('ai-floating-ball');
        const btnCloseChat = document.getElementById('btn-close-ai-chat');
        const formChat = document.getElementById('form-ai-chat');

        if (aiBall) aiBall.addEventListener('click', () => this.toggleChatModal(true));
        if (btnCloseChat) btnCloseChat.addEventListener('click', () => this.toggleChatModal(false));

        if (formChat) {
            formChat.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUserSendMessage();
            });
        }
    }

    bindGeminiKeyEvents() {
        const btnConfig = document.getElementById('btn-config-gemini-key');
        if (btnConfig) {
            btnConfig.addEventListener('click', () => {
                const key = prompt('ใส่ Google Gemini API Key ของคุณ (รับฟรีจาก aistudio.google.com):', this.geminiApiKey);
                if (key !== null) {
                    this.geminiApiKey = key.trim();
                    localStorage.setItem('lifehub_gemini_api_key', this.geminiApiKey);
                    this.updateGeminiKeyStatusUI();
                    if (window.appController) window.appController.showToast('✨ บันทึก Gemini API Key เรียบร้อยแล้ว!');
                }
            });
        }
    }

    updateGeminiKeyStatusUI() {
        const statusElem = document.getElementById('gemini-key-status');
        if (statusElem) {
            if (this.geminiApiKey) {
                statusElem.innerHTML = `<span style="color: var(--accent-emerald);">● เชื่อมต่อ Gemini API Key สำเร็จ</span>`;
            } else {
                statusElem.innerHTML = `<span style="color: var(--accent-emerald);">● ใช้งานระบบ Gemini NLP Engine ชาญฉลาด</span>`;
            }
        }
    }

    bindImageUploadEvents() {
        const imgInput = document.getElementById('ai-image-upload');
        const btnRemove = document.getElementById('btn-remove-chat-img');

        if (imgInput) {
            imgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (evt) => {
                    this.currentChatImageBase64 = evt.target.result;
                    const previewBox = document.getElementById('ai-chat-img-preview-box');
                    const previewImg = document.getElementById('ai-chat-img-preview');
                    if (previewBox && previewImg) {
                        previewImg.src = evt.target.result;
                        previewBox.style.display = 'flex';
                    }
                    if (this.inputElem) {
                        this.inputElem.placeholder = "ระบุราคา (ถ้ามี) เช่น 60 บาท หรือปล่อยว่างแล้วกดส่งได้เลยค่ะ...";
                        this.inputElem.focus();
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        if (btnRemove) {
            btnRemove.addEventListener('click', () => {
                this.currentChatImageBase64 = null;
                const previewBox = document.getElementById('ai-chat-img-preview-box');
                if (previewBox) previewBox.style.display = 'none';
                if (imgInput) imgInput.value = '';
            });
        }
    }

    toggleChatModal(show) {
        const modal = document.getElementById('modal-ai-chat');
        if (!modal) return;

        if (show) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            const input = document.getElementById('ai-chat-input');
            if (input) input.focus();
        } else {
            modal.classList.remove('active');
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
            setTimeout(() => { modal.style.display = ''; }, 200);
        }
    }

    clearHistory() {
        this.conversationHistory = [];
        this.activeContext.awaitingReasonDateRange = null;
        if (this.chatMessagesContainer) {
            this.chatMessagesContainer.innerHTML = `
                <div class="ai-message-bubble ai-msg">
                    <div class="msg-avatar">✨</div>
                    <div class="msg-content">
                        ✨ ล้างประวัติการคุยเรียบร้อยแล้วค่ะ! ดิฉันพร้อมรับฟังคำสั่งใหม่ของคุณเจ้าของร้านแล้วค่ะ 😊
                    </div>
                </div>
            `;
        }
        if (window.appController) window.appController.showToast('✨ ล้างประวัติการคุยเรียบร้อยแล้ว!');
    }

    triggerQuickAction(actionType) {
        if (actionType === 'briefing') {
            this.appendUserMessage('รายงานสรุปภาพรวมวันนี้ให้ดิฉันหน่อย');
            this.showTypingIndicatorAndRespond(() => {
                const todayStr = this.getLocalDateStr();
                const financeList = store.getFinance();
                const totalIncome = financeList.filter(x => x.type === 'income').reduce((sum, x) => sum + Number(x.amount), 0);
                const totalExpense = financeList.filter(x => x.type === 'expense').reduce((sum, x) => sum + Number(x.amount), 0);
                const netBalance = totalIncome - totalExpense;

                // Today's calories & meals
                const todayMeals = financeList.filter(x => x.type === 'expense' && x.date === todayStr && (x.calories || (x.category && x.category.includes('อาหาร'))));
                const totalCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
                const todayMealCost = todayMeals.reduce((sum, m) => sum + Number(m.amount || 0), 0);

                const tasks = store.getTasks().filter(x => x.status !== 'completed');
                const calendarData = store.getCalendar();
                const todayData = calendarData[todayStr] || {};
                const statusText = todayData.status === 'busy' ? '🔴 วันไม่ว่าง' : '🟢 วันว่าง';

                const reply = `✨ **รายงานสรุปสถานะส่วนตัววันนี้จากน้องธิดาค่ะ** 📋\n\n` +
                    `💵 **สถานะการเงินส่วนตัว**:\n` +
                    `• เงินคงเหลือสุทธิ: **฿${formatMoney(netBalance)}**\n` +
                    `• รายรับส่วนตัว: ฿${formatMoney(totalIncome)} | รายจ่ายส่วนตัว: ฿${formatMoney(totalExpense)}\n\n` +
                    `🥗 **แคลอรี่อาหารวันนี้**: **${totalCalories.toLocaleString()} / 2,000 kcal** (${todayMeals.length} มื้อ, รวมค่าอาหาร ฿${formatMoney(todayMealCost)})\n` +
                    `📅 **สถานะปฏิทินวันนี้**: **${statusText}**\n` +
                    `📝 **งานค้างที่ต้องทำ**: **${tasks.length} รายการ**\n\n` +
                    `🔒 *(ข้อมูลการตรวจเช็กนี้เป็นส่วนตัว 100% ไม่เชื่อมต่อหรือปะปนกับรายได้ร้านค้าค่ะ)*`;

                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'รายงานสรุปภาพรวมวันนี้ให้ดิฉันหน่อย');
                this.saveToConversationHistory('model', reply);
            });
        }
        else if (actionType === 'calories') {
            this.appendUserMessage('เช็กแคลอรี่และมื้ออาหารที่ทานวันนี้');
            this.showTypingIndicatorAndRespond(() => {
                const todayStr = this.getLocalDateStr();
                const financeList = store.getFinance();
                const todayMeals = financeList.filter(x => x.type === 'expense' && x.date === todayStr && (x.calories || (x.category && x.category.includes('อาหาร'))));
                const totalCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
                const totalMealCost = todayMeals.reduce((sum, m) => sum + Number(m.amount || 0), 0);
                const remaining = Math.max(0, 2000 - totalCalories);

                let mealsList = todayMeals.length > 0
                    ? todayMeals.map((m, idx) => `   ${idx + 1}. **${m.title}**: ~${m.calories || 450} kcal (-฿${formatMoney(m.amount)})`).join('\n')
                    : '   • ยังไม่มีบันทึกมื้ออาหารวันนี้';

                const reply = `🥗 **สรุปแคลอรี่และมื้ออาหารวันนี้จากน้องธิดาค่ะ** 🔥\n📅 วันที่ ${this.formatThaiDateStr(todayStr)}\n\n` +
                    `• พลังงานที่ทานไป: **${totalCalories.toLocaleString()} / 2,000 kcal**\n` +
                    `• โควตาที่ยังทานได้อีก: **~${remaining.toLocaleString()} kcal**\n` +
                    `• รวมค่าอาหารวันนี้: **฿${formatMoney(totalMealCost)}** (หักลบจากรายจ่ายส่วนตัวเรียบร้อย)\n\n` +
                    `📋 **รายการอาหารวันนี้ (${todayMeals.length} มื้อ)**:\n${mealsList}\n\n` +
                    `💡 พิมพ์หรือพูดสั่งได้ทันที เช่น *"กะเพรา 25 บาท"* หรือ *"ชานมไข่มุก 45"* ระบบจะคำนวณแคลอรี่และหักเงินลงรายจ่ายส่วนตัวให้อัตโนมัติค่ะ 😊`;

                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'เช็กแคลอรี่และมื้ออาหารที่ทานวันนี้');
                this.saveToConversationHistory('model', reply);
            });
        }
        else if (actionType === 'calendar') {
            this.appendUserMessage('เช็กตารางนัดหมายและวันว่างสัปดาห์นี้');
            this.showTypingIndicatorAndRespond(() => {
                const todayStr = new Date().toISOString().split('T')[0];
                const calendarData = store.getCalendar();
                const todayData = calendarData[todayStr] || {};
                const statusText = todayData.status === 'busy' ? '🔴 วันไม่ว่าง' : '🟢 วันว่าง';

                const reply = `✨ **รายงานตารางนัดหมายปฏิทินจากน้องธิดาค่ะ** 📅\n\n• สถานะวันนี้ (${todayStr}): **${statusText}**\n• พิมพ์บอกช่วงวันได้ตามใจชอบเลยค่ะ เช่น *"ไม่ว่างวันที่ 2 - 7 เลย"* ดิฉันจะจัดการลงปฏิทินให้ทันทีค่ะ!`;
                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'เช็กตารางนัดหมายและวันว่างสัปดาห์นี้');
                this.saveToConversationHistory('model', reply);
            });
        }
        else if (actionType === 'profit') {
            this.appendUserMessage('วิเคราะห์ยอดขายและกำไรให้หน่อย');
            this.showTypingIndicatorAndRespond(() => {
                const business = store.getBusiness();
                const sales = business.filter(x => x.type === 'sale');
                const costs = business.filter(x => x.type === 'cost');
                const totalSales = sales.reduce((s, x) => s + Number(x.amount), 0);
                const totalCosts = costs.reduce((s, x) => s + Number(x.amount), 0);
                const netProfit = totalSales - totalCosts;
                const margin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';

                const itemMap = {};
                sales.forEach(x => {
                    const title = (x.title || 'สินค้า').split(' (')[0].replace('ยอดขาย: ', '').trim();
                    itemMap[title] = (itemMap[title] || 0) + Number(x.amount);
                });
                let topItem = 'ไม่มีข้อมูล';
                let topAmt = 0;
                Object.keys(itemMap).forEach(k => {
                    if (itemMap[k] > topAmt) {
                        topAmt = itemMap[k];
                        topItem = k;
                    }
                });

                const reply = `🏪 **วิเคราะห์ผลประกอบการร้านค้าโดยน้องธิดาค่ะ** 🛍️📈\n\n• ยอดขายรวม: ฿${formatMoney(totalSales)}\n• ต้นทุนวัตถุดิบรวม: ฿${formatMoney(totalCosts)}\n• **กำไรสุทธิร้านค้า**: ฿${formatMoney(netProfit)}\n• สินค้าทำรายได้สูงสุด: **${topItem} (฿${formatMoney(topAmt)})**\n• อัตรากำไรสุทธิ (Profit Margin): **${margin}%**\n\n📌 *(ข้อมูลส่วนนี้เป็นยอดขายร้านค้า แยกจากเงินส่วนตัวค่ะ)*`;
                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'วิเคราะห์ยอดขายและกำไรให้หน่อย');
                this.saveToConversationHistory('model', reply);
            });
        }
        else if (actionType === 'advice') {
            this.appendUserMessage('ขอวิเคราะห์การเงินและคำแนะนำการใช้จ่าย');
            this.showTypingIndicatorAndRespond(() => {
                const financeList = store.getFinance();
                const expenses = financeList.filter(x => x.type === 'expense');
                const totalExp = expenses.reduce((s, x) => s + Number(x.amount), 0);

                const catMap = {};
                expenses.forEach(x => {
                    const c = x.category || 'อื่นๆ';
                    catMap[c] = (catMap[c] || 0) + Number(x.amount);
                });

                let topCat = 'อาหาร/เครื่องดื่ม';
                let topAmt = 0;
                Object.keys(catMap).forEach(c => {
                    if (catMap[c] > topAmt) {
                        topAmt = catMap[c];
                        topCat = c;
                    }
                });

                const reply = `💡 **คำแนะนำการเงินจาก Gemini AI Financial Advisor ค่ะ** 📊\n\n• ยอดรวมรายจ่ายส่วนตัว: ฿${formatMoney(totalExp)}\n• หมวดที่ใช้จ่ายสูงสุด: **${topCat} (฿${formatMoney(topAmt)})**\n\n🎯 **ข้อเสนอแนะ**: ลองตั้งเป้าหมายออมเงินเพิ่ม 10% ของยอดขายร้านค้า เพื่อเพิ่มเงินสำรองเผื่อฉุกเฉินนะคะคุณเจ้าของร้าน!`;
                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'ขอวิเคราะห์การเงินและคำแนะนำการใช้จ่าย');
                this.saveToConversationHistory('model', reply);
            });
        }
        else if (actionType === 'weather') {
            this.appendUserMessage('เช็กสภาพอากาศฝนตกก่อนเดินทาง');
            this.showTypingIndicatorAndRespond(() => {
                const isRain = window.weatherController ? window.weatherController.isRaining : false;
                const temp = window.weatherController ? window.weatherController.currentTemp || 29 : 29;
                const city = window.weatherController ? window.weatherController.cityName || 'พิกัดปัจจุบัน' : 'พิกัดปัจจุบัน';

                let reply = '';
                if (isRain) {
                    reply = `✨ **รายงานสภาพอากาศจาก Gemini AI ค่ะ** 🌧️📍\n\nพิกัด: ${city}\n• **ตอนนี้มีแนวโน้มฝนตกในพื้นที่ค่ะ!**\n• อุณหภูมิ: ${temp}°C\n☔ ดิฉันขอแนะนำให้พกร่มติดตัวและวางแผนการเดินทางนะคะ`;
                } else {
                    reply = `✨ **รายงานสภาพอากาศจาก Gemini AI ค่ะ** ☀️📍\n\nพิกัด: ${city}\n• **ขณะนี้ฝนไม่ตก ท้องฟ้าแจ่มใสค่ะ**\n• อุณหภูมิ: ${temp}°C\n☀️ สภาพอากาศเอื้ออำนวยต่อการเดินทางทำธุระค่ะ 😊`;
                }
                this.appendAIMessage(reply);
                this.saveToConversationHistory('user', 'เช็กสภาพอากาศฝนตกก่อนเดินทาง');
                this.saveToConversationHistory('model', reply);
            });
        }
    }

    showTypingIndicatorAndRespond(callback) {
        const typingId = this.showTypingIndicator();
        setTimeout(() => {
            this.removeTypingIndicator(typingId);
            callback();
        }, 300);
    }

    getApiBase() {
        return window.location.protocol === 'file:' ? 'https://lifehub-app-sable.vercel.app' : '';
    }

    handleUserSendMessage() {
        const inputElem = this.inputElem || document.getElementById('ai-chat-input');
        if (!inputElem) return;
        
        this.chatMessagesContainer = this.chatMessagesContainer || document.getElementById('ai-chat-messages');

        const text = inputElem.value.trim();
        if (!text && !this.currentChatImageBase64) return;

        const hasImage = !!this.currentChatImageBase64;
        const chatImage = this.currentChatImageBase64;

        this.appendUserMessage(text || (hasImage ? '📸 ส่งรูปภาพให้ช่วยวิเคราะห์ค่ะ' : ''), chatImage);

        inputElem.value = '';
        this.currentChatImageBase64 = null;
        const previewBox = document.getElementById('ai-chat-img-preview-box');
        if (previewBox) previewBox.style.display = 'none';

        const typingId = this.showTypingIndicator();

        if (this.geminiApiKey) {
            this.callDirectGeminiAPI(text, chatImage, typingId);
        } else if (hasImage) {
            this.callBackendImageAnalysis(chatImage, text, typingId);
        } else {
            setTimeout(() => {
                this.removeTypingIndicator(typingId);
                this.processConversationalAIMessage(text);
            }, 180);
        }
    }

    async callBackendImageAnalysis(imageBase64, userPrompt, typingId) {
        try {
            const resp = await fetch(`${this.getApiBase()}/api/send-line`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyzeImage',
                    imageBase64,
                    prompt: userPrompt || ''
                })
            });
            const data = await resp.json();
            this.removeTypingIndicator(typingId);
            if (resp.ok && data && data.success && data.result) {
                this.handleBackendImageResult(data.result, userPrompt);
                return;
            }
            throw new Error((data && data.error) || 'Backend image analysis unavailable');
        } catch (err) {
            console.warn('Backend Vision fallback:', err);
            this.removeTypingIndicator(typingId);
            this.processAIImageOCR(imageBase64, userPrompt, true);
        }
    }

    handleBackendImageResult(result, userPrompt = '') {
        const todayStr = this.getLocalDateStr();
        const promptExtract = extractFoodAndAmount(userPrompt || '');
        const parsedAmount = Number(result.amount || (promptExtract && promptExtract.amount) || 0);

        if (result.type === 'slip') {
            const slipTitle = result.merchant || result.dishName || 'สลิปโอนเงิน/ใบเสร็จ';
            const detectedCal = Number(result.calories || 0);
            const slipType = result.slipType === 'income' ? 'income' : 'expense';
            const slipId = 'bank-slip-' + Date.now();

            if (parsedAmount > 0 && /(?:รายรับ|เงินเข้า|รายจ่าย|จ่าย|หัก)/i.test(userPrompt || '')) {
                this.commitFinanceSlipRecord({
                    type: /(?:รายรับ|เงินเข้า)/i.test(userPrompt) ? 'income' : 'expense',
                    title: slipTitle,
                    amount: parsedAmount,
                    calories: detectedCal > 0 ? detectedCal : null
                });
                return;
            }

            const actionCardHTML = `
                <div class="digital-slip-card" id="${slipId}">
                    <div class="slip-header">
                        <span class="slip-badge-tag">🏦 BANK SLIP SCANNER</span>
                        <span class="slip-status-badge">${slipType === 'income' ? '💰 รับเงิน' : '💸 จ่ายเงิน'}</span>
                    </div>
                    <div class="slip-title">${escapeHTML(slipTitle)}</div>
                    <div class="slip-price-row">
                        <span class="slip-price-amount">${parsedAmount > 0 ? `฿${formatMoney(parsedAmount)}` : 'ระบุยอดเงิน'}</span>
                        ${detectedCal > 0 ? `<span class="slip-cal-pill">🔥 ~${detectedCal} kcal</span>` : ''}
                    </div>
                    <div class="slip-input-bar">
                        <input type="number" id="${slipId}-input" class="slip-price-input" value="${parsedAmount > 0 ? parsedAmount : 100}" placeholder="จำนวนเงิน (บาท)">
                        <button class="btn-slip-deduct" onclick="aiAssistantController.confirmMealExpense('${escape(slipTitle)}', ${detectedCal}, '${slipId}-input', '${slipId}', 'expense')">
                            💸 ลงรายจ่าย
                        </button>
                    </div>
                    <div class="slip-chips-row">
                        <button type="button" class="slip-chip" style="border-color:#10b981;color:#10b981;" onclick="aiAssistantController.confirmMealExpense('${escape(slipTitle)}', 0, '${slipId}-input', '${slipId}', 'income')">💰 ลงเป็นรายรับ</button>
                    </div>
                </div>
            `;
            const msg = `🧾 **น้องธิดาอ่านสลิปเรียบร้อยค่ะ!**\n• รายการ: **${slipTitle}**\n• ยอดเงินที่อ่านได้: **${parsedAmount > 0 ? `฿${formatMoney(parsedAmount)}` : 'กรุณากรอกยอดเงิน'}**\n\nกดยืนยันด้านล่างเพื่อบันทึกลงบัญชีส่วนตัวได้เลยค่ะ 😊`;
            this.appendAIMessage(msg, actionCardHTML);
            this.saveToConversationHistory('model', msg);
            return;
        }

        if (result.type === 'food') {
            this.renderFoodAnalysisResult(
                result.dishName || 'อาหารจานเดียว',
                Number(result.calories) || 450,
                parsedAmount
            );
            return;
        }

        const msg = result.replyText || '📸 น้องธิดาวิเคราะห์ภาพเรียบร้อยค่ะ หากต้องการบันทึกรายจ่ายสามารถพิมพ์ชื่อและจำนวนเงินได้เลยนะคะ 😊';
        this.appendAIMessage(msg);
        this.saveToConversationHistory('model', msg);
    }

    async callBackendAIChat(userText) {
        const typingId = this.showTypingIndicator();
        try {
            const financeList = store.getFinance();
            const totalIncome = financeList.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
            const totalExpense = financeList.filter(x => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);
            const todayStr = this.getLocalDateStr();
            const todayCalories = financeList
                .filter(x => x.type === 'expense' && x.date === todayStr && (x.calories || (x.category && x.category.includes('อาหาร'))))
                .reduce((s, m) => s + (Number(m.calories) || 0), 0);

            const resp = await fetch(`${this.getApiBase()}/api/send-line`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'aiChat',
                    text: userText,
                    context: {
                        todayStr,
                        netBalance: totalIncome - totalExpense,
                        todayCalories,
                        pendingTasks: store.getTasks().filter(t => t.status !== 'completed').length
                    }
                })
            });
            const data = await resp.json();
            this.removeTypingIndicator(typingId);
            if (resp.ok && data && data.success && data.replyText) {
                if (data.parsedAction && data.parsedAction.type === 'finance' && Number(data.parsedAction.amount) > 0) {
                    this.commitFinanceSlipRecord({
                        type: data.parsedAction.financeType === 'income' ? 'income' : 'expense',
                        title: data.parsedAction.title || userText,
                        amount: Number(data.parsedAction.amount),
                        calories: Number(data.parsedAction.calories) || null
                    });
                    return;
                }
                this.appendAIMessage(data.replyText);
                this.saveToConversationHistory('model', data.replyText);
                return;
            }
        } catch (err) {
            console.warn('Backend aiChat fallback:', err);
        }
        this.removeTypingIndicator(typingId);
        const fallbackMsg = '✨ **สวัสดีค่ะคุณเจ้าของร้าน ดิฉันคือ "น้องธิดา" เลขาส่วนตัวค่ะ** 👩‍💼😊\nคุณสามารถสั่งงานได้ทันที เช่น:\n- *"กะเพรา 25 บาท"* (คำนวณแคลอรี่ + หักรายจ่าย)\n- *"รายรับ 500"* / *"เงินเข้า 1000"*\n- *"ลบรายการล่าสุด"* (ยกเลิกรายการเมื่อกี้)\n- *"วันนี้กินไปกี่แคล"* / *"เงินเหลือเท่าไหร่"*\n- *"ไม่ว่างวันที่ 5 ถึง 10"*';
        this.appendAIMessage(fallbackMsg);
        this.saveToConversationHistory('model', fallbackMsg);
    }

    saveToConversationHistory(role, text) {
        this.conversationHistory.push({ role, text });
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }
    }

    callDirectGeminiAPI(userText, imageBase64, typingId) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.geminiApiKey}`;

        let contextText = `คุณคือ 'น้องธิดา' (Thida) เลขาส่วนตัวอัจฉริยะของคุณเจ้าของร้าน พูดจาสุภาพ นอบน้อม ชาญฉลาด มีไหวพริบ แทนตัวเองว่า 'น้องธิดา' หรือ 'ธิดา' เสมอ\n\nประวัติการคุยก่อนหน้า:\n`;

        this.conversationHistory.slice(-6).forEach(msg => {
            contextText += `${msg.role === 'user' ? 'ผู้ใช้' : 'น้องธิดา'}: ${msg.text}\n`;
        });

        contextText += `\nข้อความล่าสุดจากผู้ใช้: "${userText}"`;

        const parts = [{ text: contextText }];
        if (imageBase64) {
            const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                }
            });
        }

        const contents = [{ parts }];

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            this.removeTypingIndicator(typingId);
            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                const aiReply = data.candidates[0].content.parts[0].text;
                this.processConversationalAIMessage(userText, aiReply);
            } else {
                this.processConversationalAIMessage(userText);
            }
        })
        .catch(err => {
            console.warn('Gemini API Warning (Using Smart Engine Fallback):', err);
            this.removeTypingIndicator(typingId);
            this.processConversationalAIMessage(userText);
        });
    }

    appendUserMessage(text, imageBase64) {
        if (!this.chatMessagesContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-message-bubble user-msg';
        msgDiv.innerHTML = `
            <div class="msg-avatar">👤</div>
            <div class="msg-content">
                ${imageBase64 ? `<img src="${imageBase64}" style="max-width: 140px; border-radius: 8px; margin-bottom: 6px; display: block;">` : ''}
                ${escapeHTML(text).replace(/\n/g, '<br>')}
            </div>
        `;

        this.chatMessagesContainer.appendChild(msgDiv);
        this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }

    appendAIMessage(text, actionCardHTML = '') {
        if (!this.chatMessagesContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-message-bubble ai-msg';
        msgDiv.innerHTML = `
            <div class="msg-avatar"><img src="assets/thida_avatar.jpg" alt="น้องธิดา" class="msg-avatar-img"></div>
            <div class="msg-content">
                ${escapeHTML(text).replace(/\n/g, '<br>')}
                ${actionCardHTML}
            </div>
        `;

        this.chatMessagesContainer.appendChild(msgDiv);
        this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = 'ai-message-bubble ai-msg typing-bubble';
        msgDiv.innerHTML = `
            <div class="msg-avatar"><img src="assets/thida_avatar.jpg" alt="น้องธิดา" class="msg-avatar-img"></div>
            <div class="msg-content">น้องธิดากำลังวิเคราะห์ข้อมูลและจัดเรียงให้คุณเจ้าของร้านค่ะ... 👩‍💼💭</div>
        `;
        if (this.chatMessagesContainer) {
            this.chatMessagesContainer.appendChild(msgDiv);
            this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
        }
        return id;
    }

    removeTypingIndicator(id) {
        const elem = document.getElementById(id);
        if (elem) elem.remove();
    }

    formatThaiDateStr(dateStr) {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
    }

    // 🇹🇭 THAI NUMBER WORD TO DIGIT NORMALIZER (แปลง "สอง" -> 2, "เจ็ด" -> 7, "สิบห้า" -> 15)
    normalizeThaiText(text) {
        if (!text) return '';
        let normalized = text.toLowerCase();

        const thaiNumMap = {
            'สามสิบเอ็ด': '31', 'สามสิบ': '30', 'ยี่สิบเก้า': '29', 'ยี่สิบแปด': '28',
            'ยี่สิบเจ็ด': '27', 'ยี่สิบหก': '26', 'ยี่สิบห้า': '25', 'ยี่สิบสี่': '24',
            'ยี่สิบสาม': '23', 'ยี่สิบสอง': '22', 'ยี่สิบเอ็ด': '21', 'ยี่สิบ': '20',
            'สิบเก้า': '19', 'สิบแปด': '18', 'สิบเจ็ด': '17', 'สิบหก': '16',
            'สิบห้า': '15', 'สิบสี่': '14', 'สิบสาม': '13', 'สิบสอง': '12',
            'สิบเอ็ด': '11', 'สิบ': '10', 'เก้า': '9', 'แปด': '8',
            'เจ็ด': '7', 'หก': '6', 'ห้า': '5', 'สี่': '4',
            'สาม': '3', 'สอง': '2', 'หนึ่ง': '1', 'ศูนย์': '0'
        };

        // Sort keys by length descending so long words are replaced first
        Object.keys(thaiNumMap).sort((a, b) => b.length - a.length).forEach(word => {
            const reg = new RegExp(word, 'g');
            normalized = normalized.replace(reg, thaiNumMap[word]);
        });

        return normalized;
    }

    getLocalDateStr(dateObj) {
        const d = dateObj || new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // 🎯 RELATIVE THAI DATE PARSER ENGINE (เมื่อวาน, พรุ่งนี้, มะรืน, เสาร์-อาทิตย์นี้, สิ้นเดือน)
    parseRelativeThaiDate(text) {
        const now = new Date();
        const lower = text.toLowerCase();

        if (lower.includes('เมื่อวาน') || lower.includes('เมื่อวานนี้')) {
            const yesterday = new Date(now.getTime() - 86400000);
            return this.getLocalDateStr(yesterday);
        }
        if (lower.includes('มะรืน') || lower.includes('มะรืนนี้')) {
            const dayAfter = new Date(now.getTime() + (86400000 * 2));
            return this.getLocalDateStr(dayAfter);
        }
        if (lower.includes('พรุ่งนี้')) {
            const tomorrow = new Date(now.getTime() + 86400000);
            return this.getLocalDateStr(tomorrow);
        }
        if (lower.includes('สิ้นเดือน')) {
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return this.getLocalDateStr(endOfMonth);
        }
        if (lower.includes('เสาร์นี้') || lower.includes('เสาร์อาทิตย์นี้')) {
            const currentDay = now.getDay();
            const daysUntilSaturday = (6 - currentDay + 7) % 7;
            const sat = new Date(now.getTime() + (daysUntilSaturday * 86400000));
            return this.getLocalDateStr(sat);
        }

        return this.getLocalDateStr(now); // default today
    }

    // 🎨 ULTRA-SMART THAI CATEGORY DETECTOR (จำแนกหมวดหมู่อัตโนมัติจากคำพูดภาษาไทย)
    detectSmartCategory(title) {
        const t = title.toLowerCase();

        // 🏠 ค่าที่พัก & ค่าห้อง
        if (t.includes('หอ') || t.includes('ห้อง') || t.includes('คอนโด') || t.includes('บ้าน') || t.includes('ค่าเช่า') || t.includes('มัดจำ')) {
            return '🏠 ค่าที่พัก & ค่าห้อง';
        }
        // 🚗 ค่าเดินทาง & ค่ารถ
        if (t.includes('รถ') || t.includes('น้ำมัน') || t.includes('แท็กซี่') || t.includes('วิน') || t.includes('bts') || t.includes('mrt') || t.includes('ตั๋ว') || t.includes('ทางด่วน') || t.includes('ที่จอดรถ') || t.includes('ซ่อมรถ') || t.includes('ล้างรถ')) {
            return '🚗 ค่าเดินทาง & ค่ารถ';
        }
        // 🍔 อาหาร & เครื่องดื่ม
        if (t.includes('ไก่') || t.includes('เซเว่น') || t.includes('อาหาร') || t.includes('ข้าว') || t.includes('ขนม') || t.includes('กาแฟ') || t.includes('น้ำ') || t.includes('เค้ก') || t.includes('ส้มตำ') || t.includes('ชา') || t.includes('ชาบู') || t.includes('หมูกระทะ') || t.includes('มื้อ')) {
            return '🍔 อาหาร & เครื่องดื่ม';
        }
        // 💡 บิล & ค่าสาธารณูปโภค
        if (t.includes('ไฟ') || t.includes('เน็ต') || t.includes('บิล') || t.includes('โทรศัพท์') || t.includes('น้ำประปา') || t.includes('มือถือ') || t.includes('ais') || t.includes('true') || t.includes('dtac')) {
            return '💡 บิล & ค่าสาธารณูปโภค';
        }
        // 🛍️ ช้อปปิ้ง & ของใช้
        if (t.includes('เสื้อ') || t.includes('ช้อป') || t.includes('กระเป๋า') || t.includes('รองเท้า') || t.includes('ของใช้') || t.includes('กางเกง') || t.includes('shopee') || t.includes('lazada') || t.includes('สบู่') || t.includes('ยาสระผม')) {
            return '🛍️ ช้อปปิ้ง & ของใช้';
        }
        // 💊 สุขภาพ & รักษาพยาบาล
        if (t.includes('ตัดผม') || t.includes('ครีม') || t.includes('เครื่องสำอาง') || t.includes('สปา') || t.includes('หมอ') || t.includes('ยา') || t.includes('วิตามิน') || t.includes('ทำฟัน') || t.includes('คลินิก') || t.includes('โรงพยาบาล')) {
            return '💊 สุขภาพ & รักษาพยาบาล';
        }
        // 🎬 ความบันเทิง & พักผ่อน
        if (t.includes('เน็ตฟลิกซ์') || t.includes('netflix') || t.includes('เกม') || t.includes('หนัง') || t.includes('ตั๋วหนัง') || t.includes('เที่ยว') || t.includes('โรงแรม') || t.includes('สตรีมมิ่ง') || t.includes('spotify') || t.includes('youtube')) {
            return '🎬 ความบันเทิง & พักผ่อน';
        }
        // 🎓 การศึกษา & อุปกรณ์การเรียน
        if (t.includes('เทอม') || t.includes('สมุด') || t.includes('ปากกา') || t.includes('หนังสือ') || t.includes('คอร์ส') || t.includes('สอบ') || t.includes('เรียน') || t.includes('การบ้าน')) {
            return '🎓 การศึกษา & อุปกรณ์การเรียน';
        }
        // 💳 หนึ้สิน & ผ่อนค่างวด
        if (t.includes('งวด') || t.includes('ผ่อน') || t.includes('บัตรเครดิต') || t.includes('หนี้') || t.includes('กู้') || t.includes('ดอกเบี้ย')) {
            return '💳 หนึ้สิน & ผ่อนค่างวด';
        }
        // 🎁 สังคม & ทำบุญ/ของขวัญ
        if (t.includes('บุญ') || t.includes('ขวัญ') || t.includes('ซอง') || t.includes('งานแต่ง') || t.includes('เลี้ยง') || t.includes('วันเกิด') || t.includes('บริจาค')) {
            return '🎁 สังคม & ทำบุญ/ของขวัญ';
        }
        return '📦 อื่นๆ';
    }

    // ⚡ ULTRA-SMART MULTI-TRANSACTION NLP PARSER ENGINE
    parseMultiTransactions(text, dateStr) {
        const norm = this.normalizeThaiText(text);
        const results = [];

        // 1. EXTRACT ALL INCOME TRANSACTIONS
        const incomePattern = /(รับเงินมา|รับมา|ได้เงินมา|ได้มา|รายรับ|ยอดเข้า|โอนเข้า|เงินเข้า|ขายของได้|ได้เงิน|รับเงิน|ได้ค่านายหน้า)\s*(\d+([\.,]\d+)?)/gi;
        let incMatch;
        while ((incMatch = incomePattern.exec(norm)) !== null) {
            const label = incMatch[1];
            const amount = parseFloat(incMatch[2].replace(',', ''));
            if (amount > 0) {
                results.push({
                    type: 'income',
                    title: `รายรับ (${label})`,
                    amount: amount,
                    category: 'รายได้เสริม/งานนอก'
                });
            }
        }

        // 2. EXTRACT ALL EXPENSE TRANSACTIONS WITH SMART CATEGORY MATCHING
        const expensePattern = /(จ่าย|ค่า|ซื้อ|เสียไป)\s*([^\d\s,]+?)\s*(ไป|จำนวน)?\s*(\d+([\.,]\d+)?)\s*(บาท|บ\b)?/gi;
        let expMatch;
        while ((expMatch = expensePattern.exec(norm)) !== null) {
            const prefix = expMatch[1];
            const rawTitle = expMatch[2].trim();
            const amount = parseFloat(expMatch[4].replace(',', ''));

            const incomeWords = ['รับเงินมา', 'รับมา', 'ได้เงินมา', 'ได้มา', 'รายรับ', 'ยอดเข้า', 'โอนเข้า', 'เงินมา', 'ขายของได้'];
            if (amount > 0 && !incomeWords.includes(rawTitle)) {
                let cleanTitle = `${prefix}${rawTitle}`.replace(/^จ่าย/, '');
                if (!cleanTitle.startsWith('ค่า') && !cleanTitle.startsWith('ซื้อ')) {
                    cleanTitle = 'ค่า' + cleanTitle;
                }

                const autoCategory = this.detectSmartCategory(cleanTitle);

                const isDuplicate = results.some(r => r.type === 'expense' && r.title === cleanTitle && r.amount === amount);
                if (!isDuplicate) {
                    const calInfo = calculateFoodCalories(cleanTitle);
                    results.push({
                        type: 'expense',
                        title: cleanTitle,
                        amount: amount,
                        category: autoCategory,
                        calories: calInfo.isFood ? calInfo.calories : null
                    });
                }
            }
        }

        return results;
    }

    // 📅 ULTRA-ROBUST THAI DATE RANGE PARSER (รองรับ "วันที่ 1 - 7", "วันที่ 2 จนถึงวันที่ 7", "2 ถึง 7")
    parseThaiDateRange(text) {
        const norm = this.normalizeThaiText(text);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Explicit Range: "1 - 7", "1-7", "1 ถึง 7", "1 จนถึง 7", "ตั้งแต่วันที่ 2 จนถึงวันที่ 7"
        const rangeMatch = norm.match(/(\d{1,2})\s*(?:ถึง|จนถึง|ถึงวันที่|จนถึงวันที่|-|\s-\s)\s*(\d{1,2})/i);
        const tillMatch = norm.match(/(?:ยาวถึงวันที่|ถึงวันที่|ยาวถึง|ถึงวัน|ถึง|จนถึง)\s*(\d{1,2})/i);

        if (rangeMatch) {
            const startDay = parseInt(rangeMatch[1]);
            const endDay = parseInt(rangeMatch[2]);
            if (startDay >= 1 && startDay <= 31 && endDay >= 1 && endDay <= 31) {
                const isNextMonth = endDay < startDay;
                return this.generateDateArray(currentYear, currentMonth, startDay, endDay, isNextMonth);
            }
        }

        if (tillMatch) {
            const startDay = now.getDate();
            const endDay = parseInt(tillMatch[1]);
            if (endDay >= 1 && endDay <= 31) {
                const isNextMonth = endDay < startDay;
                return this.generateDateArray(currentYear, currentMonth, startDay, endDay, isNextMonth);
            }
        }

        return null;
    }

    generateDateArray(year, month, startDay, endDay, isNextMonth = false) {
        const result = [];
        let cur = new Date(year, month, startDay);
        let end = new Date(year, isNextMonth ? month + 1 : month, endDay);

        while (cur <= end) {
            result.push(this.getLocalDateStr(cur));
            cur.setDate(cur.getDate() + 1);
        }
        return result;
    }

    // 📅 SMART CALENDAR & APPOINTMENT NLP PARSER (รองรับ มีสอบ/หาหมอ/ธุระ, ระบุเวลา, วันที่เดี่ยว/ช่วงวัน, ยกเลิกนัด)
    parseSmartCalendarAppointment(rawText) {
        const norm = this.normalizeThaiText(rawText);
        const lower = norm.toLowerCase();
        const now = new Date();

        // 1. Check if user is asking to clear / cancel busy status
        const isCancel = lower.includes('ว่างแล้ว') || lower.includes('ยกเลิกนัด') || lower.includes('ลบนัด') || lower.includes('ลบวันไม่ว่าง') || lower.includes('เปลี่ยนเป็นว่าง');

        // 2. Extract Time
        let timeStr = 'ทั้งวัน';
        const timeRangeMatch = norm.match(/(\d{1,2}[:.]\d{2})\s*(?:-|–|ถึง|จนถึง)\s*(\d{1,2}[:.]\d{2})\s*(?:น\.|น|นาฬิกา)?/i);
        const thaiHourRangeMatch = norm.match(/(\d{1,2})\s*โมง(?:\s*เช้า|\s*บ่าย|\s*แลง)?\s*(?:ถึง|จนถึง|-)\s*(?:(เที่ยง)|(\d{1,2})\s*โมง(?:\s*เช้า|\s*บ่าย|\s*เย็น)?|(\d{1,2}[:.]\d{2}))/i);

        if (timeRangeMatch) {
            timeStr = `${timeRangeMatch[1].replace('.', ':')} - ${timeRangeMatch[2].replace('.', ':')} น.`;
        } else if (thaiHourRangeMatch) {
            let startH = parseInt(thaiHourRangeMatch[1], 10);
            let endHStr = '';
            if (thaiHourRangeMatch[2]) { // เที่ยง
                endHStr = '12:00';
            } else if (thaiHourRangeMatch[3]) {
                let endH = parseInt(thaiHourRangeMatch[3], 10);
                if (endH < 12 && (norm.includes('บ่าย') || endH <= 6)) endH += 12;
                endHStr = `${String(endH).padStart(2, '0')}:00`;
            } else if (thaiHourRangeMatch[4]) {
                endHStr = thaiHourRangeMatch[4].replace('.', ':');
            }
            let startHStr = `${String(startH).padStart(2, '0')}:00`;
            timeStr = `${startHStr} - ${endHStr} น.`;
        } else if (norm.includes('ช่วงเช้า') || norm.includes('ตอนเช้า')) {
            timeStr = 'ช่วงเช้า (09:00 - 12:00)';
        } else if (norm.includes('ช่วงบ่าย') || norm.includes('ตอนบ่าย')) {
            timeStr = 'ช่วงบ่าย (13:00 - 16:00)';
        } else if (norm.includes('ช่วงเย็น') || norm.includes('ตอนเย็น')) {
            timeStr = 'ช่วงเย็น (17:00 - 20:00)';
        } else if (norm.includes('ช่วงค่ำ') || norm.includes('กลางคืน')) {
            timeStr = 'ช่วงค่ำ (19:00 - 21:00)';
        } else {
            const singleTimeMatch = norm.match(/(\d{1,2}[:.]\d{2})\s*(?:น\.|น|นาฬิกา)?/i);
            if (singleTimeMatch) {
                timeStr = `${singleTimeMatch[1].replace('.', ':')} น.`;
            }
        }

        // 3. Extract Dates
        let targetDates = [];
        // Check date range first: "วันที่ 1 ถึง 5", "1 - 5", "ตั้งแต่วันที่ 2 ถึง 7"
        const rangeMatch = norm.match(/(?:วันที่\s*)?(\d{1,2})\s*(?:ถึง|จนถึง|ถึงวันที่|จนถึงวันที่|-)\s*(?:วันที่\s*)?(\d{1,2})/i);
        if (rangeMatch) {
            const sDay = parseInt(rangeMatch[1], 10);
            const eDay = parseInt(rangeMatch[2], 10);
            if (sDay >= 1 && sDay <= 31 && eDay >= 1 && eDay <= 31) {
                let m = now.getMonth();
                let y = now.getFullYear();
                if (sDay < now.getDate() && !norm.includes('ส.ค.') && !norm.includes('กันยา')) {
                    m++;
                    if (m > 11) { m = 0; y++; }
                }
                let cur = new Date(y, m, sDay);
                let end = new Date(y, eDay < sDay ? m + 1 : m, eDay);
                while (cur <= end) {
                    targetDates.push(this.getLocalDateStr(cur));
                    cur.setDate(cur.getDate() + 1);
                }
            }
        }

        if (targetDates.length === 0) {
            // Check relative date words
            let dObj = null;
            if (norm.includes('พรุ่งนี้')) {
                dObj = new Date(now.getTime() + 86400000);
            } else if (norm.includes('มะรืน')) {
                dObj = new Date(now.getTime() + 86400000 * 2);
            } else if (norm.includes('วันนี้')) {
                dObj = new Date(now.getTime());
            } else if (norm.includes('เสาร์นี้')) {
                const daysUntilSat = (6 - now.getDay() + 7) % 7;
                dObj = new Date(now.getTime() + daysUntilSat * 86400000);
            } else if (norm.includes('อาทิตย์นี้')) {
                const daysUntilSun = (7 - now.getDay()) % 7;
                dObj = new Date(now.getTime() + daysUntilSun * 86400000);
            } else {
                const dayMatch = norm.match(/วันที่\s*(\d{1,2})/i) || norm.match(/(?:วัน\s*)?(\d{1,2})\s*(?:ม\.ค|ก\.พ|มี\.ค|เม\.ย|พ\.ค|มิ\.ย|ก\.ค|ส\.ค|ก\.ย|ต\.ค|พ\.ย|ธ\.ค|ตุลา|กันยา)/i);
                if (dayMatch) {
                    const dayNum = parseInt(dayMatch[1], 10);
                    if (dayNum >= 1 && dayNum <= 31) {
                        let y = now.getFullYear();
                        let m = now.getMonth();
                        if (dayNum < now.getDate() && !norm.includes('ส.ค.') && !norm.includes('กันยา')) {
                            m++;
                            if (m > 11) { m = 0; y++; }
                        }
                        dObj = new Date(y, m, dayNum);
                    }
                }
            }

            if (dObj) {
                targetDates.push(this.getLocalDateStr(dObj));
            }
        }

        // 4. Extract Activity / Reason Title
        let title = '';
        const knownActivities = [
            'มีสอบ', 'สอบ', 'ไปหาหมอ', 'นัดหมอ', 'ตรวจฟัน', 'ทำฟัน',
            'คุยกับผู้ใหญ่', 'ประชุม', 'สัมภาษณ์งาน', 'สัมภาษณ์',
            'ไปงานแต่ง', 'งานแต่ง', 'ไปต่างจังหวัด', 'ไปเที่ยว',
            'ต่อใบขับขี่', 'ติดธุระ', 'ธุระส่วนตัว', 'ธุระ'
        ];
        for (const act of knownActivities) {
            if (norm.includes(act)) {
                title = act;
                const actIdx = rawText.indexOf(act);
                if (actIdx !== -1) {
                    const tail = rawText.substring(actIdx + act.length);
                    const normTail = this.normalizeThaiText(tail);
                    const cleanTail = normTail
                        .replace(/\d{1,2}[:.]\d{2}\s*[-–ถึง]\s*\d{1,2}[:.]\d{2}/g, '')
                        .replace(/\d{1,2}\s*โมง(?:\s*เช้า|\s*บ่าย|\s*แลง)?\s*(?:ถึง|จนถึง|-)\s*(?:เที่ยง|\d{1,2}\s*โมง|\d{1,2}[:.]\d{2})/gi, '')
                        .replace(/\d{1,2}[:.]\d{2}/g, '')
                        .replace(/ช่วง\s*(?:เช้า|บ่าย|เย็น|ค่ำ|กลางคืน)/g, '')
                        .replace(/ตอน\s*(?:เช้า|บ่าย|เย็น|ค่ำ|กลางคืน)/g, '')
                        .replace(/เวลา\s*[^,\s]+/g, '')
                        .replace(/วันที่\s*\d{1,2}/g, '')
                        .replace(/ทั้งวัน|ให้หน่อย|ช่วย|ครับ|ค่ะ|คะ|นะ|นะคะ/g, '')
                        .trim();
                    if (cleanTail.length > 0 && cleanTail.length < 25) {
                        title = `${act} ${cleanTail}`.trim();
                    }
                }
                break;
            }
        }

        if (!title) {
            let cleaned = rawText
                .replace(/สมมุติฉัน|สมมุติว่า|สมมุติ|ฉัน|ผม|ช่วย|ให้หน่อย|บันทึกให้หน่อย|เพิ่มลงปฏิทินให้หน่อย|ลงปฏิทิน|เพิ่มลงปฏิทิน|บันทึกปฏิทิน|ปฏิทิน/g, '')
                .replace(/วันที่\s*\d{1,2}/g, '')
                .replace(/พรุ่งนี้|มะรืนนี้|มะรืน|วันนี้/g, '')
                .replace(/เวลา\s*[^,\s]+/g, '')
                .replace(/ช่วง\s*(?:เช้า|บ่าย|เย็น|ค่ำ|กลางคืน)/g, '')
                .replace(/\d{1,2}[:.]\d{2}\s*[-–ถึง]\s*\d{1,2}[:.]\d{2}/g, '')
                .replace(/ไม่ว่าง/g, '')
                .trim();
            if (cleaned.length >= 2) {
                title = cleaned;
            } else {
                title = 'ติดภารกิจ/ไม่ว่าง';
            }
        }

        return {
            isCancel,
            targetDates,
            time: timeStr,
            title
        };
    }

    processConversationalAIMessage(text, geminiDirectReply = null) {
        this.saveToConversationHistory('user', text);

        const normalizedText = this.normalizeThaiText(text);
        const lower = normalizedText.toLowerCase();
        const targetDateStr = this.parseRelativeThaiDate(text);

        // 1. SUBMITTED TASKS IN PAST 3 DAYS QUERY INTENT
        if (lower.includes('ส่งเเล้ว') || lower.includes('ส่งแล้ว') || lower.includes('3 วัน') || lower.includes('งานที่ส่ง')) {
            const allTasks = store.getTasks();
            const completedTasks = allTasks.filter(t => t.status === 'completed');

            let replyMsg = '';
            if (completedTasks.length > 0) {
                const lines = completedTasks.map((t, idx) => {
                    const dateFormatted = t.completedDate ? this.formatThaiDateStr(t.completedDate) : '3 วันที่ผ่านมา';
                    return `${idx + 1}. **${t.title}**\n   • กำหนดส่ง/วันที่เสร็จ: ${dateFormatted}\n   • โน้ต: ${t.note || 'ไม่มีโน้ต'}`;
                }).join('\n\n');

                replyMsg = `✨ **สรุปประวัติงานที่ส่งเรียบร้อยแล้วใน 3 วันที่ผ่านมาค่ะคุณเจ้าของร้าน** 📝📋\n\n${lines}\n\n🎉 รวมงานที่ส่งแล้วทั้งสิ้น ${completedTasks.length} รายการค่ะ! ดิฉันจัดเก็บบันทึกประวัติให้อย่างปลอดภัยค่ะ ✨`;
            } else {
                replyMsg = `✨ **รายงานประวัติงานส่งแล้วค่ะ** 📝\n\nขณะนี้ยังไม่มีรายการงานที่กดส่งหรือทำเสร็จใน 3 วันที่ผ่านมาค่ะ คุณสามารถกดติ๊กถูก ✅ ในเมนู **งานค้าง (Tasks)** เพื่อเปลี่ยนสถานะเป็นส่งแล้วได้เลยค่ะ!`;
            }

            this.appendAIMessage(replyMsg);
            this.saveToConversationHistory('model', replyMsg);
            if (window.appController) window.appController.switchTab('tasks');
            return;
        }

        // 2. WEATHER QUERY INTENT
        if (lower.includes('ฝน') || lower.includes('อากาศ') || lower.includes('ตกไหม')) {
            const isRain = window.weatherController ? window.weatherController.isRaining : false;
            const temp = window.weatherController ? window.weatherController.currentTemp || 29 : 29;
            const city = window.weatherController ? window.weatherController.cityName || 'พิกัดปัจจุบัน' : 'พิกัดปัจจุบัน';

            let replyMsg = '';
            if (isRain) {
                replyMsg = `✨ **รายงานสภาพอากาศโดย Gemini AI 1.5 ค่ะ** 📍 ${city}\n\n🌧️ **ขณะนี้มีแนวโน้มฝนตกในพื้นที่ค่ะ!**\n🌡️ อุณหภูมิ: ${temp}°C\n☔ คำแนะนำ: อย่าลืมพกร่มติดตัวและขับรถด้วยความระมัดระวังนะคะคุณเจ้าของร้าน!`;
            } else {
                replyMsg = `✨ **รายงานสภาพอากาศโดย Gemini AI 1.5 ค่ะ** 📍 ${city}\n\n🌤️ **ขณะนี้ฝนไม่ตกค่ะ!** ท้องฟ้าสดใสดี\n🌡️ อุณหภูมิ: ${temp}°C\n☀️ สภาพอากาศเอื้ออำนวยต่อการเดินทางทำธุระค่ะ 😊`;
            }

            this.appendAIMessage(replyMsg);
            this.saveToConversationHistory('model', replyMsg);
            return;
        }

        // 2.5 UNDO LAST FINANCE TRANSACTION INTENT
        if (/(?:ลบรายการล่าสุด|ยกเลิกรายการล่าสุด|ยกเลิกเมื่อกี้|ลบล่าสุด|ลบอันเมื่อกี้|ยกเลิกอันเมื่อกี้)/i.test(lower)) {
            const deleted = this.undoLastFinanceItem();
            return;
        }

        // 3. CALORIE & FOOD TRACKING & EXPENSE/INCOME AUTO-SLIP INTENT
        const extractedFood = extractFoodAndAmount(text);
        if (extractedFood) {
            const calInfo = calculateFoodCalories(extractedFood.food);

            if (extractedFood.isQueryOnly) {
                const replyMsg = `🥗 **ข้อมูลแคลอรี่เมนู "${calInfo.name || extractedFood.food}" จากน้องธิดาค่ะ** 🔥\n\n` +
                    `• พลังงานโดยประมาณ: **~${calInfo.calories} kcal** ${calInfo.addonNote ? `\n• ${calInfo.addonNote}` : ''}\n\n` +
                    `💡 *หากทานเมนูนี้และต้องการบันทึกลงรายรับรายจ่ายส่วนตัว สามารถพิมพ์บอกราคาได้เลยนะคะ เช่น "${extractedFood.food} 25 บาท" น้องธิดาจะหักเงินและบันทึกแคลอรี่ให้ทันทีค่ะ 😊*`;

                this.appendAIMessage(replyMsg);
                this.saveToConversationHistory('model', replyMsg);
                return;
            }

            const todayStr = this.getLocalDateStr();
            const dateToUse = targetDateStr || todayStr;
            if (extractedFood.isIncome) {
                this.commitFinanceSlipRecord({
                    type: 'income',
                    category: '💰 รายรับส่วนตัว',
                    title: extractedFood.food,
                    amount: extractedFood.amount,
                    calories: null,
                    date: dateToUse,
                    note: `บันทึกรายรับส่วนตัวโดยน้องธิดา (${this.formatThaiDateStr(dateToUse)})`
                });
                return;
            }

            const category = calInfo.isFood ? '🍔 อาหาร & เครื่องดื่ม' : this.detectSmartCategory(extractedFood.food);
            const foodTitle = calInfo.isFood ? (calInfo.name || extractedFood.food) : extractedFood.food;
            this.commitFinanceSlipRecord({
                type: 'expense',
                category: category,
                title: foodTitle,
                amount: extractedFood.amount,
                calories: calInfo.isFood ? calInfo.calories : null,
                date: dateToUse,
                note: calInfo.isFood
                    ? `คำนวณแคลอรี่ (${calInfo.calories} kcal) และหักลบรายจ่ายส่วนตัวอัตโนมัติ ${calInfo.addonNote || ''}`.trim()
                    : `บันทึกรายจ่ายส่วนตัวอัตโนมัติโดยน้องธิดา (${this.formatThaiDateStr(dateToUse)})`
            });
            return;
        }

        // 4. DAILY CALORIE SUMMARY INTENT (เช่น "วันนี้กินไปกี่แคล", "กินไปกี่แคลแล้ว", "สรุปแคลอรี่", "แคลอรี่วันนี้", "เช็กแคลอรี่")
        if (lower.includes('กี่แคล') || lower.includes('สรุปแคล') || lower.includes('เช็กแคล') || lower.includes('แคลอรี่วันนี้') || lower.includes('กินไปเท่าไหร่')) {
            const todayStr = this.getLocalDateStr();
            const financeList = store.getFinance();
            const todayMeals = financeList.filter(x => 
                x.type === 'expense' && 
                x.date === todayStr && 
                (x.calories || (x.category && x.category.includes('อาหาร')))
            );
            const totalCalories = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 450), 0);
            const totalMealCost = todayMeals.reduce((sum, m) => sum + Number(m.amount || 0), 0);
            const remaining = Math.max(0, 2000 - totalCalories);

            let mealsList = todayMeals.length > 0
                ? todayMeals.map((m, idx) => `   ${idx + 1}. **${m.title}**: ~${m.calories || 450} kcal (-฿${formatMoney(m.amount)})`).join('\n')
                : '   • ยังไม่มีบันทึกมื้ออาหารวันนี้';

            const replyMsg = `🥗 **สรุปแคลอรี่และมื้ออาหารวันนี้จากน้องธิดาค่ะ** 🔥\n📅 วันที่ ${this.formatThaiDateStr(todayStr)}\n\n` +
                `• พลังงานที่ทานไป: **${totalCalories.toLocaleString()} / 2,000 kcal**\n` +
                `• โควตาที่ยังทานได้อีก: **~${remaining.toLocaleString()} kcal**\n` +
                `• รวมค่าอาหารวันนี้: **฿${formatMoney(totalMealCost)}** (หักลบจากรายจ่ายส่วนตัวเรียบร้อย)\n\n` +
                `📋 **รายการอาหารวันนี้ (${todayMeals.length} มื้อ)**:\n${mealsList}\n\n` +
                `💡 พิมพ์สั่งได้ทันที เช่น *"กะเพรา 25 บาท"* น้องธิดาจะคำนวณแคลอรี่และหักลบรายจ่ายส่วนตัวให้ทันทีค่ะ 😊`;

            this.appendAIMessage(replyMsg);
            this.saveToConversationHistory('model', replyMsg);
            return;
        }

        // 5. PERSONAL BALANCE QUERY INTENT (เช่น "เงินเหลือเท่าไหร่", "เงินคงเหลือ", "เช็กเงิน", "ยอดเงินส่วนตัว", "เงินส่วนตัวเหลือเท่าไหร่")
        if ((lower.includes('เงินเหลือ') || lower.includes('เงินคงเหลือ') || lower.includes('เช็กเงิน') || lower.includes('ยอดเงิน')) && !lower.includes('ร้าน') && !lower.includes('ยอดขาย')) {
            const financeList = store.getFinance();
            const totalIncome = financeList.filter(x => x.type === 'income').reduce((sum, x) => sum + Number(x.amount), 0);
            const totalExpense = financeList.filter(x => x.type === 'expense').reduce((sum, x) => sum + Number(x.amount), 0);
            const netBalance = totalIncome - totalExpense;

            const replyMsg = `💵 **รายงานยอดเงินคงเหลือส่วนตัวจากน้องธิดาค่ะ** 💳\n\n` +
                `• เงินคงเหลือสุทธิ: **฿${formatMoney(netBalance)}**\n` +
                `• รายรับส่วนตัวสะสม: ฿${formatMoney(totalIncome)}\n` +
                `• รายจ่ายส่วนตัวสะสม: ฿${formatMoney(totalExpense)}\n\n` +
                `🔒 *(ข้อมูลนี้เป็นรายรับ-รายจ่ายส่วนตัวของคุณ 100% แยกส่วนชัดเจน ไม่ปะปนกับยอดขายหรือกำไรของร้านค้าค่ะ)*`;

            this.appendAIMessage(replyMsg);
            this.saveToConversationHistory('model', replyMsg);
            return;
        }

        // 6. CHECK MULTI-TRANSACTION COMPOUND SENTENCE WITH RELATIVE DATE
        const parsedTransactions = this.parseMultiTransactions(text, targetDateStr);
        if (parsedTransactions && parsedTransactions.length > 0) {
            let incomeTotal = 0;
            let expenseTotal = 0;
            const incomeLines = [];
            const expenseLines = [];

            parsedTransactions.forEach(item => {
                store.addFinanceItem({
                    date: targetDateStr,
                    type: item.type,
                    category: item.category,
                    title: item.title,
                    amount: item.amount,
                    calories: item.calories || null,
                    note: `บันทึกและจำแนกหมวดหมู่อัตโนมัติโดย Gemini AI (${this.formatThaiDateStr(targetDateStr)})`
                });

                if (item.type === 'income') {
                    incomeTotal += item.amount;
                    incomeLines.push(`• ${item.title}: ฿${formatMoney(item.amount)} [${item.category}]`);
                } else {
                    expenseTotal += item.amount;
                    const calBadge = item.calories ? ` (~${item.calories} kcal)` : '';
                    expenseLines.push(`• ${item.title}${calBadge}: ฿${formatMoney(item.amount)} [หมวด: ${item.category}]`);
                }
            });

            if (window.financeController) window.financeController.render();
            if (window.chartRenderController) {
                window.chartRenderController.initFinanceCategoryChart();
                window.chartRenderController.initMainOverviewChart();
            }

            const formattedTargetDate = this.formatThaiDateStr(targetDateStr);

            let replyMsg = `✨ **Gemini AI บันทึกและจำแนกหมวดหมู่สีวงกลมกราฟให้อัตโนมัติประจำวันที่ ${formattedTargetDate} ครบทั้ง ${parsedTransactions.length} รายการเรียบร้อยแล้วค่ะ!** 📊🎨\n\n`;
            if (incomeLines.length > 0) {
                replyMsg += `💰 **รายรับ (${incomeLines.length} รายการ)**:\n${incomeLines.join('\n')}\n\n`;
            }
            if (expenseLines.length > 0) {
                replyMsg += `💸 **รายจ่าย (${expenseLines.length} รายการ)**:\n${expenseLines.join('\n')}\n\n`;
            }

            const netBalance = incomeTotal - expenseTotal;
            replyMsg += `📊 **สรุป**: รายรับ ฿${formatMoney(incomeTotal)} | รายจ่าย ฿${formatMoney(expenseTotal)} | คงเหลือสุทธิ ${netBalance >= 0 ? '+' : ''}฿${formatMoney(netBalance)}`;

            const actionCardHTML = `
                <div class="ai-action-card">
                    <div class="action-card-header">✅ บันทึกลงตารางการเงินแล้ว (${formattedTargetDate})</div>
                    <div class="action-card-body">บันทึกข้อมูลเรียบร้อยแล้ว คุณสามารถคลิกเพื่อตรวจสอบรายการหรือ ดูกราฟวงกลมแยกหมวดหมู่ได้เลยค่ะ</div>
                    <div class="action-card-buttons">
                        <button class="action-card-btn action-card-btn-primary" onclick="appController.switchTab('finance')">📋 ดูตารางการเงิน</button>
                        <button class="action-card-btn action-card-btn-secondary" onclick="appController.switchTab('dashboard')">📈 ดูกราฟรวม</button>
                    </div>
                </div>
            `;

            this.appendAIMessage(replyMsg, actionCardHTML);
            this.saveToConversationHistory('model', replyMsg);
            return;
        }

        // 4. SMART CALENDAR & APPOINTMENT HANDLER (มีสอบ, หาหมอ, ธุระ, ระบุเวลา, วันไม่ว่าง, ปลดล็อควันว่าง)
        const isCalendarIntent =
            lower.includes('ปฏิทิน') ||
            lower.includes('ไม่ว่าง') ||
            lower.includes('ติดธุระ') ||
            lower.includes('มีสอบ') ||
            lower.includes('สอบ') ||
            lower.includes('มีนัด') ||
            lower.includes('นัดหมาย') ||
            lower.includes('นัดหมอ') ||
            lower.includes('หาหมอ') ||
            lower.includes('ตรวจฟัน') ||
            lower.includes('ทำฟัน') ||
            lower.includes('สัมภาษณ์') ||
            lower.includes('คุยกับผู้ใหญ่') ||
            lower.includes('ไปงานแต่ง') ||
            lower.includes('งานแต่ง') ||
            lower.includes('ไปต่างจังหวัด') ||
            lower.includes('ต่อใบขับขี่') ||
            lower.includes('ยกเลิกนัด') ||
            lower.includes('ว่างแล้ว') ||
            lower.includes('เปลี่ยนเป็นว่าง') ||
            ((lower.includes('วันที่') || lower.includes('พรุ่งนี้') || lower.includes('มะรืน')) &&
             (lower.includes('นัด') || lower.includes('ธุระ') || lower.includes('ไป') || lower.includes('เวลา') || lower.includes('ช่วง')));

        if (isCalendarIntent) {
            const calResult = this.parseSmartCalendarAppointment(text);
            if (calResult.targetDates && calResult.targetDates.length > 0) {
                if (calResult.isCancel) {
                    calResult.targetDates.forEach(dStr => {
                        store.clearCalendarDay(dStr);
                    });
                    if (window.calendarController) window.calendarController.render();

                    const dateLabel = calResult.targetDates.length === 1 
                        ? this.formatThaiDateStr(calResult.targetDates[0])
                        : `${this.formatThaiDateStr(calResult.targetDates[0])} - ${this.formatThaiDateStr(calResult.targetDates[calResult.targetDates.length - 1])}`;

                    const replyMsg = `✨ **ปลดล็อคสถานะเรียบร้อยแล้วค่ะคุณเจ้าของร้าน!** 🟢\n📅 ยกเลิกนัดหมายวันที่ **${dateLabel}** และเปลี่ยนเป็น **"วันว่าง"** ในปฏิทินให้เรียบร้อยแล้วค่ะ 😊`;
                    const actionCardHTML = `
                        <div class="ai-action-card">
                            <div class="action-card-header">🟢 ยกเลิกนัดหมายแล้ว (${dateLabel})</div>
                            <div class="action-card-body">เปลี่ยนสถานะเป็นวันว่างในระบบเรียบร้อยแล้วค่ะ</div>
                            <div class="action-card-buttons">
                                <button class="action-card-btn action-card-btn-primary" onclick="appController.switchTab('calendar')">📅 เปิดดูปฏิทิน</button>
                            </div>
                        </div>
                    `;
                    this.appendAIMessage(replyMsg, actionCardHTML);
                    this.saveToConversationHistory('model', replyMsg);
                    return;
                } else {
                    calResult.targetDates.forEach(dStr => {
                        store.setCalendarDay(dStr, {
                            status: 'busy',
                            title: calResult.title,
                            time: calResult.time
                        });
                    });
                    if (window.calendarController) window.calendarController.render();

                    const isSingle = calResult.targetDates.length === 1;
                    const dateLabel = isSingle 
                        ? this.formatThaiDateStr(calResult.targetDates[0])
                        : `${this.formatThaiDateStr(calResult.targetDates[0])} ถึง ${this.formatThaiDateStr(calResult.targetDates[calResult.targetDates.length - 1])} (รวม ${calResult.targetDates.length} วัน)`;

                    const replyMsg = isSingle
                        ? `✨ **บันทึกกิจกรรมและวันไม่ว่างลงปฏิทินเรียบร้อยแล้วค่ะคุณเจ้าของร้าน!** 📅🔴\n\n📌 **กิจกรรม/เหตุผล**: ${calResult.title}\n📅 **วันที่**: ${dateLabel}\n⏰ **เวลา**: ${calResult.time}\n🔴 **สถานะ**: บันทึกเป็นวันไม่ว่าง พร้อมเชื่อมต่อระบบส่งสรุปยามเช้าใน LINE อัตโนมัติแล้วค่ะ 😊`
                        : `✨ **บันทึกช่วงวันไม่ว่างลงปฏิทินเรียบร้อยแล้วค่ะคุณเจ้าของร้าน!** 📅🔴\n\n📌 **กิจกรรม/เหตุผล**: ${calResult.title}\n📅 **ช่วงวันที่**: ${dateLabel}\n⏰ **เวลา**: ${calResult.time}\n🔴 **สถานะ**: บันทึกเป็นวันไม่ว่างเรียบร้อยแล้วค่ะ 😊`;

                    const actionCardHTML = `
                        <div class="ai-action-card">
                            <div class="action-card-header">📅 บันทึกวันไม่ว่างลงปฏิทินแล้ว (${isSingle ? this.formatThaiDateStr(calResult.targetDates[0]) : `${this.formatThaiDateStr(calResult.targetDates[0])} - ${this.formatThaiDateStr(calResult.targetDates[calResult.targetDates.length - 1])}`})</div>
                            <div class="action-card-body">
                                <div><strong>📌 กิจกรรม:</strong> ${calResult.title}</div>
                                <div><strong>⏰ เวลา:</strong> ${calResult.time}</div>
                                <div style="margin-top: 4px; font-size: 0.82rem; color: #64748b;">ข้อมูลบันทึกและซิงค์ขึ้น Cloud พร้อมรายงานใน LINE อัตโนมัติ</div>
                            </div>
                            <div class="action-card-buttons">
                                <button class="action-card-btn action-card-btn-primary" onclick="appController.switchTab('calendar')">📅 เปิดดูปฏิทิน</button>
                            </div>
                        </div>
                    `;

                    this.appendAIMessage(replyMsg, actionCardHTML);
                    this.saveToConversationHistory('model', replyMsg);
                    return;
                }
            }
        }

        // 7. IF GEMINI DIRECT API REPLIED
        if (geminiDirectReply) {
            this.appendAIMessage('✨ **Gemini AI**: ' + geminiDirectReply);
            this.saveToConversationHistory('model', geminiDirectReply);
            return;
        }

        // FALLBACK -> Ask live Vercel Gemini Assistant instead of static canned reply
        this.callBackendAIChat(text);
    }

    undoLastFinanceItem() {
        const financeList = store.getFinance();
        if (!financeList || financeList.length === 0) {
            const msg = '📭 ยังไม่มีรายการรายรับ-รายจ่ายให้ยกเลิกในขณะนี้ค่ะ';
            this.appendAIMessage(msg);
            this.saveToConversationHistory('model', msg);
            return null;
        }
        const removed = financeList[0];
        store.deleteFinanceItem(removed.id);
        if (window.financeController) window.financeController.render();
        if (window.chartRenderController) {
            window.chartRenderController.initFinanceCategoryChart();
            window.chartRenderController.initMainOverviewChart();
        }
        const updated = store.getFinance();
        const inc = updated.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
        const exp = updated.filter(x => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);
        const bal = inc - exp;

        const msg = `↩️ **น้องธิดายกเลิกและลบรายการล่าสุดให้แล้วค่ะ!**\n• รายการที่ลบ: **${removed.title}** (${removed.type === 'income' ? '+' : '-'}฿${formatMoney(removed.amount)})\n• 💵 **เงินคงเหลือส่วนตัวตอนนี้**: **฿${formatMoney(bal)}**`;
        this.appendAIMessage(msg);
        this.saveToConversationHistory('model', msg);
        if (window.appController) window.appController.showToast(`↩️ ลบรายการ "${removed.title}" เรียบร้อยค่ะ!`);
        return removed;
    }

    commitFinanceSlipRecord({ type = 'expense', category = '', title, amount, calories = null, date = '', note = '', cardId = '' }) {
        const todayStr = this.getLocalDateStr();
        const dateToUse = date || todayStr;
        const isIncome = type === 'income';
        const finalCategory = category || (isIncome ? '💰 รายรับส่วนตัว' : (calories ? '🍔 อาหาร & เครื่องดื่ม' : this.detectSmartCategory(title)));

        store.addFinanceItem({
            date: dateToUse,
            type: isIncome ? 'income' : 'expense',
            category: finalCategory,
            title: title,
            amount: Number(amount),
            calories: (!isIncome && calories) ? Number(calories) : null,
            note: note || (isIncome ? `รายรับส่วนตัว: ${title}` : `รายจ่ายส่วนตัว: ${title}`)
        });

        if (window.financeController) window.financeController.render();
        if (window.chartRenderController) {
            window.chartRenderController.initFinanceCategoryChart();
            window.chartRenderController.initMainOverviewChart();
        }

        const financeList = store.getFinance();
        const totalIncome = financeList.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
        const totalExpense = financeList.filter(x => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);
        const netBalance = totalIncome - totalExpense;

        const todayMeals = financeList.filter(x => x.type === 'expense' && x.date === dateToUse && (x.calories || (x.category && x.category.includes('อาหาร'))));
        const totalCaloriesToday = todayMeals.reduce((s, m) => s + (Number(m.calories) || 450), 0);
        const remainingCal = Math.max(0, 2000 - totalCaloriesToday);
        const percentCal = Math.min(100, Math.round((totalCaloriesToday / 2000) * 100));
        const formattedDate = this.formatThaiDateStr(dateToUse);

        const badgeColor = isIncome ? '#10b981' : '#38bdf8';
        const badgeBg = isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)';
        const slipInnerHTML = `
            <div class="slip-header">
                <span class="slip-badge-tag" style="color:${badgeColor};background:${badgeBg};">${isIncome ? '💰 DIGITAL INCOME SLIP' : '🧾 DIGITAL EXPENSE SLIP'}</span>
                <span class="slip-status-badge">${isIncome ? '✅ เพิ่มเงินเข้าแล้ว' : '✅ หักเงินแล้ว'}</span>
            </div>
            <div class="slip-title">${escapeHTML(title)}</div>
            <div class="slip-price-row">
                <span class="slip-price-amount" style="color:${isIncome ? '#10b981' : '#fb7185'};">${isIncome ? '+' : '-'}฿${formatMoney(amount)}</span>
                ${(!isIncome && calories) ? `<span class="slip-cal-pill">🔥 ~${calories} kcal</span>` : ''}
            </div>
            <hr class="slip-divider">
            <div class="slip-row">
                <span class="slip-label">หมวดหมู่</span>
                <span class="slip-val">${finalCategory}</span>
            </div>
            <div class="slip-row">
                <span class="slip-label">💵 เงินคงเหลือสุทธิ</span>
                <span class="slip-val" style="color: #38bdf8;">฿${formatMoney(netBalance)}</span>
            </div>
            ${(!isIncome && calories) ? `
                <div class="slip-progress-box">
                    <div class="slip-row" style="margin-bottom: 2px;">
                        <span class="slip-label" style="font-size: 0.75rem;">🥗 แคลอรี่วันนี้ (${formattedDate})</span>
                        <span class="slip-val" style="color: #f59e0b; font-size: 0.75rem;">${totalCaloriesToday.toLocaleString()} / 2,000 kcal</span>
                    </div>
                    <div class="slip-progress-bar">
                        <div class="slip-progress-fill ${totalCaloriesToday > 2000 ? 'over' : ''}" style="width: ${percentCal}%;"></div>
                    </div>
                    <div style="text-align: right; font-size: 0.68rem; color: #94a3b8;">ทานได้อีก ~${remainingCal.toLocaleString()} kcal</div>
                </div>
            ` : ''}
            <div style="margin-top: 10px; font-size: 0.68rem; color: #64748b; text-align: center;">🔒 บัญชีส่วนตัว 100% ไม่ปะปนกับรายได้ร้านค้า</div>
        `;

        if (cardId) {
            const cardElem = document.getElementById(cardId);
            if (cardElem) cardElem.innerHTML = slipInnerHTML;
            if (window.appController) {
                window.appController.showToast(`🎉 บันทึก ${title} ${isIncome ? '+' : '-'}฿${formatMoney(amount)} เรียบร้อยค่ะ!`);
            }
            return;
        }

        const replyMsg = isIncome
            ? `💰 **น้องธิดาบันทึกรายรับส่วนตัวเรียบร้อยแล้วค่ะ!**\n📌 **รายการ**: **${title}** (+฿${formatMoney(amount)})\n💵 **เงินคงเหลือส่วนตัวสุทธิ**: **฿${formatMoney(netBalance)}**`
            : `✨ **น้องธิดา${calories ? 'คำนวณแคลอรี่และ' : ''}หักลบรายจ่ายส่วนตัวให้เรียบร้อยแล้วค่ะ!**\n📌 **รายการ**: **${title}** (-฿${formatMoney(amount)})${calories ? `\n🔥 **พลังงาน**: **~${calories} kcal**` : ''}\n💵 **เงินคงเหลือส่วนตัวสุทธิ**: **฿${formatMoney(netBalance)}**`;

        this.appendAIMessage(replyMsg, `<div class="digital-slip-card">${slipInnerHTML}</div>`);
        this.saveToConversationHistory('model', replyMsg);
    }

    renderFoodAnalysisResult(detectedName, detectedCal, price, isOfflineFallback = false) {
        if (price > 0) {
            this.commitFinanceSlipRecord({
                type: 'expense',
                category: '🍔 อาหาร & เครื่องดื่ม',
                title: detectedName,
                amount: price,
                calories: detectedCal,
                note: `ภาพถ่ายสแกนอาหาร: ${detectedName} (~${detectedCal} kcal)`
            });
            return;
        }

        const slipId = 'meal-slip-' + Date.now();
        const actionCardHTML = `
            <div class="digital-slip-card" id="${slipId}">
                <div class="slip-header">
                    <span class="slip-badge-tag" style="color: #f59e0b; background: rgba(245, 158, 11, 0.15);">📸 AI FOOD SCANNER</span>
                    <span class="slip-status-badge">${isOfflineFallback ? '⚠️ โหมดออฟไลน์' : '✨ ตรวจพบเมนู'}</span>
                </div>
                <div class="slip-title">${escapeHTML(detectedName)}</div>
                <div class="slip-price-row">
                    <span class="slip-cal-pill" style="font-size: 0.9rem; padding: 4px 10px;">🔥 ประมาณ ~${detectedCal} kcal</span>
                </div>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 8px;">
                    ${isOfflineFallback ? 'ไม่สามารถเชื่อมต่อ AI Vision ชั่วคราว — กรุณาตรวจสอบหรือระบุราคาด้านล่างค่ะ:' : 'กรุณาระบุราคาเพื่อบันทึกเป็นรายจ่ายและหักเงินทันทีค่ะ:'}
                </div>
                <div class="slip-input-bar">
                    <input type="number" id="${slipId}-input" class="slip-price-input" value="50" placeholder="ระบุราคา (บาท)">
                    <button class="btn-slip-deduct" onclick="aiAssistantController.confirmMealExpense('${escape(detectedName)}', ${detectedCal}, '${slipId}-input', '${slipId}')">
                        ✅ ตัดเงินทันที
                    </button>
                </div>
                <div class="slip-chips-row">
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=40">฿40</button>
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=50">฿50</button>
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=60">฿60</button>
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=70">฿70</button>
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=80">฿80</button>
                    <button type="button" class="slip-chip" onclick="document.getElementById('${slipId}-input').value=100">฿100</button>
                </div>
            </div>
        `;

        const replyMsg = `📸 **น้องธิดาสแกนรูปอาหารพบ: "${detectedName}" ค่ะ!** 🍽️🔥\n• พลังงานประมาณ: **~${detectedCal} kcal**\n\n💰 *กรุณาระบุราคาด้านล่างแล้วกด "ตัดเงินทันที" ธิดาจะช่วยหักเงินและบันทึกลงบัญชีส่วนตัวให้ทันทีค่ะ 😊*`;
        this.appendAIMessage(replyMsg, actionCardHTML);
        this.saveToConversationHistory('model', replyMsg);
    }

    processAIImageOCR(imageBase64, userPrompt, isOfflineFallback = false) {
        const promptExtract = extractFoodAndAmount(userPrompt || '');
        let detectedName = 'อาหารจานเดียว';
        let detectedCal = 500;
        const price = promptExtract ? promptExtract.amount : 0;

        if (promptExtract && promptExtract.food) {
            detectedName = promptExtract.food;
            const cal = calculateFoodCalories(detectedName);
            detectedCal = cal.isFood ? cal.calories : 450;
        } else if (userPrompt && userPrompt.trim().length > 1) {
            const cal = calculateFoodCalories(userPrompt);
            if (cal.isFood) {
                detectedName = cal.name || userPrompt;
                detectedCal = cal.calories;
            }
        }
        this.renderFoodAnalysisResult(detectedName, detectedCal, price, isOfflineFallback);
    }

    confirmMealExpense(dishName, calories, inputId, cardId, txType = 'expense') {
        const inputElem = document.getElementById(inputId);
        const price = inputElem ? parseFloat(inputElem.value) : 50;
        if (!price || price <= 0) {
            alert('กรุณาระบุราคาที่ถูกต้องค่ะ');
            return;
        }

        const decodedDish = unescape(dishName);
        this.commitFinanceSlipRecord({
            type: txType === 'income' ? 'income' : 'expense',
            category: txType === 'income' ? '💰 รายรับส่วนตัว' : (calories > 0 ? '🍔 อาหาร & เครื่องดื่ม' : '🧾 บิล/ค่าใช้จ่าย'),
            title: decodedDish,
            amount: price,
            calories: calories > 0 ? calories : null,
            note: `บันทึกจากภาพถ่าย/สลิป AI: ${decodedDish}${calories > 0 ? ` (~${calories} kcal)` : ''}`,
            cardId: cardId
        });
    }

    triggerMobileNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png'
            });
        }
    }
}

const aiAssistantController = window.aiAssistantController = new AIAssistantController();
window.getLocalDateStr = d => aiAssistantController.getLocalDateStr(d);
document.addEventListener('DOMContentLoaded', () => {
    aiAssistantController.init();
});

