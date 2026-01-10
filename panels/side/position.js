
// ========== HTML ==========
/*const htmlPosition =  /* html *//* `

<h4>מיקום (Position)</h4>
<label class="design-control">
    <span>סוג מיקום</span>
    <select id="position" data-property="position">
        <option value="static">סטטי (ברירת מחדל)</option>
        <option value="relative">יחסי</option>
        <option value="absolute">מוחלט</option>
        <option value="fixed">קבוע</option>
        <option value="sticky">דביק</option>
    </select>
</label>
<div class="design-control-grid-4">
    <label>למעלה<input type="text" id="top" data-property="top" data-offset="v" data-unit="px"></label>
    <label>ימין <input type="text" id="right" data-property="right" data-offset="h" data-unit="px"></label>
    <label>למטה <input type="text" id="bottom" data-property="bottom" data-offset="v" data-unit="px"></label>
    <label>שמאל <input type="text" id="left" data-property="left" data-offset="h" data-unit="px"></label>
</div>
<label class="design-control">
    <span>Z-Index</span>
    <input type="number" id="zIndex" data-property="zIndex" style="width: 60px;">
</label>

<h4 style="margin-top: 15px;">גודל (Size)</h4>
<div class="design-control-grid-4">
    <label>רוחב <input type="text" id="width" data-property="width"></label>
    <label>גובה <input type="text" id="height" data-property="height"></label>
    <label>רוחב מינ' <input type="text" id="minWidth" data-property="minWidth"></label>
    <label>גובה מינ' <input type="text" id="minHeight" data-property="minHeight"></label>
</div>
`;*/


const htmlPosition = /* html */ `
<div class="ui-panel">
    <div class="ui-title">מיקום וגודל</div>

    <div class="ui-control">
        <label class="ui-label">שיטת מיקום</label>
        <select id="position" class="ui-select" data-property="position">
            <option value="static">סטטי (רגיל)</option>
            <option value="relative">יחסי (Relative)</option>
            <option value="absolute">מוחלט (Absolute)</option>
            <option value="fixed">קבוע (Fixed)</option>
            <option value="sticky">דביק (Sticky)</option>
        </select>
    </div>

    <label class="ui-label">היסט (Offset)</label>
    <div class="ui-grid-2">
        <div class="ui-input-group">
            <input type="text" id="top" class="ui-input" data-property="top" placeholder="-">
            <span class="ui-addon">T</span>
        </div>
        <div class="ui-input-group">
            <input type="text" id="bottom" class="ui-input" data-property="bottom" placeholder="-">
            <span class="ui-addon">B</span>
        </div>
        <div class="ui-input-group">
            <input type="text" id="left" class="ui-input" data-property="left" placeholder="-">
            <span class="ui-addon">L</span>
        </div>
        <div class="ui-input-group">
            <input type="text" id="right" class="ui-input" data-property="right" placeholder="-">
            <span class="ui-addon">R</span>
        </div>
    </div>

    <div class="ui-control" style="margin-top:10px;">
        <label class="ui-label">שכבה (Z-Index)</label>
        <input type="number" id="zIndex" class="ui-input" data-property="zIndex">
    </div>

    <div class="ui-title" style="margin-top:15px;">ממדים (Dimensions)</div>
    <div class="ui-grid-2">
        <div class="ui-control">
            <label class="ui-label">רוחב</label>
            <div class="ui-input-group">
                <input type="text" id="width" class="ui-input" data-property="width">
                <span class="ui-addon">W</span>
            </div>
        </div>
        <div class="ui-control">
            <label class="ui-label">גובה</label>
            <div class="ui-input-group">
                <input type="text" id="height" class="ui-input" data-property="height">
                <span class="ui-addon">H</span>
            </div>
        </div>
        <div class="ui-control">
             <label class="ui-label">רוחב מינ'</label>
             <input type="text" id="minWidth" class="ui-input" data-property="minWidth">
        </div>
        <div class="ui-control">
             <label class="ui-label">גובה מינ'</label>
             <input type="text" id="minHeight" class="ui-input" data-property="minHeight">
        </div>
    </div>
</div>
`;



// ========== JavaScript ==========

htmlPosition.into('#panel-position');

function fillCorrectPosition() {
    // מילוי ערכים מ-theStyles
    const panel = $('panel-position');
    if (!panel) return;

    panel.$('position').value = theStyles.position;
    panel.$('top').value = theStyles.top;
    panel.$('right').value = theStyles.right;
    panel.$('bottom').value = theStyles.bottom;
    panel.$('left').value = theStyles.left;
    panel.$('zIndex').value = theStyles.zIndex;

    panel.$('width').value = theStyles.width;
    panel.$('height').value = theStyles.height;
    panel.$('minWidth').value = theStyles.minWidth;
    panel.$('minHeight').value = theStyles.minHeight;
}


