const layoutSchema = [
    { type: 'title', label: 'פריסת פלקס' },

    {
        type: 'control-row', label: 'כיוון', inputType: 'select', prop: 'flexDirection',
        options: [
            { value: 'row', text: 'שורה ←' },
            { value: 'column', text: 'טור ↓' },
            { value: 'row-reverse', text: 'שורה הפוכה →' },
            { value: 'column-reverse', text: 'טור הפוך ↑' }
        ],
    },

    {
        type: 'control-row', label: 'יישור ציר ראשי', inputType: 'select', prop: 'justifyContent',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'flex-end', text: 'סוף' },
            { value: 'space-between', text: 'רווח מקסימלי' },
            { value: 'space-around', text: 'רווח מסביב' },
            { value: 'space-evenly', text: 'רווח שווה' }
        ],
    },

    {
        type: 'control-row', label: 'יישור ציר משני', inputType: 'select', prop: 'alignItems',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'stretch', text: 'מתיחה' }
        ],
    },

    {
        type: 'control-row', label: 'ירידת שורות', prop: 'flexWrap',
        inputType: 'toggle', v: 'wrap', x: 'nowrap'
    }
];

buildUiPanel($('panel-layout'), layoutSchema);
populatePanelValues($('panel-layout'), theStyles);