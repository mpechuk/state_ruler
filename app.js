(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.testing = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var create_world = function create_world() {
  return { year: 0, gold: 100, wheat: 100, saw: 1, farmers: 100, army: 0, messages: ['You became the king!'] };
};

var the_brain = function the_brain() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : create_world();
  var action = arguments[1];

  switch (action.type) {
    case 'LESS_ARMY':
      if (state.army > 0) {
        return {
          year: state.year,
          gold: state.gold,
          wheat: state.wheat,
          saw: state.saw,
          farmers: state.farmers + 1,
          army: state.army - 1,
          messages: [] };
      } else {
        return state;
      }

    case 'MORE_ARMY':
      if (state.farmers > 0) {
        return {
          year: state.year,
          gold: state.gold,
          wheat: state.wheat,
          saw: state.saw,
          farmers: state.farmers - 1,
          army: state.army + 1,
          messages: [] };
      } else {
        return state;
      }

    case 'NEXT_YEAR':
      var ly_mesages = [];
      var new_farmers = state.farmers;
      if (new_farmers == 0) {
        ly_mesages.push('You have no people to rule any more. This is the end...');
        return {
          year: state.year,
          gold: state.gold,
          wheat: state.wheat,
          saw: state.saw,
          farmers: state.farmers,
          army: state.army,
          messages: ly_mesages };
      }
      var productivity = 3 + Math.floor(Math.random() * 5);
      if (productivity > 6) {
        ly_mesages.push('It was a good year for farmers.');
      } else if (productivity < 5) {
        ly_mesages.push('It was a bad year for farmers.');
      }
      var growed = state.saw * productivity;
      ly_mesages.push('Your farms growed ' + growed + ' wheat');
      var saved = state.wheat;

      var new_army = state.army;
      var new_gold = state.gold;
      if (Math.floor(Math.random() * 10) > 7) {
        var barbarianArmy = Math.floor(Math.random() * 50);
        ly_mesages.push('Barbarians attacked you with army of ' + barbarianArmy + ' warriors!');
        if (barbarianArmy > new_army) {
          if (new_army == 0) {
            ly_mesages.push('You have to army, barbarians killed all farmers');
            new_farmers = 0;
          } else {
            ly_mesages.push('Barbarians defeated your army and killed all soldiers');
          }
          ly_mesages.push('Barbarians took all gold');
          ly_mesages.push('Barbarians took all wheat in storage');
          new_gold = 0;
          new_army = 0;
          saved = 0;
        } else {
          ly_mesages.push('Your army has defeated barbarians');
        }
        var wasted = Math.floor(Math.random() * growed / 2);
        ly_mesages.push('War ruined wheat fields, ' + wasted + ' wheat just wasted on the fields');
        growed = growed - wasted;
      }

      if (new_gold < new_army) {
        ly_mesages.push('You have not enough money to pay your army. Part of army ran away.');
        new_army = new_gold;
      }
      new_gold = new_gold - new_army;

      var new_wheat = saved + growed;

      if (new_wheat < new_farmers) {
        ly_mesages.push('You have nothing to feed your farmers. Part of farmers died from hunger.');
        new_farmers = new_wheat;
      }
      new_wheat = new_wheat - new_farmers;

      return {
        year: state.year + 1,
        gold: new_gold,
        wheat: new_wheat,
        saw: state.saw,
        farmers: new_farmers,
        army: new_army,
        messages: ly_mesages };
  }
  return state;
};

var _Redux = Redux,
    createStore = _Redux.createStore;


var store = createStore(the_brain);

var Year = function Year(_ref) {
  var value = _ref.value,
      onNextYear = _ref.onNextYear,
      onLessArmy = _ref.onLessArmy,
      onMoreArmy = _ref.onMoreArmy;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      { onClick: onNextYear },
      'Next year'
    ),
    React.createElement(
      'h1',
      null,
      'Year ',
      value.year
    ),
    React.createElement(
      'h2',
      null,
      'Resources'
    ),
    React.createElement(
      'h3',
      null,
      'Gold: ',
      value.gold,
      ' Wheat in storage: ',
      value.wheat,
      ', Will sow: ',
      value.saw
    ),
    React.createElement(
      'h2',
      null,
      'People'
    ),
    React.createElement(
      'h3',
      null,
      'Farmers: ',
      value.farmers,
      ' '
    ),
    React.createElement(
      'button',
      { onClick: onLessArmy },
      '^'
    ),
    React.createElement(
      'button',
      { onClick: onMoreArmy },
      'V'
    ),
    React.createElement(
      'h3',
      null,
      ' Army: ',
      value.army
    ),
    React.createElement(
      'h4',
      null,
      'What happened last year:'
    ),
    React.createElement(
      'ul',
      null,
      value.messages.map(function (message, index) {
        return React.createElement(
          'li',
          { key: index },
          message
        );
      })
    )
  );
};

var render = function render() {
  ReactDOM.render(React.createElement(Year, { value: store.getState(),
    onNextYear: function onNextYear() {
      return store.dispatch({ type: 'NEXT_YEAR' });
    },
    onLessArmy: function onLessArmy() {
      return store.dispatch({ type: 'LESS_ARMY' });
    },
    onMoreArmy: function onMoreArmy() {
      return store.dispatch({ type: 'MORE_ARMY' });
    }
  }), document.getElementById('root'));
};

var start = function start() {
  store.subscribe(render);
  render();
};

start();

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL01pY2hhZWwvLmF0b20vcGFja2FnZXMvYXRvbS1iYWJlbC1jb21waWxlci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFNO0FBQ3ZCLFNBQU8sRUFBQyxNQUFNLENBQVAsRUFBVSxNQUFLLEdBQWYsRUFBb0IsT0FBTyxHQUEzQixFQUFnQyxLQUFLLENBQXJDLEVBQXdDLFNBQVMsR0FBakQsRUFBc0QsTUFBTSxDQUE1RCxFQUErRCxVQUFVLENBQUMsc0JBQUQsQ0FBekUsRUFBUDtBQUNILENBRkQ7O0FBSUEsSUFBTSxZQUFZLFNBQVosU0FBWSxHQUFvQztBQUFBLE1BQW5DLEtBQW1DLHVFQUEzQixjQUEyQjtBQUFBLE1BQVgsTUFBVzs7QUFDcEQsVUFBTyxPQUFPLElBQWQ7QUFDRSxTQUFLLFdBQUw7QUFDRSxVQUFJLE1BQU0sSUFBTixHQUFhLENBQWpCLEVBQW9CO0FBQ1osZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FIQTtBQUliLGVBQUssTUFBTSxHQUpFO0FBS2IsbUJBQVMsTUFBTSxPQUFOLEdBQWdCLENBTFo7QUFNYixnQkFBTSxNQUFNLElBQU4sR0FBYSxDQU5OO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUgsU0FBSyxXQUFMO0FBQ0UsVUFBSSxNQUFNLE9BQU4sR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDZixlQUFPO0FBQ2IsZ0JBQU0sTUFBTSxJQURDO0FBRWIsZ0JBQUssTUFBTSxJQUZFO0FBR2IsaUJBQU8sTUFBTSxLQUhBO0FBSWIsZUFBSyxNQUFNLEdBSkU7QUFLYixtQkFBUyxNQUFNLE9BQU4sR0FBZ0IsQ0FMWjtBQU1iLGdCQUFNLE1BQU0s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TixFQUFmLENBQUw7QUFBQSxLQUZiO0FBR0MsZ0JBQVk7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxXQUFOLEVBQWYsQ0FBTDtBQUFBO0FBSGIsSUFERCxFQU1FLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQU5GO0FBUUQsQ0FURDs7QUFXQSxJQUFNLFFBQVEsU0FBUixLQUFRLEdBQU07QUFDbEIsUUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ0E7QUFDRCxDQUhEOztBQUtBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IGNyZWF0ZV93b3JsZCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7eWVhcjogMCwgZ29sZDoxMDAsIHdoZWF0OiAxMDAsIHNhdzogMSwgZmFybWVyczogMTAwLCBhcm15OiAwLCBtZXNzYWdlczogWydZb3UgYmVjYW1lIHRoZSBraW5nISddfTtcclxufVxyXG5cclxuY29uc3QgdGhlX2JyYWluID0gKHN0YXRlID0gY3JlYXRlX3dvcmxkKCksIGFjdGlvbikgPT4ge1xyXG4gIHN3aXRjaChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSAnTEVTU19BUk1ZJzpcclxuICAgICAgaWYgKHN0YXRlLmFybXkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyArIDEsXHJcbiAgICAgICAgYXJteTogc3RhdGUuYXJteSAtIDEsXHJcbiAgICAgICAgbWVzc2FnZXM6IFtdfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICBjYXNlICdNT1JFX0FSTVknOlxyXG4gICAgICBpZiAoc3RhdGUuZmFybWVycyA+IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzIC0gMSxcclxuICAgICAgICBhcm15OiBzdGF0ZS5hcm15ICsgMSxcclxuICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG5cclxuICAgIGNhc2UgJ05FWFRfWUVBUic6XHJcbiAgICAgIHZhciBseV9tZXNhZ2VzID0gW107XHJcbiAgICAgIHZhciBuZXdfZmFybWVycyA9IHN0YXRlLmZhcm1lcnM7XHJcbiAgICAgIGlmIChuZXdfZmFybWVycyA9PSAwKSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSBubyBwZW9wbGUgdG8gcnVsZSBhbnkgbW9yZS4gVGhpcyBpcyB0aGUgZW5kLi4uJyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMsXHJcbiAgICAgICAgICBhcm15OiBzdGF0ZS5hcm15LFxyXG4gICAgICAgICAgbWVzc2FnZXM6IGx5X21lc2FnZXN9O1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwcm9kdWN0aXZpdHkgPSAoMyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpKTtcclxuICAgICAgaWYgKHByb2R1Y3Rpdml0eSA+IDYpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0l0IHdhcyBhIGdvb2QgeWVhciBmb3IgZmFybWVycy4nKTtcclxuICAgICAgfSBlbHNlIGlmIChwcm9kdWN0aXZpdHkgPCA1KSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdJdCB3YXMgYSBiYWQgeWVhciBmb3IgZmFybWVycy4nKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgZ3Jvd2VkID0gc3RhdGUuc2F3ICogcHJvZHVjdGl2aXR5O1xyXG4gICAgICBseV9tZXNhZ2VzLnB1c2goYFlvdXIgZmFybXMgZ3Jvd2VkICR7Z3Jvd2VkfSB3aGVhdGApO1xyXG4gICAgICB2YXIgc2F2ZWQgPSBzdGF0ZS53aGVhdDtcclxuXHJcbiAgICAgIHZhciBuZXdfYXJteSA9IHN0YXRlLmFybXk7XHJcbiAgICAgIHZhciBuZXdfZ29sZCA9IHN0YXRlLmdvbGQ7XHJcbiAgICAgIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgPiA3KSB7XHJcbiAgICAgICAgdmFyIGJhcmJhcmlhbkFybXkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCk7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKGBCYXJiYXJpYW5zIGF0dGFja2VkIHlvdSB3aXRoIGFybXkgb2YgJHtiYXJiYXJpYW5Bcm15fSB3YXJyaW9ycyFgKTtcclxuICAgICAgICBpZiAoYmFyYmFyaWFuQXJteSA+IG5ld19hcm15ICkge1xyXG4gICAgICAgICAgaWYgKG5ld19hcm15ID09IDApIHtcclxuICAgICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSB0byBhcm15LCBiYXJiYXJpYW5zIGtpbGxlZCBhbGwgZmFybWVycycpO1xyXG4gICAgICAgICAgICBuZXdfZmFybWVycyA9IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgZGVmZWF0ZWQgeW91ciBhcm15IGFuZCBraWxsZWQgYWxsIHNvbGRpZXJzJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgdG9vayBhbGwgZ29sZCcpO1xyXG4gICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdCYXJiYXJpYW5zIHRvb2sgYWxsIHdoZWF0IGluIHN0b3JhZ2UnKTtcclxuICAgICAgICAgIG5ld19nb2xkID0gMDtcclxuICAgICAgICAgIG5ld19hcm15ID0gMDtcclxuICAgICAgICAgIHNhdmVkID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3VyIGFybXkgaGFzIGRlZmVhdGVkIGJhcmJhcmlhbnMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHdhc3RlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyb3dlZC8yICk7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKGBXYXIgcnVpbmVkIHdoZWF0IGZpZWxkcywgJHt3YXN0ZWR9IHdoZWF0IGp1c3Qgd2FzdGVkIG9uIHRoZSBmaWVsZHNgKTtcclxuICAgICAgICBncm93ZWQgPSBncm93ZWQgLSB3YXN0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChuZXdfZ29sZCA8IG5ld19hcm15KSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSBub3QgZW5vdWdoIG1vbmV5IHRvIHBheSB5b3VyIGFybXkuIFBhcnQgb2YgYXJteSByYW4gYXdheS4nKTtcclxuICAgICAgICBuZXdfYXJteSA9IG5ld19nb2xkO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld19nb2xkID0gbmV3X2dvbGQgLSBuZXdfYXJteTtcclxuXHJcbiAgICAgIHZhciBuZXdfd2hlYXQgPSBzYXZlZCArIGdyb3dlZDtcclxuXHJcblxyXG4gICAgICBpZiAobmV3X3doZWF0IDwgbmV3X2Zhcm1lcnMpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vdGhpbmcgdG8gZmVlZCB5b3VyIGZhcm1lcnMuIFBhcnQgb2YgZmFybWVycyBkaWVkIGZyb20gaHVuZ2VyLicpO1xyXG4gICAgICAgIG5ld19mYXJtZXJzID0gbmV3X3doZWF0O1xyXG4gICAgICB9XHJcbiAgICAgIG5ld193aGVhdCA9IG5ld193aGVhdCAtIG5ld19mYXJtZXJzO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyICsxLFxyXG4gICAgICAgIGdvbGQ6IG5ld19nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBuZXdfd2hlYXQsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgZmFybWVyczogbmV3X2Zhcm1lcnMsXHJcbiAgICAgICAgYXJteTogIG5ld19hcm15LFxyXG4gICAgICAgIG1lc3NhZ2VzOiBseV9tZXNhZ2VzfTtcclxuICB9XHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG5jb25zdCB7IGNyZWF0ZVN0b3JlIH0gPSBSZWR1eDtcclxuXHJcbnZhciBzdG9yZSA9IGNyZWF0ZVN0b3JlKHRoZV9icmFpbik7XHJcblxyXG5jb25zdCBZZWFyID0gKHsgdmFsdWUsIG9uTmV4dFllYXIsIG9uTGVzc0FybXksIG9uTW9yZUFybXkgfSkgPT4gKFxyXG4gICA8ZGl2PlxyXG4gICA8YnV0dG9uIG9uQ2xpY2s9e29uTmV4dFllYXJ9Pk5leHQgeWVhcjwvYnV0dG9uPlxyXG4gICA8aDE+WWVhciB7dmFsdWUueWVhcn08L2gxPlxyXG4gICA8aDI+UmVzb3VyY2VzPC9oMj5cclxuICAgPGgzPkdvbGQ6IHt2YWx1ZS5nb2xkfSBXaGVhdCBpbiBzdG9yYWdlOiB7dmFsdWUud2hlYXR9LCBXaWxsIHNvdzoge3ZhbHVlLnNhd308L2gzPlxyXG4gICA8aDI+UGVvcGxlPC9oMj5cclxuICAgPGgzPkZhcm1lcnM6IHt2YWx1ZS5mYXJtZXJzfSA8L2gzPlxyXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkxlc3NBcm15fT5ePC9idXR0b24+XHJcbiAgICA8YnV0dG9uIG9uQ2xpY2s9e29uTW9yZUFybXl9PlY8L2J1dHRvbj5cclxuICAgPGgzPiBBcm15OiB7dmFsdWUuYXJteX08L2gzPlxyXG4gICA8aDQ+V2hhdCBoYXBwZW5lZCBsYXN0IHllYXI6PC9oND5cclxuICAgPHVsPnt2YWx1ZS5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PlxyXG4gICAgICA8bGkga2V5PXtpbmRleH0+XHJcbiAgICAgICAge21lc3NhZ2V9XHJcbiAgICAgIDwvbGk+XHJcbiAgICApfTwvdWw+XHJcbiAgIDwvZGl2PlxyXG4gKVxyXG5cclxuXHJcbmNvbnN0IHJlbmRlciA9ICgpID0+IHtcclxuICBSZWFjdERPTS5yZW5kZXIoXHJcbiAgIDxZZWFyIHZhbHVlPXtzdG9yZS5nZXRTdGF0ZSgpfVxyXG4gICAgb25OZXh0WWVhcj17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonTkVYVF9ZRUFSJ30pfVxyXG4gICAgb25MZXNzQXJteT17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonTEVTU19BUk1ZJ30pfVxyXG4gICAgb25Nb3JlQXJteT17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonTU9SRV9BUk1ZJ30pfVxyXG4gICAgLz4sXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpXHJcbiAgKTtcclxufVxyXG5cclxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XHJcbiAgc3RvcmUuc3Vic2NyaWJlKHJlbmRlcik7XHJcbiAgcmVuZGVyKCk7XHJcbn1cclxuXHJcbnN0YXJ0KCk7XHJcbiJdfQ==
