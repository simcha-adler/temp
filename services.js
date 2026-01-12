// ------------------------------------
// 2. פונקציות עזר
// ------------------------------------

function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb;
    // טיפול בערך ברירת מחדל 'transparent' או 'rgba(0, 0, 0, 0)'
    if (rgb.includes('0, 0, 0, 0') || rgb === 'transparent') {
        // עבור input[type=color], שקוף אינו ערך חוקי. נחזיר שחור או לבן.
        return '#000000';
    }

    let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#000000';

    function hex(c) {
        return ("0" + parseInt(c).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}


function getSelectedElement() {
    const selection = window.getSelection();

    // 1. אם אין בחירה, החזר את העורך
    if (selection.rangeCount === 0) {
        return editor;
    }

    const range = selection.getRangeAt(0);
    let element = range.startContainer;

    // 2. אם התחלנו מצומת טקסט, עלה להורה שלו (האלמנט)
    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentNode;
    }

    let tag = element.tagName;
    while (tag === 'B' || tag === 'I' || tag === 'U') {
        element = element.parentNode;
        tag = element.tagName;
    }

    // 3. בדיקת אבטחה פשוטה: אם האלמנט מחוץ לעורך, החזר את העורך
    if (!editor.contains(element)) {
        return editor;
    }

    // 4. החזר את האלמנט הספציפי שהסמן התחיל בו.
    return element;
}

function getStyle(selector, prop) {
    // אם אין סלקטור כזה בסטייט, אין מה להחזיר
    if (!styleState[selector] || !styleState[selector].rule) {
        return '';
    }
    // קריאה ישירה מהחוק החי
    return styleState[selector].rule.style[prop];
}

function updateStyle(selector, prop, value) {
    // אם אין עדיין חוק כזה, צור אותו ב-state ובתגית הסטייל, וקשר אותם.
    if (!styleState[selector]) {
        createRuleAndRef(selector);
    }

    let rule = styleState[selector]['rule'];
    if (rule) {
        rule.style[prop] = value;
    }
}

/**
 * מקבל סלקטור, יוצר אוביקט CSSRule תואם, ומחזיר אותו.
 */
function createRule(selector) {
    try {
        // '0' מוסיף את החוק להתחלה (חשוב לעדיפות)
        sheet.insertRule(`${selector} {}`, 0);
        return sheet.cssRules[0]; // החזר את החוק החדש שנוצר
    } catch (e) {
        console.error("שגיאה ביצירת חוק CSS:", e, selector);
        return null;
    }
}

/**
 * מוודא שלאלמנט נתון יש ID ייחודי.
 * אם אין לו, יוצר עבורו ID ומחזיר אותו.
 */
function ensureElementId(element) {
    if (element.id) {
        return element.id;
    }
    // יצירת ID ייחודי
    const newId = createSafeId('', element.tagName);
    element.id = newId;
    return newId;
}

function applyEditorCommand(command, value = null) {
    editor.focus();
    try {
        document.execCommand(command, false, value);
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}


// שריד לגירסאות ישנות. לבדוק אם צריך בכלל, ולבנות בהתאם לארכיטקטורה החדשה
function changeBlockTag(newTag) {
    const element = getSelectedElement();
    const blockElement = element.closest('p, h1, h2, h3, h4, h5, h6, pre, div');

    if (blockElement && editor.contains(blockElement) && blockElement.tagName.toLowerCase() !== newTag) {
        const newBlock = document.createElement(newTag);
        newBlock.id = blockElement.id;
        newBlock.style.cssText = blockElement.style.cssText;

        while (blockElement.firstChild) {
            newBlock.appendChild(blockElement.firstChild);
        }

        blockElement.parentNode.replaceChild(newBlock, blockElement);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(newBlock);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        updateSelectedElement(newBlock);
    }
}

function insertNodeAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        editor.appendChild(node);
        return;
    }
    const range = selection.getRangeAt(0);
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * משכפל אלמנט ואת כל ילדיו, ומייצר להם IDs חדשים ותקינים.
 * @param {HTMLElement} original - האלמנט המקורי
 * @param {string} newId - השם (ID) החדש לאלמנט הראשי
 */
function cloneElementWithUniqueIds(original, newId) {
    // 1. שכפול עמוק של ה-DOM
    const clone = original.cloneNode(true);

    // 2. עדכון ה-ID של הראש
    clone.id = newId;

    // 3. עדכון רקורסיבי של IDs לכל הילדים
    // כדי למנוע התנגשות עם הילדים המקוריים
    const descendants = clone.$$('*');
    descendants.forEach(child => {
        if (child.id) {
            // יצירת ID חדש: "copy_" + המקורי + מספר אקראי
            child.id = child.id + '_ב' + newId;
        }
    });

    return clone;
}




/**
 * מפרק ערך CSS למספר וליחידה
 * למשל: "20px" -> { value: 20, unit: "px" }
 */
function parseUnit(cssValue, defaultUnit = 'px') {
    if (!cssValue) return { value: '', unit: defaultUnit };

    // אם זה "auto" או מילה אחרת
    if (isNaN(parseFloat(cssValue))) return { value: '', unit: defaultUnit };

    const value = parseFloat(cssValue);
    const unit = cssValue.replace(value, '').trim() || defaultUnit;
    return { value, unit };
}

/**
 * מייצר HTML עבור אינפוט חכם עם בחירת יחידות
 */
function createInputHTML(prop, label, defaultUnit = 'px') {
    return /*html*/ `
    <div class="control-wrapper">
        <span class="input-label-small">${label}</span>
        <div class="input-group">
            <input type="number" data-prop="${prop}" data-type="value" placeholder="-">
            <select class="unit-select" data-prop="${prop}" data-type="unit">
                <option value="px" ${defaultUnit === 'px' ? 'selected' : ''}>px</option>
                <option value="%" ${defaultUnit === '%' ? 'selected' : ''}>%</option>
                <option value="vh" ${defaultUnit === 'vh' ? 'selected' : ''}>vh</option>
                <option value="vw" ${defaultUnit === 'vw' ? 'selected' : ''}>vw</option>
                <option value="rem" ${defaultUnit === 'rem' ? 'selected' : ''}>rem</option>
                <option value="em" ${defaultUnit === 'em' ? 'selected' : ''}>em</option>
                <option value="" ${defaultUnit === '' ? 'selected' : ''}>-</option>
            </select>
        </div>
    </div>`;
}

// פונקציה לטיפול באקורדיונים
function initAccordions(panelElement) {
    const headers = panelElement.$$('.section-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.toggleClass('collapsed');
        });
    });
}







/*==========חדש לניסיון=======*/

const Color = {
    // המרה והרחבה של פונקציות קיימות
    hexToRgb: (hex) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // ערבוב שני צבעים לפי אחוז (0-100)
    mixColors: (color1, color2, percentage) => {
        const c1 = Color.hexToRgb(color1);
        const c2 = Color.hexToRgb(color2);
        const p = percentage / 100;

        const r = Math.round(c1.r * (1 - p) + c2.r * p);
        const g = Math.round(c1.g * (1 - p) + c2.g * p);
        const b = Math.round(c1.b * (1 - p) + c2.b * p);

        return Color.rgbToHex(r, g, b);
    },

    // יצירת CSS גרדיאנט דינמי לסליידרים (דרישה א')
    generateLiveHwbGradient: (channel, currentH, currentW, currentB) => {
        if (channel === 'h') {
            // Hue תמיד צבעוני, אבל מושפע מ-W ו-B הנוכחיים
            return `linear-gradient(to right, 
                hwb(0 ${currentW}% ${currentB}%), hwb(60 ${currentW}% ${currentB}%), 
                hwb(120 ${currentW}% ${currentB}%), hwb(180 ${currentW}% ${currentB}%), 
                hwb(240 ${currentW}% ${currentB}%), hwb(300 ${currentW}% ${currentB}%), 
                hwb(360 ${currentW}% ${currentB}%))`;
        }
        if (channel === 'w') {
            // מלבן עד הצבע הנוכחי (ללא לבן)
            // שים לב: ככל ש-W עולה הצבע נהיה לבן.
            // הסליידר מציג: צד שמאל (0% לבן = הצבע המלא) -> צד ימין (100% לבן)
            return `linear-gradient(to right, hwb(${currentH} 0% ${currentB}%), hwb(${currentH} 100% ${currentB}%))`;
        }
        if (channel === 'b') {
            // מהצבע הנוכחי (ללא שחור) עד שחור
            return `linear-gradient(to right, hwb(${currentH} ${currentW}% 0%), hwb(${currentH} ${currentW}% 100%))`;
        }
    }
};


/**
 * ממלאת את כל השדות בפאנל באופן אוטומטי לפי הסטייל של האלמנט הנבחר
 * @param {HTMLElement} panel - הפאנל (למשל $('panel-position'))
 * @param {CSSStyleDeclaration} styles - הסטייל המחושב של האלמנט
 */
function populatePanelValues(panel) {
    if (!panel || !theStyles) return;

    // מוצא את כל האינפוטים שיש להם שיוך ל-CSS Property
    const inputs = panel.$$('[data-property]');
    const styles = theStyles;

    inputs.forEach(input => {
        const prop = input.dataset.property;
        let value = styles[prop]; // שולף את הערך, למשל "10px" או "rgb(0,0,0)"

        if (input.type === 'checkbox')
            input.checked = value === input.dataset.v;

        // 1. טיפול בצבעים (המרה מ-rgb ל-hex)
        else if (input.type === 'color' || prop.toLowerCase().includes('color')) {
            // הנחת עבודה: יש לך פונקציה rgbToHex ב-services.js
            input.value = rgbToHex(value);
        }
        // 2. טיפול במספרים (הסרת 'px', 'em' וכו')
        else if (input.type === 'number' || input.type === 'range') {
            input.value = parseFloat(value) || 0;
        }
        // 3. כל השאר (Select, Text)
        else {
            // ניקוי מרכאות אם יש (למשל בפונטים)
            input.value = value ? value.replace(/"/g, '').trim() : '';
        }
    });
}
