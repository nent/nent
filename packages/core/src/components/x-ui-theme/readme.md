# X-UI-THEME

The `<x-ui-theme>` component checks for the preferred light/dark theme preference of the
user and sets the interface state: theme, accordingly.

## Usage

Add this tag somewhere close to the top of the application to auto-adjust the theme class
based on the user's preferences.

Use it in conjunction with the [\<x-ui-theme-switch\>](/components/x-ui-theme-switch) component,
to gives users control of which theme should be applied.

### Standard

```html
<x-ui>
  <x-ui-theme>    
  </x-ui-theme>
</x-ui>
```

### No Changes

```html
<x-ui>
  <x-ui-theme skip-class>    
  </x-ui-theme>
</x-ui>
```

### Custom Dark Class

```html
<x-ui>
  <x-ui-theme 
    dark-class='midnight'>
  </x-ui-theme>
</x-ui>
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
