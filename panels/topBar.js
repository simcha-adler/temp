// --- 1. ניהול טולבאר "הפעלות עריכה" ---
const editBar = document.getElementById('topBar');
const toggleBtn = document.getElementById('btnToggleEditBar');

toggleBtn.addEventListener('click', () => {
    const isClosed = editBar.classList.contains('collapsed');
    if (isClosed) {
        editBar.classList.remove('collapsed');
        toggleBtn.classList.add('active'); // החץ מסתובב
    } else {
        editBar.classList.add('collapsed');
        toggleBtn.classList.remove('active');
    }
});

// --- 2. כפתורי גודל מסך (Viewport) ---
const artboard = $1('.canvas-scroller'); // או העוטף שלו
const vpBtns = $$('.vp-btn');

vpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // הסרת פעיל מכולם
        vpBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // שינוי רוחב הארטבורד
        const width = btn.dataset.width;
        artboard.style.maxWidth = width;

        // אנימציה קטנה של איפוס margin למרכז
        if (width === '100%') {
            artboard.style.width = '100%';
        } else {
            artboard.style.width = width;
        }
    });
});

// --- 3. הפעלות עריכה (הקלדה חופשית / גרירה) ---
document.getElementById('toggleContentEditable').addEventListener('change', (e) => {
    const isEditable = e.target.checked;
    artboard.setAttribute('contenteditable', isEditable);
    if (isEditable) {
        artboard.focus();
        // הערה: כדאי לבטל את ה-Drag כשההקלדה פעילה למניעת התנגשויות
        document.getElementById('toggleDragDrop').checked = false;
        // כאן תקרא לפונקציה שמבטלת גרירה
    }
});

document.getElementById('toggleDragDrop').addEventListener('change', (e) => {
    const isDraggable = e.target.checked;
    // כאן נכנסת הלוגיקה שלך שמפעילה/מבטלת את ה-draggable ב-Services.js
    // למשל: globalDragMode = isDraggable;

    if (isDraggable) {
        // ביטול הקלדה חופשית
        document.getElementById('toggleContentEditable').checked = false;
        artboard.setAttribute('contenteditable', 'false');
        artboard.classList.add('drag-mode-active'); // לקלאס CSS שמראה גבולות
    } else {
        artboard.classList.remove('drag-mode-active');
    }
});

// --- 4. זום (Zoom) ---
const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');

zoomRange.addEventListener('input', (e) => {
    const scale = e.target.value / 100;
    artboard.style.transform = `scale(${scale})`;
    artboard.style.transformOrigin = 'top center'; // הזום מתחיל מלמעלה
    zoomValue.textContent = e.target.value + '%';
});
