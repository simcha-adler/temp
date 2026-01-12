// --- ניהול הגדרות משתמש ---

const settings = {

    defaultData: {
        darkMod: false,       // 'light' או 'dark' (ממשק העורך)
        showOutlines: false,  // האם להציג גבולות לכל האלמנטים בדף (לעזרה בעיצוב)
        autoSave: true,       // האם לשמור אוטומטית
        language: 'he',       // שפת ממשק
        uiScale: 100,          // גודל ממשק (זום)
        huePrimary: 240,
        saturationPrimary: 0,

    },

    data: {},

    init: () => {
        // 1. טעינה מ-LocalStorage
        const saved = localStorage.getItem('screenEditor_settings');
        if (saved) {
            try {
                // מיזוג ההגדרות השמורות עם ברירות המחדל (למקרה שהוספנו פיצ'רים חדשים)
                settings.data = { ...settings.defaultData, ...JSON.parse(saved) };
                settings.apply();
                settings.save();
            } catch (e) {
                settings.reloadDefoult();
                console.error('שגיאה בטעינת הגדרות. נטענו הגדרות אוטומטיות', e);
            }
        } else {
            settings.reloadDefoult();
        }
    },

    reloadDefoult: () => {
        settings.data = { ...settings.defaultData };
        settings.apply();
        settings.save();
    },

    save: () => {
        localStorage.setItem('screenEditor_settings', JSON.stringify(settings.data));
    },

    apply: () => {
        const body = document.body;

        // --- יישום מצב כהה ---
        if (settings.data.darkMod === true) {
            body.addClass('editor-dark-mode');
        } else {
            body.removeClass('editor-dark-mode');
        }

        document.documentElement.style.setProperty('--h', settings.data.huePrimary);
        document.documentElement.style.setProperty('--c', settings.data.saturationPrimary);
        // --- יישום גבולות עזר ---
        // מוסיף קלאס לקונטיינר של העורך
        if (settings.data.showOutlines) {
            editor.addClass('show-outlines');
        } else {
            editor.removeClass('show-outlines');
        }

        // --- יישום גודל ממשק ---
        // משנה את הזום של הממשק (לא של האתר הנערך!)
        // נשתמש במשתנה CSS לשליטה בגודל הפונט הבסיסי של הממשק
        body.style.setProperty('--ui-scale', settings.data.uiScale / 100);
    },

    update: (key, value) => {
        settings.data[key] = value;
        settings.apply();
        settings.save();
    },

    fillPanel: () => {
        // מוצא את כל האינפוטים שיש להם שיוך ל-CSS Property
        const inputs = $('panel-settings').$$('[data-property]');

        inputs.forEach(input => {
            const prop = input.dataset.property;
            if (input.type === 'checkbox') {
                input.checked = settings.data[prop];
            } else { input.value = settings.data[prop]; }
        });
    }
}



const settingsSchema = [
    { type: 'title', label: 'ערכת נושא וצבעים' },

    // --- אזור הסליידרים החדש ---
    {
        type: 'section', label: 'גווני האתר', collapsed: false,
        children: [
            { type: 'small-title', label: 'צבע בסיס (רקעים)' },
            { type: 'control-row', label: 'מצב כהה', prop: 'darkMod', inputType: 'toggle' },
            {
                // סליידר לגוון (Hue)
                type: 'control-row', label: 'גוון', inputType: 'range',
                prop: 'huePrimary', min: 0, max: 360
            },
            {
                // סליידר לבהירות/רוויה (Whiteness)
                type: 'control-row', label: 'רוויה', inputType: 'range',
                prop: 'saturationPrimary', min: 0, max: 100
            },

            { type: 'small-title', label: 'צבע הדגשה (Accent)' },
            {
                // סליידר לגוון הדגשה
                type: 'control-row', label: 'גוון (Hue)', inputType: 'range',
                prop: 'accentHue', min: 0, max: 360
            },
            {
                // סליידר לבהירות הדגשה
                type: 'control-row', label: 'בהירות (W)', inputType: 'range',
                prop: 'accentWhite', min: 0, max: 100
            }
        ]
    },

    { type: 'title', label: 'מערכת' },
    {
        type: 'section', label: 'הגדרות נוספות', collapsed: true,
        children: [
            { type: 'control-row', label: 'שמירה אוטומטית', prop: 'autoSave', inputType: 'toggle' },
            { type: 'control-row', label: 'גבולות עזר', prop: 'showOutlines', inputType: 'toggle' }
        ]
    },

    {
        type: 'button', label: 'אפס להגדרות יצרן', class: 'ui-btn-danger',
        onClick: () => {
            if (confirm('האם לאפס את כל ההגדרות?')) {
                settings.reloadDefoult();
            }
        }
    }
];

function loadSettingsPanel() {
    buildUiPanel($('panel-settings'), settingsSchema);
    settings.init();
    settings.fillPanel();

    $('panel-settings').when('input', (e) => {
        const input = e.upTo('input');
        if (input.type === 'checkbox') {
            settings.update(input.dataset.property, input.checked);
        } else { settings.update(input.dataset.property, input.value); }
    });
}

loadSettingsPanel()