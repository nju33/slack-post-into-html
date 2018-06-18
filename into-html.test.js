const intoHtml = require('.');

describe('into-html', () => {
  for (const type of ['h1', 'h2', 'h3', 'p']) {
    test(type, () => {
      const result = intoHtml([{type, text: `${type} text`}]);
      expect(result).toBe(`<${type}>${type} text</${type}>`);
    });
  }

  for (const type of ['ul', 'ol']) {
    test(type, () => {
      const result = intoHtml([
        {type: 'p', text: ''},
        {type, text: '1'},
        {type, text: '2'},
        {type, text: '3'},
        {type: 'p', text: ''}
      ]);
      expect(result).toBe(
        `
<p></p>
<${type}><li>1</li><li>2</li><li>3</li></${type}>
<p></p>
      `.trim()
      );
    });
  }

  test('pre', () => {
    const result = intoHtml([
      {type: 'p', text: ''},
      {type: 'pre', text: '1'},
      {type: 'pre', text: '2'},
      {type: 'pre', text: '3'},
      {type: 'p', text: ''}
    ]);
    expect(result).toBe(
      `
<p></p>
<pre>1
2
3</pre>
<p></p>
          `.trim()
    );
  });

  for (const format of ['b', 'i', 'strike']) {
    test(format, () => {
      const result = intoHtml([
        {
          type: 'p',
          text: `__${format}__`,
          formats: {[format]: [2, 2 + format.length]}
        }
      ]);
      expect(result).toBe(`<p>__<${format}>${format}</${format}>__</p>`);
    });
  }

  test('links', () => {
    const result = intoHtml([
      {
        type: 'p',
        text: `__link1__link2__`,
        links: {
          'http://example.com': [2, 7],
          'http://example2.com': [9, 14]
        }
      }
    ]);
    expect(result).toBe(
      '<p>__<a href="http://example.com">link1</a>__<a href="http://example2.com>link2</a>__</p>'
    );
  });
});
