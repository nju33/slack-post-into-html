const ow = require('ow');

module.exports = root => {
  ow(root, ow.object);
  ow(root.children, ow.array);
  const state = {
    ul: null,
    ol: null,
    pre: null
  };
  const lines = [];

  const checkUpdate = currentType => {
    Object.keys(state).forEach(type => {
      if (state[type] !== null && currentType !== type) {
        if (type === 'ul') {
          lines.push(
            `<ul>${state[type].map(item => `<li>${item}</li>`).join('')}</ul>`
          );
        } else if (type === 'ol') {
          lines.push(
            `<ol>${state[type].map(item => `<li>${item}</li>`).join('')}</ol>`
          );
        } else if (type === 'pre') {
          lines.push(`<pre>${state[type].join('')}</pre>`);
        } else {
          throw new Error('err');
        }

        state[type] === null;
      }
    });
  };

  root.children.forEach(child => {
    ow(child.type, ow.string);
    checkUpdate(child.type);

    switch (child.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'p': {
        // const chi`<${child.type}>${child.text || ''}</${child.type}>`
        let text = child.text || '';
        if (({}).hasOwnProperty.call(child, 'links')) {
          Object.keys(child.links).forEach(url => {
            const range = child.links[url];
            const rangeLength = range[1] - range[0];
            const linkText = child.text.slice.apply(child.text, range);
            const htmlLink = `<a href="${url}">${linkText}</a>`;
            const htmlLength = htmlLink.length;

            const splittedText = child.text.split('')
            splittedText.splice.apply(splittedText, [...range, ...htmlLink.split('')])

            text = splittedText.join('');
          });
        }

        lines.push(`<${child.type}>${text}</${child.type}>`);

        return;
      }
      case 'ul': {
        if (state.ul === null) {
          state.ul = [];
        }
        state.ul.push(child.text || '');

        return;
      }
      case 'ol': {
        if (state.ol === null) {
          state.ol = [];
        }
        state.ol.push(child.text || '');

        return;
      }
      case 'pre': {
        if (state.pre === null) {
          state.pre = [];
        }
        state.pre.push(child.text || '');

        return;
      }
      case 'cl':
      case 'unfurl':
      default:
        return;
    }
  });

  return lines.join('\n');
};
