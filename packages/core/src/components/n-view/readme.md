# N-VIEW

The View component is a child component for the `<n-view>` component for adding a page route. It is a container element that displays its inner HTML for a given route or sub-route. This provides a declarative mechanism for in-page content/component routing by URL.

## Extensions

* [Elements](/components/n-view/elements)
* [Data](/components/n-view/data)


> The view element uses the display property in CSS to hide and show based on the route. It is important that any class added does not override this

### Child Views & Routing

Views can hold any HTML, including View components. This implicitly creates child routes below the path configured for this View. This View will enforce the routing rule, by inserting its path in the child-views path property (This should be done in a way that accounts for the parent path being included in the child path attribute)

```html
<n-views>
  <n-view path='/'>
  ...
  </n-view>
  <n-view path='/about'>
    <n-view path='/location'>
    ...
    </n-view>
  </n-view>
</n-views>
```

### View Prompts

The contained HTML is parsed before rendering and special handling is given if any child elements are [\<n-view-prompt\>](/components/n-view-prompt) elements. Before rendering its HTML, this component iterates the collection and evaluates their conditions (_when_ attribute) looking for the first [\<n-view-prompt\>](/components/n-view-prompt) that should be displayed, using the order they are declared. If and when a non-visited [\<n-view-prompt\>](/components/n-view-prompt) is found, its route is activated and subsequently marked as visited.

[\<n-view-prompt\>](/components/n-view-prompt) components each have their own **visit** strategies, but each of them need only return to their parent URL when completed. The parent performs the above evaluation until each child [\<n-view-prompt\>](/components/n-view-prompt) element has been visited or is excluded by its rule (_when_ attribute).

At that point, the inner HTML content is finally revealed. Using this convention, you can declaratively create a workflow of pages that must be visited to reach a destination.


<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-views>
  <n-view path='/'
    page-title='Home'
    transition='fade-in'>
    ...
  </n-view>
  <n-view path='/about'
    page-title='About Us'
    scroll-top-offset='20'>
    ...
  </n-view>
</n-views>
```



## Properties

| Property             | Attribute           | Description                                                                                                                                                                                                                     | Type                                                 | Default     |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `contentSrc`         | `content-src`       | Remote URL for this Route's content.                                                                                                                                                                                            | `string`, `undefined`                                | `undefined` |
| `debug`              | `debug`             | Turn on debug statements for load, update and render events.                                                                                                                                                                    | `boolean`                                            | `false`     |
| `exact`              | `exact`             | The path for this route should only be matched when it is exact.                                                                                                                                                                | `boolean`                                            | `false`     |
| `mode`               | `mode`              | Cross Origin Mode if the content is pulled from a remote location                                                                                                                                                               | `"cors"`, `"navigate"`, `"no-cors"`, `"same-origin"` | `'cors'`    |
| `pageTitle`          | `page-title`        | The title for this view. This is prefixed before the app title configured in n-views                                                                                                                                            | `string`                                             | `''`        |
| `path` _(required)_  | `path`              | The path for this route, including the parent's routes, excluding the router's root.                                                                                                                                            | `string`                                             | `undefined` |
| `resolveTokens`      | `resolve-tokens`    | Before rendering remote HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance.  IMPORTANT: ONLY WORKS ON REMOTE HTML | `boolean`                                            | `false`     |
| `route` _(required)_ | --                  | Route information                                                                                                                                                                                                               | `Route`                                              | `undefined` |
| `scrollTopOffset`    | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                            | `number`                                             | `0`         |
| `src`                | `src`               | Remote URL for this route's HTML. HTML from this URL will be not be assigned to any slot.  You can add slot='content' to any containers within this HTML if you have a mix of HTML for this exact-route and its children.       | `string`, `undefined`                                | `undefined` |
| `transition`         | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                            | `string`, `undefined`                                | `undefined` |


## Methods

### `getChildren() => Promise<{ activators: HTMLNActionActivatorElement[]; views: HTMLNViewElement[]; dos: HTMLNViewPromptElement[]; }>`

Return all child elements used for processing. This function is
primarily meant for testing.

#### Returns

Type: `Promise<{ activators: HTMLNActionActivatorElement[]; views: HTMLNViewElement[]; dos: HTMLNViewPromptElement[]; }>`




## Slots

| Slot        | Description                                                                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"content"` | The content route is rendered only when the route           matches EXACTLY. Note: This HTML is removed when the           route changes.                         |
| `"default"` | The default slot is rendered when this route is           activated, visible by default to all routes matching           the route URL (typically, child routes). |


----------------------------------------------

NENT 2021 - all rights reserved
