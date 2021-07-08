/**
 * 创建footer容器
 */
export function createFooter() {
  const el = document.createElement('div');
  el.id = 'footer-link';

  return el;
};

/**
 * 创建 横向列表
 */
export function createList() {
  const list = document.createElement('div');
  list.className += 'footer-link__list';
  const links = [
    { link: 'https://github.com/XyyF', title: 'contact me' },
  ];

  for (let i = 0, l = links.length; i < l; i++) {
    const el = document.createElement('a');
    el.target = '_blank';
    el.href = links[i].link;
    el.innerText = links[i].title;

    list.appendChild(el);
    return list;
  }
};

/**
 * 创建 section内容
 */
export function createSection() {
  const section = document.createElement('section');

  const p = document.createElement('p');
  p.innerHTML = 'Copyright &#169; 2021 Rengarxiao.';
  section.appendChild(p);

  const a = document.createElement('a');
  a.href = 'https://github.com/XyyF/';
  a.target = '_blank';
  a.rel = 'noopener';
  const img = document.createElement('img');
  img.src = 'https://rengarxiao.com/XyyF/images/elfin.png';
  a.appendChild(img);
  section.appendChild(a);

  return section;
};
