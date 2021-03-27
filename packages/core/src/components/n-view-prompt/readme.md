# X-APP-DO

The [\<n-view-prompt\>](/components/n-view-prompt) element represents a specialized child-route that for its parent [\<n-view\>](/components/n-view) route. It represents a sub-route that has special presentation and workflow behaviors.

> [\<n-view-prompt\>](/components/n-view-prompt) are essentially **to-do** items for the parent route.

They are used to create presentation, wizards, input workflows, or step by step instructions or wherever you want guided or automatic navigation. These are the only routes that support [audio](/audio), [video](/video) and [declarative actions](/actions).

## Usage

Much like its parent, [\<n-view\>](/components/n-view), basic routing information is required.

```html
<n-view ...>
  <n-view-prompt
    url='<sub-path>'
    page-title='<route title>'
    display='page|modal|full'
    visit='always|once|optional'
    when='<expression predicate>'
    content-src='<remote html'
    transition='<animation-enter>'
    scroll-top-offset=''
    next-after='<seconds before next>'
  >
    ...
  </n-view-prompt>
  ...
</n-view>
```

> The **when** attribute is a data-expression to that overrides the **visit** strategy. It is a predicate that produces a boolean result. **true: visit=always** false: visit=optional

### How it works

When the parent [\<n-view\>](/components/n-view)'s route is activated, before rendering, it:

1. Lists all direct-child [\<n-view-prompt\>](/components/n-view-prompt) items, one at a time in sequence.
2. Finds the first unvisited route respecting the **'visit'** requirement or [**'when'** predicate](/expression), if present.

   - **If found**: It pushes the page state to its url, thus activated the child route.
   - **Otherwise**: The [\<n-view\>](/components/n-view) is satisfied and can now render its own contents.

## Samples

The following are some examples to demonstrate how you can combine the settings to create robust workflows.

### Present Once

This route will be activated once for each new visit to the page. (Visit 'once' is the default behavior, so it can be omitted.)

```html
<n-view-prompt url='/accept-terms' 
  page-title='Consent' 
  visit='once'>
  ...
</n-view-prompt>
```

> By default, the visit-strategy is 'once'. In this case, the visit is stored in local-storage. Any subsequent visits to this page with the same browser won't see it again.

### Present Each Visit

This route will be activated once for each new session visit to the page.

```html
<n-view-prompt
  url='/accept-terms'
  page-title='Consent'
  visit='always'
>
  ...
</n-view-prompt>
```

> For **'always'**, the visit is stored in local-session which is destroyed when the browser tab is closed, but retained while on the site.

### Collect Required Data

This route will be activated if a value for 'consent' was not found in local-storage[^1].

```html
<n-view-prompt
  url='/accept-terms'
  page-title='Consent'
  when='{{storage:consent}}'
>
  ...
</n-view-prompt>
```

> **Important**: If a value for `{{storage:consent}}` is not set in this route's somehow, the user cannot get to the parent page.

This data can be set manually or using our specialized declarative components to update data. See [declarative actions](/actions) for more info.

[^1]: Check out the [data system](/embedded-data) for expressions and how to use external data.

### Optional

This route will be activated only through navigation. This is helpful for opt-in presentations, modals or other action-based content.

```html
<n-view-prompt
  url='/learn-more'
  page-title='Watch a video'
  visit='optional'
>
  ...
</n-view-prompt>
```

> **Important**: When linking from a [\<n-view-prompt\>](/components/n-view-prompt) to another any other route, you using a [\<n-view-link\>](/components/n-view-link), validation and visit tracking is not performed. To mark the current route 'visited', add a **'n-next'** attribute to any clickable element.

#### Presentation Features

- Supports [video](/video) support:
  * Video Timer becomes basis for Timed Actions
  * Auto-Play w/Global Setting
  * Auto-Next available on Video End
  * Video Supports Global Audio Preferences
- Supports [audio](/audio) support:
  * Time & Event-based Sounds \* Voice Over
  * Background Music
  * Voice-overs
- Supports [actions](/actions):
  * At route entrance
  * At a given time
  * At a given user interaction
  * Before route exit
- Built-in timer & and optional duration:
  * Synced to video (respecting scrub, pause, etc)
  * Based on time elapsed since entrance
  * Hide and show elements at certain times
  * Time-based animation class toggling
  * Time-based navigation or when the video ends.
- Automatic visibility resolution for child elements using special attributes.
- Automatic next and back handlers for child elements using special attributes.
- Automatic time/percentage value insertion for child elements using special attributes.

### Routing & Guided Navigation

This evaluation has to take place before the route is activated as the underlying data can change in the previous Do components. If the component is deemed unnecessary (the predicate returns false), the component marks itself ‘complete’ and returns control to the parent view, without revealing its contents.



<!-- Auto Generated Below -->


## Usage

### Basic

Add this component to a route component to force a prompt ahead of the parent content.



## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                                     | Type                                                 | Default     |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `contentSrc`       | `content-src`       | Remote URL for HTML content. Content from this URL will be assigned the 'content' slot.                                                                                                                                         | `string \| undefined`                                | `undefined` |
| `debug`            | `debug`             | To debug timed elements, set this value to true.                                                                                                                                                                                | `boolean`                                            | `false`     |
| `exact`            | `exact`             | The url for this route should only be matched when it is exact.                                                                                                                                                                 | `boolean`                                            | `true`      |
| `mode`             | `mode`              | Cross Origin Mode if the content is pulled from a remote location                                                                                                                                                               | `"cors" \| "navigate" \| "no-cors" \| "same-origin"` | `'cors'`    |
| `nextAfter`        | `next-after`        | When this value exists, the page will automatically progress when the duration in seconds has passed.                                                                                                                           | `boolean \| number \| undefined`                     | `false`     |
| `pageTitle`        | `page-title`        | The title for this view. This is prefixed before the app title configured in n-views                                                                                                                                            | `string`                                             | `''`        |
| `resolveTokens`    | `resolve-tokens`    | Before rendering remote HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance.  IMPORTANT: ONLY WORKS ON REMOTE HTML | `boolean`                                            | `false`     |
| `scrollTopOffset`  | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                                                                                                                                                            | `number \| undefined`                                | `undefined` |
| `transition`       | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                            | `string \| undefined`                                | `undefined` |
| `url` _(required)_ | `url`               | The url for this route, including the parent's routes.                                                                                                                                                                          | `string`                                             | `undefined` |
| `visit`            | `visit`             | The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL            | `"always" \| "once" \| "optional"`                   | `'once'`    |
| `when`             | `when`              | If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy                                                                    | `string \| undefined`                                | `undefined` |


----------------------------------------------

nent 2021 - all rights reserved
