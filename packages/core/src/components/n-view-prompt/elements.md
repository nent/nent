# X-APP-IEW-DO 

Child Attribute Detection & Resolution

## Install `\<n-elements\>`

```html
<n-elements></n-elements>
```

## Special Next & Back Attributes

To make guided-navigation easy, you can add attributes to set-up event-handlers for next & back.

## [n-next]

```html
<any n-next />
or
<any n-next='view' />
```

## [n-back]

```html
<any n-back />
```

## [n-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

```html
<any n-hide-when='predicate' />
```

## [n-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes.

```html
<any n-show-when='predicate' hidden />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

## Conditioned Classes: [n-class-when] && [n-class]

This pair of attributes conditionally toggle the class specified in the `n-class` attribute using the `n-class-where` expression.

```html
<any n-class='class' 
  n-class-when='predicate'></any>
```

## Value From: [n-value-from]

Input-type elements (input, textarea and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any n-class='class' n-class-when='predicate'></any>
```

## Time-Presentation Child Attribute Resolution

The [\<n-view-prompt\>](/components/n-view-prompt) element is always keeping track of time once its route is active. As such, you can create timed-based actions using special attributes placed on any child element.

> ℹ️) If a video element is detected, its time is used, allowing pause & play.

## [n-in-time] & [n-in-class]

This attribute removes the 'hidden' attribute if present at the specified time in seconds.

```html
<any hidden n-in-time='1' />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with n-in-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time in seconds.

```html
<any hidden n-in-time='1' n-in-class='fade-in' />
```

## [n-out-time] & [n-out-class]

This attribute adds the 'hidden' attribute if no n-out-class attribute is present at the specified time in seconds.

```html
<any n-out-time='1' />
```

> ℹ️) To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with n-out-class, this attribute adds the specified class and removes the 'hidden' attribute if present at the specified time out seconds.

```html
<any n-out-time='1' n-out-class='fade-out' />
```

## Time To: [n-time-to]

This attribute instructs [\<n-view-prompt\>](/components/n-view-prompt) to inject the current time to the named attributes. In this example's case 'value' will be updated.

```html
<any value='' n-time-to='value' />

<input n-time-to='value' />
```

## Time Percentage To: [n-percentage-to]

This attribute instructs [\<n-view-prompt\>](/components/n-view-prompt) to inject the current time percentage (based on the **next-after** attribute or the video-duration) to the named attributes. In this example's case 'value' will be updated.

```html
<any value='' n-percentage-to='value' />
```