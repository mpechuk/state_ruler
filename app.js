(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.testing = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var create_world = function create_world() {
  return { year: 0, gold: 100, wheat: 100, saw: 1, farmers: 100, army: 0, messages: ['You became the king!'] };
};

var the_brain = function the_brain() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : create_world();
  var action = arguments[1];

  switch (action.type) {
    case 'STORAGE_TO_FIELD':
      if (state.wheat > 0) {
        return {
          year: state.year,
          gold: state.gold,
          wheat: state.wheat - 1,
          saw: state.saw + 1,
          farmers: state.farmers,
          army: state.army,
          messages: [] };
      } else {
        return state;
      }

    case 'FIELD_TO_STORAGE':
      if (state.saw > 0) {
        return {
          year: state.year,
          gold: state.gold,
          wheat: state.wheat + 1,
          saw: state.saw - 1,
          farmers: state.farmers,
          army: state.army,
          messages: [] };
      } else {
        return state;
      }

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
      onMoreArmy = _ref.onMoreArmy,
      onStorageToField = _ref.onStorageToField,
      onFieldToStorage = _ref.onFieldToStorage;
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
    },
    onStorageToField: function onStorageToField() {
      return store.dispatch({ type: 'STORAGE_TO_FIELD' });
    },
    onFieldToStorage: function onFieldToStorage() {
      return store.dispatch({ type: 'FIELD_TO_STORAGE' });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL01pY2hhZWwvLmF0b20vcGFja2FnZXMvYXRvbS1iYWJlbC1jb21waWxlci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFNO0FBQ3ZCLFNBQU8sRUFBQyxNQUFNLENBQVAsRUFBVSxNQUFLLEdBQWYsRUFBb0IsT0FBTyxHQUEzQixFQUFnQyxLQUFLLENBQXJDLEVBQXdDLFNBQVMsR0FBakQsRUFBc0QsTUFBTSxDQUE1RCxFQUErRCxVQUFVLENBQUMsc0JBQUQsQ0FBekUsRUFBUDtBQUNILENBRkQ7O0FBSUEsSUFBTSxZQUFZLFNBQVosU0FBWSxHQUFvQztBQUFBLE1BQW5DLEtBQW1DLHVFQUEzQixjQUEyQjtBQUFBLE1BQVgsTUFBVzs7QUFDcEQsVUFBTyxPQUFPLElBQWQ7QUFDRSxTQUFLLGtCQUFMO0FBQ0UsVUFBSSxNQUFNLEtBQU4sR0FBYyxDQUFsQixFQUFxQjtBQUNiLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBQU4sR0FBYyxDQUhSO0FBSWIsZUFBSyxNQUFNLEdBQU4sR0FBWSxDQUpKO0FBS2IsbUJBQVMsTUFBTSxPQUxGO0FBTWIsZ0JBQU0sTUFBTSxJQU5DO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBSyxrQkFBTDtBQUNFLFVBQUksTUFBTSxHQUFOLEdBQVksQ0FBaEIsRUFBbUI7QUFDWCxlQUFPO0FBQ2IsZ0JBQU0sTUFBTSxJQURDO0FBRWIsZ0JBQUssTUFBTSxJQUZFO0FBR2IsaUJBQU8sTUFBTSxLQUFOLEdBQWMsQ0FIUjtBQUliLGVBQUssTUFBTSxHQUFOLEdBQVksQ0FKSjtBQUtiLG1CQUFTLE1BQU0sT0FMRjtBQU1iLGdC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LEtBQVEsR0FBTTtBQUNsQixRQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDQTtBQUNELENBSEQ7O0FBS0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuY29uc3QgY3JlYXRlX3dvcmxkID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHt5ZWFyOiAwLCBnb2xkOjEwMCwgd2hlYXQ6IDEwMCwgc2F3OiAxLCBmYXJtZXJzOiAxMDAsIGFybXk6IDAsIG1lc3NhZ2VzOiBbJ1lvdSBiZWNhbWUgdGhlIGtpbmchJ119O1xyXG59XHJcblxyXG5jb25zdCB0aGVfYnJhaW4gPSAoc3RhdGUgPSBjcmVhdGVfd29ybGQoKSwgYWN0aW9uKSA9PiB7XHJcbiAgc3dpdGNoKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlICdTVE9SQUdFX1RPX0ZJRUxEJzpcclxuICAgICAgaWYgKHN0YXRlLndoZWF0ID4gMCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0IC0gMSxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyArIDEsXHJcbiAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyxcclxuICAgICAgICBhcm15OiBzdGF0ZS5hcm15LFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdGSUVMRF9UT19TVE9SQUdFJzpcclxuICAgICAgICBpZiAoc3RhdGUuc2F3ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQgKyAxLFxyXG4gICAgICAgICAgc2F3OiBzdGF0ZS5zYXcgLSAxLFxyXG4gICAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyxcclxuICAgICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGNhc2UgJ0xFU1NfQVJNWSc6XHJcbiAgICAgIGlmIChzdGF0ZS5hcm15ID4gMCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMgKyAxLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXkgLSAxLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSAnTU9SRV9BUk1ZJzpcclxuICAgICAgaWYgKHN0YXRlLmZhcm1lcnMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyAtIDEsXHJcbiAgICAgICAgYXJteTogc3RhdGUuYXJteSArIDEsXHJcbiAgICAgICAgbWVzc2FnZXM6IFtdfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICBjYXNlICdORVhUX1lFQVInOlxyXG4gICAgICB2YXIgbHlfbWVzYWdlcyA9IFtdO1xyXG4gICAgICB2YXIgbmV3X2Zhcm1lcnMgPSBzdGF0ZS5mYXJtZXJzO1xyXG4gICAgICBpZiAobmV3X2Zhcm1lcnMgPT0gMCkge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgbm8gcGVvcGxlIHRvIHJ1bGUgYW55IG1vcmUuIFRoaXMgaXMgdGhlIGVuZC4uLicpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgICAgYXJteTogc3RhdGUuYXJteSxcclxuICAgICAgICAgIG1lc3NhZ2VzOiBseV9tZXNhZ2VzfTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcHJvZHVjdGl2aXR5ID0gKDMgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KSk7XHJcbiAgICAgIGlmIChwcm9kdWN0aXZpdHkgPiA2KSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdJdCB3YXMgYSBnb29kIHllYXIgZm9yIGZhcm1lcnMuJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHJvZHVjdGl2aXR5IDwgNSkge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnSXQgd2FzIGEgYmFkIHllYXIgZm9yIGZhcm1lcnMuJyk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGdyb3dlZCA9IHN0YXRlLnNhdyAqIHByb2R1Y3Rpdml0eTtcclxuICAgICAgbHlfbWVzYWdlcy5wdXNoKGBZb3VyIGZhcm1zIGdyb3dlZCAke2dyb3dlZH0gd2hlYXRgKTtcclxuICAgICAgdmFyIHNhdmVkID0gc3RhdGUud2hlYXQ7XHJcblxyXG4gICAgICB2YXIgbmV3X2FybXkgPSBzdGF0ZS5hcm15O1xyXG4gICAgICB2YXIgbmV3X2dvbGQgPSBzdGF0ZS5nb2xkO1xyXG4gICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApID4gNykge1xyXG4gICAgICAgIHZhciBiYXJiYXJpYW5Bcm15ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApO1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaChgQmFyYmFyaWFucyBhdHRhY2tlZCB5b3Ugd2l0aCBhcm15IG9mICR7YmFyYmFyaWFuQXJteX0gd2FycmlvcnMhYCk7XHJcbiAgICAgICAgaWYgKGJhcmJhcmlhbkFybXkgPiBuZXdfYXJteSApIHtcclxuICAgICAgICAgIGlmIChuZXdfYXJteSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgdG8gYXJteSwgYmFyYmFyaWFucyBraWxsZWQgYWxsIGZhcm1lcnMnKTtcclxuICAgICAgICAgICAgbmV3X2Zhcm1lcnMgPSAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdCYXJiYXJpYW5zIGRlZmVhdGVkIHlvdXIgYXJteSBhbmQga2lsbGVkIGFsbCBzb2xkaWVycycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdCYXJiYXJpYW5zIHRvb2sgYWxsIGdvbGQnKTtcclxuICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyB0b29rIGFsbCB3aGVhdCBpbiBzdG9yYWdlJyk7XHJcbiAgICAgICAgICBuZXdfZ29sZCA9IDA7XHJcbiAgICAgICAgICBuZXdfYXJteSA9IDA7XHJcbiAgICAgICAgICBzYXZlZCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91ciBhcm15IGhhcyBkZWZlYXRlZCBiYXJiYXJpYW5zJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB3YXN0ZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncm93ZWQvMiApO1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaChgV2FyIHJ1aW5lZCB3aGVhdCBmaWVsZHMsICR7d2FzdGVkfSB3aGVhdCBqdXN0IHdhc3RlZCBvbiB0aGUgZmllbGRzYCk7XHJcbiAgICAgICAgZ3Jvd2VkID0gZ3Jvd2VkIC0gd2FzdGVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmV3X2dvbGQgPCBuZXdfYXJteSkge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgbm90IGVub3VnaCBtb25leSB0byBwYXkgeW91ciBhcm15LiBQYXJ0IG9mIGFybXkgcmFuIGF3YXkuJyk7XHJcbiAgICAgICAgbmV3X2FybXkgPSBuZXdfZ29sZDtcclxuICAgICAgfVxyXG4gICAgICBuZXdfZ29sZCA9IG5ld19nb2xkIC0gbmV3X2FybXk7XHJcblxyXG4gICAgICB2YXIgbmV3X3doZWF0ID0gc2F2ZWQgKyBncm93ZWQ7XHJcblxyXG5cclxuICAgICAgaWYgKG5ld193aGVhdCA8IG5ld19mYXJtZXJzKSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSBub3RoaW5nIHRvIGZlZWQgeW91ciBmYXJtZXJzLiBQYXJ0IG9mIGZhcm1lcnMgZGllZCBmcm9tIGh1bmdlci4nKTtcclxuICAgICAgICBuZXdfZmFybWVycyA9IG5ld193aGVhdDtcclxuICAgICAgfVxyXG4gICAgICBuZXdfd2hlYXQgPSBuZXdfd2hlYXQgLSBuZXdfZmFybWVycztcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogc3RhdGUueWVhciArMSxcclxuICAgICAgICBnb2xkOiBuZXdfZ29sZCxcclxuICAgICAgICB3aGVhdDogbmV3X3doZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IG5ld19mYXJtZXJzLFxyXG4gICAgICAgIGFybXk6ICBuZXdfYXJteSxcclxuICAgICAgICBtZXNzYWdlczogbHlfbWVzYWdlc307XHJcbiAgfVxyXG4gIHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuY29uc3QgeyBjcmVhdGVTdG9yZSB9ID0gUmVkdXg7XHJcblxyXG52YXIgc3RvcmUgPSBjcmVhdGVTdG9yZSh0aGVfYnJhaW4pO1xyXG5cclxuY29uc3QgWWVhciA9ICh7IHZhbHVlLCBvbk5leHRZZWFyLCBvbkxlc3NBcm15LCBvbk1vcmVBcm15LCBvblN0b3JhZ2VUb0ZpZWxkLCBvbkZpZWxkVG9TdG9yYWdlIH0pID0+IChcclxuICAgPGRpdj5cclxuICAgPGJ1dHRvbiBvbkNsaWNrPXtvbk5leHRZZWFyfT5OZXh0IHllYXI8L2J1dHRvbj5cclxuICAgPGgxPlllYXIge3ZhbHVlLnllYXJ9PC9oMT5cclxuICAgPGgyPlJlc291cmNlczwvaDI+XHJcbiAgIDxoMz5Hb2xkOiB7dmFsdWUuZ29sZH0gV2hlYXQgaW4gc3RvcmFnZToge3ZhbHVlLndoZWF0fSwgV2lsbCBzb3c6IHt2YWx1ZS5zYXd9PC9oMz5cclxuICAgPGgyPlBlb3BsZTwvaDI+XHJcbiAgIDxoMz5GYXJtZXJzOiB7dmFsdWUuZmFybWVyc30gPC9oMz5cclxuICAgIDxidXR0b24gb25DbGljaz17b25MZXNzQXJteX0+XjwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtvbk1vcmVBcm15fT5WPC9idXR0b24+XHJcbiAgIDxoMz4gQXJteToge3ZhbHVlLmFybXl9PC9oMz5cclxuICAgPGg0PldoYXQgaGFwcGVuZWQgbGFzdCB5ZWFyOjwvaDQ+XHJcbiAgIDx1bD57dmFsdWUubWVzc2FnZXMubWFwKChtZXNzYWdlLCBpbmRleCkgPT5cclxuICAgICAgPGxpIGtleT17aW5kZXh9PlxyXG4gICAgICAgIHttZXNzYWdlfVxyXG4gICAgICA8L2xpPlxyXG4gICAgKX08L3VsPlxyXG4gICA8L2Rpdj5cclxuIClcclxuXHJcblxyXG5jb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgUmVhY3RET00ucmVuZGVyKFxyXG4gICA8WWVhciB2YWx1ZT17c3RvcmUuZ2V0U3RhdGUoKX1cclxuICAgIG9uTmV4dFllYXI9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J05FWFRfWUVBUid9KX1cclxuICAgIG9uTGVzc0FybXk9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J0xFU1NfQVJNWSd9KX1cclxuICAgIG9uTW9yZUFybXk9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J01PUkVfQVJNWSd9KX1cclxuICAgIG9uU3RvcmFnZVRvRmllbGQ9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J1NUT1JBR0VfVE9fRklFTEQnfSl9XHJcbiAgICBvbkZpZWxkVG9TdG9yYWdlPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidGSUVMRF9UT19TVE9SQUdFJ30pfVxyXG4gICAgLz4sXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpXHJcbiAgKTtcclxufVxyXG5cclxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XHJcbiAgc3RvcmUuc3Vic2NyaWJlKHJlbmRlcik7XHJcbiAgcmVuZGVyKCk7XHJcbn1cclxuXHJcbnN0YXJ0KCk7XHJcbiJdfQ==
