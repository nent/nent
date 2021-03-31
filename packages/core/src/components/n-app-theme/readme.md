# N-APP-THEME

The `<n-app-theme>` component checks for the preferred light/dark theme preference of the
user and sets the interface state: theme, accordingly.


<!-- Auto Generated Below -->


## Usage

### Basic

Add this tag somewhere close to the top of the application to auto-adjust the theme class
based on the user's preferences.

Use it in conjunction with the [\<n-app-theme-switch\>](/components/n-app-theme-switch) component,
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

| Property    | Attribute    | Description                                                                                  | Type      | Default  |
| ----------- | ------------ | -------------------------------------------------------------------------------------------- | --------- | -------- |
| `darkClass` | `dark-class` | Change the class name that is added to the body tag when the theme is determined to be dark. | `string`  | `'dark'` |
| `skipClass` | `skip-class` | Skip adding the class to the body tag, just update the ui state.                             | `boolean` | `false`  |


----------------------------------------------

NENT 2021 - all rights reserved
