const htmlSidebar = /*html*/ `

<div class="activity-btn" data-panel="panel-tree" title="מבנה העמוד">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <rect x="56" y="24" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="168" y="96" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="168" y="184" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="80" y1="120" x2="168" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <path d="M80,72V192a16,16,0,0,0,16,16h72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path
            d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 0h6v6h-6v-6zM10 6h4v1h-4V6zm0 12h4v1h-4v-1zM6 10v4h1v-4H6zm12 0v4h1v-4h-1z"
            fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-add-element" title="הוספת אלמנטים">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-design" title="עיצוב">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <path d="M16,216H92a52,52,0,1,0-52-52C40,200,16,216,16,216Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <path d="M112.41,116.16C131.6,90.29,179.46,32,224,32c0,44.54-58.29,92.4-84.16,111.59" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <path d="M133,90.64a84.39,84.39,0,0,1,32.41,32.41" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path
            d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-borders" title="גבולות">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <polyline points="176 40 216 40 216 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <polyline points="80 216 40 216 40 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <polyline points="216 176 216 216 176 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <polyline points="40 80 40 40 80 40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="80" y="80" width="96" height="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" fill="currentColor" />
        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z" fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-layout" title="פריסה">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <rect x="48" y="48" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="144" y="48" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="48" y="144" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <rect x="144" y="144" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M4 12h16M12 6v12" stroke="currentColor" stroke-width="2" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-position" title="מיקום">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <circle cx="128" cy="104" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <path d="M208,104c0,72-80,128-80,128S48,176,48,104a80,80,0,0,1,160,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-display" title="תצוגה">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <path d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            fill="currentColor" />
    </svg-->
</div>

<div class="activity-btn" data-panel="panel-classes" title="ניהול קלאסים">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <path d="M164,129.66l35.78,21.53a5.46,5.46,0,0,0,8.19-5.86l-9.73-40.19,31.84-26.88A5.38,5.38,0,0,0,227,68.78l-41.79-3.31-16.1-38.14a5.51,5.51,0,0,0-10.12,0l-16.1,38.14-41.79,3.31a5.38,5.38,0,0,0-3.13,9.48l31.84,26.88L120,145.33a5.46,5.46,0,0,0,8.19,5.86Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="82.45" y1="117.55" x2="24" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="93.26" y1="178.74" x2="40" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <line x1="166.28" y1="177.72" x2="112" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="none"/>
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/>
    </svg-->
</div>
<div class="activity-btn" data-panel="panel-theme" title="צבעי נושא גלובליים">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <path d="M128,192a24,24,0,0,1,24-24h46.21a24,24,0,0,0,23.4-18.65A96.48,96.48,0,0,0,224,127.17c-.45-52.82-44.16-95.7-97-95.17a96,96,0,0,0-95,96c0,41.81,26.73,73.44,64,86.61A24,24,0,0,0,128,192Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
        <circle cx="128" cy="76" r="8"/>
        <circle cx="84" cy="100" r="8"/>
        <circle cx="84" cy="156" r="8"/>
        <circle cx="172" cy="100" r="8"/>
    </svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
    </svg-->
</div>
<br>
<br>
<br>
<br>
<div class="activity-btn" data-panel="panel-settings" title="ניהול קלאסים">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none"/>
        <circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    <path d="M41.43,178.09A99.14,99.14,0,0,1,31.36,153.8l16.78-21a81.59,81.59,0,0,1,0-9.64l-16.77-21a99.43,99.43,0,0,1,10.05-24.3l26.71-3a81,81,0,0,1,6.81-6.81l3-26.7A99.14,99.14,0,0,1,102.2,31.36l21,16.78a81.59,81.59,0,0,1,9.64,0l21-16.77a99.43,99.43,0,0,1,24.3,10.05l3,26.71a81,81,0,0,1,6.81,6.81l26.7,3a99.14,99.14,0,0,1,10.07,24.29l-16.78,21a81.59,81.59,0,0,1,0,9.64l16.77,21a99.43,99.43,0,0,1-10,24.3l-26.71,3a81,81,0,0,1-6.81,6.81l-3,26.7a99.14,99.14,0,0,1-24.29,10.07l-21-16.78a81.59,81.59,0,0,1-9.64,0l-21,16.77a99.43,99.43,0,0,1-24.3-10l-3-26.71a81,81,0,0,1-6.81-6.81Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
</svg>
    <!--svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="none"/>
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/>
    </svg-->
</div>
`;

htmlSidebar.into(sidebar);


sidebar.whenClick((e) => {
    const btn = e.upTo('.activity-btn');
    if (btn) {
        // לוקח את ה-ID של הפאנל מה-HTML (data-panel)
        toggleActivityPanel(btn);
    }
});

/**
 * פונקציה לצביעת הכפתור הפעיל בלבד
*/
function updateActivityBarState(activeBtn) {
    if (thePanel)
        $1(`.activity-btn[data-panel=${thePanel.id}]`).removeClass('active');
    if (activeBtn)
        activeBtn.addClass('active');
}

/**
 * הפונקציה הראשית לניהול לחיצה על אייקון בסרגל
*/
function toggleActivityPanel(btn) {
    const panelId = btn.dataset.panel;
    const panel = $(panelId);

    // 1. אם לחצו על הפאנל שכבר פתוח -> סגור את אזור הפאנלים
    if (thePanel === panel) {
        panelLeft.removeClass('open');
        updateActivityBarState(null); // כיבוי האייקון הפעיל
        updatePanel(null);
    } else {
        // 2. אחרת -> פתח את הפאנל החדש
        if (panelId !== 'panel-tree') panelLeft.addClass('open');
        else $('panel-right').addClass('open');
        updateActivityBarState(btn);
        updatePanel(panel);
    }
}

function restartPanel(panel) {
    const panelName = panel.id;

    switch (panelName) {
        case 'panel-borders':
            fillCorrectBorders();
            break;

        case 'panel-design':
            fillCorrectDesign();
            break;

        case 'panel-view':
            fillCorrectView();
            break;

        case 'panel-position':
            fillCorrectPosition();
            break;

        case 'panel-layout':
            fillCorrectLayout();
            break;

        case 'panel-classes':
            refreshClassesView();
            break;

        case 'panel-theme':
            //fillCorrectTheme();
            break;

        default:
            break;
    }
}
