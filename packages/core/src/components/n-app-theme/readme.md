# N-APP-THEME

The `<n-app-theme>` element checks for the preferred light/dark theme preference of the
user and sets the interface state: theme, accordingly.


<!-- Auto Generated Below -->


## Usage

### Basic

Add this tag somewhere close to the top of the application to auto-adjust the theme class
based on the user's preferences.

Use it in conjunction with the [\<n-app-theme-switch\>](/components/n-app-theme-switch) element,
to give users control of which theme should be applied.

```html
<n-app>
  <n-app-theme>    
  </n-app-theme>
</n-app>
```


### Custom-class

To set a custom class name:

```html
<n-app>
  <n-app-theme 
    dark-class='midnight'>
  </n-app-theme>
</n-app>
```



## Properties

| Property        | Attribute        | Description                                                                                        | Type      | Default  |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------- | --------- | -------- |
| `darkClass`     | `dark-class`     | Change the class name that is added to the target element when the theme is determined to be dark. | `string`  | `'dark'` |
| `display`       | `display`        | Display the user's system preference.                                                              | `boolean` | `false`  |
| `switch`        | `switch`         | This component displays the current theme, unless in switch-mode, it will show the opposite.       | `boolean` | `false`  |
| `targetElement` | `target-element` | Change the element that is decorated with the dark-mode class                                      | `string`  | `'body'` |


----------------------------------------------

NENT 2021 - all rights reserved
