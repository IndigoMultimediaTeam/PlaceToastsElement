# place-toasts

Toast notifications implementation inspired by `@see`.
Attributes are not dynamic (evaluated when connected)!

## Attributes

| Attribute      | Type          | Default | Description                                      |
|----------------|---------------|---------|--------------------------------------------------|
| `color-scheme` | `COLORSCHEME` | "auto"  | Prefered mode dark/ligh or detect from system (default). Make sence to use with `ui`≠'custom'. |

## Properties

| Property      | Attribute | Type                                     | Default   | Description                                      |
|---------------|-----------|------------------------------------------|-----------|--------------------------------------------------|
| `colorScheme` |           | `"dark" \| "light" \| "auto"`            |           |                                                  |
| `ui`          | `ui`      | `"default"\|"default-wrapper"\|"custom"` | "default" | To apply all default styles, or only for `<place-toasts>` itself, or no and use custom (via CSS). |

## Methods

| Method | Type                                         | Description                                      |
|--------|----------------------------------------------|--------------------------------------------------|
| `add_` | `(text: string): Promise<HTMLOutputElement>` | Add new toast notification. Returns promise when notification disappear (argument is notif. element). |
