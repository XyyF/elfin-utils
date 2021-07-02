(function () {
  window.addEventListener('load', function () {
    const footer = createFooter();

    footer.appendChild(createList());
    footer.appendChild(createSection());
    addStyle();

    document.body.appendChild(footer);

    /**
     * 创建footer容器
     */
    function createFooter() {
      const el = document.createElement('div');
      el.id = 'footer-link';

      return el;
    };

    /**
     * 创建 横向列表
     */
    function createList() {
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
    function createSection() {
      const section = document.createElement('section');

      const p = document.createElement('p');
      p.innerText = 'Copyright &#169; 2021 Rengarxiao.';
      section.appendChild(p);

      const a = document.createElement('a');
      a.href = 'https://github.com/XyyF/';
      a.target = '_blank';
      a.rel = 'noopener';
      const img = document.createElement('img');
      img.src = 'https://rengar-1253859411.cos.ap-chengdu.myqcloud.com/elfin.png';
      a.appendChild(img);
      section.appendChild(a);

      return section;
    }

    /**
     * 添加style样式
     */
    function addStyle() {
      const style = document.createElement('style');
      style.innerText = `
        #footer-link {
          width: 100%;
          color: #595958;
          padding: 15px 10px;
          margin-top: 40px;
          box-sizing: border-box;
          border-top: 1px solid #595958;
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
    }
  });
})();
