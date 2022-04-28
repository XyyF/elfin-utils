/**
 * javascript 类工厂
 * create at 2022/02/18
 */

function mbClass(methods) {
  if (methods === undefined || methods === null) return function () { };
  return createClass(methods);
}

/**
 * 创建class
 * @param {object} methods 作为prototype原型链属性
 * @param {object?} _prototype 需要继承的原型链属性，原型链遮蔽原则
 * @param {function?} _constructor 需要继承的原型
 */
function createClass(methods, _prototype, _constructor) {
  // 属性描述符集合
  let methodProperties = {};
  let names = Object.getOwnPropertyNames(methods);
  for (let i = 0, j = names.length; i < j; i++) {
    let name = names[i];
    let property = Object.getOwnPropertyDescriptor(methods, name);
    methodProperties[name] = property;
  }

  let Ctor;
  // 构造函数
  if (methodProperties.hasOwnProperty('constructor')) {
    Ctor = methodProperties.constructor.value;
    if (typeof Ctor !== 'function') throw new Error('constructor is not function');
  } else {
    Ctor = function () { };
    methodProperties.constructor = { value: Ctor, writable: true, configurable: true };
  }
  // 原型链属性值(包括constructor)
  if (_prototype) Ctor.prototype = Object.create(_prototype);
  // if (!Ctor.prototype) Ctor.prototype = Object.create(Object.prototype);
  Object.defineProperties(Ctor.prototype, methodProperties);
  // 继承原型 __proto__
  // if (_constructor) Ctor.prototype.constructor = _constructor;

  return Ctor;
}

/**
 * 继承class
 */
mbClass.extend = function(superClass) {
  let _prototype = null, _constructor = null;
  if (superClass) {
    if (typeof superClass === 'function') {
      // function
      _prototype = superClass.prototype;
      _constructor = superClass;
    } else if (typeof superClass === 'object') {
      // object
      _prototype = superClass;
    }
  }

  return function(methods) {
    return createClass(methods, _prototype, _constructor);
  }
}

module.exports = mbClass;
