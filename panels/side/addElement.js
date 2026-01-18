// ==========================================
//   הגדרות הרכיבים (Metadata)
// ==========================================
// (נשאר זהה לקוד המקורי שלך - לא שיניתי את ההגדרות)
const elementsList = {
    'h1': {
        label: '🇹 כותרת ראשית (H1)',
        fields: [
            { type: 'control-row', key: 'text', label: 'תוכן', inputType: 'text', value: 'כותרת ראשית' },
            { type: 'control-row', key: 'color', label: 'צבע', inputType: 'color', value: '#333333' }
        ]
    },
    'h2': {
        label: '🇹 כותרת משנית (H2)',
        fields: [
            { type: 'control-row', key: 'text', label: 'תוכן', inputType: 'text', value: 'כותרת משנה' },
            { type: 'control-row', key: 'color', label: 'צבע', inputType: 'color', value: '#555555' }
        ]
    },
    'p': {
        label: '📝 פסקה (Paragraph)',
        fields: [
            { type: 'control-row', key: 'text', label: 'תוכן', inputType: 'textarea', value: 'טקסט לדוגמה...' },
            { type: 'control-row', key: 'fontSize', label: 'גודל (px)', inputType: 'number', value: '16' },
            { type: 'control-row', key: 'lineHeight', label: 'גובה שורה', inputType: 'number', value: '1.5' }
        ]
    },
    'img': {
        label: '🖼️ תמונה (Image)',
        fields: [
            { type: 'control-row', key: 'src', label: 'URL', inputType: 'text', value: 'https://via.placeholder.com/400x300' },
            { type: 'control-row', key: 'alt', label: 'תיאור', inputType: 'text', value: 'תמונה' },
            { type: 'control-row', key: 'width', label: 'רוחב (%)', inputType: 'number', value: '100' },
            { type: 'control-row', key: 'borderRadius', label: 'עיגול (px)', inputType: 'number', value: '8' }
        ]
    },
    'video': {
        label: '🎬 וידאו (Video)',
        fields: [
            { type: 'control-row', key: 'src', label: 'URL', inputType: 'text', value: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'control-row', key: 'controls', label: 'פקדים', inputType: 'checkbox', value: true },
            { type: 'control-row', key: 'autoplay', label: 'ניגון אוטומטי', inputType: 'checkbox', value: false }
        ]
    },
    'button': {
        label: '🔘 כפתור (Button)',
        fields: [
            { type: 'control-row', key: 'text', label: 'טקסט', inputType: 'text', value: 'לחץ כאן' },
            { type: 'control-row', key: 'backgroundColor', label: 'רקע', inputType: 'color', value: '#0078d4' },
            { type: 'control-row', key: 'color', label: 'טקסט', inputType: 'color', value: '#ffffff' },
            { type: 'control-row', key: 'borderRadius', label: 'עיגול (px)', inputType: 'number', value: '4' },
            { type: 'control-row', key: 'padding', label: 'ריווח', inputType: 'text', value: '10px 20px' }
        ]
    },
    'a': {
        label: '🔗 קישור (Link)',
        fields: [
            { type: 'control-row', key: 'text', label: 'טקסט', inputType: 'text', value: 'עבור לאתר' },
            { type: 'control-row', key: 'href', label: 'URL', inputType: 'text', value: 'https://google.com' },
            { type: 'control-row', key: 'target', label: 'חלון חדש', inputType: 'checkbox', value: true },
            { type: 'control-row', key: 'color', label: 'צבע', inputType: 'color', value: '#0078d4' }]
    },
    'div': {
        label: '🔲 קופסה (Container)',
        fields: [
            { type: 'control-row', key: 'minHeight', label: 'גובה מינ\' (px)', inputType: 'number', value: '100' },
            { type: 'control-row', key: 'backgroundColor', label: 'רקע', inputType: 'color', value: '#f9f9f9' },
            { type: 'control-row', key: 'padding', label: 'ריווח', inputType: 'text', value: '20px' },
            { type: 'control-row', key: 'border', label: 'מסגרת', inputType: 'checkbox', value: true }
        ]
    },
    'details': {
        label: '🔻 אקורדיון (Details)',
        fields: [
            { type: 'control-row', key: 'summary', label: 'כותרת', inputType: 'text', value: 'לחץ לפתיחה' },
            { type: 'control-row', key: 'content', label: 'תוכן', inputType: 'textarea', value: 'תוכן מוסתר...' }
        ]
    },
    'card': {
        label: '🃏 כרטיס (Card)',
        fields: [
            { type: 'control-row', key: 'imgSrc', label: 'תמונה', inputType: 'text', value: 'https://via.placeholder.com/300x200' },
            { type: 'control-row', key: 'title', label: 'כותרת', inputType: 'text', value: 'כותרת' },
            { type: 'control-row', key: 'desc', label: 'תיאור', inputType: 'textarea', value: 'תיאור קצר.' },
            { type: 'control-row', key: 'btnText', label: 'כפתור', inputType: 'text', value: 'קרא עוד' }
        ]
    }
};

const addElementSchema = [
    { type: 'title', label: 'הוספת אלמנט' },

    {
        type: 'control-row', label: 'בחר סוג אלמנט', inputType: 'select', id: 'elementTypeSelect',
        options: Object.keys(elementsList).map(k => ({ value: k, text: elementsList[k].label })),
    },

    // קונטיינר לשדות הדינמיים
    {
        type: 'div', id: 'dynamicFormFields',
        style: 'margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;'
    },

    {
        type: 'control-row', label: 'מזהה ייחודי (ID)', inputType: 'text', id: 'newElementId',
        placeholder: 'אופציונלי...', style: 'direction:ltr;'
    },

    {
        type: 'button', id: 'btnAdd', label: '+ הוסף למסמך', class: 'ui-btn-primary',
        onClick: executeAdd // הפונקציה המקורית
    }
];

function loadAddElementPanel() {
    buildUiPanel($('panel-add-element'), addElementSchema);
    // אתחול ראשוני של השדות הדינמיים
    const select = $('elementTypeSelect');
    renderDynamicFields(select.value);
    select.when('change', (v) => renderDynamicFields(v.target.value));
}

/**
 * בונה את השדות (Inputs) בהתאם לסוג שנבחר
 */
function renderDynamicFields(type) {
    const container = $('dynamicFormFields');
    container.innerHTML = '';
    const config = elementsList[type];
    if (!config || !config.fields) return;

    config.fields.forEach(field => container.append(renderComponent(field)));
    /*
    config.fields.forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        if (field.type === 'checkbox') {
            wrapper.className = 'checkbox-group'; // עיצוב שונה לצ'קבוקס

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = field.default;
            input.id = 'field_' + field.key;

            const label = document.createElement('label');
            label.htmlFor = input.id; // קשירה ללחיצה
            label.textContent = field.label;
            label.className = 'form-label';

            wrapper.appendChild(input);
            wrapper.appendChild(label);
        } else {
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = field.label;
            wrapper.appendChild(label);

            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'styled-textarea';
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.className = 'styled-input';
                // אם זה צבע, ניתן לו גובה קבוע שיראה טוב
                if (field.type === 'color') input.style.height = '35px';
            }

            if (field.default !== undefined) input.value = field.default;
            input.id = 'field_' + field.key;
            wrapper.appendChild(input);
        }
        container.appendChild(wrapper);
    });*/
}


// ==========================================
//   לוגיקת הוספה חכמה (Architecture Compliant)
// ==========================================

/**
 * הפונקציה הראשית שיוצרת את האלמנט לפי הנתונים בטופס
 */
function executeAdd() {
    const type = $('elementTypeSelect').value;
    const config = elementsList[type];

    let baseId = $('newElementId').value;
    baseId = createSafeId(baseId, type);
    if (!baseId) return;

    const data = {};
    config.fields.forEach(field => {
        const input = $(field.key);
        data[field.key] = field.type === 'checkbox' ? input.checked : input.value;
    });

    const result = buildElementStructure(type, data, baseId);
    let parent = theElement;
    if (['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'].includes(parent.tagName)) {
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parent = parent.parentNode;
        } else return;
    }

    insertElementManager(result.element, parent, false);

    Object.keys(result.rules).forEach(selector => {
        const rule = createRuleAndRef(selector);
        Object.entries(result.rules[selector]).forEach(([p, v]) => {
            if (v !== undefined && v !== '') {
                if (['width', 'height', 'fontSize', 'borderRadius', 'minHeight', 'padding', 'margin'].includes(p) && !isNaN(v)) v += 'px';
                rule.style[p] = v;
            }
        });
    });
}

/**
 * בונה את מבנה ה-DOM ומכין את אובייקט העיצובים
 * @returns { element: HTMLElement, rules: { 'selector': { prop: val } } }
 */
function buildElementStructure(type, data, baseId) {
    const rules = {};
    let el;

    // --- קומפוננטת כרטיס (Card) - מורכב ---
    if (type === 'card') {
        // 1. מיכל ראשי
        el = document.createElement('div');
        el.id = baseId;
        rules['#' + baseId] = {
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'var(--ui-base)',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        };

        // 2. תמונה
        const img = createElement('img', { id: baseId + '_img', src: data.imgSrc });
        el.appendChild(img);
        rules['#' + baseId + '_img'] = {
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            display: 'block'
        };

        // 3. תוכן הכרטיס (עוטף)
        const content = createElement('div', { id: baseId + '_content' });
        el.appendChild(content);
        rules['#' + baseId + '_content'] = { padding: '15px' };

        // 4. כותרת
        const h3 = createElement('h3', { id: baseId + '_title', text: data.title });
        content.appendChild(h3);
        rules['#' + baseId + '_title'] = { margin: '0 0 10px 0', fontSize: '18px' };

        // 5. תיאור
        const p = createElement('p', { text: data.desc, id: baseId + '_desc' });
        content.appendChild(p);
        rules['#' + baseId + '_desc'] = { fontSize: '14px', color: '#666', margin: '0 0 15px 0' };
        // 6. כפתור
        const b = document.createElement('button');
        b.innerText = data.btnText;
        b.id = baseId + '_button';
        content.appendChild(b);
        rules['#' + baseId + '_button'] = {
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px'
        };
        return { element: el, rules: rules };
    }

    // --- אלמנטים סטנדרטיים ---

    el = createElement(type, { id: baseId });

    // אובייקט הסטייל של האלמנט הראשי
    const myStyle = {};

    // מיפוי שדות מידע ל-DOM Attributes או ל-CSS Styles

    // -- DOM Attributes --
    if (data.text) el.innerText = data.text;
    if (data.src) el.src = data.src;
    if (data.href) el.href = data.href;
    if (data.alt) el.alt = data.alt;
    if (data.target) el.target = '_blank';

    if (type === 'video') {
        if (data.controls) el.controls = true;
        if (data.autoplay) el.autoplay = true;
        myStyle.maxWidth = '100%';
    }
    if (type === 'details') {
        const s = createElement('summary', { id: baseId + '_summary', text: data.summary });
        const p = createElement('p', { id: baseId + '_p', text: data.content });
        el.append(s, p);
        myStyle.border = '1px solid #ccc';
        myStyle.padding = '10px';
        myStyle.borderRadius = '4px';
    }

    // -- CSS Properties Mapping --
    // מיפוי ישיר: אם המפתח קיים ב-data, נעביר אותו לסטייל
    const styleKeys = [
        'color', 'backgroundColor', 'fontSize', 'lineHeight',
        'borderRadius', 'border', 'width', 'minHeight', 'padding'
    ];

    styleKeys.forEach(key => {
        if (data[key]) {
            if (key === 'border') {
                if (data[key] === true)
                    myStyle.border = '1px dashed #ccc'; // ברירת מחדל למסגרת
            } else {
                myStyle[key] = data[key];
            }
        }
    });

    // כפתור וקישורים - הסרת קו תחתון ועיצוב בסיסי
    if (type === 'a') myStyle.textDecoration = 'none';
    if (type === 'button') {
        myStyle.border = 'none';
        myStyle.cursor = 'pointer';
    }
    rules['#' + baseId] = myStyle;
    return { element: el, rules: rules };
}


/**
 * יצירת id מאובטח מהשם שהכניס המשתמש
 */
function createSafeId(nameFromUser, tagName) {
    let safeId;
    if (nameFromUser) {
        safeId = nameFromUser.trim().replace(/\s+/g, '_');
        if ($(safeId))
            return alert('שגיאה: קיים כבר אלמנט עם השם הזה. אנא בחר שם אחר.');
    } else {
        do {
            safeId = 'auto_' + tagName + '_' + Math.random().toString(36).substring(2, 9);
        } while ($(safeId));
    }
    return safeId;
}

// הפעלה ראשונית
loadAddElementPanel();