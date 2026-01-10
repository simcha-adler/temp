function loadDocumentListeners() {

    /**
 * מאזין האירועים הראשי לזיהוי האלמנט הנבחר.
 */
    document.when('selectionchange', () => {
        if (document.activeElement === editor || editor.contains(window.getSelection().anchorNode)) {
            updateSelectedElement();
        }
    });

    $('selectedElement').when('input', (e) => { updateSelectedElement($(`${e.target.value}`)) });

    // מאזין 'input' פועל לרוב הפקדים (טקסט, מספר, צבע)
    panelLeft.when('input' || 'change', (e) => {
        if (!theElement) return;

        //  קבע את הסלקטור
        const state = $('dropdown-states').value; // ':hover', ':focus' או ""
        const selector = '#' + theElement.id + state; // '#כותרת-לדוגמא:hover'

        let prop = e.target.dataset.property;
        const unit = e.target.dataset.unit || ''; // למשל 'px'
        let value = e.target.value;

        if (prop === 'gradient') {
            prop = 'background'
            value = `linear-gradient(${$('deg').value}deg, ${$('gradient1').value}, ${$('gradient2').value})`;
        }

        if (prop && selector)
            updateStyle(selector, prop, value + unit);
    });

    document.whenClick(() => {
        $('tree-menu').style.display = 'none';
        closeOpenedNav();
    });
}
