# PlaceToastsElement
Web component implementing an adaptive and accessible toast nottifications.

Use [`PlaceToastsElement.js`](./PlaceToastsElement.js) for example in your `<head>` element.
Anywhere in your HTML use
```html
<place-toasts></place-toasts>
```
…or with attrs
```html
<place-toasts ui="auto" color-scheme="dark"></place-toasts>
```
…in JS use for example
```js
const toasts= document.getElementsByTagName("place-toasts")[0];
toasts.add_("Notification");
```

Demonstration there [PlaceToastsElement](https://refined-github-html-preview.kidonng.workers.dev/jaandrle/PlaceToastsElement/raw/main/example.html).

There is also documentation generated via [Web Component Analyzer](https://github.com/runem/web-component-analyzer) in [wca folder](./wca).

<small>This component supports [customElementsInitiator](https://github.com/IndigoMultimediaTeam/customElementsInitiator).</small>
