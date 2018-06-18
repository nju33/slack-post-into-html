# slack file contents into html

## usage

```js
const intoHtml = require('into-html');

const html = intoHtml([
  {type, text},
  {type, text},
  {type, text},
  // ...
]);
```

## features

### tags

- [x] h1
- [x] h2
- [x] h3
- [x] p
- [x] ul
- [x] ol
- [x] pre
- [ ] cl (check list)
- [ ] unfurl

### formats

- [ ] link
- [ ] b
- [ ] i
- [ ] stroke