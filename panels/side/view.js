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
        ]
    },

    {
        type: 'control-row', label: 'גלישה', inputType: 'select', prop: 'overflow',
        options: [
            { value: 'visible', text: 'רגיל' },
            { value: 'hidden', text: 'חתוך' },
            { value: 'scroll', text: 'גלילה' },
            { value: 'auto', text: 'אוטומטי' }
        ]
    },

    {
        type: 'control-row', label: 'נראות', prop: 'visibility',
        inputType: 'toggle', v: 'visible', x: 'hidden'
    },

    {
        type: 'control-row', label: 'אטימות', inputType: 'range',
        min: 0, max: 1, step: 0.01, value: 1, prop: 'opacity'
    },

    {
        type: 'control-row', label: 'סמן עכבר', inputType: 'select', prop: 'cursor',
        options: [
            { value: 'auto', text: 'אוטומטי' },
            { value: 'pointer', text: 'יד' },
            { value: 'text', text: 'טקסט' },
            { value: 'not-allowed', text: 'חסום' }
        ]
    }
];

buildUiPanel($('panel-display'), viewSchema);
populatePanelValues($('panel-display'), theStyles);

