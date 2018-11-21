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
          messages: state.mesages };
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
          messages: state.mesages };
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL01pY2hhZWwvLmF0b20vcGFja2FnZXMvYXRvbS1iYWJlbC1jb21waWxlci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxHQUFNO0FBQ3ZCLFNBQU8sRUFBQyxNQUFNLENBQVAsRUFBVSxNQUFLLEdBQWYsRUFBb0IsT0FBTyxHQUEzQixFQUFnQyxLQUFLLENBQXJDLEVBQXdDLFNBQVMsR0FBakQsRUFBc0QsTUFBTSxDQUE1RCxFQUErRCxVQUFVLENBQUMsc0JBQUQsQ0FBekUsRUFBUDtBQUNILENBRkQ7O0FBSUEsSUFBTSxZQUFZLFNBQVosU0FBWSxHQUFvQztBQUFBLE1BQW5DLEtBQW1DLHVFQUEzQixjQUEyQjtBQUFBLE1BQVgsTUFBVzs7QUFDcEQsVUFBTyxPQUFPLElBQWQ7QUFDRSxTQUFLLFdBQUw7QUFDRSxVQUFJLE1BQU0sSUFBTixHQUFhLENBQWpCLEVBQW9CO0FBQ1osZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FIQTtBQUliLGVBQUssTUFBTSxHQUpFO0FBS2IsbUJBQVMsTUFBTSxPQUFOLEdBQWdCLENBTFo7QUFNYixnQkFBTSxNQUFNLElBQU4sR0FBYSxDQU5OO0FBT2Isb0JBQVUsTUFBTSxPQVBILEVBQVA7QUFRUCxPQVRELE1BU087QUFDTCxlQUFPLEtBQVA7QUFDRDs7QUFFSCxTQUFLLFdBQUw7QUFDRSxVQUFJLE1BQU0sT0FBTixHQUFnQixDQUFwQixFQUF1QjtBQUNmLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBSEE7QUFJYixlQUFLLE1BQU0sR0FKRTtBQUtiLG1CQUFTLE1BQU0sT0FBTixHQUFnQixDQUxaO0FBTWIsZ0JBQU0s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QyxNQUFLLFdBQU4sRUFBZixDQUFMO0FBQUEsS0FGYjtBQUdDLGdCQUFZO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssV0FBTixFQUFmLENBQUw7QUFBQTtBQUhiLElBREQsRUFNRSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FORjtBQVFELENBVEQ7O0FBV0EsSUFBTSxRQUFRLFNBQVIsS0FBUSxHQUFNO0FBQ2xCLFFBQU0sU0FBTixDQUFnQixNQUFoQjtBQUNBO0FBQ0QsQ0FIRDs7QUFLQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCBjcmVhdGVfd29ybGQgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge3llYXI6IDAsIGdvbGQ6MTAwLCB3aGVhdDogMTAwLCBzYXc6IDEsIGZhcm1lcnM6IDEwMCwgYXJteTogMCwgbWVzc2FnZXM6IFsnWW91IGJlY2FtZSB0aGUga2luZyEnXX07XHJcbn1cclxuXHJcbmNvbnN0IHRoZV9icmFpbiA9IChzdGF0ZSA9IGNyZWF0ZV93b3JsZCgpLCBhY3Rpb24pID0+IHtcclxuICBzd2l0Y2goYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ0xFU1NfQVJNWSc6XHJcbiAgICAgIGlmIChzdGF0ZS5hcm15ID4gMCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMgKyAxLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXkgLSAxLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBzdGF0ZS5tZXNhZ2VzfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICBjYXNlICdNT1JFX0FSTVknOlxyXG4gICAgICBpZiAoc3RhdGUuZmFybWVycyA+IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzIC0gMSxcclxuICAgICAgICBhcm15OiBzdGF0ZS5hcm15ICsgMSxcclxuICAgICAgICBtZXNzYWdlczogc3RhdGUubWVzYWdlc307XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSAnTkVYVF9ZRUFSJzpcclxuICAgICAgdmFyIGx5X21lc2FnZXMgPSBbXTtcclxuICAgICAgdmFyIG5ld19mYXJtZXJzID0gc3RhdGUuZmFybWVycztcclxuICAgICAgaWYgKG5ld19mYXJtZXJzID09IDApIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vIHBlb3BsZSB0byBydWxlIGFueSBtb3JlLiBUaGlzIGlzIHRoZSBlbmQuLi4nKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyxcclxuICAgICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgICBtZXNzYWdlczogbHlfbWVzYWdlc307XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHByb2R1Y3Rpdml0eSA9ICgzICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSkpO1xyXG4gICAgICBpZiAocHJvZHVjdGl2aXR5ID4gNikge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnSXQgd2FzIGEgZ29vZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb2R1Y3Rpdml0eSA8IDUpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0l0IHdhcyBhIGJhZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBncm93ZWQgPSBzdGF0ZS5zYXcgKiBwcm9kdWN0aXZpdHk7XHJcbiAgICAgIGx5X21lc2FnZXMucHVzaChgWW91ciBmYXJtcyBncm93ZWQgJHtncm93ZWR9IHdoZWF0YCk7XHJcbiAgICAgIHZhciBzYXZlZCA9IHN0YXRlLndoZWF0O1xyXG5cclxuICAgICAgdmFyIG5ld19hcm15ID0gc3RhdGUuYXJteTtcclxuICAgICAgdmFyIG5ld19nb2xkID0gc3RhdGUuZ29sZDtcclxuICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSA+IDcpIHtcclxuICAgICAgICB2YXIgYmFyYmFyaWFuQXJteSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYEJhcmJhcmlhbnMgYXR0YWNrZWQgeW91IHdpdGggYXJteSBvZiAke2JhcmJhcmlhbkFybXl9IHdhcnJpb3JzIWApO1xyXG4gICAgICAgIGlmIChiYXJiYXJpYW5Bcm15ID4gbmV3X2FybXkgKSB7XHJcbiAgICAgICAgICBpZiAobmV3X2FybXkgPT0gMCkge1xyXG4gICAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIHRvIGFybXksIGJhcmJhcmlhbnMga2lsbGVkIGFsbCBmYXJtZXJzJyk7XHJcbiAgICAgICAgICAgIG5ld19mYXJtZXJzID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyBkZWZlYXRlZCB5b3VyIGFybXkgYW5kIGtpbGxlZCBhbGwgc29sZGllcnMnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyB0b29rIGFsbCBnb2xkJyk7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgdG9vayBhbGwgd2hlYXQgaW4gc3RvcmFnZScpO1xyXG4gICAgICAgICAgbmV3X2dvbGQgPSAwO1xyXG4gICAgICAgICAgbmV3X2FybXkgPSAwO1xyXG4gICAgICAgICAgc2F2ZWQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdXIgYXJteSBoYXMgZGVmZWF0ZWQgYmFyYmFyaWFucycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgd2FzdGVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3Jvd2VkLzIgKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYFdhciBydWluZWQgd2hlYXQgZmllbGRzLCAke3dhc3RlZH0gd2hlYXQganVzdCB3YXN0ZWQgb24gdGhlIGZpZWxkc2ApO1xyXG4gICAgICAgIGdyb3dlZCA9IGdyb3dlZCAtIHdhc3RlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5ld19nb2xkIDwgbmV3X2FybXkpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vdCBlbm91Z2ggbW9uZXkgdG8gcGF5IHlvdXIgYXJteS4gUGFydCBvZiBhcm15IHJhbiBhd2F5LicpO1xyXG4gICAgICAgIG5ld19hcm15ID0gbmV3X2dvbGQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X2dvbGQgPSBuZXdfZ29sZCAtIG5ld19hcm15O1xyXG5cclxuICAgICAgdmFyIG5ld193aGVhdCA9IHNhdmVkICsgZ3Jvd2VkO1xyXG5cclxuXHJcbiAgICAgIGlmIChuZXdfd2hlYXQgPCBuZXdfZmFybWVycykge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgbm90aGluZyB0byBmZWVkIHlvdXIgZmFybWVycy4gUGFydCBvZiBmYXJtZXJzIGRpZWQgZnJvbSBodW5nZXIuJyk7XHJcbiAgICAgICAgbmV3X2Zhcm1lcnMgPSBuZXdfd2hlYXQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X3doZWF0ID0gbmV3X3doZWF0IC0gbmV3X2Zhcm1lcnM7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIgKzEsXHJcbiAgICAgICAgZ29sZDogbmV3X2dvbGQsXHJcbiAgICAgICAgd2hlYXQ6IG5ld193aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBuZXdfZmFybWVycyxcclxuICAgICAgICBhcm15OiAgbmV3X2FybXksXHJcbiAgICAgICAgbWVzc2FnZXM6IGx5X21lc2FnZXN9O1xyXG4gIH1cclxuICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbmNvbnN0IHsgY3JlYXRlU3RvcmUgfSA9IFJlZHV4O1xyXG5cclxudmFyIHN0b3JlID0gY3JlYXRlU3RvcmUodGhlX2JyYWluKTtcclxuXHJcbmNvbnN0IFllYXIgPSAoeyB2YWx1ZSwgb25OZXh0WWVhciwgb25MZXNzQXJteSwgb25Nb3JlQXJteSB9KSA9PiAoXHJcbiAgIDxkaXY+XHJcbiAgIDxidXR0b24gb25DbGljaz17b25OZXh0WWVhcn0+TmV4dCB5ZWFyPC9idXR0b24+XHJcbiAgIDxoMT5ZZWFyIHt2YWx1ZS55ZWFyfTwvaDE+XHJcbiAgIDxoMj5SZXNvdXJjZXM8L2gyPlxyXG4gICA8aDM+R29sZDoge3ZhbHVlLmdvbGR9IFdoZWF0IGluIHN0b3JhZ2U6IHt2YWx1ZS53aGVhdH0sIFdpbGwgc293OiB7dmFsdWUuc2F3fTwvaDM+XHJcbiAgIDxoMj5QZW9wbGU8L2gyPlxyXG4gICA8aDM+RmFybWVyczoge3ZhbHVlLmZhcm1lcnN9IDwvaDM+XHJcbiAgICA8YnV0dG9uIG9uQ2xpY2s9e29uTGVzc0FybXl9Pl48L2J1dHRvbj5cclxuICAgIDxidXR0b24gb25DbGljaz17b25Nb3JlQXJteX0+VjwvYnV0dG9uPlxyXG4gICA8aDM+IEFybXk6IHt2YWx1ZS5hcm15fTwvaDM+XHJcbiAgIDxoND5XaGF0IGhhcHBlbmVkIGxhc3QgeWVhcjo8L2g0PlxyXG4gICA8dWw+e3ZhbHVlLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+XHJcbiAgICAgIDxsaSBrZXk9e2luZGV4fT5cclxuICAgICAgICB7bWVzc2FnZX1cclxuICAgICAgPC9saT5cclxuICAgICl9PC91bD5cclxuICAgPC9kaXY+XHJcbiApXHJcblxyXG5cclxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xyXG4gIFJlYWN0RE9NLnJlbmRlcihcclxuICAgPFllYXIgdmFsdWU9e3N0b3JlLmdldFN0YXRlKCl9XHJcbiAgICBvbk5leHRZZWFyPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidORVhUX1lFQVInfSl9XHJcbiAgICBvbkxlc3NBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidMRVNTX0FSTVknfSl9XHJcbiAgICBvbk1vcmVBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidNT1JFX0FSTVknfSl9XHJcbiAgICAvPixcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JylcclxuICApO1xyXG59XHJcblxyXG5jb25zdCBzdGFydCA9ICgpID0+IHtcclxuICBzdG9yZS5zdWJzY3JpYmUocmVuZGVyKTtcclxuICByZW5kZXIoKTtcclxufVxyXG5cclxuc3RhcnQoKTtcclxuIl19
