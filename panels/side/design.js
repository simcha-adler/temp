
const htmlDesign = /* html */ `
<div class="ui-panel">
    <div class="ui-title">טיפוגרפיה וצבע</div>

    <div class="ui-grid-2">
        <div class="ui-control">
            <label class="ui-label">גופן</label>
            <select id="fontFamilyInput" class="ui-select" data-property="fontFamily">
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="inherit">מורש (Inherit)</option>
            </select>
        </div>
        <div class="ui-control">
            <label class="ui-label">גודל (px)</label>
            <input type="number" id="fontSizeInput" class="ui-input" data-property="fontSize" min="8" max="200">
        </div>
    </div>

    <div class="ui-control input-color">
        </div>

    <div class="ui-control">
        <label class="ui-label">צבע רקע</label>
        <div class="ui-input-group">
            <input type="color" id="bgColorInput" data-property="backgroundColor" style="height:30px; width:100%; border:none; padding:0;">
        </div>
    </div>

    <button id="gradientBtn" class="ui-btn ui-btn-full" style="margin-top:5px;">הגדרות גרדיאנט</button>
    
    <div id="gradientDiv" style="display:none; margin-top:10px; padding:10px; background:var(--ui-5); border-radius:var(--ui-radius);">
        <div class="ui-grid-2">
             <div class="ui-control">
                <label class="ui-label">זווית</label>
                <input type="number" id="deg" class="ui-input" value="90">
             </div>
             <div class="ui-control">
                <label class="ui-label">צבע התחלה</label>
                <input type="color" id="gradient1" style="width:100%; height:30px; border:none;">
             </div>
        </div>
        <div class="ui-control">
            <label class="ui-label">צבע סיום</label>
            <input type="color" id="gradient2" style="width:100%; height:30px; border:none;">
        </div>
    </div>
</div>
`;



htmlDesign.into('#panel-design');


function fillCorrectDesign() {
    // --- 1. עדכון פאנל צבע וטיפוגרפיה ---
    const mainFont = theStyles.fontFamily.split(',')[0].replace(/"/g, '').trim();
    let found = Array.from(fontFamilyInput.options).find(opt => opt.value.includes(mainFont));

    /*    $('colorInput').value = rgbToHex(theStyles.color);*/
    $('bgColorInput').value = rgbToHex(theStyles.backgroundColor);
    $('fontSizeInput').value = parseInt(theStyles.fontSize, 10);
    $('fontFamilyInput').value = found ? found.value : 'Arial, sans-serif';

}

function toggleGradient() {
    const hide = $('gradientDiv').style.display === 'none';
    $('gradientDiv').style.display = hide ? 'block' : 'none';
}

function loadDesignListeners() {
    $('gradientBtn').whenClick(toggleGradient);
}

function buildDesignPanel() {
    const inputs = $$('.input-color')
    // הזרקת פיקר חכם לצבע טקסט
    const label = createElement('label', { class: 'design-control', text: 'צבע טקסט' });
    // שליחת הסלקטור הנוכחי
    const selector = getActiveSelectorKey(); // (פונקציית עזר שקיימת ב-borders.js וצריך להנגיש אותה)
    const currentColor = getStyle(selector, 'color');

    const picker = createColorPicker(selector, 'color', currentColor);

    inputs.forEach(container => {
        Array.from(container.children).forEach(ch => ch.remove());
        container.appendChild(label);
        container.appendChild(picker);
    });
}

loadDesignListeners();
buildDesignPanel();


const designSchema = [
    { type: 'title', label: 'עיצוב טקסט וצבע' },

    {
        type: 'section', label: 'טיפוגרפיה', collapsed: false,
        children: [
            {
                type: 'control-row', label: 'גופן', inputType: 'select', prop: 'fontFamily',
                options: [
                    { value: 'Arial', text: 'Arial' },
                    { value: 'Verdana', text: 'Verdana' },
                    { value: 'Times New Roman', text: 'Times New Roman' },
                    { value: 'Courier New', text: 'Courier New' },
                    { value: 'System-ui', text: 'System-ui' }
                ],
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

buildUiPanel($('panel-design'), designSchema);

