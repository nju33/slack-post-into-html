const ow = require('ow');
const replaceRange = require('replace-range');

module.exports = children => {
  ow(children, ow.array);
  const state = {
    ul: null,
    ol: null,
    pre: null
  };
  const lines = [];

  const checkTag = currentType => {
    const type = Object.keys(state).find(type => {
      return state[type] !== null && currentType !== type;
    });

    if (typeof type === 'undefined') {
      return;
    }

    if (type === 'ul') {
      lines.push(
        `<ul>${state[type].map(item => `<li>${item}</li>`).join('')}</ul>`
      );
    } else if (type === 'ol') {
      lines.push(
        `<ol>${state[type].map(item => `<li>${item}</li>`).join('')}</ol>`
      );
    } else if (type === 'pre') {
      lines.push(`<pre>${state[type].join('\n')}</pre>`);
    } else {
      throw new Error('err');
    }

    state[type] = null;
  };

  children.forEach(child => {
    ow(child.type, ow.string);
    checkTag(child.type);

    switch (child.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'p': {
        const linkRangeItems = Object.keys(child.links || []).map(url => {
          const range = child.links[url];
          return [...range, text => `<a href="${url}">${text}</a>`]
        });

        const formatRangeItems = [];
        Object.keys(child.formats || []).forEach(tag => {
          const ranges = child.formats[tag];
          let index = 0;

          while (index < ranges.length) {
            const range = ranges.slice(index, 2);
            formatRangeItems.push([...range, text => `<${tag}>${text}</${tag}>`]);
            index += 2;
          }
        });

        const text = replaceRange(child.text, [
          ...linkRangeItems,
          ...formatRangeItems
        ]);

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
