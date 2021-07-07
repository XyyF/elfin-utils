import { createFooter, createList, createSection } from './base';

/**
 * 添加style样式
 */
 export function addStyle() {
  const style = document.createElement('style');
  style.innerHTML = `
    #footer-link {
      width: 100%;
      color: #595958;
      padding: 15px 10px;
      box-sizing: border-box;
      background: #f2f2f2;
    }

    #footer-link .footer-link__list {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    #footer-link .footer-link__list a {
      display: block;
      margin: 0 7px;
      text-decoration: none;
      cursor: pointer;
      color: #595958;
    }

    #footer-link section {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    #footer-link section img {
      max-width: 42px;
      height: auto;
    }
  `;
  document.head.appendChild(style);
};

window.addEventListener('load', function () {
  const footer = createFooter();

  footer.appendChild(createList());
  footer.appendChild(createSection());
  addStyle();

  document.body.appendChild(footer);
});
