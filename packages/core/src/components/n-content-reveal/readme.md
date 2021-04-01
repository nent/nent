# N-CONTENT-REVEAL

Use this component to add a little flair to any HTML. It creates an entrance animation using the configured attributes to add pop to any page.

## Element

```html
<n-content-reveal 
  direction=''
  delay=''
  duration=''
  animation-distance=''
  trigger-distance=''>
  ...
</n-content-reveal>
```

<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                      | Type                                  | Default |
| ------------------- | -------------------- | -------------------------------------------------------------------------------- | ------------------------------------- | ------- |
| `animationDistance` | `animation-distance` | How far the element moves in the animation (% of element width/height)           | `string`                              | `'30%'` |
| `delay`             | `delay`              | How long to delay the animation (ms)                                             | `number`                              | `0`     |
| `direction`         | `direction`          | Direction the element moves when animating in                                    | `'down'`, `'left'`, `'right'`, `'up'` | `'up'`  |
| `duration`          | `duration`           | How long the animation runs (ms)                                                 | `number`                              | `500`   |
| `triggerDistance`   | `trigger-distance`   | How much of the element must be visible before it animates (% of element height) | `string`                              | `'33%'` |


----------------------------------------------

NENT 2021 - all rights reserved
