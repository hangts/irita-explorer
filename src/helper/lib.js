// menuList 菜单这里的路径是（索引+1）的路径
export const getActiveIndex = (menuList, path) => {
  if (!Array.isArray(menuList)) {
    throw 'menuList is Array';
  }

  let flag = false;
  let res = '';

  const dfs = (data, parent) => {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const nextParent = parent ? `${parent}-${i + 1}` : `${i + 1}`;

      if (path.includes(item.link)) {
        flag = true;
        res = nextParent;
      }

      if (!flag && item && item.children && item.children.length > 0) {
        dfs(item.children, nextParent);
      }
    }
  };

  dfs(menuList, '');

  return res;
};
