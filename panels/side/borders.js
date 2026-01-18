const bordersSchema = [
    { type: 'title', label: 'גבולות וריווח' },

    {
        type: 'section', label: 'מסגרת', collapsed: true,
        children: [
            {
                type: 'control-row', label: 'סגנון קו', inputType: 'select', prop: 'borderStyle',
                options: [
                    { value: 'none', text: 'ללא' },
                    { value: 'solid', text: 'רציף' },
                    { value: 'dashed', text: 'מקווקו' },
                    { value: 'dotted', text: 'מנוקד' },
                    { value: 'double', text: 'כפול' }
                ],
            },
            { type: 'control-row', label: 'צבע', inputType: 'color', prop: 'borderColor' },
            { type: 'control-row', label: 'עובי', inputType: 'number', prop: 'borderWidth', unit: 'px' }
        ]
    },

    {
        type: 'section', label: 'פינות עגולות', collapsed: true,
        children: [
            {
                type: 'grid-4',
                children: [
                    { inputType: 'number', label: '↖', prop: 'borderTopLeftRadius', unit: 'px' },
                    { inputType: 'number', label: '↗', prop: 'borderTopRightRadius', unit: 'px' },
                    { inputType: 'number', label: '↘', prop: 'borderBottomRightRadius', unit: 'px' },
                    { inputType: 'number', label: '↙', prop: 'borderBottomLeftRadius', unit: 'px' }
                ]
            }
        ]
    },

    {
        type: 'section', label: 'ריווח פנימי', collapsed: true,
        children: [
            {
                type: 'grid-4',
                children: [
                    { inputType: 'number', label: 'Top', prop: 'paddingTop', unit: 'px' },
                    { inputType: 'number', label: 'Right', prop: 'paddingRight', unit: 'px' },
                    { inputType: 'number', label: 'Bottom', prop: 'paddingBottom', unit: 'px' },
                    { inputType: 'number', label: 'Left', prop: 'paddingLeft', unit: 'px' }
                ]
            }
        ]
    },
    {
        type: 'section', label: 'ריווח חיצוני', collapsed: true,
        children: [
            {
                type: 'grid-4',
                children: [
                    { inputType: 'number', label: 'Top', prop: 'marginTop', unit: 'px' },
                    { inputType: 'number', label: 'Right', prop: 'marginRight', unit: 'px' },
                    { inputType: 'number', label: 'Bottom', prop: 'marginBottom', unit: 'px' },
                    { inputType: 'number', label: 'Left', prop: 'marginLeft', unit: 'px' }
                ]
            }
        ]
    }
];

buildUiPanel($('panel-borders'), bordersSchema);
populatePanelValues($('panel-borders'));
