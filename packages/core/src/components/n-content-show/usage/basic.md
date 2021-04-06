### Show

```html
<n-content-show 
  when='true'>
  
</n-content-show>
```

### Hide

```html
<n-content-show 
  when='false'>
  
</n-content-show>
```

### Expressions

```html
<n-content-show 
  when='1 in [1,2]'>
  ... shows! ...
</n-content-show>
```

```html
<n-content-show 
  when='3 in [1,2]'>
  ... hides! ...
</n-content-show>
```

```html
<n-content-show 
  when='5 > 4'>
  ... shows! ...
</n-content-show>
```