export default function makeDOM(type, props, children) {
  if (arguments.length > 3) {
    children = [children];

    for (let i = 3; i < arguments.length; i++) {
      children.push(arguments[i]);
    }
  }

  const isSvg = type === 'svg';
  const dom = isSvg
  ? document.createElementNS('http://www.w3.org/2000/svg', type)
  : document.createElement(type);

  // 设置属性
  for (let prop in props) {
    setProperty(dom, prop, props[prop], isSvg);
  }

  // 子节点处理
  appendChildren(dom, children);

  return dom;
}

function appendChildren(dom, children) {
  if (children) {
    if (typeof children === 'string' || typeof children == 'number') {
      dom.appendChild(document.createTextNode(children));
    } else if (Array.isArray(children)) {
      for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        if (typeof child === 'string' || typeof child == 'number') {
          dom.appendChild(document.createTextNode(child));
        } else {
          dom.appendChild(child);
        }
      }
    }
  }
}

function setProperty(dom, name, value, isSvg) {
	let s, useCapture, nameLower;

	if (isSvg) {
		if (name === 'className') {
			name = 'class';
		}
	} else if (name === 'class') {
		name = 'className';
	}

	if (name === 'style') {
		s = dom.style;

		if (typeof value == 'string') {
			s.cssText = value;
		} else if (value) {
      for (let i in value) {
        setStyle(s, i, value[i]);
      }
    }
	}
	// Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
	else if (name[0] === 'o' && name[1] === 'n') {
		useCapture = name !== (name = name.replace(/Capture$/, ''));
		nameLower = name.toLowerCase();
		name = (nameLower in dom ? nameLower : name).slice(2);

		if (value) {
			dom.addEventListener(name, eventProxy, useCapture);
			(dom._listeners || (dom._listeners = {}))[name] = value;
		} else {
			dom.removeEventListener(name, eventProxy, useCapture);
		}
	} else if (
		name !== 'list' &&
		name !== 'tagName' &&
		// HTMLButtonElement.form and HTMLInputElement.form are read-only but can be set using
		// setAttribute
		name !== 'form' &&
		name !== 'type' &&
		name !== 'size' &&
		!isSvg &&
		name in dom
	) {
		dom[name] = value == null ? '' : value;
	} else if (typeof value != 'function' && name !== 'dangerouslySetInnerHTML') {
		if (name !== (name = name.replace(/^xlink:?/, ''))) {
			if (value == null || value === false) {
				dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
			} else {
				dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
			}
		} else if (
			value == null ||
			(value === false &&
				// ARIA-attributes have a different notion of boolean values.
				// The value `false` is different from the attribute not
				// existing on the DOM, so we can't remove it. For non-boolean
				// ARIA-attributes we could treat false as a removal, but the
				// amount of exceptions would cost us too many bytes. On top of
				// that other VDOM frameworks also always stringify `false`.
				!/^ar/.test(name))
		) {
			dom.removeAttribute(name);
		} else {
			dom.setAttribute(name, value);
		}
	}
}

function setStyle(style, key, value) {
	if (key[0] === '-') {
		style.setProperty(key, value);
	} else if (typeof value == 'number' && IS_NON_DIMENSIONAL.test(key) === false) {
		style[key] = value + 'px';
	} else if (value == null) {
		style[key] = '';
	} else {
		style[key] = value;
	}
}
