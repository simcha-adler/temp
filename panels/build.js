/*const help = {
    types: ['panel', 'title', 'smallTitle', 'section', 'grid', 'control', 'button', 'div'],
    'input.data': [
        'text' = { placeholder },
        'textarea' = { placeholder, rows },
        'number' = { unit, max, min, step },
        'range' = { unit, max, min, step },
        'toggle' = { 'data-v': 'data-x' },
        'button' = { 'data-v': 'data-x' },
        'select' = { options: [{ value, text }] },
        'color' = {},
        'comb' = { valInput: inputElement, unitInput: inputElement }
    ],
    'input.class': [
        'text' = input,
        'textarea' = t,
        'number' = input,
        'range' = t,
        'toggle' = none,
        'button' = t,
        'select' = t,
        'color' = none,
        'comb' = input - group
    ],

    panel: [panelName, label, onInput = () => { settings || allDesigns || classes || addElement }],
    title: [type, label],
    smallTitle: [type, label],
    section: [type, label, collapsed = true, children = [{}, {}]],
    grid: [type, label, children = [{}, {}]],
    control: [type, label, input = [type, id || '', prop, options || {}, data = {}]],
    button: [type, label, Class, onClick = () => { }],
    div: [type, id, Class, style]
}*/

const build = {
    router: (item) => {
        const result = build[item.type](item);
        if (item.id) result.id = item.id;
        return result;
    },

    fillChildren: (parent, children) => {
        children.forEach(child => perent.appendChild(build.router(child)));
    },

    panel: (panel, { label, children, on }) => {
        panel.innerHTML = '';

        const title = createElement('div', { class: 'ui-title', text: label });
        panel.appendChild(title);
        build.fillChildren(panel, children);

        panel.when('input' || 'change', (e) => on(e));
    },
    title: (item) => { return createElement('div', { class: 'ui-title', text: item.label }); },
    smallTitle: (item) => { return createElement('div', { class: 'ui-title small', text: item.label }) },
    section: (item) => {
        const section = createElement('div', { class: 'ui-section' });
        if (item.collapsed) section.addClass('collapsed');

        const head = createElement('div', {
            class: 'ui-section-head', text: item.label,
        });
        head.onclick = () => section.toggleClass('collapsed');

        const body = createElement('div', { class: 'ui-section-body' });
        build.fillChildren(body, item.children);

        section.append(head, body);
        return section;
    },
    grid: (item) => { },
    inputRow: (item) => {
        let cls = '';
        if (item.input.type === 'color'/* || item.input.type === 'number'*/) cls = ' flex-col';
        const wrapper = createElement('div', { class: 'ui-control-row' + cls });
        const label = createElement('span', { class: 'ui-label', text: item.label });
        const input = build.input.manager(item.input);

        wrapper.append(label, input);
        return wrapper;
    },
    button: (item) => {
        const btn = createElement('button', {
            text: item.label, class: 'ui-btn ' + (item.class || 'ui-btn-secondary')
        });
        btn.onclick = item.onClick;
        return btn;
    },
    div: (item) => {
        return createElement('div', {
            id: item.id || '', class: item.class || '', style: item.style || ''
        });
    },
    input: {
        manager: (item) => {
            if (item.type === 'color') return createSmartColorPicker(item);
            // מציאת סוג הקלט
            const type = item.type;
            let inputType = type;
            if (type === 'comb') inputType = 'text';
            else if (type === 'toggle') inputType = 'checkbox';

            // בניית האינפוט עצמו
            let element = createElement('input', {
                type: inputType,
                id: item.id ?? item.prop,
                'data-property': item.prop,
            });

            // הוספת קלאס תואם אינפוט
            let cls = '';
            if (type === 'text' || type === 'number') cls = 'ui-input';
            else if (type === 'comb') cls = 'ui-input-group';
            else cls = 'ui-' + type;

            element.className = cls;

            // עטיפה ותוספות לפי סוג האינפוט
            switch (type) {
                case 'text':
                case 'textarea':
                case 'number':
                case 'range':
                case 'button':
                    updateElement(element, item.data);
                    break;
                case 'toggle':
                    updateElement(element, item.data);
                    element = build.input.toggle(element);
                    break;
                case 'select':
                    build.input.select(element, item.data.options);
                    break;
                case 'comb':
                    build.input.comb(element, item.data);
            }

            return element;
        },

        toggle: (input) => {
            const switchLabel = createElement('label', { class: 'ui-switch' });
            const slider = createElement('span', { class: 'ui-slider' });
            switchLabel.append(input, slider);
            return switchLabel;
        },
        select: (select, options) => {
            options.forEach(opt => {
                const o = createElement('option', { value: opt.value, text: opt.text });
                select.appendChild(o);
            });
        },
        comb: (wrapper, data) => {
            const valInput = build.input.manager(data.valInput);
            const unitInput = build.input.manager(data.unitInput);

            wrapper.when('input' || 'change', (e) => {
                let val = wrapper.children[0].value + wrapper.children[1].value;
                e.target.value = val
            })
            wrapper.append(valInput, unitInput);
        }
    }
}

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
    let cls = '';
    if (item.inputType === 'color'/* || item.inputType === 'number'*/) cls = ' flex-col';
    const wrapper = createElement('div', { class: 'ui-control-row' + cls });
    const label = createElement('span', { class: 'ui-label', text: item.label });
    const inputEl = renderInputControl(item);

    const input = inputEl.$1('input');
    if (input) input.id = item.id || item.key || '';

    wrapper.append(label, inputEl);
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
                const o = createElement('option', { value: opt.value, text: opt.text });
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
        case 'textarea':
            // Simple input or Input Group
            if (item.unit) {
                const group = createElement('div', { class: 'ui-input-group' });
                const input = createElement('input', {
                    type: item.inputType,
                    'data-property': item.prop
                });

                let addon;
                if (Array.isArray(item.unit)) {
                    addon = createElement('select', { class: 'ui-addon' });
                    item.unit.forEach(u => {
                        const opt = createElement('option', { value: u, text: u });
                        addon.appendChild(opt);
                    });
                } else {
                    addon = createElement('span', { class: 'ui-addon', text: item.unit });
                }

                group.append(input, addon);
                return group;
            } else {
                const input = createElement('input', {
                    type: item.inputType, class: 'ui-input', 'data-property': item.prop
                });
                return input;
            }

        case 'toggle':
        case 'checkbox':
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

function createSmartColorPicker(item) {
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
                <div class="ui-color-preview"></div>
                <span style="font-size:12px; font-family:monospace;"></span>
            </div>
            <input type="color" class="native-picker" style="position:absolute; opacity:0; pointer-events:none;">
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
    buildUiPanel(document.getElementById('panel-classes'), classesSchema);
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
