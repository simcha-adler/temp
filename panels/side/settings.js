// --- ניהול הגדרות משתמש ---

const settings = {

    defaultData: {
        darkMod: 'false',       // 'light' או 'dark' (ממשק העורך)
        showOutlines: false,  // האם להציג גבולות לכל האלמנטים בדף (לעזרה בעיצוב)
        autoSave: true,       // האם לשמור אוטומטית
        language: 'he',       // שפת ממשק
        uiScale: 100,          // גודל ממשק (זום)
        huePrimary: 120,
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
            } catch (e) {
                settings.data = { ...settings.defaultData };
                console.error('שגיאה בטעינת הגדרות. נטענו הגדרות אוטומטיות', e);
            }
        }

        // 2. החלת ההגדרות בפועל
        settings.apply();
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
    }
}



const settingsSchema = [
    { type: 'title', label: 'ערכת נושא וצבעים' },

    // --- אזור הסליידרים החדש ---
    {
        type: 'section', label: 'גווני האתר', collapsed: false,
        children: [
            { type: 'title', label: 'צבע בסיס (רקעים)' },
            {
                type: 'toggle-row', label: 'מצב כהה',
                onChange: (checked) => settings.update('darkMod', checked)
            },
            {
                // סליידר לגוון (Hue)
                type: 'control-row', label: 'גוון', inputType: 'range',
                // אנו לא שומרים ב-settings.data אובייקט מורכב כרגע כדי לשמור על פשטות, 
                // אלא משנים ישירות את המשתנה. בגרסה מתקדמת תשמור גם את זה.
                prop: 'baseHue',
                min: 0, max: 360,
                onChange: (v) => updateCssVar('--h', v)
            },
            {
                // סליידר לבהירות/רוויה (Whiteness)
                type: 'control-row', label: 'רוויה', inputType: 'range',
                prop: 'baseWhite',
                min: 0, max: 100, unit: '%',
                onChange: (v) => updateCssVar('--c', v)
            },

            { type: 'title', label: 'צבע הדגשה (Accent)' },
            {
                // סליידר לגוון הדגשה
                type: 'control-row', label: 'גוון (Hue)', inputType: 'range',
                prop: 'accentHue',
                min: 0, max: 360,
                onChange: (v) => updateCssVar('--ah', v)
            },
            {
                // סליידר לבהירות הדגשה
                type: 'control-row', label: 'בהירות (W)', inputType: 'range',
                prop: 'accentWhite',
                min: 0, max: 100, unit: '%',
                onChange: (v) => updateCssVar('--aw', v + '%')
            }
        ]
    },

    { type: 'title', label: 'מערכת' },
    {
        type: 'section', label: 'הגדרות נוספות', collapsed: true,
        children: [
            {
                type: 'toggle-row', label: 'שמירה אוטומטית', prop: 'autoSave',
                onChange: (checked) => {
                    settings.data.autoSave = checked;
                    settings.save();
                }
            },
            {
                type: 'toggle-row', label: 'גבולות עזר (Outlines)', prop: 'showOutlines',
                onChange: (checked) => {
                    settings.data.showOutlines = checked;
                    settings.apply();
                    settings.save();
                }
            }
        ]
    },

    {
        type: 'button', label: 'אפס להגדרות יצרן', className: 'ui-btn-danger',
        onClick: () => {
            if (confirm('האם לאפס את כל ההגדרות?')) {
                localStorage.removeItem('screenEditor_settings');
                location.reload();
            }
        }
    }
];

// פונקציית עזר לעדכון משתני CSS בזמן אמת
function updateCssVar(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

function loadSettingsPanel() {
    // Note: Assuming settings.data object exists
    buildUiPanel($('panel-settings'), settingsSchema);
    //attachSettingsListeners();
}


/*
function loadSettingsPanel() {
    // טעינת ערכים התחלתיים אם רוצים (אופציונלי)
    // כרגע הסליידרים יתחילו באמצע או ב-0, 
    // כדי שזה יהיה מושלם צריך לשלוף את הערך הנוכחי מ-getComputedStyle

    // ניסיון לקרוא ערכים נוכחיים מה-CSS כדי שהסליידרים יעמדו במקום הנכון
    const style = getComputedStyle(document.documentElement);
    const context = {
        ...settings.data,
        baseHue: style.getPropertyValue('--h').trim(),
        baseWhite: parseFloat(style.getPropertyValue('--w')),
        accentHue: style.getPropertyValue('--ah').trim(),
        accentWhite: parseFloat(style.getPropertyValue('--aw'))
    };

    buildUiPanel(document.getElementById('panel-settings'), settingsSchema, context);
}

loadSettingsPanel();
*/

// function loadSettingsPanel() {
//     $('panel-settings').innerHTML = htmlSettings;
//     initAccordions($('panel-settings')); // שימוש בפונקציה מהשלבים הקודמים

//     // מילוי הערכים הנוכחיים
//     $('settingDarkMode').checked = settings.data.darkMod;
//     $('settingUiScale').value = settings.data.uiScale;
//     $('settingOutlines').checked = settings.data.showOutlines;
//     $('settingAutoSave').checked = settings.data.autoSave;

//     attachSettingsListeners();
// }

function attachSettingsListeners() {
    // מצב כהה
    $('settingDarkMode').when('change', (e) => {
        settings.data.darkMod = e.target.checked;
        settings.apply(); // החלת השינוי מיידית
        settings.save();  // שמירה לזיכרון
    });

    // גבולות עזר
    $('settingOutlines').when('change', (e) => {
        settings.data.showOutlines = e.target.checked;
        settings.apply();
        settings.save();
    });

    // סקייל ממשק
    $('settingUiScale').when('input', (e) => {
        settings.data.uiScale = e.target.value;
        settings.apply();
        settings.save();
    });

    // שמירה אוטומטית
    $('settingAutoSave').when('change', (e) => {
        settings.data.autoSave = e.target.checked;
        settings.save();
    });

    // איפוס
    $('btnResetSettings').whenClick(() => {
        if (confirm('האם לאפס את כל הגדרות המערכת?')) {
            localStorage.removeItem('screenEditor_settings');
            location.reload(); // רענון הדף
        }
    });
}

loadSettingsPanel()