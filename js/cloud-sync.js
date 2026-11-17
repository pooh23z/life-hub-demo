/* ==========================================================================
   Life & Business Hub - Cloud Sync Engine (Firebase Realtime Database)
   ========================================================================== */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBSkklb88s7Mf5NX3EGSNbcsuElTLl-w4k",
  authDomain: "lifehub-7420d.firebaseapp.com",
  databaseURL: "https://lifehub-7420d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lifehub-7420d",
  storageBucket: "lifehub-7420d.firebasestorage.app",
  messagingSenderId: "127099886380",
  appId: "1:127099886380:web:021f969918d238fd80aa89",
  measurementId: "G-YMRSLZV7FF"
};

class CloudSyncEngine {
    constructor() {
        // Default shared Cloud Sync Room for instant cross-device sync (Mac & Mobile)
        this.roomCode = localStorage.getItem('lifehub_sync_room_code') || 'DEMO-2026';
        this.firebaseConfig = DEFAULT_FIREBASE_CONFIG;
        this.db = null;
        this.roomRef = null;
        this.connectedRef = null;
        this.isSyncing = false;
        this.isApplyingRemote = false;
        this.pendingPushType = null;
        this.hasInitialSync = false;
        this.useRestFallback = false;
        this.sdkRetryCount = 0;
        this.restPollTimer = null;
        this.connected = false;

        this.init();
    }

    init() {
        this.loadSavedConfig();
        this.bindUIEvents();
    }

    loadSavedConfig() {
        const savedConfig = localStorage.getItem('lifehub_firebase_config');
        if (savedConfig) {
            try {
                this.firebaseConfig = JSON.parse(savedConfig);
            } catch (e) {
                console.warn('Invalid saved firebase config', e);
            }
        }
        this.initFirebase();
    }

    getRestUrl(code) {
        if (!this.firebaseConfig || !this.firebaseConfig.databaseURL || !code) return null;
        const base = String(this.firebaseConfig.databaseURL).replace(/\/$/, '');
        return `${base}/rooms/${encodeURIComponent(code)}.json`;
    }

    async restFetchRoom(code) {
        const url = this.getRestUrl(code);
        if (!url) throw new Error('ไม่มี Firebase databaseURL');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 7000);
        try {
            const resp = await fetch(url, { cache: 'no-store', signal: controller.signal });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return await resp.json();
        } finally {
            clearTimeout(timer);
        }
    }

    async restPatchRoom(code, patchObj) {
        const url = this.getRestUrl(code);
        if (!url) throw new Error('ไม่มี Firebase databaseURL');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 7000);
        try {
            const resp = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patchObj),
                signal: controller.signal
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return await resp.json();
        } finally {
            clearTimeout(timer);
        }
    }

    enableRestFallback() {
        if (this.useRestFallback) return;
        this.useRestFallback = true;
        this.connected = true;
        this.updateBadgeUI('synced');
        this.updateModalUI();
        if (this.roomCode) {
            this.startRestSyncLoop(this.roomCode);
        }
    }

    async startRestSyncLoop(code) {
        if (this.restPollTimer) {
            clearInterval(this.restPollTimer);
            this.restPollTimer = null;
        }
        await this.syncOnceViaRest(code, false);
        this.restPollTimer = setInterval(() => {
            if (this.roomCode && !document.hidden) {
                this.syncOnceViaRest(this.roomCode, false);
            }
        }, 15000);
    }

    async syncOnceViaRest(code, forceImport = false) {
        if (!code || this.isSyncing) return;
        try {
            const remoteData = await this.restFetchRoom(code);
            this.connected = true;
            if (remoteData && typeof remoteData === 'object') {
                this.handleRemoteData(remoteData, { forceImport });
            } else if (!this.hasInitialSync) {
                this.hasInitialSync = true;
                this.pushDataToCloud('all');
            }
            this.updateBadgeUI('synced');
        } catch (err) {
            console.warn('REST sync fallback warning:', err.message || err);
        }
    }

    initFirebase() {
        if (!this.firebaseConfig) return;
        if (typeof firebase === 'undefined') {
            this.sdkRetryCount++;
            if (this.sdkRetryCount <= 5) {
                setTimeout(() => this.initFirebase(), 400);
            } else {
                console.warn('Firebase SDK unavailable, switching to REST Sync');
                this.enableRestFallback();
            }
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }
            this.db = firebase.database();
            this.useRestFallback = false;
            this.connected = true;
            this.updateBadgeUI();

            if (!this.connectedRef) {
                this.connectedRef = this.db.ref('.info/connected');
                this.connectedRef.on('value', snap => {
                    const isOnline = snap.val() === true;
                    if (isOnline) {
                        this.connected = true;
                        this.updateBadgeUI();
                    } else if (this.hasInitialSync && !this.useRestFallback) {
                        this.restFetchRoom(this.roomCode)
                            .then(() => { this.enableRestFallback(); })
                            .catch(() => {
                                this.connected = false;
                                this.updateBadgeUI();
                            });
                    }
                });
            }

            // Auto connect to room code (default DEMO-2026) for instant Mac <-> Mobile sync
            if (this.roomCode) {
                this.listenToRoom(this.roomCode);
            }
        } catch (e) {
            console.error('Firebase init error:', e);
            this.enableRestFallback();
        }
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    attachFinancePayload(patch, now) {
        const financeList = store.getFinance();
        patch.finance = financeList;
        if (financeList.length === 0) {
            const resetAt = Number(localStorage.getItem('lifehub_finance_reset_at') || 0) || now;
            localStorage.setItem('lifehub_finance_reset_at', String(resetAt));
            patch.financeResetAt = resetAt;
        }
    }

    buildPatchPayload(changedType = 'all') {
        const now = Date.now();
        const patch = {
            updatedAt: now,
            exportDate: new Date(now).toISOString()
        };

        if (changedType === 'finance') {
            this.attachFinancePayload(patch, now);
        } else if (changedType === 'tasks') {
            patch.tasks = store.getTasks();
        } else if (changedType === 'savings') {
            patch.savings = store.getSavings();
        } else if (changedType === 'calendar') {
            patch.calendar = store.getCalendar();
        } else if (changedType === 'business') {
            patch.business = store.getBusiness();
        } else {
            this.attachFinancePayload(patch, now);
            patch.tasks = store.getTasks();
            patch.savings = store.getSavings();
            patch.calendar = store.getCalendar();
            const biz = store.getBusiness();
            if (Array.isArray(biz) && biz.length > 0) {
                patch.business = biz;
            }
        }
        return patch;
    }

    hasNonEmptyLocalPersonalData() {
        return (
            store.getFinance().length > 0 ||
            store.getTasks().length > 0 ||
            store.getSavings().length > 0 ||
            Object.keys(store.getCalendar() || {}).length > 0
        );
    }

    extractFinanceTimestamp(item) {
        if (!item || !item.id) return 0;
        const match = String(item.id).match(/^fin-(\d+)$/);
        return match ? Number(match[1]) : 0;
    }

    handleRemoteData(remoteData, { forceImport = false, showToast = false } = {}) {
        if (!remoteData || typeof remoteData !== 'object') {
            this.hasInitialSync = true;
            return false;
        }

        const remoteUpdated = Number(remoteData.updatedAt || 0);
        const localUpdated = Number(localStorage.getItem('lifehub_last_sync_time') || 0);
        const remoteResetAt = Number(remoteData.financeResetAt || 0);
        const localResetAt = Number(localStorage.getItem('lifehub_finance_reset_at') || 0);
        const remoteFinanceMissingOrEmpty = remoteData.finance === undefined || (Array.isArray(remoteData.finance) && remoteData.finance.length === 0);
        const hasUnappliedRemoteReset = remoteFinanceMissingOrEmpty && remoteResetAt > localResetAt;

        if (forceImport || remoteUpdated >= localUpdated || localUpdated === 0) {
            const wasInitial = !this.hasInitialSync;
            const importPayload = Object.assign({}, remoteData);
            if (hasUnappliedRemoteReset || (forceImport && remoteData.finance === undefined && remoteResetAt > 0)) {
                importPayload.finance = [];
                if (remoteResetAt > 0) {
                    localStorage.setItem('lifehub_finance_reset_at', String(remoteResetAt));
                }
            }

            this.isSyncing = true;
            this.isApplyingRemote = true;
            try {
                store.importAllData(JSON.stringify(importPayload), { skipCloud: true });
                localStorage.setItem('lifehub_last_sync_time', String(remoteUpdated || Date.now()));
                this.hasInitialSync = true;
            } finally {
                this.isApplyingRemote = false;
                this.isSyncing = false;
            }

            // Heal any collections missing on cloud (e.g. from prior partial sync) using existing local data
            // Never resurrect finance when cloud carries an explicit financeResetAt tombstone
            if (wasInitial) {
                const missingPatch = {};
                if (remoteData.tasks === undefined && store.getTasks().length > 0) missingPatch.tasks = store.getTasks();
                if (remoteData.savings === undefined && store.getSavings().length > 0) missingPatch.savings = store.getSavings();
                if (remoteData.calendar === undefined && Object.keys(store.getCalendar()).length > 0) missingPatch.calendar = store.getCalendar();
                if (remoteData.finance === undefined && remoteResetAt === 0 && store.getFinance().length > 0) missingPatch.finance = store.getFinance();
                if (Object.keys(missingPatch).length > 0) {
                    missingPatch.updatedAt = Date.now();
                    if (this.db && !this.useRestFallback) {
                        this.db.ref('rooms/' + this.roomCode).update(missingPatch).catch(() => this.restPatchRoom(this.roomCode, missingPatch));
                    } else {
                        this.restPatchRoom(this.roomCode, missingPatch).catch(() => {});
                    }
                }
            }

            this.updateBadgeUI('synced');
            if (showToast && window.appController) {
                window.appController.showToast('📲 ซิงก์ข้อมูลคลาวด์เรียบร้อยแล้ว!');
            }
            return true;
        }

        // Apply remote finance reset before pushing newer local edits so stale items aren't resurrected
        if (hasUnappliedRemoteReset) {
            const keptAfterReset = store.getFinance().filter(item => this.extractFinanceTimestamp(item) > remoteResetAt);
            this.isSyncing = true;
            this.isApplyingRemote = true;
            try {
                localStorage.setItem('lifehub_finance_reset_at', String(remoteResetAt));
                store.importAllData(JSON.stringify({ finance: keptAfterReset }), { skipCloud: true });
            } finally {
                this.isApplyingRemote = false;
                this.isSyncing = false;
            }
        }

        // Local edits are strictly newer than remote -> push only personal data cleanly
        if (!this.hasInitialSync) {
            this.hasInitialSync = true;
            if (this.hasNonEmptyLocalPersonalData()) {
                this.pushDataToCloud('all');
            }
        }
        return false;
    }

    createRoom() {
        const code = this.generateRoomCode();
        this.roomCode = code;
        localStorage.setItem('lifehub_sync_room_code', code);

        const dataObj = this.buildPatchPayload('all');
        dataObj.updatedBy = navigator.userAgent;

        const finishCreate = () => {
            this.hasInitialSync = true;
            localStorage.setItem('lifehub_last_sync_time', String(dataObj.updatedAt));
            this.listenToRoom(code);
            this.updateModalUI();
            if (window.appController) {
                window.appController.showToast(`🏠 สร้างห้อง Sync รหัส ${code} สำเร็จแล้ว!`);
            }
        };

        if (this.db && !this.useRestFallback) {
            this.db.ref('rooms/' + code).set(dataObj).then(finishCreate).catch(err => {
                alert('เกิดข้อผิดพลาดในการสร้างห้อง: ' + err.message);
            });
        } else {
            this.restPatchRoom(code, dataObj).then(finishCreate).catch(err => {
                alert('เกิดข้อผิดพลาดในการสร้างห้อง: ' + err.message);
            });
        }
    }

    async joinRoom(code) {
        const cleanCode = String(code || '').toUpperCase().trim();
        if (cleanCode.length !== 6) {
            alert('กรุณาใส่รหัสห้อง 6 หลักให้ถูกต้อง');
            return;
        }

        const onFound = (data) => {
            if (data && typeof data === 'object') {
                this.roomCode = cleanCode;
                localStorage.setItem('lifehub_sync_room_code', cleanCode);
                this.handleRemoteData(data, { forceImport: true, showToast: false });
                this.listenToRoom(cleanCode);
                this.updateModalUI();

                if (window.appController) {
                    window.appController.showToast(`🔗 เข้าร่วมห้อง Sync รหัส ${cleanCode} สำเร็จ!`);
                }
            } else {
                alert('ไม่พบห้อง Sync รหัสนี้ กรุณาตรวจสอบรหัสบนอุปกรณ์อีกเครื่อง');
            }
        };

        try {
            if (this.db && !this.useRestFallback) {
                const snapshot = await this.db.ref('rooms/' + cleanCode).once('value');
                onFound(snapshot.exists() ? snapshot.val() : null);
            } else {
                const data = await this.restFetchRoom(cleanCode);
                onFound(data);
            }
        } catch (err) {
            try {
                const data = await this.restFetchRoom(cleanCode);
                onFound(data);
            } catch (restErr) {
                alert('เกิดข้อผิดพลาดในการเข้าร่วมห้อง: ' + (restErr.message || err.message));
            }
        }
    }

    listenToRoom(code) {
        if (!code) return;
        if (this.roomRef) {
            this.roomRef.off();
            this.roomRef = null;
        }
        if (this.restPollTimer) {
            clearInterval(this.restPollTimer);
            this.restPollTimer = null;
        }

        if (this.useRestFallback || !this.db) {
            this.startRestSyncLoop(code);
            this.updateBadgeUI('connected');
            return;
        }

        this.hasInitialSync = false;
        let settledInitial = false;

        // If RTDB WebSocket is slow (e.g., Safari file://), bootstrap via REST within 3s
        const restFallbackTimer = setTimeout(() => {
            if (!settledInitial) {
                this.syncOnceViaRest(code, false).then(() => {
                    settledInitial = true;
                    this.hasInitialSync = true;
                });
            }
        }, 3000);

        this.roomRef = this.db.ref('rooms/' + code);
        this.roomRef.on('value', snapshot => {
            clearTimeout(restFallbackTimer);
            if (this.isSyncing) return;

            if (snapshot.exists()) {
                const remoteData = snapshot.val();
                const isFirst = !settledInitial;
                settledInitial = true;
                this.handleRemoteData(remoteData, { forceImport: false, showToast: !isFirst });
            } else {
                settledInitial = true;
                this.hasInitialSync = true;
                // Room truly doesn't exist yet -> seed only if we have data
                if (this.hasNonEmptyLocalPersonalData()) {
                    this.pushDataToCloud('all');
                }
            }
        }, err => {
            clearTimeout(restFallbackTimer);
            console.warn('Realtime listener error, falling back to REST:', err);
            this.enableRestFallback();
        });

        this.updateBadgeUI('connected');
    }

    forceSyncCloud() {
        if (!this.roomCode) return;
        if (!this.db && !this.useRestFallback) {
            this.initFirebase();
        }

        const finishRemote = (remoteData) => {
            if (remoteData && typeof remoteData === 'object') {
                this.handleRemoteData(remoteData, { forceImport: true, showToast: false });
                if (window.appController) {
                    window.appController.showToast('✅ ซิงก์ดึงข้อมูลล่าสุดจากคลาวด์เรียบร้อยแล้ว!');
                }
            } else {
                this.hasInitialSync = true;
                this.pushDataToCloud('all');
                if (window.appController) {
                    window.appController.showToast('☁️ อัปโหลดข้อมูลขึ้นคลาวด์เรียบร้อยแล้ว!');
                }
            }
        };

        if (this.db && !this.useRestFallback) {
            this.db.ref('rooms/' + this.roomCode).once('value').then(snapshot => {
                finishRemote(snapshot.exists() ? snapshot.val() : null);
            }).catch(err => {
                console.warn('Force sync SDK error, trying REST:', err);
                this.restFetchRoom(this.roomCode).then(finishRemote).catch(restErr => {
                    console.error('Force sync REST failed:', restErr);
                });
            });
        } else {
            this.restFetchRoom(this.roomCode).then(finishRemote).catch(err => {
                console.error('Force sync REST error:', err);
            });
        }
    }

    pushDataToCloud(changedType = 'all') {
        if (!this.roomCode || this.isSyncing) return;

        const patchObj = this.buildPatchPayload(changedType);
        localStorage.setItem('lifehub_last_sync_time', String(patchObj.updatedAt));
        this.isSyncing = true;

        const onDone = () => {
            this.isSyncing = false;
            this.connected = true;
            this.updateBadgeUI('synced');
            if (this.pendingPushType && this.roomCode && this.hasInitialSync) {
                const nextType = this.pendingPushType;
                this.pendingPushType = null;
                this.pushDataToCloud(nextType);
            }
        };
        const onFail = (err) => {
            this.isSyncing = false;
            this.pendingPushType = null;
            console.error('Cloud Sync upload failed', err);
        };

        if (this.db && !this.useRestFallback) {
            this.db.ref('rooms/' + this.roomCode).update(patchObj).then(onDone).catch(err => {
                // Retry via REST PATCH in case WebSocket auth/channel dropped
                this.restPatchRoom(this.roomCode, patchObj).then(onDone).catch(() => onFail(err));
            });
        } else {
            this.restPatchRoom(this.roomCode, patchObj).then(onDone).catch(onFail);
        }
    }

    onDataChanged(changedType = 'all') {
        // CRITICAL: Never upload until initial cloud handshake finishes!
        // Prevents uninitialized browser tabs or startup CSV loads from wiping cloud rooms.
        if (!this.roomCode || !this.hasInitialSync || this.isApplyingRemote) return;
        if (this.isSyncing) {
            this.pendingPushType = (!this.pendingPushType || this.pendingPushType === changedType) ? changedType : 'all';
            return;
        }
        this.pushDataToCloud(changedType);
    }

    disconnectRoom() {
        if (this.roomRef) {
            this.roomRef.off();
            this.roomRef = null;
        }
        if (this.restPollTimer) {
            clearInterval(this.restPollTimer);
            this.restPollTimer = null;
        }
        this.roomCode = '';
        this.hasInitialSync = false;
        localStorage.removeItem('lifehub_sync_room_code');
        this.updateBadgeUI('disconnected');
        this.updateModalUI();
    }

    saveFirebaseConfig(rawConfigText) {
        try {
            let jsonText = rawConfigText.trim();

            if (jsonText.startsWith('const') || jsonText.startsWith('var') || jsonText.startsWith('let')) {
                jsonText = jsonText.substring(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1);
            }

            jsonText = jsonText
                .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/'/g, '"');

            const parsed = JSON.parse(jsonText);

            if (!parsed.apiKey || !parsed.databaseURL) {
                alert('Firebase Config ต้องมี apiKey และ databaseURL ครับ');
                return false;
            }

            this.firebaseConfig = parsed;
            localStorage.setItem('lifehub_firebase_config', JSON.stringify(parsed));
            this.initFirebase();
            this.updateModalUI();
            return true;
        } catch (e) {
            alert('รูปแบบ Firebase Config ไม่ถูกต้อง กรุณา copy จาก Firebase Console มาวาง');
            return false;
        }
    }

    updateBadgeUI(state) {
        const badge = document.getElementById('cloud-sync-status-badge');
        if (!badge) return;

        if (!this.connected && !this.useRestFallback) {
            badge.className = 'cloud-sync-badge offline';
            badge.innerHTML = '<span class="sync-dot sync-offline"></span> Offline';
        } else if (this.roomCode) {
            badge.className = 'cloud-sync-badge online';
            const modeLabel = this.useRestFallback ? 'Sync REST' : 'Syncing';
            badge.innerHTML = `<span class="sync-dot sync-online"></span> ${modeLabel} (${this.roomCode})`;
        } else {
            badge.className = 'cloud-sync-badge ready';
            badge.innerHTML = '<span class="sync-dot sync-ready"></span> Ready';
        }
    }

    updateModalUI() {
        const statusContainer = document.getElementById('sync-modal-status');
        const configSection = document.getElementById('firebase-config-section');
        const roomSection = document.getElementById('room-section');

        if (this.firebaseConfig && this.connected) {
            if (configSection) configSection.style.display = 'none';
            if (roomSection) roomSection.style.display = 'block';

            if (statusContainer) {
                if (this.roomCode) {
                    statusContainer.innerHTML = `
                        <div class="sync-status-connected">
                            <div class="sync-room-display">
                                <span class="sync-room-label">รหัสห้อง Sync ของคุณ</span>
                                <span class="sync-room-code">${this.roomCode}</span>
                                <button onclick="navigator.clipboard.writeText('${this.roomCode}'); alert('คัดลอกรหัสห้องแล้ว!');" class="btn-copy-code">📋 คัดลอกรหัส</button>
                            </div>
                            <p class="sync-status-text">🟢 ข้อมูลลิงก์กับอุปกรณ์อื่นแบบเรียลไทม์แล้ว</p>
                            <button id="btn-disconnect-room" class="btn-text-danger" style="margin-top: 10px;">❌ ออกจากห้องนี้</button>
                        </div>
                    `;
                    const btnDisc = document.getElementById('btn-disconnect-room');
                    if (btnDisc) btnDisc.addEventListener('click', () => this.disconnectRoom());
                } else {
                    statusContainer.innerHTML = `
                        <div class="sync-status-disconnected">
                            <p class="sync-guide-text">พร้อมใช้งาน Cloud Sync — สร้างห้องบนเครื่องนี้ หรือใส่รหัส 6 ตัวเพื่อเข้าร่วม</p>
                        </div>
                    `;
                }
            }
        } else {
            if (configSection) configSection.style.display = 'block';
            if (roomSection) roomSection.style.display = 'none';
        }
    }

    bindUIEvents() {
        const btnOpenSync = document.getElementById('btn-open-cloud-sync');
        const btnCloseSyncModal = document.getElementById('btn-close-sync-modal');
        const modalSync = document.getElementById('modal-cloud-sync');
        const btnSaveConfig = document.getElementById('btn-save-firebase-config');
        const btnCreateRoom = document.getElementById('btn-create-room');
        const btnJoinRoom = document.getElementById('btn-join-room');

        if (btnOpenSync) {
            btnOpenSync.addEventListener('click', () => {
                this.updateModalUI();
                if (modalSync) modalSync.classList.add('active');
            });
        }

        if (btnCloseSyncModal) {
            btnCloseSyncModal.addEventListener('click', () => {
                if (modalSync) modalSync.classList.remove('active');
            });
        }

        if (btnSaveConfig) {
            btnSaveConfig.addEventListener('click', () => {
                const configInput = document.getElementById('firebase-config-input');
                if (configInput && configInput.value.trim()) {
                    if (this.saveFirebaseConfig(configInput.value)) {
                        if (window.appController) window.appController.showToast('🔑 บันทึก Firebase Config สำเร็จ!');
                    }
                }
            });
        }

        if (btnCreateRoom) {
            btnCreateRoom.addEventListener('click', () => this.createRoom());
        }

        if (btnJoinRoom) {
            btnJoinRoom.addEventListener('click', () => {
                const joinInput = document.getElementById('join-room-code');
                if (joinInput && joinInput.value.trim()) {
                    this.joinRoom(joinInput.value.trim());
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cloudSync = new CloudSyncEngine();
});
