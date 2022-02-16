/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true */
/* global customElements, customElementsInitiator */
/* *CE/WC* v0, see: https://github.com/IndigoMultimediaTeam/customElementsInitiator
 *
 * See JSDoc for PlaceToastsElement
 */
(typeof customElementsInitiator==="function" ? customElementsInitiator : function customElementsInitiator(component, when= "now"){
    if(when==="DOMContentLoaded"&&document.readyState==="loading")
        return document.addEventListener(when, component.bind(this));
    component.call(this);
})(function component(){
    /** @typedef {"dark"|"light"|"auto"} COLORSCHEME */
    const styles= {
        ani_duration: "3s",

        style_el: null,
        motion_ok: false,
        initConsts(){
            this.motion_ok= window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
        },
        styleEl(){
            if(this.style_el) return this.style_el;
            this.style_el= document.createElement("style");
            document.head.appendChild(this.style_el);
            return this.style_el;
        },
        cssGroup(){
            const style_el= this.styleEl();
            const css= document.createTextNode([
                PlaceToastsElement.tagName+":not([ui=custom]){",
                    "position: fixed;",
                    "z-index: 1;",
                    "inset-block-end: 0;",
                    "inset-inline: 0;",
                    "padding-block-end: 5vh;",

                    "display: grid;",
                    "justify-items: center;",
                    "justify-content: center;",
                    "gap: 1vh;",

                    "pointer-events: none;", // optimizations
                "}"
            ].join(""));
            style_el.appendChild(css);
        },
        /** @param {COLORSCHEME} color_scheme */
        cssToast(color_scheme){
            const is_dark=
                color_scheme==="auto" ? window.matchMedia('(prefers-color-scheme: dark)').matches : (
                color_scheme==="dark" ? true : false);

            const colors= is_dark ? "color: white; --_bg-lightness: 20%;" : "color: black; --_bg-lightness: 90%;";
            const distance= this.motion_ok ? "5vh" : "0";

            const anims= [ "fade-in", "slide-in", "fade-out" ].map(n=> PlaceToastsElement.tagName+"-"+n);

            const style_el= this.styleEl();
            const t= PlaceToastsElement.tagName;
            const css= document.createTextNode([
                `${t}:not([ui]) output, ${t}[ui=default] output{`,
                    "font-family: system-ui, sans-serif;",
                    colors,
                    "background: hsl(0 0% var(--_bg-lightness) / 90%);",
                
                    "max-inline-size: min(25ch, 90vw);",
                    "padding-block: .5ch;",
                    "padding-inline: 1ch;",
                    "border-radius: 3px;",
                    "font-size: 1rem;",
                
                    "will-change: transform;",
                
                    `animation: ${anims[0]} .3s ease, ${anims[1]} .3s ease, ${anims[2]} .3s ease ${this.ani_duration};`,
                "}",
                `@keyframes ${anims[0]} { from { opacity: 0 } }`,
                `@keyframes ${anims[2]} { to { opacity: 0 } }`,
                `@keyframes ${anims[1]} { from { transform: translateY(${distance}) } }`
            ].join(""));
            style_el.appendChild(css);
        }
    };
    /**
     * Toast notifications implementation inspired by `@see`.
     * Attributes are not dynamic (evaluated when connected)!
     * 
     * @version 1.0.1
     * @see https://web.dev/building-a-toast-component/
     * @see https://github.com/argyleink/gui-challenges/blob/main/toast/
     * @attr {"default"|"default-wrapper"|"custom"} [ui="default"] To apply all default styles, or only for `<place-toasts>` itself, or no and use custom (via CSS).
     * @attr {COLORSCHEME} [color-scheme="auto"] Prefered mode dark/ligh or detect from system (default). Make sence to use with `ui`≠'custom'.
     * */
    class PlaceToastsElement extends HTMLElement {
        static get tagName(){ return "place-toasts"; }
        /**
         * Add new toast notification. Returns promise when notification disappear (argument is notif. element).
         * @param {string} text
         * @returns {Promise<HTMLOutputElement>}
         * */
        add_(text){
            const node= createToast(text);
            if(!this.children.length || !styles.motion_ok)
                return removeAfterAnimation_(this, this.appendChild(node));

            // https://aerotwist.com/blog/flip-your-animations/
            const { offsetHeight }= this;
            this.appendChild(node);
            const animation= this.animate(
                ([ this.offsetHeight-offsetHeight, 0 ])
                    .map(n=> ({ transform: `translateY(${n}px)` })),
                { duration: 150, easing: "ease-out" });
            animation.startTime= document.timeline.currentTime;
            return removeAfterAnimation_(this, node);
        }
        connectedCallback(){
            const { ui, colorScheme }= this;
            styles.initConsts();
            if(ui==="custom") return 0;
            styles.cssGroup();
            if(ui==="default-wrapper") return 1;
            styles.cssToast(colorScheme);
            return 2;
        }
        set ui(val){ return this.setAttribute("ui", val); }
        get ui(){ return this.hasAttribute("ui") ? this.getAttribute("ui") : "default"; }
        /** @param {COLORSCHEME} colorScheme */
        set colorScheme(val){ return this.setAttribute("color-scheme", val); }
        /** @returns {COLORSCHEME} */
        get colorScheme(){ return this.hasAttribute("color-scheme") ? this.getAttribute("color-scheme") : "auto"; }
    }
    customElements.define(PlaceToastsElement.tagName, PlaceToastsElement);
    
    /**
     * @param {PlaceToastsElement} el_parent
     * @param {HTMLOutputElement} el_toast
     * @returns Promise
     */
    function removeAfterAnimation_(el_parent, el_toast){
        const animations= el_toast.getAnimations();
        return Promise.allSettled(animations.length ? animations.map(a=> a.finished) : fallbackRemoveAnimation())
            .then(()=> el_parent.removeChild(el_toast));
    }
    function createToast(textContent){
        const node= document.createElement('output');
        node.textContent= textContent;
        node.setAttribute("role", "status");
        node.setAttribute('aria-live', 'polite');
        return node;
    }
    function fallbackRemoveAnimation(){ return [ new Promise(r=> setTimeout(r, 500)) ]; }
}, "now");
