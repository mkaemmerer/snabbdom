var assert = require('assert');

var snabbdom = require('../snabbdom');
var patch = snabbdom.init([
]);
var h = require('../h');
var thunk = require('../thunk');

describe('thunk', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('returns vnode with data and render function', function() {
    function numberInSpan(n) {
      return h('span', 'Number is ' + n);
    }
    var vnode = thunk('num', numberInSpan, 22);
    assert.deepEqual(vnode.sel, 'thunknum');
    assert.deepEqual(vnode.data.args, [22]);
  });
  it('only calls render function on data change', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('num', numberInSpan, 1)
    ]);
    var vnode2 = h('div', [
      thunk('num', numberInSpan, 1)
    ]);
    var vnode3 = h('div', [
      thunk('num', numberInSpan, 2)
    ]);
    patch(vnode0, vnode1);
    patch(vnode1, vnode2);
    patch(vnode2, vnode3);
    assert.equal(called, 2);
  });
  it('renders correctly', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('num', numberInSpan, 1)
    ]);
    var vnode2 = h('div', [
      thunk('num', numberInSpan, 1)
    ]);
    var vnode3 = h('div', [
      thunk('num', numberInSpan, 2)
    ]);
    patch(vnode0, vnode1);
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    patch(vnode1, vnode2);
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    patch(vnode2, vnode3);
    assert.equal(elm.firstChild.innerHTML, 'Number is 2');
    assert.equal(called, 2);
  });
  it('renders correctly when root', function() {
      var called = 0;
      function numberInSpan(n) {
        called++;
        return h('span', 'Number is ' + n);
      }
      var vnode1 = thunk('num', numberInSpan, 1);
      var vnode2 = thunk('num', numberInSpan, 1);
      var vnode3 = thunk('num', numberInSpan, 2);

      patch(vnode0, vnode1);
      assert.equal(elm.innerHTML, 'Number is 1');

      patch(vnode1, vnode2);
      assert.equal(elm.innerHTML, 'Number is 1');

      patch(vnode2, vnode3);
      assert.equal(elm.innerHTML, 'Number is 2');
      assert.equal(called, 2);
  });
  it('can mutate its root tag', function() {
    function oddEven(n) {
      var oddEvenSel = (n % 2) ? 'div.odd' : 'p.even';
      return h(oddEvenSel, n);
    }
    var vnode1 = h('div', [thunk('oddEven', oddEven, 1)]);
    var vnode2 = h('div', [thunk('oddEven', oddEven, 4)]);

    patch(vnode0, vnode1);
    assert.equal(elm.firstChild.tagName, 'DIV');
    assert.equal(elm.firstChild.className, 'odd');

    patch(vnode1, vnode2);
    assert.equal(elm.firstChild.tagName, 'P');
    assert.equal(elm.firstChild.className, 'even');
  });
  it('can be replaced and removed', function() {
      function numberInSpan(n) {
        return h('span.numberInSpan', 'Number is ' + n);
      }
      function oddEven(n) {
        var oddEvenClass = (n % 2) ? '.odd' : '.even';
        return h('div' + oddEvenClass, 'Number is ' + n);
      }
      var vnode1 = h('div', [thunk('num', numberInSpan, 1)]);
      var vnode2 = h('div', [thunk('oddEven', oddEven, 4)]);

      patch(vnode0, vnode1);
      assert.equal(elm.firstChild.tagName, 'SPAN');
      assert.equal(elm.firstChild.className, 'numberInSpan');

      patch(vnode1, vnode2);
      assert.equal(elm.firstChild.tagName, 'DIV');
      assert.equal(elm.firstChild.className, 'even');
  });
  it('can be replaced and removed when root', function() {
      function numberInSpan(n) {
          return h('span.numberInSpan', 'Number is ' + n);
        }
        function oddEven(n) {
          var oddEvenClass = (n % 2) ? '.odd' : '.even';
          return h('div' + oddEvenClass, 'Number is ' + n);
        }
        var vnode1 = thunk('num', numberInSpan, 1);
        var vnode2 = thunk('oddEven', oddEven, 4);

        patch(vnode0, vnode1);
        assert.equal(elm.firstChild.tagName, 'SPAN');
        assert.equal(elm.firstChild.className, 'numberInSpan');

        patch(vnode1, vnode2);
        assert.equal(elm.firstChild.tagName, 'DIV');
        assert.equal(elm.firstChild.className, 'even');
  });
});
