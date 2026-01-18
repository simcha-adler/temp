// ===מציאת אוביקט לפי סלקטור===

function $(selector) {
    return document.getElementById(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function $1(selector) {
    return document.querySelector(selector);
}

Element.prototype.$ = function (selector) {
    return this.querySelector('#' + selector);
}

Element.prototype.$$ = function (selector) {
    return this.querySelectorAll(selector);
}

Element.prototype.$1 = function (selector) {
    return this.querySelector(selector);
}

Event.prototype.upTo = function (selector) {
    return this.target.closest(selector);
}


// ===הוספת מאזין===

function whenClick(callback) {
    this.addEventListener('click', callback);
    return this;
}
Element.prototype.whenClick = whenClick;
Document.prototype.whenClick = whenClick;

NodeList.prototype.whenClick = function (callback) {
    this.forEach(el => el.whenClick(callback));
    return this;
}

function when(eventName, callback) {
    this.addEventListener(eventName, callback);
    return this;
}
Element.prototype.when = when;
Document.prototype.when = when;
Window.prototype.when = when;

NodeList.prototype.when = function (eventName, callback) {
    this.forEach(element => element.addEventListener(eventName, callback));
    return this;
}

// ===הכנסת אלמנט לתוך אלמנט אחר===

function into(parent) {
    // אפשרות שה-parent הוא סלקטור (כמו "#app")
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
    }

    // מוסיף לסוף התוכן הקיים
    if (this instanceof String) {
        parent.insertAdjacentHTML('beforeend', this);

        // אם this הוא אלמנט בודד
    } else if (this instanceof Node) {
        parent.append(this);

        // אם this הוא רשימת אלמנטים (מ-getAllElements) או מערך
    } else if (this instanceof NodeList || this instanceof HTMLCollection || Array.isArray(this)) {
        this.forEach(node => parent.append(node));
    }

    return this; // החזרת 'this' מאפשרת שרשור
}
Element.prototype.into = into;
String.prototype.into = into;
NodeList.prototype.into = into;

// ===ניהול קלאסים===

Element.prototype.addClass = function (className) {
    this.classList.add(className);
    return this;
}

NodeList.prototype.addClass = function (className) {
    this.forEach(el => el.addClass(className));
    return this;
}

Element.prototype.removeClass = function (className) {
    this.classList.remove(className);
    return this;
}

NodeList.prototype.removeClass = function (className) {
    this.forEach(el => el.removeClass(className));
    return this;
}

Element.prototype.toggleClass = function (className) {
    this.classList.toggle(className);
    return this;
}

NodeList.prototype.toggleClass = function (className) {
    this.forEach(el => el.classList.toggle(className));
    return this;
}

// ===גישה לאטריביוטים===
Element.prototype.attr = function (name, value) {
    // אם סופק ערך, קבע אותו (setter)
    if (value !== undefined) {
        this.setAttribute(name, value);
        return this; // אפשר שרשור
    }
    // אם לא סופק ערך, החזר את הערך הקיים (getter)
    return this.getAttribute(name);
}

NodeList.prototype.attr = function (name, value) {
    this.forEach(el => el.attr(name, value));
    return this;
}

// ===יצירת אלמנט עם תכונות מובנות===
//  מקבלת אוביקט שמכיל זוגות של מאפיינים (כשדות) וערכים. מצורפת דוגמת שימוש

function createElement(tagName, options = {}) {
    const el = document.createElement(tagName);
    updateElement(el, options);
    return el;
}

// דוגמת שימוש:
// const myButton = createElement('button', {
//     class: 'btn primary',
//     text: 'לחץ כאן',
//     id: 'submit-btn',
//     style: 'width: 100%; color: blue;'
// });

function updateElement(element, options = {}) {
    for (const [key, value] of Object.entries(options)) {
        if (value !== '')
            switch (key) {
                case 'class':
                    const classes = options.class.split(" ");
                    classes.forEach(cls => element.addClass(cls));
                    break;

                case 'text':
                    element.textContent = element.textContent + options.text;
                    break;

                case 'in':
                    element.innerHTML = element.innerHTML + options.in;
                    break;

                case 'style':
                    element.style.cssText = element.style.cssText + options.style;
                    break;

                default:
                    element.setAttribute(key, value);
                    break;
            }
    }
}