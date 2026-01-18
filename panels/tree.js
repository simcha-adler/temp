
// משתנים גלובליים לניהול הגרירה והתפריט
let draggable = false;
let actionTree = null; // האלמנט שנגרר
let actionDom = null; // אלמנט ה-dom המקביל לנגרר


/*=======================================
            פונקציות לבניית עץ
=========================================*/


function buildTreeDOM(element) {
    // סינון אלמנטים לא רצויים (כמו בקוד המקורי)
    if (element.nodeType !== 1 || ['SCRIPT', 'STYLE'].includes(element.tagName))
        return null;

    // 1. יצירת הצומת הנוכחי
    const li = createTreeNode(element);

    // 2. אם יש ילדים - בנייה רקורסיבית
    if (element.children.length > 0) {
        const ul = createElement('ul', { class: 'tree-children' });

        Array.from(element.children).forEach(child => {
            const childLi = buildTreeDOM(child);
            if (childLi) childLi.into(ul);
        });

        ul.into(li);
    }

    return li;
}

// הפונקציה הראשית שנקראת מבחוץ
function renderTree() {
    // ניקוי העץ
    tree.innerHTML = '';

    // יצירת העץ והכנסתו
    const ulRoot = createElement('ul', { style: 'padding: 10px; margin: 0;' });
    const rootLi = buildTreeDOM(editor); // מתחילים מהעורך

    if (rootLi) {
        rootLi.into(ulRoot);
        // פתיחת רמת השורש כברירת מחדל
        showChildren(rootLi);
    }

    ulRoot.into(tree);
}


/**
 * יצירת אלמנט ה-LI לעץ (ללא הכנסה לעץ)
 */
function createTreeNode(realElement) {
    const id = ensureElementId(realElement);
    const hasChildren = realElement.children.length > 0;

    // קביעת השם לתצוגה
    let displayName = id.replaceAll("_", " ");
    if (id.startsWith('auto_')) {
        displayName = `<span style="opacity:0.8">${realElement.tagName.toLowerCase()}</span>`;
    }

    // יצירת ה-LI
    const li = createElement('li', {
        class: 'tree-node',
        attrs: {
            'data-editor-id': id,
            'draggable': 'true'
        }
    });

    // יצירת התוכן הפנימי (Toggle + Text)
    const container = createElement('div', { class: 'tree-life' });

    const toggle = createElement('span', {
        class: 'tree-node-toggle',
        in: hasChildren ? '&#9664;' : ''
    });

    const content = createElement('span', {
        class: 'tree-node-content',
        in: displayName
    });

    // === כפתור התפריט ===
    const menuBtn = createElement('span', {
        class: 'tree-node-menu-btn',
        text: '⋮', // תו של שלוש נקודות אנכיות
        attrs: { title: 'פעולות נוספות' }
    });

    // חיבור פנימי
    toggle.into(li);
    content.into(container);
    menuBtn.into(container);
    container.into(li);

    return li;
}


/**
 * הכנסת האלמנט לעץ במקום הנכון
 * מטפל גם ביצירת ה-UL להורה אם צריך
 */
function appendNodeToTree(newNode, parent) {
    if (!parent || !newNode) {
        return;
    }

    // בדיקה אם להורה כבר יש רשימת ילדים (UL)
    let ul = parent.$1('ul.tree-children');
    if (!ul) {
        ul = createElement('ul', { class: 'tree-children' });
        ul.into(parent);
    }

    // הפעולה הסופית - הכנסה (או העברה אם כבר קיים)
    newNode.into(ul);
}


/*====================================================
        פונקציות לניהול מקביל של העץ וה-dom
======================================================*/



function selectTreeNode(node) {
    const src = $(node.dataset.editorId);
    updateSelectedElement(src);

    // עדכון משתנים גלובליים
    actionTree = node;
    actionDom = src;

    // סימון ויזואלי בעץ
    $$('.tree-life').removeClass('selected');
    node.$1('.tree-life').addClass('selected');
}

function insertElementManager(node, parent, isTree) {
    if (!node || !parent || node === parent) return;
    let nodeTree, parentTree, nodeDom, parentDom;
    if (isTree) {
        nodeTree = node;
        parentTree = parent;
        nodeDom = $(nodeTree.dataset.editorId);
        parentDom = $(parentTree.dataset.editorId);
    } else {
        nodeTree = tree.$1(`.tree-node[data-editor-id=${node.id}]`);
        parentTree = tree.$1(`.tree-node[data-editor-id=${parent.id}]`);
        nodeDom = node;
        parentDom = parent;
        if (!nodeTree) nodeTree = buildTreeDOM(nodeDom);
    }

    //  אם אלמנט האב אינו יכול להכיל אלמנטים בתוכו, עבור לאלמנט האב באישור המשתמש
    const voidElements = ['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'];
    if (voidElements.includes(parentDom.tagName))
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parentDom = parentDom.parentNode;
            parentTree = parentTree.parentNode.closest('.tree-node');
        } else return;

    // מניעת לולאות (הכנסת אבא לבן)
    if (nodeDom.contains(parentDom))
        return alert('שגיאה: לא ניתן להכניס אלמנט לתוך עצמו.');

    // הכנסה בפועל ל-dom ולעץ
    nodeDom.into(parentDom);
    appendNodeToTree(nodeTree, parentTree);

    // פתיחת ההורה החדש כדי שנראה את הילד שהתווסף, כולל גם את הוספת אייקון החץ.
    setTimeout(showChildren(parentTree), 50);
    selectTreeNode(nodeTree);
}

function removeElementManager() {
    let del = false;
    if (actionDom.children.length === 0) {
        del = confirm('למחוק את האלמנט?');
    } else {
        del = confirm('למחוק את האלמנט ואת כל האלמנטים שבו?');
    }
    if (del) {
        const parent = actionTree.closest('.tree-node');
        actionTree.remove();
        actionDom.remove();
        actionTree = null;
        actionDom = null;
        updateHasChildren(parent);
        updateSelectedElement(null); // איפוס בחירה
    }
}

function duplicateElementmanager() {
    let newName = prompt('הכנס שם לאלמנט המשוכפל (מומלץ). השאר ריק ליצירה אוטומטית', actionDom.id.replaceAll('_', ' ') + '_copy');
    if (newName || newName === '') {
        newName = createSafeId(newName, actionDom.tagName);
        if (!newName) return; // שם כפול!
        // שימוש בפונקציית השכפול החכמה מ-servises.js
        const newClone = cloneElementWithUniqueIds(actionDom, newName);

        if (newClone) {
            // הוספה ל-DOM אחרי המקורי
            actionDom.after(newClone);
            // יצירת השורות המקבילות בעץ
            const newTreeItem = buildTreeDOM(newClone);
            // הוספה לעץ אחרי המקורי
            if (actionTree)
                actionTree.after(newTreeItem);
            // עדכון בחירה
            updateSelectedElement(newClone);
        }
    }
}



/*===========================
      אתחול מאזיני העץ 
=============================*/



function initTreeListeners() {

    /*----------------------------------------------------------
        לחיצה על שורה בעץ. טיפול מתאים לפי מיקום הלחיצה
    -------------------------------------------------------------*/

    tree.whenClick((e) => {
        // טיפול בפתיחה/סגירה (החץ)
        const toggleBtn = e.upTo('.tree-node-toggle');
        if (toggleBtn) {
            const node = toggleBtn.closest('.tree-node');
            let icon = toggleBtn.innerText;
            if (icon)
                if (icon === '▼') /* תפריט ילדים פתוח */
                    hideChildren(node);
                else
                    showChildren(node);
            return;
        }

        // טיפול בבחירת אלמנט
        const contentSpan = e.upTo('.tree-node-content');
        if (contentSpan) {
            const node = contentSpan.closest('.tree-node');
            selectTreeNode(node);
            return;
        }

        // מאזין לחיצה לפתיחת התפריט
        const menuBtn = e.upTo('.tree-node-menu-btn');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const node = menuBtn.closest('.tree-node');
            // עדכון משתני הפעולה הגלובליים
            selectTreeNode(node);
            // פתיחת התפריט במיקום הכפתור
            if (node.dataset.editorId === 'דף_הבסיס')
                hideItemsNotForEditor();
            else
                showItemsNotForEditor();
            showContextMenu(e.pageX, e.pageY);
        }
    });

    // ===== מאזין לפקודות התפריט הנפתח ===== */
    $('tree-menu').whenClick((e) => {
        const btn = e.upTo('.tree-menu-item');
        if (btn) {
            const action = btn.dataset.action;
            handleMenuAction(action);
        }
    });


    /*---------------------------------------------
          מאזין לאירועי גרירה (Drag & Drop)
    -----------------------------------------------*/

    // ======== שחרור הנעילה ======
    $('toggle-lock-drag').when('change', function () {
        if (this.checked) {
            draggable = true;
            panelTree.addClass('drag-mode');
        } else {
            draggable = false;
            panelTree.removeClass('drag-mode');
        };
    });

    // ======== תחילת גרירה =========
    tree.when('dragstart', (e) => {
        if (draggable) {
            const node = e.upTo('.tree-node');

            if (!node || node === $1('.tree-node[data-editor-id="דף הבסיס"]')) {
                e.preventDefault();
                return;
            }

            actionTree = node;
            e.dataTransfer.effectAllowed = 'move';

            setTimeout(() => node.addClass('dragging'), 0);
        }
    });

    // ======== תהליך הגרירה ==========
    tree.when('dragover', (e) => {
        if (draggable) {
            e.preventDefault(); // חובה כדי לאפשר Drop!

            const targetTree = e.upTo('.tree-node');
            if (targetTree && targetTree !== actionTree) {
                // ניקוי סימונים קודמים
                $$('.tree-node').removeClass('drag-over');
                targetTree.addClass('drag-over');
            }
        }
    });

    // ======== שחרור ==========
    tree.when('drop', (e) => {
        if (draggable) {
            e.preventDefault();
            e.stopPropagation();

            const parent = e.upTo('.tree-node');

            // אם שחררנו במקום לא חוקי או על עצמנו
            if (!parent || (parent === actionTree)) return;

            const preParent = actionTree.parentNode.closest('.tree-node');
            insertElementManager(actionTree, parent, true);
            updateHasChildren(preParent);

            // ניקוי
            cleanDragClasses();
        }
    });

    tree.when('dragend', (e) => {
        cleanDragClasses();
    });
}



/*=============================================
        תצוגת וניהול פעולות התפריט הנפתח
===============================================*/


function showContextMenu(x, y) {
    const menu = $('tree-menu');

    menu.style.display = 'block';
    menu.style.left = (x - 150) + 'px';
    menu.style.top = y + 'px';
}

// פונקציה גלובלית לטיפול בפעולות התפריט
function handleMenuAction(action) {
    if (!action) return;

    switch (action) {
        case 'add-inside':
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'add-after':
            // לסדר, כי עכשיו זה מוסיף לסוף האבא ולא אחרי הנבחר
            updateSelectedElement(actionDom.parentElement);
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'delete':
            removeElementManager();
            break;

        case 'empty':
            if (confirm('למחוק את כל האלמנטים שבתוך אלמנט זה?')) {
                $$(`#${actionDom.id} *`).forEach(ch => ch.remove());
                updateHasChildren(actionTree, true);
            }
            break;

        case 'duplicate':
            duplicateElementmanager();
            break;

        default:
            break;
    }
};


/*======================================
        פונקציות עזר קטנות
========================================*/

function showChildren(parentTree) {
    parentTree.addClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9660;';
}

function hideChildren(parentTree) {
    parentTree.removeClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9664;';
}

function updateHasChildren(node, empty = false) {
    const list = node.$1('ul');
    if (!list) return;
    if (empty || list.children.length === 0) {
        list.remove();
        node.$1('.tree-node-toggle').innerHTML = '';
    }
}

function hideItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.style.display = 'none');
}

function showItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.style.display = 'block');
}

function cleanDragClasses() {
    $$('.tree-node').removeClass('dragging').removeClass('drag-over');
}
