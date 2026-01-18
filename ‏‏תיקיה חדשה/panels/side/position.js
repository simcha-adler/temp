const positionSchema = [
    { type: 'title', label: 'מיקום (Position)' },
    {
        type: 'control-row', inputType: 'select', label: 'שיטה', prop: 'position',
        options: [
            { value: 'static', text: 'אוטומטי' },
            { value: 'relative', text: 'הזזת התצוגה' },
            { value: 'absolute', text: 'מיקום קבוע ביחס להורה' },
            { value: 'fixed', text: 'קבוע' },
            { value: 'sticky', text: 'דביק' }
        ],
    },
    {
        type: 'control-row', inputType: 'number', label: 'שכבה', prop: 'zIndex',
    },

    // גריד של 4 כיוונים
    { type: 'label', label: 'היסט' }, // לייבל עצמאי אם רוצים
    {
        type: 'grid-2',
        children: [
            { inputType: 'number', label: 'למעלה', prop: 'top', unit: ['px', '%', 'vh'] },
            { inputType: 'number', label: 'למטה', prop: 'bottom', unit: ['px', '%', 'vh'] },
        ]
    },

    { type: 'title', label: 'גודל (Size)' },
    // רוחב וגובה
    {
        type: 'grid-2',
        children: [
            { inputType: 'number', label: 'רוחב', prop: 'width', unit: ['px', '%', 'vw', 'auto'] },
            { inputType: 'number', label: 'גובה', prop: 'height', unit: ['px', '%', 'vh', 'auto'] }
        ]
    },

    // מינימום רוחב/גובה
    {
        type: 'section', label: 'הגבלות גודל (Min/Max)', collapsed: true,
        children: [
            {
                type: 'grid-2',
                children: [
                    { inputType: 'number', label: 'רוחב מינימלי', prop: 'minWidth', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'minWidth', v) },
                    { inputType: 'number', label: 'גובה מינימלי', prop: 'minHeight', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'minHeight', v) },
                    { inputType: 'number', label: 'רוחב מקסימלי', prop: 'maxWidth', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'maxWidth', v) },
                    { inputType: 'number', label: 'גובה מקסימלי', prop: 'maxHeight', unit: 'px', onChange: (v) => updateStyle(getActiveSelectorKey(), 'maxHeight', v) }
                ]
            }
        ]
    }
];


buildUiPanel($('panel-position'), positionSchema);
populatePanelValues($('panel-position'));

