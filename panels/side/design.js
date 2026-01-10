/*const htmlDesign = /* html */ /*`

<h4>צבע וטיפוגרפיה</h4>

<label for="fontFamilyInput" class="design-control">
    <span>גופן</span>
    <select id="fontFamilyInput" data-property="fontFamily" style="width: 120px;">
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Verdana, sans-serif">Verdana</option>
    </select>
</label>

<label for="fontSizeInput" class="design-control">
    <span>גודל גופן (px)</span>
    <input type="number" id="fontSizeInput" data-property="fontSize" data-unit="px" min="8" max="120" value="16"
        style="width: 50px; text-align: left;">
</label>

<label for="colorInput" class="design-control input-color">
    <!--span>צבע טקסט</span>
    <input type="color" id="colorInput" data-property="color" value="#000000"-->
</label>

<label for="bgColorInput" class="design-control">
    <span>צבע רקע (סימון)</span>
    <input type="color" id="bgColorInput" data-property="backgroundColor" value="#ffff00">
</label>

<button id="gradientBtn">גרדיאנט</button>
<div id="gradientDiv" style="display: none;">
    <label for="bgColorInput" class="design-control">            
        <span>זווית</span>
        <input type="number" id="deg" data-property="gradient" value="0"  style="width: 50px; text-align: center;">
        <span>צבע 1</span>
        <input type="color" id="gradient1" data-property="gradient" value="#ffffff">
        <span>צבע 2</span>
        <input type="color" id="gradient2" data-property="gradient" value="#ffffff">
    </label>
</div>
`;*/


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
