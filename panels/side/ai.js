/**
 * UI Builder Engine
 * @param {HTMLElement} container - Target DOM element
 * @param {Array} schema - List of component definitions
 */
function buildUiPanel(container, schema) {
    container.innerHTML = '';

    schema.forEach(item => {
        const el = renderComponent(item);
        if (el) container.appendChild(el);
    });
}

// Main Dispatcher
function renderComponent(item) {
    switch (item.type) {
        case 'title':
            return createElement('div', { class: 'ui-title', text: item.label });
        case 'small-title':
            return createElement('div', { class: 'ui-title', text: item.label });
        case 'section': return renderSection(item);
        case 'grid-2':
        case 'grid-4': return renderGrid(item);

        // Smart Components
        case 'control-row': return renderControlRow(item);
        case 'toggle-row': return renderToggleRow(item);
        case 'button': return renderButton(item);

        case 'custom-container':
        case 'div':
            const div = document.createElement('div');
            if (item.id) div.id = item.id;
            if (item.className) div.className = item.className;
            if (item.style) div.style.cssText = item.style;
            return div;

        // Fallback or raw inputs inside grids
        default: return renderInputControl(item);
    }
}

// --- Renderers ---

function renderSection(item) {
    const section = createElement('div', { class: 'ui-section' });
    if (item.collapsed) section.addClass('collapsed');

    const head = createElement('div', {
        class: 'ui-section-head', text: item.label,
    });
    head.onclick = () => section.toggleClass('collapsed');

    const body = createElement('div', { class: 'ui-section-body' });

    if (item.children) {
        item.children.forEach(child => {
            const childEl = renderComponent(child);
            if (childEl) body.appendChild(childEl);
        });
    }

    section.append(head, body);
    return section;
}

function renderGrid(item) {
    const grid = document.createElement('div');
    grid.className = item.type === 'grid-4' ? 'ui-grid-4' : 'ui-grid-2';

    item.children.forEach(child => {
        // If child has a label, wrap it. If it's just an input definition, render input directly.
        let childEl;
        if (child.label) {
            // Mini wrapper for grid items with labels
            const wrapper = createElement('div');
            const lbl = createElement('label', {
                class: 'ui-label', style: 'fontSize: 11px;', text: child.label
            });
            wrapper.appendChild(lbl);
            wrapper.appendChild(renderInputControl(child));
            childEl = wrapper;
        } else {
            childEl = renderInputControl(child);
        }
        grid.appendChild(childEl);
    });
    return grid;
}

// The "Smart Row" (Label + Input)
function renderControlRow(item) {
    const wrapper = createElement('div', { class: 'ui-control-row' });
    const label = createElement('label', { class: 'ui-label', text: item.label });

    wrapper.appendChild(label);

    const inputEl = renderInputControl(item);
    wrapper.appendChild(inputEl);

    return wrapper;
}

// The "Smart Toggle" (Label Left + Switch Right)
function renderToggleRow(item) {
    const wrapper = createElement('div', { class: 'ui-toggle-row' });
    const label = createElement('span', { class: 'ui-label', text: item.label });
    const switchLabel = createElement('label', { class: 'ui-switch' });
    const input = createElement('input', { type: 'checkbox' });
    input.onchange = (e) => item.onChange(e.target.checked);
    const slider = createElement('span', { class: 'ui-slider' });

    switchLabel.append(input, slider);
    wrapper.append(label, switchLabel);

    return wrapper;
}

function renderButton(item) {
    const btn = createElement('button', {
        text: item.label,
        class: 'ui-btn ' + (item.className || 'ui-btn-secondary'),
    });
    btn.onclick = item.onClick;
    return btn;
}

// --- Low Level Inputs ---

function renderInputControl(item) {
    switch (item.inputType) {
        case 'select':
            const select = createElement('select', { class: 'ui-select' });
            item.options.forEach(opt => {
                const o = document.createElement('option');
                // Support both ['a','b'] and [{value:'a', text:'A'}]
                const value = typeof opt === 'object' ? opt.value : opt;
                const text = typeof opt === 'object' ? opt.text : opt;
                o.value = value;
                o.innerText = text;
                select.appendChild(o);
            });
            select.onchange = (e) => item.onChange(e.target.value);
            return select;

        case 'color':
            return createSmartColorPicker(item);

        case 'range':
            const range = createElement('input', {
                type: 'range', class: 'ui-range',
                min: item.min || 0, max: item.max || 100,
                value: item.val || (item.max / 2),
            });
            range.oninput = (e) => item.onChange(e.target.value);
            return range;

        case 'number':
        case 'text':
            // Simple input or Input Group
            if (item.unit) {
                const group = createElement('div', { class: 'ui-input-group' });
                const input = createElement('input', {
                    type: item.inputType,
                    placeholder: '-'
                });
                input.oninput = (e) => {
                    const currentUnit = group.$1('.ui-addon').value || group.$1('.ui-addon').innerText;
                    item.onChange(e.target.value + currentUnit);
                };

                let addon;
                if (Array.isArray(item.unit)) {
                    addon = createElement('select', { class: 'ui-addon' });
                    item.unit.forEach(u => {
                        const opt = document.createElement('option');
                        opt.value = u; opt.innerText = u;
                        addon.appendChild(opt);
                    });

                    addon.onchange = () => item.onChange(input.value + addon.value);
                } else {
                    addon = createElement('span', { class: 'ui-addon', text: item.unit });
                }

                group.append(input, addon);
                return group;
            } else {
                const input = createElement('input', { type: item.inputType, class: 'ui-input' });
                input.oninput = (e) => item.onChange(e.target.value);
                return input;
            }

        default:
            return createElement('div');
    }
}

function createSmartColorPicker(item, initialVal) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ui-color-wrapper';

    let mode = 'solid';

    wrapper.innerHTML = `
        <div class="ui-color-tabs">
            <button class="ui-tab active" data-mode="solid">רגיל</button>
            <button class="ui-tab" data-mode="theme">ערכת נושא</button>
        </div>
        <div class="mode-solid">
            <div class="ui-color-trigger">
                <div class="ui-color-preview" style="background:${initialVal}"></div>
                <span style="font-size:12px; font-family:monospace;">${initialVal || 'Transparent'}</span>
            </div>
            <input type="color" class="native-picker" value="${initialVal && initialVal.startsWith('#') ? initialVal : '#000000'}" style="position:absolute; opacity:0; pointer-events:none;">
        </div>
        <div class="mode-theme" style="display:none;">
             <select class="ui-select theme-select"><option value="">בחר...</option></select>
             <input type="range" class="theme-slider" min="0" max="100" style="width:100%; margin-top:5px; display:none;">
        </div>
    `;

    // Logic
    const tabs = wrapper.$$('.ui-tab');
    const solidView = wrapper.$1('.mode-solid');
    const themeView = wrapper.$1('.mode-theme');
    const trigger = wrapper.$1('.ui-color-trigger');
    const native = wrapper.$1('.native-picker');
    const preview = wrapper.$1('.ui-color-preview');
    const text = wrapper.$1('span');

    tabs.forEach(t => t.onclick = () => {
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        mode = t.dataset.mode;
        solidView.style.display = mode === 'solid' ? 'block' : 'none';
        themeView.style.display = mode === 'theme' ? 'block' : 'none';
    });

    trigger.onclick = () => native.showPicker ? native.showPicker() : native.click();
    native.oninput = (e) => {
        const v = e.target.value;
        preview.style.background = v;
        text.innerText = v;
        item.onChange(v);
    };

    // Populate Themes (if available)
    if (typeof themeDefinitions !== 'undefined') {
        const sel = wrapper.querySelector('.theme-select');
        themeDefinitions.forEach(theme => {
            const opt = document.createElement('option');
            opt.value = theme.id;
            opt.innerText = theme.name;
            sel.appendChild(opt);
        });
        sel.onchange = (e) => {
            // Theme logic placeholder - trigger global theme logic
            // For simplicity, we just pass the theme ID or handle it via a helper
            // item.onChange('theme:' + e.target.value); 
        };
    }

    return wrapper;
}










const bordersSchema = [
    { type: 'title', label: 'גבולות וריווח' },

    {
        type: 'section', label: 'מסגרת', collapsed: false,
        children: [
            {
                type: 'control-row', label: 'סגנון קו', inputType: 'select', prop: 'borderStyle',
                options: [
                    { value: 'none', text: 'ללא' },
                    { value: 'solid', text: 'רציף' },
                    { value: 'dashed', text: 'מקווקו' },
                    { value: 'dotted', text: 'מנוקד' },
                    { value: 'double', text: 'כפול' }
                ],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderStyle', v)
            },
            {
                type: 'control-row', label: 'צבע', inputType: 'color', prop: 'borderColor',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderColor', v)
            },
            {
                type: 'control-row', label: 'עובי', inputType: 'number', prop: 'borderWidth', unit: 'px',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderWidth', v)
            }
        ]
    },

    {
        type: 'section', label: 'פינות עגולות (Radius)', collapsed: true,
        children: [
            {
                type: 'grid-4',
                children: [
                    { inputType: 'number', label: '↖', prop: 'borderTopLeftRadius', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderTopLeftRadius', v) },
                    { inputType: 'number', label: '↗', prop: 'borderTopRightRadius', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderTopRightRadius', v) },
                    { inputType: 'number', label: '↘', prop: 'borderBottomRightRadius', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderBottomRightRadius', v) },
                    { inputType: 'number', label: '↙', prop: 'borderBottomLeftRadius', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'borderBottomLeftRadius', v) }
                ]
            }
        ]
    },

    {
        type: 'section', label: 'ריווח פנימי (Padding)', collapsed: false,
        children: [
            {
                type: 'grid-4',
                children: [
                    { inputType: 'number', label: 'Top', prop: 'paddingTop', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'paddingTop', v) },
                    { inputType: 'number', label: 'Right', prop: 'paddingRight', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'paddingRight', v) },
                    { inputType: 'number', label: 'Bottom', prop: 'paddingBottom', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'paddingBottom', v) },
                    { inputType: 'number', label: 'Left', prop: 'paddingLeft', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'paddingLeft', v) }
                ]
            }
        ]
    },
    // Margin same structure...
];

function loadBordersPanel() {
    buildUiPanel(document.getElementById('panel-borders'), bordersSchema, theStyles);
}
loadBordersPanel()

/*layout.js*/
const layoutSchema = [
    { type: 'title', label: 'פריסת פלקס' },

    {
        type: 'control-row', label: 'כיוון', inputType: 'select', prop: 'flexDirection',
        options: [
            { value: 'row', text: 'שורה →' },
            { value: 'column', text: 'טור ↓' },
            { value: 'row-reverse', text: 'שורה הפוכה ←' },
            { value: 'column-reverse', text: 'טור הפוך ↑' }
        ],
        onChange: (v) => theElement.style.flexDirection = v
    },

    {
        type: 'control-row', label: 'יישור ראשי', inputType: 'select', prop: 'justifyContent',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'flex-end', text: 'סוף' },
            { value: 'space-between', text: 'רווח מקסימלי' },
            { value: 'space-around', text: 'רווח מחולק' },
            { value: 'space-evenly', text: 'רווח שווה' }
        ],
        onChange: (v) => theElement.style.justifyContent = v
    },

    {
        type: 'control-row', label: 'יישור משני (Align)', inputType: 'select', prop: 'alignItems',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'stretch', text: 'מתיחה' }
        ],
        onChange: (v) => theElement.style.alignItems = v
    },

    {
        type: 'toggle-row', label: 'גלישת שורות', prop: 'flexWrap',
        onChange: (isChecked) => theElement.style.flexWrap = isChecked ? 'wrap' : 'nowrap'
    }
];

function loadLayoutPanel() {
    buildUiPanel(document.getElementById('panel-layout'), layoutSchema, theStyles);
}
loadLayoutPanel()
/*design.js*/
const designSchema = [
    { type: 'title', label: 'עיצוב טקסט וצבע' },

    {
        type: 'section', label: 'טיפוגרפיה', collapsed: false,
        children: [
            {
                type: 'control-row', label: 'גופן', inputType: 'select', prop: 'fontFamily',
                options: ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'System-ui'],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'fontFamily', v)
            },
            {
                type: 'control-row', label: 'גודל', inputType: 'number', prop: 'fontSize', unit: 'px',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'fontSize', v)
            },
            {
                type: 'control-row', label: 'משקל', inputType: 'select', prop: 'fontWeight',
                options: [{ value: '400', text: 'רגיל' }, { value: '700', text: 'מודגש' }],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'fontWeight', v)
            }
        ]
    },

    {
        type: 'section', label: 'צבעים', collapsed: false,
        children: [
            {
                type: 'control-row', label: 'צבע טקסט', inputType: 'color', prop: 'color',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'color', v)
            },
            {
                type: 'control-row', label: 'צבע רקע', inputType: 'color', prop: 'backgroundColor',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'backgroundColor', v)
            }
        ]
    }
];

function loadDesignPanel() {
    buildUiPanel(document.getElementById('panel-design'), designSchema, theStyles);
}
loadDesignPanel()
/*settings.js
ג'אווהסקריפט*/
/*const settingsSchema = [
    { type: 'title', label: 'הגדרות מערכת' },

    {
        type: 'section', label: 'כללי', collapsed: false,
        children: [
            {
                type: 'toggle-row', label: 'מצב כהה', prop: 'theme',
                onChange: (checked) => toggleTheme(checked)
            },
            {
                type: 'toggle-row', label: 'שמירה אוטומטית', prop: 'autoSave',
                onChange: (checked) => toggleAutoSave(checked)
            }
        ]
    },

    {
        type: 'button', label: 'אפס הגדרות', className: 'ui-btn-danger',
        onClick: () => {
            if (confirm('בטוח?')) localStorage.clear();
        }
    }
];
*/
// function loadSettingsPanel() {
//     // Note: Assuming settings.data object exists
//     buildUiPanel(document.getElementById('panel-settings'), settingsSchema, settings.data);
// }
// loadSettingsPanel();

/*

צודק לגמרי! התמקדנו בדוגמאות ושכחנו את הפאנלים הכבדים יותר.
הנה ההשלמה המלאה עבור: Position, View, Classes, Theme, ו - Add Element.
מכיוון שהבנאי שלנו(uiBuilder) יודע להקצות id לאלמנטים שהוא יוצר, הלוגיקה הקיימת שלך(שמשתמשת ב - getElementById או $ כדי למצוא קונטיינרים ולמלא אותם) תמשיך לעבוד, כל עוד נקפיד על ה - IDs הנכונים בג'ייסון.
1.position.js
פאנל זה משתמש הרבה ב - grid - 4 ובשדות עם יחידות מידה.
    ג'אווהסקריפט*/
const positionSchema = [
    { type: 'title', label: 'מיקום (Position)' },

    // שורה ראשונה: סוג מיקום ו-Z-Index
    {
        type: 'grid-2',
        children: [
            {
                inputType: 'select', label: 'שיטה', prop: 'position',
                options: [
                    { value: 'static', text: 'אוטומטי' },
                    { value: 'relative', text: 'הזזת התצוגה' },
                    { value: 'absolute', text: 'מיקום קבוע ביחס להורה' },
                    { value: 'fixed', text: 'קבוע' },
                    { value: 'sticky', text: 'דביק' }
                ],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'position', v)
            },
            {
                inputType: 'number', label: 'שכבה', prop: 'zIndex',
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'zIndex', v)
            }
        ]
    },

    // גריד של 4 כיוונים
    { type: 'label', label: 'היסט' }, // לייבל עצמאי אם רוצים
    {
        type: 'grid-4',
        children: [
            { inputType: 'number', label: 'Top', prop: 'top', unit: ['px', '%', 'vh'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'top', v) },
            { inputType: 'number', label: 'Bottom', prop: 'bottom', unit: ['px', '%', 'vh'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'bottom', v) },
            { inputType: 'number', label: 'Left', prop: 'left', unit: ['px', '%', 'vw'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'left', v) },
            { inputType: 'number', label: 'Right', prop: 'right', unit: ['px', '%', 'vw'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'right', v) }
        ]
    },

    { type: 'title', label: 'גודל (Size)' },

    // רוחב וגובה
    {
        type: 'grid-2',
        children: [
            { inputType: 'number', label: 'רוחב', prop: 'width', unit: ['px', '%', 'vw', 'auto'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'width', v) },
            { inputType: 'number', label: 'גובה', prop: 'height', unit: ['px', '%', 'vh', 'auto'], onChange: (v) => updateStyle(getActiveSelectorKey(), 'height', v) }
        ]
    },

    // מינימום רוחב/גובה
    {
        type: 'section', label: 'הגבלות גודל (Min/Max)', collapsed: true,
        children: [
            {
                type: 'grid-2',
                children: [
                    { inputType: 'number', label: 'רוחב מינימלי', prop: 'minWidth', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'minWidth', v) },
                    { inputType: 'number', label: 'גובה מינימלי', prop: 'minHeight', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'minHeight', v) },
                    { inputType: 'number', label: 'רוחב מקסימלי', prop: 'maxWidth', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'maxWidth', v) },
                    { inputType: 'number', label: 'גובה מקסימלי', prop: 'maxHeight', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'maxHeight', v) }
                ]
            }
        ]
    }
];

function loadPositionPanel() {
    buildUiPanel(document.getElementById('panel-position'), positionSchema, theStyles);
}
loadPositionPanel();
/*2.view.js
תצוגה, נראות ואפקטים.
    ג'אווהסקריפט*/
const viewSchema = [
    { type: 'title', label: 'תצוגה ואפקטים' },

    {
        type: 'control-row', label: 'סוג תצוגה', inputType: 'select', prop: 'display',
        options: [
            { value: 'block', text: 'בלוק' },
            { value: 'inline', text: 'בתוך השורה' },
            { value: 'inline-block', text: 'בלוק בתוך השורה' },
            { value: 'flex', text: 'פריסה גמישה חד ממדית' },
            { value: 'grid', text: 'פריסה גמישה דו ממדית' },
            { value: 'none', text: 'מוסתר' }
        ],
        onChange: (v) => updateStyle(getActiveSelectorKey(), 'display', v)
    },

    {
        type: 'grid-2',
        children: [
            {
                inputType: 'select', label: 'גלישה (Overflow)', prop: 'overflow',
                options: [
                    { value: 'visible', text: 'רגיל' },
                    { value: 'hidden', text: 'חתוך' },
                    { value: 'scroll', text: 'גלילה' },
                    { value: 'auto', text: 'אוטומטי' }
                ],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'overflow', v)
            },
            {
                inputType: 'select', label: 'נראות (Visibility)', prop: 'visibility',
                options: [
                    { value: 'visible', text: 'גלוי' },
                    { value: 'hidden', text: 'נסתר (תופס מקום)' }
                ],
                onChange: (v) => updateStyle(getActiveSelectorKey(), 'visibility', v)
            }
        ]
    },

    {
        type: 'control-row', label: 'שקיפות', inputType: 'number', prop: 'opacity',
        unit: '', // אין יחידה (0-1)
        onChange: (v) => updateStyle(getActiveSelectorKey(), 'opacity', v)
    },

    {
        type: 'control-row', label: 'סמן עכבר', inputType: 'select', prop: 'cursor',
        options: [
            { value: 'auto', text: 'אוטומטי' },
            { value: 'pointer', text: 'יד' },
            { value: 'text', text: 'טקסט' },
            { value: 'not-allowed', text: 'חסום' }
        ],
        onChange: (v) => updateStyle(getActiveSelectorKey(), 'cursor', v)
    }
];

function loadViewPanel() {
    buildUiPanel(document.getElementById('panel-display'), viewSchema, theStyles);
}
loadViewPanel();

/*3.classes.js
כאן אנחנו משתמשים בבנאי כדי ליצור את ה"שלד"(הקונטיינרים והאינפוטים), אבל הלוגיקה המקורית שלך(refreshClassesView) היא זו שתמלא את ה - divים בתוכן דינמי(תגיות).
    ג'אווהסקריפט*/
const classesSchema = [
    { type: 'title', label: 'ניהול קלאסים (Classes)' },

    // אזור הקלאסים הפעילים
    { type: 'label', label: 'קלאסים משויכים:' },
    {
        // אנו יוצרים div ריק עם ID ספציפי כדי שהלוגיקה הקיימת תדע "לשפוך" לתוכו את התגיות
        // נשתמש בטריק של יצירת "רכיב קלט" שהוא בעצם קונטיינר
        type: 'custom-container', // נצטרך לוודא שזה נתמך או להשתמש ב-section ריק
        id: 'activeClassesList',
        className: 'ui-input-group', // סתם שייראה כמו מסגרת
        style: 'min-height: 40px; padding: 5px; flex-wrap: wrap; height: auto;'
    },

    // אזור הוספה
    { type: 'label', label: 'הוסף קלאס חדש:' },
    {
        type: 'grid-2', // שורה עם אינפוט וכפתור
        children: [
            {
                inputType: 'text', id: 'classInput', placeholder: 'שם קלאס (למשל my-btn)...',
                onChange: () => { } // הלוגיקה מטופלת בנפרד בכפתור
            },
            {
                type: 'button', id: 'btnConnectClass', label: 'שייך', className: 'ui-btn-primary',
                onClick: () => { } // המאזין יחובר בפונקציה הראשית בנפרד, או כאן אם תרצה
            }
        ]
    },
    {
        type: 'button', id: 'btnCreateRule', label: '🛠️ צור חוק CSS חדש', className: 'ui-btn-secondary',
        style: 'font-size: 11px; margin-bottom: 15px;'
    },

    { type: 'title', label: 'ספריית קלאסים' },
    {
        // קונטיינר לרשימה
        id: 'systemClassesList',
        style: 'max-height: 150px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px;'
    }
];

function loadClassesPanel() {
    buildUiPanel(document.getElementById('panel-classes'), classesSchema, {});
    // קריאה לפונקציות המקוריות שלך שממלאות את התוכן ומחברות מאזינים
    refreshClassesView();
    attachClassesListeners();
}
loadClassesPanel();
/*הערה: ב - uiBuilder תצטרך לתמוך ב - id ו - style עבור אלמנטים גנריים, או פשוט להוסיף case קטן שיוצר div פשוט אם ה - type לא מוכר.
theme.js
דומה ל - Classes, יש כאן רשימה דינמית.
    ג'אווהסקריפט*/
const themeSchema = [
    { type: 'title', label: 'מערכת צבעים חכמה' },

    {
        // קונטיינר לרשימת הנושאים
        id: 'themeItemsList',
        style: 'margin-bottom: 10px;'
    },

    {
        type: 'button', id: 'btnAddThemeItem', label: '+ צור טווח חדש', className: 'ui-btn-primary',
        onClick: () => openThemeEditor()
    }
];

function loadThemePanel() {
    buildUiPanel(document.getElementById('panel-theme'), themeSchema, {});
    renderThemeList(); // הפונקציה המקורית שממלאת את הרשימה
}
loadThemePanel();
/*5.addElement.js
זה פאנל מיוחד כי הוא בונה טופס בתוך טופס.הבנאי שלנו יבנה את ה"מסגרת", והלוגיקה המקורית תמלא את האמצע.
    ג'אווהסקריפט*/
const addElementSchema = [
    { type: 'title', label: 'הוספת אלמנט' },

    {
        type: 'control-row', label: 'בחר סוג אלמנט', inputType: 'select', id: 'elementTypeSelect',
        options: Object.keys(elementDefinitions).map(k => ({ value: k, text: elementDefinitions[k].label })),
        onChange: (v) => renderDynamicFields(v) // קריאה לפונקציה המקורית שבונה את השדות האמצעיים
    },

    // קונטיינר לשדות הדינמיים
    {
        id: 'dynamicFormFields',
        style: 'margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;'
    },

    {
        type: 'control-row', label: 'מזהה ייחודי (ID)', inputType: 'text', id: 'newElementId',
        placeholder: 'אופציונלי...', style: 'direction:ltr;'
    },

    {
        type: 'button', id: 'btnAdd', label: '+ הוסף למסמך', className: 'ui-btn-primary',
        onClick: executeAdd // הפונקציה המקורית
    }
];

function loadAddElementPanel() {
    buildUiPanel(document.getElementById('panel-add-element'), addElementSchema, {});
    // אתחול ראשוני של השדות הדינמיים
    const select = document.getElementById('elementTypeSelect');
    if (select) renderDynamicFields(select.value);
}
loadAddElementPanel();
