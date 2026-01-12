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
            return createElement('div', { class: 'ui-title small', text: item.label });
        case 'section': return renderSection(item);
        case 'grid-2':
        case 'grid-4': return renderGrid(item);

        // Smart Components
        case 'control-row': return renderControlRow(item);
        case 'button': return renderButton(item);

        case 'div':
            const div = document.createElement('div');
            if (item.id) div.id = item.id;
            if (item.class) div.className = item.class;
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
            const lbl = createElement('span', {
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
    const cls = item.inputType === 'color' ? ' flex-col' : '';
    const wrapper = createElement('div', { class: 'ui-control-row' + cls });
    const label = createElement('span', { class: 'ui-label', text: item.label });

    wrapper.appendChild(label);

    const inputEl = renderInputControl(item);
    wrapper.appendChild(inputEl);

    return wrapper;
}

function renderButton(item) {
    const btn = createElement('button', {
        text: item.label, 'data-property': item.prop,
        class: 'ui-btn ' + (item.class || 'ui-btn-secondary'),
    });
    btn.onclick = item.onClick;
    return btn;
}

// --- Low Level Inputs ---

function renderInputControl(item) {
    switch (item.inputType) {
        case 'select':
            const select = createElement('select', {
                class: 'ui-select', 'data-property': item.prop
            });
            item.options.forEach(opt => {
                const o = document.createElement('option');
                // Support both ['a','b'] and [{value:'a', text:'A'}]
                const value = typeof opt === 'object' ? opt.value : opt;
                const text = typeof opt === 'object' ? opt.text : opt;
                o.value = value;
                o.innerText = text;
                select.appendChild(o);
            });
            if (item.prop === 'cursor') {
                Array.from(select.children).forEach(opt => opt.style.cursor = opt.value);
            }
            return select;

        case 'color':
            return createSmartColorPicker(item);

        case 'range':
            const range = createElement('input', {
                type: 'range', class: 'ui-range', 'data-property': item.prop,
                min: item.min || 0, max: item.max || 100, step: item.step || 1,
                value: item.value || (item.max / 2),
            });
            return range;

        case 'number':
        case 'text':
            // Simple input or Input Group
            if (item.unit) {
                const group = createElement('div', { class: 'ui-input-group' });
                const input = createElement('input', {
                    type: item.inputType,
                    'data-property': item.prop
                });
                input.oninput = (e) => {
                    const currentUnit = group.$1('.ui-addon').value || group.$1('.ui-addon').innerText;
                    item.onChange(e.target.value + currentUnit);
                };

                let addon;
                if (Array.isArray(item.unit)) {
                    addon = createElement('select', { class: 'ui-addon' });
                    item.unit.forEach(u => {
                        const opt = createElement('option', { value: u, text: u });
                        addon.appendChild(opt);
                    });

                    addon.onchange = () => item.onChange(input.value + addon.value);
                } else {
                    addon = createElement('span', { class: 'ui-addon', text: item.unit });
                }

                group.append(input, addon);
                return group;
            } else {
                const input = createElement('input', {
                    type: item.inputType, class: 'ui-input', 'data-property': item.prop
                });
                input.oninput = (e) => item.onChange(e.target.value);
                return input;
            }

        case 'toggle':
            const switchLabel = createElement('label', { class: 'ui-switch' });
            const input = createElement('input', {
                type: 'checkbox', 'data-property': item.prop,
                'data-v': item.v, 'data-x': item.x
            });
            const slider = createElement('span', { class: 'ui-slider' });

            switchLabel.append(input, slider);
            return switchLabel;

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
        type: 'div', // נצטרך לוודא שזה נתמך או להשתמש ב-section ריק
        id: 'activeClassesList',
        class: 'ui-input-group', // סתם שייראה כמו מסגרת
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
                type: 'button', id: 'btnConnectClass', label: 'שייך', class: 'ui-btn-primary',
                onClick: () => { } // המאזין יחובר בפונקציה הראשית בנפרד, או כאן אם תרצה
            }
        ]
    },
    {
        type: 'button', id: 'btnCreateRule', label: '🛠️ צור חוק CSS חדש', class: 'ui-btn-secondary',
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
        type: 'button', id: 'btnAddThemeItem', label: '+ צור טווח חדש', class: 'ui-btn-primary',
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
        type: 'button', id: 'btnAdd', label: '+ הוסף למסמך', class: 'ui-btn-primary',
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
