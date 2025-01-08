## Why I created this component?

I created this toast component primarily for my own projects. I needed a simple, reusable toast notification system that could be easily integrated into any of my personal projects.

I tried other libraries, but most of them were built for specific frameworks, which limits their flexibility and usage across different projects. This component, on the other hand, is built using **Web Components** and **Custom events**, making it framework-independent and easy to integrate into any project, regardless of the tech stack.

> [!WARNING]
> This component is not intended to replace existing, feature-rich toast libraries. It's a lightweight, minimalistic solution designed for developers who need a simple way to implement toast notifications.

## Features

- Framework-Agnostic
- Lightweight
- Easy to integrate
- Customizable through CSS variables

## Roadmap

- [X] Add on enter/exit animations
- [X] Export variables to customize the component
- [ ] Improve accessibility
- [X] Provide documentation

## Usage

Install the package and import it in your JavaScript to register the custom element. Then, add the `<moaqz-toaster>` element to your HTML:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="module" src="/main.js"></script>
  </head>
  <body>
    <!-- Toaster container -->
    <moaqz-toaster></moaqz-toaster>
  </body>
</html>
```

**Using the toast API**

Once the container is set up, import the `toast` from the package and use it to create notifications.

```js
import { toast } from "@moaqzdev/toast"; // <-- Registers the custom element.

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

**Customizing the Component**

The component is customizable through CSS variables. You can override the default styles in your CSS to match your project’s design.

```css
moaqz-toaster {
  /* Animation */
  --toast-travel-distance: 5vh;
  --toast-animation-duration: 3s;

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
  }
}
```

**Position**

By default, the default position is `bottom-right`. You can customize the position of the toasts by using the position attribute. The available options are:

- top-right
- top-left
- top-center
- bottom-right (default)
- bottom-left
- bottom-center

```html
<moaqz-toaster position="bottom-right"></moaqz-toaster>
```

## Acknowledgments

Thanks to [Manz](https://manz.dev/) for providing an excellent resource to learn [Web components](https://lenguajejs.com/webcomponents/). ♥️
