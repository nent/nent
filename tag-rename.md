
# X-UI to NENT 

## Reference Change

Update the paths from:

```html
<script type="module"
  src="https://unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.esm.js"></script>
```
To:
```html
<script type="module"
    src="https://cdn.jsdelivr.net/npm/@nent/core/dist/esm/nent.js"></script>
```

## Tag Changes

Perform these changes in this order:


### 1) Routing

Routing components have been removed from the app namespace, from x-app-* to n-*:

     x-app                   n-views
     x-app-view-not-found    n-view-not-found
     
     x-app-view              n-view
     x-app-link              n-view-link
     x-app-view-list         n-view-link-list

Routing view-do renamed to view-prompt:

    x-app-view-do           n-view-prompt

Attribute URL in a-views, n-view and n-view-prompt changed to path:

    start-url=""            start-path=""
    url=""                  path=""

Topic 'routing', data-url renamed to data-path.

    data-url                data-path

### 2) Analytics

Analytics also pulled from the app namespace, from x-app-* to n-*:

    x-app-analytics         n-analytics

### 3) App (was UI)

The UI components have been renamed from x-ui-* to n-app-*: 

    x-ui                    n-app
    x-ui-theme              n-app-theme
    x-ui-theme-switch       n-app-theme-switch

Content share was moved to the App namespace as it will be part of the PWA functionality group:

    x-content-share         n-app-share

TOPIC: renamed from 'ui' to 'app'

    topic="ui"              topic="app"

### 4) Data 

The data components have been split up.

Content w/data moved to n-content-*:

    x-data-display            n-content-template
    x-data-repeater           n-content-repeat
    x-data-show               n-content-show

Data provider names simplified: x-data-provider-* to n-data-*

    x-data-provider-cookie    n-data-cookie
    x-data-provider-session   n-data-session
    x-data-provider-storage   n-data-storage

### 5) Content

Content include was renamed (again, sorry):

    x-content                 n-content-include

### 6) Audio

Simplified the audio-state switch name:

    x-audio-state-switch    n-audio-switch

Renamed audio-action components to include the action namespace to start a new convention of cross-namespace naming:

    x-audio-music-load      n-audio-action-music-load
    x-audio-sound-load      n-audio-action-sound-load
    x-audio-music-action    n-audio-action-music
    x-audio-sound-action    n-audio-action-sound

### 7) Video

    x-video-autoplay-switch n-video-switch


### 8) Rename remaining from x-* to n-*.

    x-action*               n-action
    x-action-activator      n-action-activator
