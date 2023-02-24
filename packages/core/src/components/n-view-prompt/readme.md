# N-VIEW-PROMPT

The [`n-view-prompt`](/components/n-view-prompt) element represents a specialized child-route that can force a prompt before the parent route is displayed.

> ℹ️ Note: [`n-view-prompt`](/components/n-view-prompt) can be used to capture data, agree to terms or anything else the parent route may need.

They are used to create presentations, wizards, input workflows, or step-by-step instructions.


### How it works

When the parent [`n-view`](/components/n-view)'s route is activated, before rendering, it:

1. Lists all direct-child [`n-view-prompt`](/components/n-view-prompt) items, one at a time in sequence.
2. Finds the first unvisited route respecting the **'visit'** requirement or [**'when'** predicate](/expression), if present.

   - **If found**: It pushes the page state to its URL, thus activated the child route.
   - **Otherwise**: The [`n-view`](/components/n-view) is satisfied and can now render its own contents.

## Samples

The following are some examples to demonstrate how you can combine the settings to create robust workflows.

### Present Once

This route will be activated once for each new visit to the page. (Visit 'once' is the default behavior, so it can be omitted.)

```html
<n-view-prompt path='/accept-terms' 
  page-title='Consent' 
  visit='once'>
  ...
</n-view-prompt>
```

> ℹ️ Note: By default, the visit strategy is 'once'. In this case, the visit is stored in the local storage. Any subsequent visits to this page with the same browser won't see it again.

### Present Each Visit

This route will be activated once for each new session visit to the page.

```html
<n-view-prompt
  path='/accept-terms'
  page-title='Consent'
  visit='always'
>
  ...
</n-view-prompt>
```

> ℹ️ Note: For **'always'**, the visit is stored in local-session which is destroyed when the browser tab is closed, but retained while on the site.

### Collect Required Data

This route will be activated if a value for 'consent' was not found in local-storage[^1].

```html
<n-view-prompt
  path='/accept-terms'
  page-title='Consent'
  when='!{{storage:consent}}'
>
  ...
</n-view-prompt>
```

> **Important**: If a value for `{{storage:consent}}` is not set in this route's somehow, the user cannot get to the parent page.

This data can be set manually or using our specialized declarative elements to update data. See [actions](/actions) for more info.

[^1]: Check out the [data system](/data) for info to use external data.

### Optional

This route will be activated only through navigation. This is helpful for opt-in presentations, modals or other action-based content.

```html
<n-view-prompt
  path='/learn-more'
  page-title='Watch a video'
  visit='optional'
>
  ...
</n-view-prompt>
```

### Routing & Guided Navigation

This evaluation has to take place before the route is activated as the underlying data can change in the previous Do elements. If the element is deemed unnecessary (the predicate returns false), the element marks itself ‘complete’ and returns control to the parent view, without revealing its contents.



<!-- Auto Generated Below -->


## Overview

This element represents a specialized child-route for a parent \<n-view\> element.
It represents a sub-route that has required and workflow behaviors.

They are used to create, wizards, input workflows, or step by step instructions or
wherever you want guided or automatic navigation.

## Usage

### Basic

Much like its parent, [`n-view`](/components/n-view), basic routing information is required.

```html
<n-view ...>
  <n-view-prompt
    path='<sub-path>'
    page-title='<route title>'
    visit='always|once|optional'
    when='<expression predicate>'
    src='<remote html with route sand children>'
    content-src='<remote content html>'
    transition='<animation-enter>'
    scroll-top-offset=''
  >
    ...
  </n-view-prompt>
  ...
</n-view>
```

> ℹ️ Note: The **when** attribute is a data expression that overrides the **visit** strategy. It is a predicate that produces a boolean result. **true: visit=always** false: visit=optional



## Properties

| Property             | Attribute           | Description                                                                                                                                                                                                                     | Type                                                 | Default     |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `contentSrc`         | `content-src`       | Remote URL for HTML content. Content from this URL will be assigned the 'content' slot.                                                                                                                                         | `string`, `undefined`                                | `undefined` |
| `debug`              | `debug`             | To debug timed elements, set this value to true.                                                                                                                                                                                | `boolean`                                            | `false`     |
| `exact`              | `exact`             | The url for this route should only be matched when it is exact.                                                                                                                                                                 | `boolean`                                            | `true`      |
| `mode`               | `mode`              | Cross Origin Mode if the content is pulled from a remote location                                                                                                                                                               | `"cors"`, `"navigate"`, `"no-cors"`, `"same-origin"` | `'cors'`    |
| `noCache`            | `no-cache`          | Force render with data & route changes.                                                                                                                                                                                         | `boolean`                                            | `false`     |
| `pageDescription`    | `page-description`  | The page description for this view.                                                                                                                                                                                             | `string`                                             | `''`        |
| `pageKeywords`       | `page-keywords`     | The keywords to add to the keywords meta-tag for this view.                                                                                                                                                                     | `string`                                             | `''`        |
| `pageRobots`         | `page-robots`       | The robots instruction for search indexing                                                                                                                                                                                      | `"all"`, `"nofollow"`, `"noindex"`, `"none"`         | `'none'`    |
| `pageTitle`          | `page-title`        | The title for this view. This is prefixed before the app title configured in n-views                                                                                                                                            | `string`                                             | `''`        |
| `path` _(required)_  | `path`              | The path for this prompt route, including the parent's routes, excluding the router's root.                                                                                                                                     | `string`                                             | `undefined` |
| `resolveTokens`      | `resolve-tokens`    | Before rendering remote HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance.  IMPORTANT: ONLY WORKS ON REMOTE HTML | `boolean`                                            | `false`     |
| `route` _(required)_ | --                  | Route information                                                                                                                                                                                                               | `Route`                                              | `undefined` |
| `scrollTopOffset`    | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                            | `number`, `undefined`                                | `undefined` |
| `transition`         | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                            | `string`, `undefined`                                | `undefined` |
| `visit`              | `visit`             | The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL            | `"always"`, `"once"`, `"optional"`                   | `'once'`    |
| `when`               | `when`              | If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy                                                                    | `string`, `undefined`                                | `undefined` |


----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
