


// "זיכרון" של קשרים: איזה אלמנט קשור לאיזה טווח, ומה המיקום היחסי שלו
// מבנה: { selector: '#myDiv', prop: 'backgroundColor', themeId: 't1', relativeValue: 25 }
let themeLinks = [];

/**
 * פונקציה ליצירת בורר צבע חכם
 * @param {string} selector - הסלקטור של האלמנט הנערך (למשל #myDiv)
 * @param {string} prop - תכונת ה-CSS (למשל backgroundColor)
 * @param {string} currentVal - הערך הנוכחי (Hex)
 */
function createColorPicker(selector, prop, currentVal) {
    const container = createElement('div', { class: 'color-picker-wrapper' });

    // בדיקה האם האלמנט כבר מקושר לטווח כלשהו
    const existingLink = themeLinks.find(l => l.selector === selector && l.prop === prop);
    const mode = existingLink ? 'theme' : 'solid';

    container.innerHTML = `
        <div class="picker-tabs" style="display:flex; gap:5px; margin-bottom:5px;">
            <button class="tab-btn ${mode === 'solid' ? 'active' : ''}" data-mode="solid">רגיל</button>
            <button class="tab-btn ${mode === 'theme' ? 'active' : ''}" data-mode="theme">מתוך טווח</button>
        </div>
        
        <div class="mode-content solid-mode" style="display:${mode === 'solid' ? 'block' : 'none'}">
            <input type="color" class="simple-color" value="${existingLink ? '#000000' : (currentVal.startsWith('#') ? currentVal : '#000000')}" style="width:100%;">
        </div>

        <div class="mode-content theme-mode" style="display:${mode === 'theme' ? 'block' : 'none'}">
            <select class="theme-select" style="width:100%; margin-bottom:5px;">
                <option value="">בחר טווח...</option>
                ${themeDefinitions.map(t => `<option value="${t.id}" ${existingLink?.themeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
            
            <div class="range-slider-container" style="position:relative; height:20px; border-radius:10px; border:1px solid #ccc; margin-top:5px; display:${existingLink ? 'block' : 'none'}">
                 <div class="range-bg" style="width:100%; height:100%; border-radius:10px;"></div>
                 <input type="range" class="range-input" min="0" max="100" value="${existingLink ? existingLink.relativeValue : 50}" 
                        style="position:absolute; top:0; left:0; width:100%; opacity:0; cursor:pointer;">
                 <div class="range-thumb" style="position:absolute; top:0; height:100%; width:4px; background:var(--ui-base); border:1px solid #000; pointer-events:none; left:${existingLink ? existingLink.relativeValue : 50}%"></div>
            </div>
        </div>
    `;

    // --- לוגיקה ---
    const solidInput = container.$1('.simple-color');
    const themeSelect = container.$1('.theme-select');
    const rangeContainer = container.$1('.range-slider-container');
    const rangeInput = container.$1('.range-input');
    const rangeBg = container.$1('.range-bg');
    const rangeThumb = container.$1('.range-thumb');

    // החלפת טאבים
    container.$$('.tab-btn').whenClick((e) => {
        container.$$('.tab-btn').removeClass('active');
        e.target.addClass('active');
        const m = e.target.dataset.mode;
        container.$$('.mode-content').forEach(d => d.style.display = 'none');
        container.$1(`.${m}-mode`).style.display = 'block';

        // ניתוק קשר אם עוברים למצב רגיל
        if (m === 'solid') {
            removeLink(selector, prop);
            updateStyle(getActiveSelectorKey(), prop, solidInput.value); // עדכון רגיל
        }
    });

    // שינוי צבע רגיל
    solidInput.when('input', (e) => {
        updateStyle(getActiveSelectorKey(), prop, e.target.value);
    });

    // בחירת טווח
    themeSelect.when('change', (e) => {
        const themeId = e.target.value;
        if (!themeId) {
            rangeContainer.style.display = 'none';
            return;
        }

        rangeContainer.style.display = 'block';
        const theme = themeDefinitions.find(t => t.id === themeId);

        // עדכון הרקע של הסליידר שייראה כמו הטווח הנבחר
        rangeBg.style.background = `linear-gradient(to right, ${theme.anchors.join(', ')})`;

        // הפעלה ראשונית של חישוב הצבע לפי מיקום הסליידר
        applyThemeColor(theme, rangeInput.value);
    });

    // הזזת הסמן בטווח
    rangeInput.when('input', (e) => {
        const val = e.target.value;
        rangeThumb.style.left = val + '%';
        const themeId = themeSelect.value;
        const theme = themeDefinitions.find(t => t.id === themeId);

        applyThemeColor(theme, val);
    });

    function applyThemeColor(theme, percent) {
        // 1. חישוב הצבע בפועל
        let finalColor;
        if (theme.type === '1d') {
            finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], percent);
        } else {
            // לוגיקה ל-3 צבעים (פשטני: 0-50% צבע 1 ו-2, 50-100% צבע 2 ו-3)
            if (percent <= 50) {
                finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], percent * 2);
            } else {
                finalColor = Color.mixColors(theme.anchors[1], theme.anchors[2], (percent - 50) * 2);
            }
        }

        // 2. שמירת הקשר (Binding)
        saveLink(selector, prop, theme.id, percent);

        // 3. עדכון הסטייל בדף (ממירים להקסדצימלי רגיל כי CSS לא מכיר את הטווחים שלנו)
        updateStyle(selector, prop, finalColor);
    }

    return container;
}
/*
function updateColorPicker(selector) {
    // בדיקה האם האלמנט כבר מקושר לטווח כלשהו
    const existingLink = themeLinks.find(l => l.selector === selector && l.prop === prop);
    const mode = existingLink ? 'theme' : 'solid';
}

function replaseTab() {
    
}*/

// ניהול רשימת הקישורים
function saveLink(selector, prop, themeId, val) {
    // הסר ישן אם קיים
    removeLink(selector, prop);
    themeLinks.push({
        selector: selector,
        prop: prop,
        themeId: themeId,
        relativeValue: parseFloat(val)
    });
}

function removeLink(selector, prop) {
    themeLinks = themeLinks.filter(l => !(l.selector === selector && l.prop === prop));
}

// פונקציה שנקראת כשעורכים טווח בפאנל הראשי - מעדכנת את כל המקושרים
function updateAllLinkedElements(themeId) {
    const theme = themeDefinitions.find(t => t.id === themeId);
    if (!theme) return;

    themeLinks.forEach(link => {
        if (link.themeId === themeId) {
            // חישוב מחדש של הצבע לפי המיקום היחסי השמור
            let finalColor;
            const p = link.relativeValue;

            if (theme.type === '1d') {
                finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], p);
            } else {
                if (p <= 50) finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], p * 2);
                else finalColor = Color.mixColors(theme.anchors[1], theme.anchors[2], (p - 50) * 2);
            }

            updateStyle(link.selector, link.prop, finalColor);
        }
    });
}





















// משתנה גלובלי לשמירת הגדרות הנושא
let themeDefinitions = [];
// מבנה: { id: 't1', name: 'Primary Gradient', type: '1d', anchors: ['#0000ff', '#ff0000'] }

function loadThemePanel() {
    const container = $('panel-theme');
    container.innerHTML = `
        <div class="theme-panel">
            <h4>מערכת צבעים חכמה</h4>
            <div id="themeItemsList"></div>
            <button id="btnAddThemeItem" class="btn-primary" style="margin-top:10px; width:100%;">+ צור טווח חדש</button>
        </div>
        <div id="themeEditorOverlay"></div> 
    `;

    $('btnAddThemeItem').whenClick(() => openThemeEditor());
    renderThemeList();
}

function renderThemeList() {
    const list = $('themeItemsList');
    list.innerHTML = '';
    themeDefinitions.forEach(item => {
        const div = createElement('div', { class: 'color-item' });

        // יצירת תצוגה מקדימה (Gradient Bar)
        let backgroundStyle = '';
        if (item.type === '1d') {
            backgroundStyle = `background: linear-gradient(to right, ${item.anchors.join(', ')});`;
        } else if (item.type === '2d') {
            // ל-2D נשתמש ב-3 צבעים (למשל משולש או פינות)
            backgroundStyle = `background: linear-gradient(135deg, ${item.anchors[0]}, ${item.anchors[1]}), linear-gradient(to bottom, transparent, ${item.anchors[2]}); background-blend-mode: multiply;`;
        }

        div.innerHTML = `
            <div class="color-header" onclick="openThemeEditor('${item.id}')">
                <span>${item.name}</span>
                <div style="width: 50px; height: 15px; border-radius: 3px; ${backgroundStyle}"></div>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- עורך הטווחים (Editor) ---
function openThemeEditor(editId = null) {
    let config = editId
        ? themeDefinitions.find(c => c.id === editId)
        : { id: 'theme_' + Date.now(), name: 'טווח חדש', type: '1d', anchors: ['#0000FF', '#FF0000'] };

    // שכפול עמוק כדי לא לשנות ישר
    config = JSON.parse(JSON.stringify(config));

    const overlay = $('themeEditorOverlay');
    overlay.style.display = 'flex'; // הנחה שיש CSS מתאים (כמו בקוד הקודם)

    const renderEditor = () => {
        let anchorsHtml = '';
        // דרישה ב': בחירת גוונים שיוצרים טווח
        config.anchors.forEach((color, idx) => {
            anchorsHtml += `
                <div class="anchor-control" style="display:flex; align-items:center; margin-bottom:5px;">
                    <span style="width:60px;">גוון ${idx + 1}:</span>
                    <input type="color" value="${color}" data-idx="${idx}" class="anchor-picker">
                </div>`;
        });

        overlay.innerHTML = `
            <div class="builder-modal">
                <h3>עריכת טווח</h3>
                <label>שם הטווח</label>
                <input type="text" id="themeName" value="${config.name}" style="width:100%; margin-bottom:10px;">
                
                <label>סוג</label>
                <select id="themeType" style="width:100%; margin-bottom:15px;">
                    <option value="1d" ${config.type === '1d' ? 'selected' : ''}>טווח לינארי (2 גוונים)</option>
                    <option value="2d" ${config.type === '2d' ? 'selected' : ''}>משטח (3 גוונים)</option>
                </select>

                <div id="anchorsContainer">${anchorsHtml}</div>

                <div class="preview-box" style="height:40px; margin:15px 0; border:1px solid #ccc; border-radius:4px; ${getPreviewStyle(config)}"></div>

                <div style="display:flex; gap:10px; margin-top: 20px;">
                    <button id="btnSaveTheme" class="btn-primary" style="margin: 0;">שמור</button>
                    <button id="btnCancelTheme" style="background:#ccc;">ביטול</button>
                </div>
            </div>
        `;

        // Listeners
        overlay.$('themeName').when('input', (e) => config.name = e.target.value);
        overlay.$('themeType').when('change', (e) => {
            config.type = e.target.value;
            // איפוס עוגנים לפי סוג
            config.anchors = config.type === '1d' ? ['#0000FF', '#FF0000'] : ['#0000FF', '#FF0000', '#00FF00'];
            renderEditor();
        });

        overlay.$$('.anchor-picker').forEach(input => {
            input.when('input', (e) => {
                config.anchors[e.target.dataset.idx] = e.target.value;
                overlay.$1('.preview-box').style = getPreviewStyle(config);
            });
        });

        overlay.$('btnSaveTheme').whenClick(() => {
            saveThemeConfig(config, editId);
            overlay.innerHTML = '';
            renderThemeList();
            buildDesignPanel();
        });

        overlay.$('btnCancelTheme').whenClick(() => overlay.innerHTML = '');
    };

    renderEditor();
}

function getPreviewStyle(config) {
    if (config.type === '1d') {
        return `background: linear-gradient(to right, ${config.anchors.join(', ')});`;
    }
    // מימוש פשוט ל-2D עם 3 צבעים (Gradient Mesh מזויף)
    return `background: linear-gradient(to right, ${config.anchors[0]}, ${config.anchors[1]}), linear-gradient(to top, ${config.anchors[2]}, transparent); background-blend-mode: screen;`;
}

function saveThemeConfig(newConfig, isEdit) {
    if (isEdit) {
        const idx = themeDefinitions.findIndex(t => t.id === newConfig.id);
        themeDefinitions[idx] = newConfig;
    } else {
        themeDefinitions.push(newConfig);
    }
    // דרישה ג' חלק 2: עדכון כל האלמנטים התלויים בטווח
    updateAllLinkedElements(newConfig.id);
}

loadThemePanel();
