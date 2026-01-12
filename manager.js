
/**
 * מעדכן את המשתנים הרלוונטיים על זהות האלמנט הנבחר ותכונותיו
 */
function updateSelectedElement(newElement = null) {
    // כשהאלמנט נבחר מהעורך, לא נשלח ערך ומופעלת פונקציית מיקוד
    if (!newElement)
        newElement = getSelectedElement();
    // אם האלמנט לא השתנה או שהוא מחוץ לעורך, חזור
    if (theElement === newElement ||
        (newElement !== 'editor' && !editor.contains(newElement))) return;
    // מחזיר id. אם אין, יוצר ומחזיר.
    const Id = ensureElementId(newElement);
    // 3. ניקוי הסימון מהאלמנט הקודם (אם היה)
    if (theElement) {
        theElement.removeClass('selected-element');
    }
    // עדכן את כל התוכנית שהאלמנט השתנה
    theElement = newElement;
    theStyles = window.getComputedStyle(theElement);
    if (thePanel && thePanel !== panelTree)
        restartPanel(thePanel);
    $('theElement').value = Id.replaceAll('_', ' ');
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
}

/**
 * טעינת התוכן לפאנל
*/
function updatePanel(panel) {
    if (thePanel === panel) return;

    if (thePanel) setTimeout(thePanel.style.display = 'none', 3000);
    thePanel = panel;
    if (panel) {
        panel.style.display = 'block';
        // לבטל כשאסיר את טולבאר
        if (panel === panelTree)
            renderTree();
        else
            populatePanelValues(thePanel);
    }
}

function createRuleAndRef(selector) {
    if (!styleState[selector]) {
        const rule = createRule(selector);
        styleState[selector] = { 'rule': rule };
        return rule;
    }
    return styleState[selector]['rule'];
}

function restartPage() {
    if (!confirm('הדף הנוכחי יימחק לחלוטין, ולא ניתן יהיה לשחזר אותו! האם אתם בטוחים? לשמירת הדף, ניתן להוריד אותו כ-html לפני האתחול.')) return false;

    // נקה את העורך הנוכחי
    $('דף_הבסיס').innerHTML = '';
    // נקה את ה-CSS ואת ה-State
    $('styles').innerHTML = '';
    sheet = $('styles').sheet; // רענון הרפרנס
    styleState = {}; // איפוס אובייקט המידע
    return true;
}

function createRefRule(rule) {
    const selector = rule.selectorText;
    if (!selector) return null;
    styleState[selector] = { 'rule': rule };
    return rule;
}

function loadPage() {
    loadDocumentListeners();
    updateSelectedElement(editor);
    renderTree();
    initTreeListeners();
}

loadPage();