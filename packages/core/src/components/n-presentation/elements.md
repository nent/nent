# N-PRESENTATION: Element Extension

When elements are enabled, this element can use special attributes for real-time updates.

## Install `\<n-elements\>`

```html
<n-elements></n-elements>
```

## Time-Presentation Child Attribute Resolution

The [`n-presentation`](/components/n-presentation) element is always keeping track of time once it is active. As such, you can create timed-based actions using special attributes placed on any child element.

> ℹ️ If a video element is detected, its time is used, allowing pause & play.

## [n-in-time] & [n-in-class]

This attribute removes the 'hidden' attribute, if present, at the specified time in seconds.

```html
<any hidden n-in-time='1' />
```

> ℹ️ Note: To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with n-in-class, this attribute adds the specified class and removes the 'hidden' attribute, if present, at the specified time in seconds.

```html
<any hidden n-in-time='1' n-in-class='fade-in' />
```

## [n-out-time] & [n-out-class]

This attribute adds the 'hidden' attribute if no n-out-class attribute is present at the specified time in seconds.

```html
<any n-out-time='1' />
```

> ℹ️ To initially hide the element, be sure to include the ‘hidden’ attribute.

When used with n-out-class, this attribute adds the specified class and removes the 'hidden' attribute, if present, at the specified time-out seconds.

```html
<any n-out-time='1' n-out-class='fade-out' />
```

## Time To: [n-time-to]

This attribute instructs [`n-presentation`](/components/n-presentation) to inject the current time to the named attributes. In this example's case, 'value' will be updated.

```html
<any value='' n-time-to='value' />

<input n-time-to='value' />
```

## Time Percentage To: [n-percentage-to]

This attribute instructs [`n-presentation`](/components/n-presentation) to inject the current time percentage (based on the **next-after** attribute or the video-duration) to the named attributes. In this example's case, 'value' will be updated.

```html
<any value='' n-percentage-to='value' />
```