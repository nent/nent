# X-UI-THEME

The `<n-app-theme>` component checks for the preferred light/dark theme preference of the
user and sets the interface state: theme, accordingly.

## Usage

Add this tag somewhere close to the top of the application to auto-adjust the theme class
based on the user's preferences.

Use it in conjunction with the [\<n-app-theme-switch\>](/components/n-app-theme-switch) component,
to gives users control of which theme should be applied.

### Standard

```html
<n-app>
  <n-app-theme>    
  </n-app-theme>
</n-app>
```

### No Changes

```html
<n-app>
  <n-app-theme skip-class>    
  </n-app-theme>
</n-app>
```

### Custom Dark Class

```html
<n-app>
  <n-app-theme 
    dark-class='midnight'>
  </n-app-theme>
</n-app>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property    | Attribute    | Description                                                                                  | Type      | Default  |
| ----------- | ------------ | -------------------------------------------------------------------------------------------- | --------- | -------- |
| `darkClass` | `dark-class` | Change the class name that is added to the body tag when the theme is determined to be dark. | `string`  | `'dark'` |
| `skipClass` | `skip-class` | Skip adding the class to the body tag, just update the ui state.                             | `boolean` | `false`  |


----------------------------------------------

nent 2021 - all rights reserved
