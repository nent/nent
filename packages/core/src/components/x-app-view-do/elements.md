# X-APP-IEW-DO 

Child Attribute Detection & Resolution

## Install `\<x-elements\>`

```html
<x-elements></x-elements>
```

## Special Next & Back Attributes

To make guided-navigation easy, you can add attributes to set-up event-handlers for next & back.

## [x-next]

```html
<any x-next />
or
<any x-next='route' />
```

## [x-back]

```html
<any x-back />
```

## [x-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

```html
<any x-hide-when='predicate' />
```

## [x-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes.

```html
<any x-show-when='predicate' hidden />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

## Conditioned Classes: [x-class-when] && [x-class]

This pair of attributes conditionally toggle the class specified in the `x-class` attribute using the `x-class-where` expression.

```html
<any x-class='class' 
  x-class-when='predicate'></any>
```

## Value From: [x-value-from]

Input-type elements (input, textarea and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any x-class='class' x-class-when='predicate'></any>
```

## Time-Presentation Child Attribute Resolution

The [\<x-app-view-do\>](/components/x-app-view-do) element is always keeping track of time once its route is active. As such, you can create timed-based actions using special attributes placed on any child element.

> ℹ️) If a video element is detected, its time is used, allowing pause & play.

## [x-in-time] & [x-in-class]

This attribute removes the 'hidden' attribute if present at the specified time in seconds.

```html
<any hidden x-in-time='1' />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with x-in-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time in seconds.

```html
<any hidden x-in-time='1' x-in-class='fade-in' />
```

## [x-out-time] & [x-out-class]

This attribute adds the 'hidden' attribute if no x-out-class attribute is present at the specified time in seconds.

```html
<any x-out-time='1' />
```

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with x-out-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time out seconds.

```html
<any x-out-time='1' x-out-class='fade-out' />
```

## Time To: [x-time-to]

This attribute instructs [\<x-app-view-do\>](/components/x-app-view-do) to inject the current time to the named attributes. In this example's case 'value' will be updated.

```html
<any value='' x-time-to='value' />

<input x-time-to='value' />
```

## Time Percentage To: [x-percentage-to]

This attribute instructs [\<x-app-view-do\>](/components/x-app-view-do) to inject the current time percentage (based on the **next-after** attribute or the video-duration) to the named attributes. In this example's case 'value' will be updated.

```html
<any value='' x-percentage-to='value' />
```