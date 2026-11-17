/* ==========================================================================
   Life & Business Hub - Interactive Free/Busy Calendar Grid Controller
   รองรับการระบุเหตุผล/กิจกรรมที่ไม่ว่าง (เช่น มีสอบ, หาหมอ) และช่วงเวลากี่โมง
   ========================================================================== */

class CalendarController {
    constructor() {
        this.currentDate = new Date();
        this.selectedDateStr = getLocalDateStr();
        this.activeFormChoice = 'busy'; // 'busy' or 'free'
    }

    init() {
        this.render();
        this.bindEvents();

        store.subscribe(type => {
            if (type === 'calendar' || type === 'tasks' || type === 'all') {
                this.render();
            }
        });
    }

    bindEvents() {
        const btnPrev = document.getElementById('btn-prev-month');
        const btnNext = document.getElementById('btn-next-month');
        const btnMarkFree = document.getElementById('btn-mark-free');
        const btnMarkBusy = document.getElementById('btn-mark-busy');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }

        if (btnMarkFree) {
            btnMarkFree.addEventListener('click', () => {
                this.quickSetFree(this.selectedDateStr);
            });
        }

        if (btnMarkBusy) {
            btnMarkBusy.addEventListener('click', () => {
                this.activeFormChoice = 'busy';
                this.renderDayDetails(this.selectedDateStr);
                const input = document.getElementById('cal-reason-input');
                if (input) input.focus();
            });
        }
    }

    quickSetFree(dateStr) {
        store.setCalendarDay(dateStr, { status: 'free' });
        this.render();
        if (window.appController) {
            window.appController.showToast(`🟢 บันทึกวันที่ ${dateStr} เป็นวันว่างเรียบร้อยแล้ว!`);
        }
    }

    setChoiceStatus(status) {
        this.activeFormChoice = status;
        const btnBusy = document.getElementById('btn-choice-busy');
        const btnFree = document.getElementById('btn-choice-free');
        const wrapper = document.getElementById('busy-fields-wrapper');

        if (status === 'busy') {
            if (btnBusy) {
                btnBusy.style.border = '2px solid var(--accent-rose)';
                btnBusy.style.background = 'rgba(239,68,68,0.18)';
                btnBusy.style.color = '#ff4d4f';
            }
            if (btnFree) {
                btnFree.style.border = '1px solid var(--border-color)';
                btnFree.style.background = 'transparent';
                btnFree.style.color = 'var(--text-secondary)';
            }
            if (wrapper) wrapper.style.display = 'block';
            const reasonInput = document.getElementById('cal-reason-input');
            if (reasonInput && !reasonInput.value) reasonInput.focus();
        } else {
            if (btnFree) {
                btnFree.style.border = '2px solid var(--accent-emerald)';
                btnFree.style.background = 'rgba(16,185,129,0.18)';
                btnFree.style.color = '#10b981';
            }
            if (btnBusy) {
                btnBusy.style.border = '1px solid var(--border-color)';
                btnBusy.style.background = 'transparent';
                btnBusy.style.color = 'var(--text-secondary)';
            }
            if (wrapper) wrapper.style.display = 'none';
        }
    }

    setTimePreset(preset) {
        const timeInput = document.getElementById('cal-time-input');
        if (timeInput) {
            timeInput.value = preset;
            timeInput.focus();
        }
    }

    saveCurrentDayForm(dateStr) {
        const status = this.activeFormChoice || 'busy';
        if (status === 'free') {
            store.setCalendarDay(dateStr, { status: 'free' });
            if (window.appController) {
                window.appController.showToast(`🟢 บันทึกวันที่ ${dateStr} เป็นวันว่างเรียบร้อยแล้ว!`);
            }
        } else {
            const reasonInput = document.getElementById('cal-reason-input');
            const timeInput = document.getElementById('cal-time-input');

            const reason = (reasonInput && reasonInput.value ? reasonInput.value.trim() : '') || 'ติดภารกิจ/ไม่ว่าง';
            const time = (timeInput && timeInput.value ? timeInput.value.trim() : '') || 'ทั้งวัน';

            store.setCalendarDay(dateStr, {
                status: 'busy',
                title: reason,
                time: time
            });

            if (window.appController) {
                window.appController.showToast(`🔴 บันทึกนัดหมาย "${reason}" (${time}) ลงวันที่ ${dateStr} แล้ว!`);
            }
        }

        this.render();
    }

    clearDayStatus(dateStr) {
        store.clearCalendarDay(dateStr);
        this.render();
        if (window.appController) {
            window.appController.showToast(`🗑️ ล้างสถานะและนัดหมายวันที่ ${dateStr} เรียบร้อยแล้ว!`);
        }
    }

    render() {
        this.renderCalendarGrid();
        this.renderDayDetails(this.selectedDateStr);
        this.updateDashboardStatus();
    }

    renderCalendarGrid() {
        const container = document.getElementById('calendar-days-container');
        const titleElem = document.getElementById('calendar-month-year-title');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        if (titleElem) titleElem.textContent = `${thaiMonths[month]} ${year + 543}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayStr = getLocalDateStr();
        const calendarData = store.getCalendar();
        const tasksList = store.getTasks();

        let html = '';

        // Empty cells before start of month
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        // Render Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === this.selectedDateStr;

            const dayData = calendarData[dateStr] || {};
            const dayStatus = dayData.status;

            // Count tasks due on this date
            const dayTasks = tasksList.filter(t => t.dueDate === dateStr && t.status !== 'completed');

            let statusPill = '';
            if (dayStatus === 'free') {
                statusPill = `<span class="day-status-pill status-free">🟢 ว่าง</span>`;
            } else if (dayStatus === 'busy') {
                const label = dayData.title ? `${escapeHTML(dayData.title)}` : 'ไม่ว่าง';
                const timeText = dayData.time && dayData.time !== 'ทั้งวัน' ? ` ⏰ ${escapeHTML(dayData.time)}` : '';
                statusPill = `<span class="day-status-pill status-busy" style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.72rem; padding: 2px 5px;" title="${escapeHTML(label + (dayData.time ? ' ' + dayData.time : ''))}">🔴 ${label}${timeText}</span>`;
            }

            let taskPill = dayTasks.length > 0 ? `<span class="day-task-count">📝 ${dayTasks.length} งาน</span>` : '';

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="calendarController.selectDate('${dateStr}')">
                    <span class="day-number">${day}</span>
                    <div class="day-indicators" style="display: flex; flex-direction: column; gap: 2px; width: 100%;">
                        ${statusPill}
                        ${taskPill}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    selectDate(dateStr) {
        this.selectedDateStr = dateStr;
        const calendarData = store.getCalendar();
        const dayData = calendarData[dateStr] || {};
        this.activeFormChoice = dayData.status === 'free' ? 'free' : 'busy';

        this.renderCalendarGrid();
        this.renderDayDetails(dateStr);
    }

    renderDayDetails(dateStr) {
        const titleElem = document.getElementById('selected-date-title');
        const contentElem = document.getElementById('selected-day-content');
        if (!contentElem) return;

        let dObj;
        try {
            dObj = new Date(dateStr + 'T00:00:00');
        } catch (e) {
            dObj = new Date();
        }

        const thaiDateFormatted = dObj.toLocaleDateString('th-TH', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        if (titleElem) titleElem.textContent = `📅 รายละเอียด: ${thaiDateFormatted}`;

        const calendarData = store.getCalendar();
        const dayData = calendarData[dateStr] || {};
        const isBusy = dayData.status === 'busy';
        const isFree = dayData.status === 'free';
        const formChoice = this.activeFormChoice || (isFree ? 'free' : 'busy');

        const tasksList = store.getTasks().filter(t => t.dueDate === dateStr);

        let tasksHtml = '';
        if (tasksList.length > 0) {
            tasksHtml = `
                <h4 class="mt-16" style="font-size: 0.92rem; color: var(--text-primary); margin-bottom: 8px;">📋 รายการงานค้างในวันนี้ (${tasksList.length} งาน):</h4>
                <div class="recent-list">
                    ${tasksList.map(t => `
                        <div class="recent-item">
                            <div class="recent-info">
                                <span class="recent-title">${escapeHTML(t.title)}</span>
                                <span class="recent-meta">ความสำคัญ: ${t.priority === 'high' ? '⚠️ ด่วนมาก' : 'ปกติ'}</span>
                            </div>
                            <span class="badge-tag ${t.status === 'completed' ? 'badge-success-sm' : ''}">${t.status === 'completed' ? '✓ เสร็จแล้ว' : 'ยังไม่เสร็จ'}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        contentElem.innerHTML = `
            <div class="day-detail-summary" style="padding: 6px 0;">
                <!-- Current Status Banner -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                    <div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">สถานะวันที่ ${dateStr}</div>
                        <div style="font-size: 1.05rem; font-weight: 700;">
                            ${isBusy ? `<span style="color: var(--accent-rose);">🔴 ไม่ว่าง: ${escapeHTML(dayData.title || 'ติดภารกิจ')}</span>` :
                              (isFree ? `<span style="color: var(--accent-emerald);">🟢 วันว่าง (Free Day)</span>` : `<span style="color: var(--text-muted);">⚪ ยังไม่ได้ระบุสถานะ</span>`)}
                        </div>
                        ${isBusy ? `<div style="font-size: 0.85rem; color: var(--accent-cyan); margin-top: 4px;">⏰ ช่วงเวลา: <b>${escapeHTML(dayData.time || 'ทั้งวัน')}</b></div>` : ''}
                    </div>
                    <div>
                        ${(isBusy || isFree) ? `
                            <button class="btn-text-danger" style="font-size: 0.82rem; padding: 6px 12px; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; cursor: pointer;" onclick="calendarController.clearDayStatus('${dateStr}')">
                                🗑️ ล้างสถานะ
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Appointment / Busy Reason Form -->
                <div style="background: rgba(2, 132, 199, 0.04); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                        <span>✏️</span> บันทึกนัดหมาย (ระบุเหตุผล & ช่วงเวลากี่โมง)
                    </div>

                    <!-- Mode Toggle -->
                    <div style="display: flex; gap: 10px; margin-bottom: 14px;">
                        <button type="button" id="btn-choice-busy" onclick="calendarController.setChoiceStatus('busy')" style="flex: 1; padding: 9px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 2px solid ${formChoice === 'busy' ? 'var(--accent-rose)' : 'var(--border-color)'}; background: ${formChoice === 'busy' ? 'rgba(239,68,68,0.18)' : 'transparent'}; color: ${formChoice === 'busy' ? '#ff4d4f' : 'var(--text-secondary)'};">
                            🔴 ตั้งเป็นวันไม่ว่าง
                        </button>
                        <button type="button" id="btn-choice-free" onclick="calendarController.setChoiceStatus('free')" style="flex: 1; padding: 9px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 2px solid ${formChoice === 'free' ? 'var(--accent-emerald)' : 'var(--border-color)'}; background: ${formChoice === 'free' ? 'rgba(16,185,129,0.18)' : 'transparent'}; color: ${formChoice === 'free' ? '#10b981' : 'var(--text-secondary)'};">
                            🟢 ตั้งเป็นวันว่าง
                        </button>
                    </div>

                    <div id="busy-fields-wrapper" style="display: ${formChoice === 'free' ? 'none' : 'block'};">
                        <div class="form-group" style="margin-bottom: 12px;">
                            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block; color: var(--text-secondary);">
                                📌 กิจกรรม / เหตุผลที่ไม่ว่าง:
                            </label>
                            <input type="text" id="cal-reason-input" class="form-input width-100" placeholder="เช่น มีสอบ, หาหมอ, ไปเที่ยวกับเพื่อน, นัดคุยงาน..." value="${escapeHTML(dayData.title || '')}" style="padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.25);">
                        </div>

                        <div class="form-group" style="margin-bottom: 12px;">
                            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block; color: var(--text-secondary);">
                                ⏰ ช่วงเวลาที่ไม่ว่าง:
                            </label>
                            <input type="text" id="cal-time-input" class="form-input width-100" placeholder="เช่น 09:00 - 12:00 หรือ ทั้งวัน" value="${escapeHTML(dayData.time || 'ทั้งวัน')}" style="padding: 10px 12px; border-radius: 8px; background: rgba(0,0,0,0.25);">
                        </div>

                        <!-- Quick Time Presets -->
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">⚡ จิ้มเลือกช่วงเวลาด่วน:</div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                <button type="button" class="chip-time" onclick="calendarController.setTimePreset('ทั้งวัน')" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 5px 10px; border-radius: 6px; font-size: 0.78rem; cursor: pointer;">☀️ ทั้งวัน</button>
                                <button type="button" class="chip-time" onclick="calendarController.setTimePreset('09:00 - 12:00 น.')" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 5px 10px; border-radius: 6px; font-size: 0.78rem; cursor: pointer;">🌅 เช้า (09:00 - 12:00)</button>
                                <button type="button" class="chip-time" onclick="calendarController.setTimePreset('13:00 - 16:00 น.')" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 5px 10px; border-radius: 6px; font-size: 0.78rem; cursor: pointer;">☕ บ่าย (13:00 - 16:00)</button>
                                <button type="button" class="chip-time" onclick="calendarController.setTimePreset('18:00 - 21:00 น.')" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 5px 10px; border-radius: 6px; font-size: 0.78rem; cursor: pointer;">🌙 เย็น (18:00 - 21:00)</button>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn-primary width-100" onclick="calendarController.saveCurrentDayForm('${dateStr}')" style="background: linear-gradient(135deg, #0284c7, #38bdf8); font-weight: 700; padding: 12px; border-radius: 8px; font-size: 0.92rem;">
                        💾 บันทึกข้อมูลปฏิทิน
                    </button>
                </div>

                ${tasksHtml}
            </div>
        `;
    }

    updateDashboardStatus() {
        const todayStr = getLocalDateStr();
        const calendarData = store.getCalendar();
        const todayData = calendarData[todayStr] || {};

        const statusElem = document.getElementById('dash-today-status');
        const eventsElem = document.getElementById('dash-today-events');

        const tasksCount = store.getTasks().filter(t => t.dueDate === todayStr && t.status !== 'completed').length;

        if (statusElem) {
            if (todayData.status === 'busy') {
                const label = todayData.title ? `🔴 ไม่ว่าง: ${todayData.title}` : '🔴 วันไม่ว่าง';
                statusElem.textContent = label;
                statusElem.style.color = 'var(--accent-rose)';
            } else if (todayData.status === 'free') {
                statusElem.textContent = '🟢 วันว่าง';
                statusElem.style.color = 'var(--accent-emerald)';
            } else {
                statusElem.textContent = '🟢 วันว่าง';
                statusElem.style.color = 'var(--accent-emerald)';
            }
        }

        if (eventsElem) {
            eventsElem.textContent = `${tasksCount} นัดหมายวันนี้`;
        }
    }
}

const calendarController = window.calendarController = new CalendarController();
