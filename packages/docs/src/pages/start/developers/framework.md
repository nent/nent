# Framework integrations 👨‍💻

## Angular

Using `x-ui` elements within an Angular project:

### Including the Custom Elements Schema

Including the `CUSTOM_ELEMENTS_SCHEMA` in the module allows the use of Web Components in the HTML files. Here is an example of adding it to `AppModule`:

```ts
import { BrowserModule } from '@angular/platform-browser'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

The `CUSTOM_ELEMENTS_SCHEMA` needs to be included in any module that uses **x-ui**.

#### Calling defineCustomElements

**x-ui** element includes a function used to load itself in the application window object. That function is called `defineCustomElements()` and needs to be executed once during the bootstrapping of your application. One convenient place to add it is in the `main.ts` file as follows:

```tsx
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { defineCustomElements as defineXui } from '@nent/core/loader'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err))
defineXui(window)
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/angular.md)

### React

- Specific Wrapper

When using a wrapper component, It's not necessary to access the reference directly to attach events, etc. More details [here](./react/README.md).

```tsx
const App = () => {
  return (
    <x-ui>
      <div>
        <p>HELLO WORLD</p>
      </div>
    </x-ui>
  )
}
export default App
```

- Web Component

Other option is using the web element directly:

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { defineCustomElements as defineXui } from '@nent/core/loader'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

defineXui(window)
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/react.md)

### Vue

In order to use the `x-ui` Web Component inside of a Vue application, it should be modified to define the custom elements and to inform the Vue compiler which elements to ignore during compilation. This can all be done within the `main.js` file as follows:

```tsx
import Vue from 'vue'
import { defineCustomElements as defineXui } from '@nent/core/loader'

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.ignoredElements = [/x-\w*/]

// Bind the custom element to the window object
defineXui(window)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

[_from stencil documentation_](https://github.com/ionic-team/stencil-site/blob/master/src/docs/framework-integration/vue.md)

### Stencil

To animate [Functional Components](https://stenciljs.com/docs/functional-components) you can use the `createx-uiComponent` utility, e.g:

- `utils.tsx`

```tsx
import {
  createx-uiComponent
} from '@nent/core';

const SendMessageButton = (props) => (
  <ion-fab-button {{...props}}>
    <ion-icon name='send' />
  </ion-fab-button>
);
export const x-uiSendMessageButton = createx-uiComponent(SendMessageButton);
export const keyFramesSendMessage: Keyframe[] = [
  {
    opacity: '0',
    transform: 'rotate(0deg)'
  },
  {
    opacity: '1',
    transform: 'rotate(360deg)'
  }
];
export const optionsSendMessage: KeyframeAnimationOptions = {
  duration: 500,
  easing: 'ease-in-out'
};
```

- `my-component.tsx`

```tsx
import { Component, Host, h } from '@stencil/core';
import { x-uiSendMessageButton, keyFramesSendMessage, optionsSendMessage } from './utils'

@Component({
  tag: 'my-component',
  shadow: false
})
export class MyComponent {
  render() {
    return (
      <x-app

      />
    )
  }
}
```
