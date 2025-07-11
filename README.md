<https://github.com/user-attachments/assets/a0448e9d-4f14-4cd2-90bf-4e3d052ab5cc>

![License](https://badgen.net/npm/license/@moaqzdev/toast)
![npm version](https://badgen.net/npm/v/@moaqzdev/toast)
![Monthly downloads](https://badgen.net/npm/dm/@moaqzdev/toast)
![Gzip + Minify size](https://badgen.net/bundlephobia/minzip/@moaqzdev/toast)  

## ⭐ Features

- **Framework independent**
- **Small bundle size** - less than 3KB min/gzip
- **Themeable** – customizable via CSS variables
- **Zero dependencies**

> [!NOTE]
> Coming soon: support for CSS Shadow Parts for more granular styling control.

## 💡 Motivations

- I needed a toast notification solution that wasn't tied to any framework.
- Learn [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
- Learn more about [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

> ⭐ If you like this project, consider giving it a star!

## 🚀 Usage

**Install the library**

```bash
pnpm add @moaqzdev/toast
```

**Import the library in your JavaScript to register the custom element and then add the `<moaqz-toaster>` element to your HTML:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Make sure to import the library inside your script -->
    <script type="module" src="/main.js"></script> 
  </head>
  <body>
    <moaqz-toaster></moaqz-toaster>
  </body>
</html>
```

**Using the toast API**

Import the `toast` object from the library and use it to create notifications.

```js
import "@moaqzdev/toast"; // Registers the <moaqz-toaster> element
import { toast } from "@moaqzdev/toast/utils";

toast.success({
  title: "Success! Everything went smoothly.",
  description: "Your request was successful!"
});

toast.error({
  title: "Oops! Something went wrong.",
  description: "There was an issue processing your request.",
});

toast.info({
  title: "Here's something you should know.",
  description: "No action required, just an update.",
});
```

## 🔧 Customization

The component is customizable through CSS variables. You can override the default styles in your CSS to match your project’s design.

```css
moaqz-toaster {
  /* Animation */
  --toast-travel-distance: 5vh;

  /* Colors */
  --toast-background: #fcfcfc;
  --toast-border: #00000026;
  --toast-title: #000000df;
  --toast-description: #0000009b;

  /* State Colors */
  --toast-success: #00924ba4;
  --toast-error: #d2000571;
  --toast-warning: #e35f00aa;
  --toast-info: #0084e6a1;
  --toast-confirm: #6600C06C;

  /* Layout for actions */
  --toast-actions-direction: row; /* Layout direction */
  --toast-actions-justify: flex-end; /* Button alignment */
  --toast-actions-gap: 0.25rem;  /* Space between buttons */

  /* Confirm button */
  --toast-actions-confirm-text-color: white;
  --toast-actions-confirm-background-color: #00713FDE;

  /* Cancel button */
  --toast-actions-cancel-text-color: white;
  --toast-actions-cancel-background-color: #C40006D3;
}

@media (prefers-color-scheme: dark) {
  moaqz-toaster {
    /* Colors */
    --toast-background: #111111;
    --toast-border: #ffffff2c;
    --toast-title: #ffffffed;
    --toast-description: #ffffffaf;

    /* State Colors */
    --toast-success: #54ffad73;
    --toast-error: #ff5d61b0;
    --toast-warning: #fe84389d;
    --toast-info: #3094feb9;
    --toast-confirm: #C47EFFA4;

    /* Confirm button */
    --toast-actions-confirm-text-color: white;
    --toast-actions-confirm-background-color: #54FFAD73;

    /* Cancel button */
    --toast-actions-cancel-text-color: white;
    --toast-actions-cancel-background-color: #FF5D61B0;
  }
}
```

**Position**

By default, the position is `bottom-right`. You can customize the position of the toasts by using the position attribute. The available options are:

- top-right
- top-left
- top-center
- bottom-right (default)
- bottom-left
- bottom-center

```html
<moaqz-toaster position="bottom-right"></moaqz-toaster>
```

**Enable Close Button**

By default, the toast component does not include a close button. You can enable it by adding the `dismissable` attribute.

```html
<moaqz-toaster dismissable></moaqz-toaster>
```

**Toast Duration and Persistence**

By default, the toast will be removed after `3s`. You can customize this behavior when emitting the custom event.

```js
toast.confirm({
  title: "New Feature Available",
  description: "A new update is available! Check out the latest features now.",
  confirmText: "Update now",
  cancelText: "Cancel",
  duration: "none",
});
```

The available options for the `duration` property are:

- `none`: Use this when you don't want the toast to be automatically removed.
- `number`: A number representing the duration in milliseconds.

## ❓ FAQ

#### Property 'moaqz-toaster' does not exist on type 'JSX.IntrinsicElements'

This TypeScript error occurs because TypeScript does not recognize custom elements as valid JSX elements by default. To fix this, you need to extend `JSX.IntrinsicElements` to tell TypeScript that `<moaqz-toaster>` is a valid element.

The library provides an interface (`ToasterAttributes`) containing all the attributes for the custom element. You can use this interface to properly type the `<moaqz-toaster>` element.

**For Preact**

```typescript
// global.d.ts
import type { ToasterAttributes } from "@moaqzdev/toast/utils";

// https://preactjs.com/guide/v10/typescript#extending-built-in-jsx-types
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "moaqz-toaster": Partial<ToasterAttributes>;
    }
  }
}
```

**For Solid**

```typescript
// global.d.ts
import type { ToasterAttributes } from "@moaqzdev/toast/utils";

// https://docs.solidjs.com/configuration/typescript#advanced-jsx-attributes-and-directives
declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "moaqz-toaster": Partial<ToasterAttributes>;
    }
  }
}
```

If you are using another framework check their documentation for how to extend `JSX.IntrinsicElements`.

## 📃 Acknowledgments

Thanks to [Manz](https://manz.dev/) for providing an excellent resource to learn [Web components](https://lenguajejs.com/webcomponents/). ♥️
