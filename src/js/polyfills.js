import lazySizes from 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/respimg/ls.respimg';


if (!('object-fit' in document.createElement('a').style)) {
    require('lazysizes/plugins/object-fit/ls.object-fit');
}

export default function () {

    // Полифилл .contains для IE 11

    if (!SVGElement.prototype.contains) {
        SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
    }

    // Полифилл для метода element.matches();

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
    }

    // Полифилл метода element.closest();

    (function (ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
        ELEMENT.closest =
            ELEMENT.closest ||
            function closest(selector) {
                if (!this) return null;
                if (this.matches(selector)) return this;
                if (!this.parentElement) {
                    return null;
                } else return this.parentElement.closest(selector);
            };
    })(Element.prototype);

    // Полифилл для кастомных событий

    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: null};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    window.CustomEvent = CustomEvent;

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
    (function (arr) {
        arr.forEach(function (item) {
            if (item.hasOwnProperty('append')) {
                return;
            }
            Object.defineProperty(item, 'append', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function append() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    this.appendChild(docFrag);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);


    /**
     * ChildNode.append() polyfill
     * https://gomakethings.com/adding-an-element-to-the-end-of-a-set-of-elements-with-vanilla-javascript/
     * @author Chris Ferdinandi
     * @license MIT
     */
    (function (elem) {

        // Check if element is a node
        // https://github.com/Financial-Times/polyfill-service
        var isNode = function (object) {

            // DOM, Level2
            if (typeof Node === 'function') {
                return object instanceof Node;
            }

            // Older browsers, check if it looks like a Node instance)
            return object &&
                typeof object === "object" &&
                object.nodeName &&
                object.nodeType >= 1 &&
                object.nodeType <= 12;

        };

        // Add append() method to prototype
        for (var i = 0; i < elem.length; i++) {
            if (!window[elem[i]] || 'append' in window[elem[i]].prototype) continue;
            window[elem[i]].prototype.append = function () {
                var argArr = Array.prototype.slice.call(arguments);
                var docFrag = document.createDocumentFragment();

                for (var n = 0; n < argArr.length; n++) {
                    docFrag.appendChild(isNode(argArr[n]) ? argArr[n] : document.createTextNode(String(argArr[n])));
                }

                this.appendChild(docFrag);
            };
        }

    })(['Element', 'CharacterData', 'DocumentType']);
}
