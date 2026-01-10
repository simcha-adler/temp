// ========== פונקציות עזר ועיצוב ==========

// const borderPanelStyles = /*html*/`
// <style>
//     /* Accordion Style */
//     .panel-section { border: 1px solid #eee; margin-bottom: 8px; border-radius: 6px; overflow: hidden; background: var(--ui-base); }
//     .section-header { 
//         cursor: pointer; 
//         font-weight: 600; 
//         font-size: 13px; 
//         color: #444; 
//         padding: 10px 12px; 
//         display: flex; 
//         justify-content: space-between; 
//         align-items: center; 
//         background: #fdfdfd;
//         transition: background 0.2s;
//     }
//     .section-header:hover { background: #f5f5f5; }
//     .section-header::after { content: '▼'; font-size: 10px; color: #888; transition: transform 0.2s; }
//     .panel-section.collapsed .section-content { display: none; }
//     .panel-section.collapsed .section-header::after { transform: rotate(-90deg); }
//     .section-content { padding: 12px; background: var(--ui-base); border-top: 1px solid #eee; }

//     /*  Input Style */
//     .input-group label{ 
//         width: 100%;
//         font-size: 18px
//     }
//     .input-group { 
//         display: flex; 
//         align-items: center; 
//         margin-bottom: 8px;
//         border: none;
//     }
//     .input-label-small { 
//         font-size: 12px; 
//         color: #666; 
//         margin-left: 3px;
//         flex-grow: 1;
//     }
//     .combined-input {
//         display: flex;
//         border: 1px solid #ddd;
//         border-radius: 4px;
//         overflow: hidden;
//         background: var(--ui-base);
//         transition: border-color 0.2s;
//     }
//     .combined-input:focus-within { border-color: #0078d4; }

//     .combined-input input {
//         border: none;
//         flex-grow: 1;
//         padding: 6px 8px;
//         font-size: 13px;
//         min-width: 50px;
//         outline: none;
//     }

//     .combined-input select {
//         border: none;
//         border-left: 1px solid #eee;
//         background: #f9f9f9;
//         font-size: 11px;
//         color: #666;
//         padding: 0;
//         outline: none;
//         cursor: pointer;
//         height: auto;
//         width: auto;
//     }
//     .combined-input select:hover { background: #eee; }

//     /* Mode Switcher */
//     .mode-switcher { 
//         display: flex; 
//         background: #f0f0f0; 
//         border-radius: 6px; 
//         padding: 3px; 
//         gap: 3px; 
//         margin-bottom: 12px; 
//     }
//     .mode-btn { 
//         flex: 1; 
//         border: none; 
//         background: transparent; 
//         cursor: pointer; 
//         font-size: 14px; 
//         padding: 6px; 
//         border-radius: 4px; 
//         color: #666;
//         transition: all 0.2s;
//     }
//     .mode-btn:hover { background: rgba(0,0,0,0.05); }
//     .mode-btn.active { 
//         background: var(--ui-base); 
//         color: #0078d4; 
//         box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
//     }

//     /* Grid Layouts */
//     .inputs-grid { display: grid; gap: 8px; }
//     .grid-1 { grid-template-columns: 1fr; }
//     .grid-2 { grid-template-columns: 1fr 1fr; }
//     .grid-4 { grid-template-columns: 1fr 1fr; }
// </style>
// `;

// function createInputHTML(prop, label, defaultUnit = 'px') {
//     return /*html*/`
//     <div class="input-group">
//         <label>${label}
//         <!--span class="input-label-small">${label}</span-->
//         <div class="combined-input">
//             <input type="number" data-prop="${prop}" placeholder="-">
//             <select class="unit-select">
//                 <option value="px" ${defaultUnit === 'px' ? 'selected' : ''}>px</option>
//                 <option value="%" ${defaultUnit === '%' ? 'selected' : ''}>%</option>
//                 <option value="em" ${defaultUnit === 'em' ? 'selected' : ''}>em</option>
//                 <option value="rem" ${defaultUnit === 'rem' ? 'selected' : ''}>rem</option>
//                 <option value="vh" ${defaultUnit === 'vh' ? 'selected' : ''}>vh</option>
//                 <option value="" ${defaultUnit === '' ? 'selected' : ''}>-</option>
//             </select>
//         </div>
// </label>
//     </div>`;
// }

// החלף את פונקציית העזר הקיימת בזו:
function createInputHTML(prop, label, defaultUnit = 'px') {
    return /*html*/`
    <div class="ui-control">
        <label class="ui-label">${label}</label>
        <div class="ui-input-group">
            <input type="number" class="ui-input" data-prop="${prop}" placeholder="-">
            <select class="ui-addon unit-select">
                <option value="px" ${defaultUnit === 'px' ? 'selected' : ''}>px</option>
                <option value="%" ${defaultUnit === '%' ? 'selected' : ''}>%</option>
                <option value="em" ${defaultUnit === 'em' ? 'selected' : ''}>em</option>
                <option value="rem" ${defaultUnit === 'rem' ? 'selected' : ''}>rem</option>
                <option value="" ${defaultUnit === '' ? 'selected' : ''}>-</option>
            </select>
        </div>
    </div>`;
}

const htmlBorders = /* html */ `
    <div class="ui-panel">
        <div class="ui-title">גבולות וריווח</div>

        <div class="ui-section">
            <div class="ui-section-head">מסגרת (Border)</div>
            <div class="ui-section-body">
                <div class="ui-grid-2">
                    <div class="ui-control">
                        <label class="ui-label">סגנון</label>
                        <select id="borderStyleInput" class="ui-select">
                            <option value="none">ללא</option>
                            <option value="solid">קו רציף (Solid)</option>
                            <option value="dashed">מקווקו (Dashed)</option>
                            <option value="dotted">מנוקד (Dotted)</option>
                        </select>
                    </div>
                    <div class="ui-control">
                        <label class="ui-label">צבע</label>
                        <input type="color" id="borderColorInput" style="width:100%; height:30px; border:none; padding:0;">
                    </div>
                </div>
                ${createInputHTML('borderWidth', 'עובי הקו', 'px')}
            </div>
        </div>

        <div class="ui-section"> 
            <div class="ui-section-head">פינות עגולות (Radius)</div>
            <div class="ui-section-body" id="radiusContainer"></div>
        </div>

        <div class="ui-section">
            <div class="ui-section-head">ריווח פנימי (Padding)</div>
            <div class="ui-section-body" id="paddingContainer"></div>
        </div>

        <div class="ui-section">
            <div class="ui-section-head">ריווח חיצוני (Margin)</div>
            <div class="ui-section-body" id="marginContainer"></div>
        </div>
    </div>
`;



function parseUnit(value) {
    if (!value) return { value: '', unit: 'px' };
    const match = value.match(/^([\d\.\-]+)([a-z%]*)$/);
    if (match) return { value: match[1], unit: match[2] || 'px' };
    return { value: value, unit: 'px' };
}

function getActiveSelectorKey() {
    if (!theElement) return '';
    const state = $('dropdown-states').value || '';
    return '#' + theElement.id + state;
}

// ========== HTML מבנה ==========

/*const htmlBorders = /* html *//* `
    ${borderPanelStyles}

    <div class="panel-section">
        <div class="section-header">קו גבול (Border)</div>
        <div class="section-content">
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                 <div style="flex:2;">
                    <span class="input-label-small" style="display:block; margin-bottom:4px;">סגנון</span>
                    <div class="combined-input">
                        <select id="borderStyleInput" style="width:100%; border:none; padding:6px; background:transparent;">
                            <option value="none">ללא</option>
                            <option value="solid">קו רציף (Solid)</option>
                            <option value="dashed">מקווקו (Dashed)</option>
                            <option value="dotted">מנוקד (Dotted)</option>
                            <option value="double">כפול (Double)</option>
                        </select>
                    </div>
                 </div>
                 <div style="flex:1;">
                    <span class="input-label-small" style="display:block; margin-bottom:4px;">צבע</span>
                    <input type="color" id="borderColorInput" style="width:100%; height:32px; padding:0; border:1px solid #ddd; border-radius:4px; cursor:pointer;">
                 </div>
            </div>
            ${createInputHTML('borderWidth', 'עובי', 'px')}
        </div>
    </div>

    <div class="panel-section collapsed"> 
        <div class="section-header">פינות עגולות (Radius)</div>
        <div class="section-content" id="radiusContainer"></div>
    </div>

    <div class="panel-section">
        <div class="section-header">ריווח פנימי (Padding)</div>
        <div class="section-content" id="paddingContainer"></div>
    </div>

    <div class="panel-section">
        <div class="section-header">ריווח חיצוני (Margin)</div>
        <div class="section-content" id="marginContainer"></div>
    </div>
`;*/

function generateSpacingControl(type) {
    // אייקונים נקיים יותר (UTF8)
    const iconAll = '⬛';
    const iconAxis = '❚❚';
    const iconSides = '⚃';

    return /*html*/ `
    <div class="spacing-control" data-spacing-type="${type}">
        <div class="mode-switcher">
            <button class="mode-btn active" data-mode="all" title="אחיד">${iconAll}</button>
            <button class="mode-btn" data-mode="axis" title="צירים">${iconAxis}</button>
            <button class="mode-btn" data-mode="sides" title="נפרד">${iconSides}</button>
        </div>
        
        <div class="inputs-grid grid-1" data-mode-content="all">
            ${createInputHTML(type, 'הכל')}
        </div>
        
        <div class="inputs-grid grid-2 ui-grid-2" data-mode-content="axis" style="display:none;">
            ${createInputHTML(type + (type === 'borderRadius' ? 'TopLeft' : 'Top'), type === 'borderRadius' ? 'אלכסון 1' : 'אנכי')} 
            ${createInputHTML(type + (type === 'borderRadius' ? 'TopRight' : 'Right'), type === 'borderRadius' ? 'אלכסון 2' : 'אופקי')}
        </div>

        <div class="inputs-grid grid-4 ui-grid-4 design-control-grid-4" data-mode-content="sides" style="display:none;">
            ${createInputHTML(type + (type === 'borderRadius' ? 'TopLeft' : 'Top'), '↖')}
            ${createInputHTML(type + (type === 'borderRadius' ? 'TopRight' : 'Right'), '↗')}
            ${createInputHTML(type + (type === 'borderRadius' ? 'BottomRight' : 'Bottom'), '↘')}
            ${createInputHTML(type + (type === 'borderRadius' ? 'BottomLeft' : 'Left'), '↙')}
        </div>
    </div>
    `;
}

// ========== Logic (Listeners) ==========

htmlBorders.into('#panel-borders');

$('radiusContainer').innerHTML = generateSpacingControl('borderRadius');
$('paddingContainer').innerHTML = generateSpacingControl('padding');
$('marginContainer').innerHTML = generateSpacingControl('margin');

function attachBorderListeners() {
    // אקורדיון - קליק על ההדר
    $$('#panel-borders .section-header').whenClick((e) => {
        const section = e.target.closest('.panel-section');
        section.toggleClass('collapsed');
    });

    // מתגי מצבים (Tabs)
    $$('#panel-borders .mode-btn').forEach(btn => {
        btn.whenClick((e) => {
            const parent = btn.closest('.spacing-control');
            parent.$$('.mode-btn').forEach(b => b.removeClass('active'));
            btn.addClass('active');
            const mode = btn.dataset.mode;
            parent.$$('[data-mode-content]').forEach(div => div.style.display = 'none');
            const targetDiv = parent.$1(`[data-mode-content="${mode}"]`);
            if (targetDiv) targetDiv.style.display = 'grid'; // Grid כי הגדרנו Grid ב-CSS
        });
    });

    // Smart Inputs (Number + Unit)
    $$('#panel-borders .combined-input input, #panel-borders .combined-input select').forEach(el => {
        el.when('input', handleInput);
        el.when('change', handleInput);
    });

    // פקדים רגילים
    $('borderStyleInput').when('change', (e) => updateStyle(getActiveSelectorKey(), 'borderStyle', e.target.value));
    $('borderColorInput').when('input', (e) => updateStyle(getActiveSelectorKey(), 'borderColor', e.target.value));
}

function handleInput(e) {
    if (!theElement) return;
    const wrapper = e.target.closest('.combined-input'); // תוקן הסלקטור
    const valInput = wrapper.$1('input');
    const unitSelect = wrapper.$1('select');

    const value = valInput.value;
    const unit = unitSelect.value;
    const prop = valInput.dataset.prop;

    if (value === '') return; // אולי צריך אפשרות לאיפוס? כרגע נשאיר כך

    const finalValue = value + unit;
    const selector = getActiveSelectorKey();

    // לוגיקת הצירים (Axis logic)
    const activeModeBtn = e.target.closest('.spacing-control')?.$1('.mode-btn.active');
    const mode = activeModeBtn ? activeModeBtn.dataset.mode : null;
    const spacingType = e.target.closest('.spacing-control')?.dataset.spacingType;

    if (mode === 'axis' && (spacingType === 'margin' || spacingType === 'padding')) {
        if (prop.includes('Top')) {
            updateStyle(selector, spacingType + 'Top', finalValue);
            updateStyle(selector, spacingType + 'Bottom', finalValue);
        } else {
            updateStyle(selector, spacingType + 'Right', finalValue);
            updateStyle(selector, spacingType + 'Left', finalValue);
        }
    } else {
        updateStyle(selector, prop, finalValue);
    }
}

function fillCorrectBorders() {
    if (!theElement) return;
    const selector = getActiveSelectorKey();

    const borderStyle = theStyles.borderStyle;
    if (borderStyle) $('borderStyleInput').value = borderStyle;

    const borderColor = theStyles.borderColor;
    if (borderColor) $('borderColorInput').value = rgbToHex(borderColor);

    // מילוי Smart Inputs
    $$('#panel-borders input[data-prop]').forEach(input => {
        const prop = input.dataset.prop;
        let val = theStyles[prop];

        if (val) {
            const parsed = parseUnit(val);
            input.value = parsed.value;
            const unitSel = input.parentElement.$1('.unit-select');
            if (unitSel) unitSel.value = parsed.unit;
        } else {
            input.value = '';
        }
    });
}

//attachBorderListeners();