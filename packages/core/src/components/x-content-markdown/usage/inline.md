
### Inline Markdown

A <script> tag can be inserted inside of the element to provide the markdown source. It overrides the markdown and src attributes. Support for changing this markdown source dynamically is not yet implemented.

```html
<!-- Do not set the `src` attribute -->
<x-content-markdown>
  <!-- Write your markdown inside a `<script type='text/markdown'>` tag -->
  <script type='text/markdown'>
    # **This** is my [markdown](https://example.com)
    This <button onclick="alert('JavaScript executed')">button</button> is evil
  </script>
</x-content-markdown>
```