/**
 * mugol_kayit.js — MuGöl Hikayeler Kullanıcı Veri Yöneticisi
 * Tüm kalıcı verileri (favoriler, ilerleme, okundu, ayarlar) yönetir.
 * HTML dosyasından önce yüklenmeli.
 */

const MuGolKayit = (() => {

    const KEYS = {
        favorites : 'mugol_favorites',
        progress  : 'mugol_progress',
        readList  : 'mugol_readList',
        theme     : 'mugol_theme',
        fontSize  : 'mugol_fontSize',
        speed     : 'mugol_speed',
    };

    // ── Yardımcılar ──────────────────────────────────────────────
    function _get(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
        catch { return fallback; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; }
        catch { console.warn('MuGolKayit: localStorage yazılamadı.'); return false; }
    }

    // ── FAVORİLER ────────────────────────────────────────────────
    function getFavorites()          { return _get(KEYS.favorites, {}); }
    function isFavorite(id)          { return !!getFavorites()[id]; }
    function setFavorite(id, state)  {
        const favs = getFavorites();
        if (state) favs[id] = Date.now();
        else delete favs[id];
        _set(KEYS.favorites, favs);
        return state;
    }
    function toggleFavorite(id) {
        return setFavorite(id, !isFavorite(id));
    }
    function getFavoriteCount()      { return Object.keys(getFavorites()).length; }
    function getFavoriteIds()        { 
        const favs = getFavorites();
        // Eklenme zamanına göre en yeni önce sırala
        return Object.entries(favs).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    }

    // ── İLERLEME ─────────────────────────────────────────────────
    function getAllProgress()         { return _get(KEYS.progress, {}); }
    function getProgress(id)         { return getAllProgress()[id] || 0; } // 0–100 yüzde
    function saveProgress(id, pct)   {
        const all = getAllProgress();
        all[id] = Math.round(Math.min(100, Math.max(0, pct)));
        _set(KEYS.progress, all);
    }
    function resetProgress(id)       {
        const all = getAllProgress();
        delete all[id];
        _set(KEYS.progress, all);
    }

    // ── OKUNDU LİSTESİ ───────────────────────────────────────────
    function getReadList()           { return _get(KEYS.readList, []); }
    function isRead(id)              { return getReadList().includes(id); }
    function markRead(id)            {
        const list = getReadList();
        if (!list.includes(id)) { list.push(id); _set(KEYS.readList, list); }
    }
    function unmarkRead(id)          {
        _set(KEYS.readList, getReadList().filter(x => x !== id));
    }
    function getReadCount()          { return getReadList().length; }

    // ── AYARLAR ──────────────────────────────────────────────────
    function getTheme()              { return _get(KEYS.theme, 'light'); }
    function saveTheme(t)            { _set(KEYS.theme, t); }

    function getFontSize()           { return _get(KEYS.fontSize, 20); }
    function saveFontSize(sz)        { _set(KEYS.fontSize, sz); }

    function getSpeed()              { return _get(KEYS.speed, 1); }
    function saveSpeed(s)            { _set(KEYS.speed, s); }

    // ── GENEL ────────────────────────────────────────────────────
    /** Tüm kullanıcı verilerini sıfırla */
    function resetAll() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    // Public API
    return {
        favorites: { get: getFavorites, is: isFavorite, toggle: toggleFavorite, set: setFavorite, count: getFavoriteCount, ids: getFavoriteIds },
        progress : { getAll: getAllProgress, get: getProgress, save: saveProgress, reset: resetProgress },
        read     : { list: getReadList, is: isRead, mark: markRead, unmark: unmarkRead, count: getReadCount },
        settings : { getTheme, saveTheme, getFontSize, saveFontSize, getSpeed, saveSpeed },
        resetAll,
    };
})();
