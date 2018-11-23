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
      ' '
    ),
    React.createElement(
      'button',
      { onClick: onFieldToStorage },
      '^'
    ),
    React.createElement(
      'h3',
      null,
      'Wheat in storage: ',
      value.wheat
    ),
    React.createElement(
      'button',
      { onClick: onFieldToStorage },
      '^'
    ),
    React.createElement(
      'button',
      { onClick: onStorageToField },
      'V'
    ),
    React.createElement(
      'h3',
      null,
      'Field: ',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL25wZWNoXzAwMC8uYXRvbS9wYWNrYWdlcy9hdG9tLWJhYmVsLWNvbXBpbGVyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxJQUFNLGVBQWUsU0FBZixZQUFlLEdBQU07QUFDdkIsU0FBTyxFQUFDLE1BQU0sQ0FBUCxFQUFVLE1BQUssR0FBZixFQUFvQixPQUFPLEdBQTNCLEVBQWdDLEtBQUssQ0FBckMsRUFBd0MsU0FBUyxHQUFqRCxFQUFzRCxNQUFNLENBQTVELEVBQStELFVBQVUsQ0FBQyxzQkFBRCxDQUF6RSxFQUFQO0FBQ0gsQ0FGRDs7QUFJQSxJQUFNLFlBQVksU0FBWixTQUFZLEdBQW9DO0FBQUEsTUFBbkMsS0FBbUMsdUVBQTNCLGNBQTJCO0FBQUEsTUFBWCxNQUFXOztBQUNwRCxVQUFPLE9BQU8sSUFBZDtBQUNFLFNBQUssa0JBQUw7QUFDRSxVQUFJLE1BQU0sS0FBTixHQUFjLENBQWxCLEVBQXFCO0FBQ2IsZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FBTixHQUFjLENBSFI7QUFJYixlQUFLLE1BQU0sR0FBTixHQUFZLENBSko7QUFLYixtQkFBUyxNQUFNLE9BTEY7QUFNYixnQkFBTSxNQUFNLElBTkM7QUFPYixvQkFBVSxFQVBHLEVBQVA7QUFRUCxPQVRELE1BU087QUFDTCxlQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFLLGtCQUFMO0FBQ0UsVUFBSSxNQUFNLEdBQU4sR0FBWSxDQUFoQixFQUFtQjtBQUNYLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBQU4sR0FBYyxDQUhSO0FBSWIsZUFBSyxNQUFNLEdBQU4sR0FBWSxDQUpKO0FBS2IsbUJBQVMsTUFBTSxPQUxGO0FBTWIsZ0JBQU0sTUFBTSxJQU5DO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUwsU0FBSyxXQUFMO0FBQ0UsVUFBSSxNQUFNLElBQU4sR0FBYSxDQUFqQixFQUFvQjtBQUNaLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBSEE7QUFJYixlQUFLLE1BQU0sR0FKRTtBQUtiLG1CQUFTLE1BQU0sT0FBTixHQUFnQixDQUxaO0FBTWIsZ0JBQU0sTUFBTSxJQUFOLEdBQWEsQ0FOTjtBQU9iLG9CQUFVLEVBUEcsRUFBUDtBQVFQLE9BVEQsTUFTTztBQUNMLGVBQU8sS0FBUDtBQUNEOztBQUVILFNBQUssV0FBTDtBQUNFLFVBQUksTUFBTSxPQUFOLEdBQWdCLENBQXBCLEVBQXVCO0FBQ2YsZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FIQTtBQUliLGVBQUssTUFBTSxHQUpFO0FBS2IsbUJBQVMsTUFBTSxPQUFOLEdBQWdCLENBTFo7QUFNYixnQkFBTSxNQUFNLElBQU4sR0FBYSxDQU5OO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUgsU0FBSyxXQUFMO0FBQ0UsVUFBSSxhQUFhLEVBQWpCO0FBQ0EsVUFBSSxjQUFjLE1BQU0sT0FBeEI7QUFDQSxVQUFJLGVBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsbUJBQVcsSUFBWCxDQUFnQix5REFBaEI7QUFDQSxlQUFPO0FBQ0wsZ0JBQU0sTUFBTSxJQURQO0FBRUwsZ0JBQUssTUFBTSxJQUZOO0FBR0wsaUJBQU8sTUFBTSxLQUhSO0FBSUwsZUFBSyxNQUFNLEdBSk47QUFLTCxtQkFBUyxNQUFNLE9BTFY7QUFNTCxnQkFBTSxNQUFNLElBTlA7QUFPTCxvQkFBVSxVQVBMLEVBQVA7QUFRRDtBQUNELFVBQUksZUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsQ0FBM0IsQ0FBeEI7QUFDQSxVQUFJLGVBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsbUJBQVcsSUFBWCxDQUFnQixpQ0FBaEI7QUFDRCxPQUZELE1BRU8sSUFBSSxlQUFlLENBQW5CLEVBQXNCO0FBQzNCLG1CQUFXLElBQVgsQ0FBZ0IsZ0NBQWhCO0FBQ0Q7QUFDRCxVQUFJLFNBQVMsTUFBTSxHQUFOLEdBQVksWUFBekI7QUFDQSxpQkFBVyxJQUFYLHdCQUFxQyxNQUFyQztBQUNBLFVBQUksUUFBUSxNQUFNLEtBQWxCOztBQUVBLFVBQUksV0FBVyxNQUFNLElBQXJCO0FBQ0EsVUFBSSxXQUFXLE1BQU0sSUFBckI7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixJQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxZQUFJLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBcEI7QUFDQSxtQkFBVyxJQUFYLDJDQUF3RCxhQUF4RDtBQUNBLFlBQUksZ0JBQWdCLFFBQXBCLEVBQStCO0FBQzdCLGNBQUksWUFBWSxDQUFoQixFQUFtQjtBQUNqQix1QkFBVyxJQUFYLENBQWdCLGlEQUFoQjtBQUNBLDBCQUFjLENBQWQ7QUFDRCxXQUhELE1BR087QUFDTCx1QkFBVyxJQUFYLENBQWdCLHVEQUFoQjtBQUNEO0FBQ0QscUJBQVcsSUFBWCxDQUFnQiwwQkFBaEI7QUFDQSxxQkFBVyxJQUFYLENBQWdCLHNDQUFoQjtBQUNBLHFCQUFXLENBQVg7QUFDQSxxQkFBVyxDQUFYO0FBQ0Esa0JBQVEsQ0FBUjtBQUNELFNBWkQsTUFZTztBQUNMLHFCQUFXLElBQVgsQ0FBZ0IsbUNBQWhCO0FBQ0Q7QUFDRCxZQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLE1BQWhCLEdBQXVCLENBQWxDLENBQWI7QUFDQSxtQkFBVyxJQUFYLCtCQUE0QyxNQUE1QztBQUNBLGlCQUFTLFNBQVMsTUFBbEI7QUFDRDs7QUFFRCxVQUFJLFdBQVcsUUFBZixFQUF5QjtBQUN2QixtQkFBVyxJQUFYLENBQWdCLG9FQUFoQjtBQUNBLG1CQUFXLFFBQVg7QUFDRDtBQUNELGlCQUFXLFdBQVcsUUFBdEI7O0FBRUEsVUFBSSxZQUFZLFFBQVEsTUFBeEI7O0FBR0EsVUFBSSxZQUFZLFdBQWhCLEVBQTZCO0FBQzNCLG1CQUFXLElBQVgsQ0FBZ0IsMEVBQWhCO0FBQ0Esc0JBQWMsU0FBZDtBQUNEO0FBQ0Qsa0JBQVksWUFBWSxXQUF4Qjs7QUFFQSxhQUFPO0FBQ0wsY0FBTSxNQUFNLElBQU4sR0FBWSxDQURiO0FBRUwsY0FBTSxRQUZEO0FBR0wsZUFBTyxTQUhGO0FBSUwsYUFBSyxNQUFNLEdBSk47QUFLTCxpQkFBUyxXQUxKO0FBTUwsY0FBTyxRQU5GO0FBT0wsa0JBQVUsVUFQTCxFQUFQO0FBekhKO0FBa0lBLFNBQU8sS0FBUDtBQUNELENBcElEOzthQXNJd0IsSztJQUFoQixXLFVBQUEsVzs7O0FBRVIsSUFBSSxRQUFRLFlBQVksU0FBWixDQUFaOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxNQUFHLEtBQUgsUUFBRyxLQUFIO0FBQUEsTUFBVSxVQUFWLFFBQVUsVUFBVjtBQUFBLE1BQXNCLFVBQXRCLFFBQXNCLFVBQXRCO0FBQUEsTUFBa0MsVUFBbEMsUUFBa0MsVUFBbEM7QUFBQSxNQUE4QyxnQkFBOUMsUUFBOEMsZ0JBQTlDO0FBQUEsTUFBZ0UsZ0JBQWhFLFFBQWdFLGdCQUFoRTtBQUFBLFNBQ1Y7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLFFBQVEsU0FBUyxVQUFqQjtBQUFBO0FBQUEsS0FEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQVUsWUFBTTtBQUFoQixLQUZBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUhBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBVyxZQUFNLElBQWpCO0FBQUE7QUFBQSxLQUpBO0FBS0E7QUFBQTtBQUFBLFFBQVEsU0FBUyxnQkFBakI7QUFBQTtBQUFBLEtBTEE7QUFNRDtBQUFBO0FBQUE7QUFBQTtBQUF1QixZQUFNO0FBQTdCLEtBTkM7QUFPRTtBQUFBO0FBQUEsUUFBUSxTQUFTLGdCQUFqQjtBQUFBO0FBQUEsS0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFRLFNBQVMsZ0JBQWpCO0FBQUE7QUFBQSxLQVJGO0FBU0M7QUFBQTtBQUFBO0FBQUE7QUFBWSxZQUFNO0FBQWxCLEtBVEQ7QUFVQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBVkE7QUFXQTtBQUFBO0FBQUE7QUFBQTtBQUFjLFlBQU0sT0FBcEI7QUFBQTtBQUFBLEtBWEE7QUFZQztBQUFBO0FBQUEsUUFBUSxTQUFTLFVBQWpCO0FBQUE7QUFBQSxLQVpEO0FBYUM7QUFBQTtBQUFBLFFBQVEsU0FBUyxVQUFqQjtBQUFBO0FBQUEsS0FiRDtBQWNBO0FBQUE7QUFBQTtBQUFBO0FBQVksWUFBTTtBQUFsQixLQWRBO0FBZUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQWZBO0FBZ0JBO0FBQUE7QUFBQTtBQUFLLFlBQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsVUFBQyxPQUFELEVBQVUsS0FBVjtBQUFBLGVBQ3JCO0FBQUE7QUFBQSxZQUFJLEtBQUssS0FBVDtBQUNHO0FBREgsU0FEcUI7QUFBQSxPQUFuQjtBQUFMO0FBaEJBLEdBRFU7QUFBQSxDQUFiOztBQTBCQSxJQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsV0FBUyxNQUFULENBQ0Msb0JBQUMsSUFBRCxJQUFNLE9BQU8sTUFBTSxRQUFOLEVBQWI7QUFDQyxnQkFBWTtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLFdBQU4sRUFBZixDQUFMO0FBQUEsS0FEYjtBQUVDLGdCQUFZO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssV0FBTixFQUFmLENBQUw7QUFBQSxLQUZiO0FBR0MsZ0JBQVk7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxXQUFOLEVBQWYsQ0FBTDtBQUFBLEtBSGI7QUFJQyxzQkFBa0I7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxrQkFBTixFQUFmLENBQUw7QUFBQSxLQUpuQjtBQUtDLHNCQUFrQjtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLGtCQUFOLEVBQWYsQ0FBTDtBQUFBO0FBTG5CLElBREQsRUFRRSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FSRjtBQVVELENBWEQ7O0FBYUEsSUFBTSxRQUFRLFNBQVIsS0FBUSxHQUFNO0FBQ2xCLFFBQU0sU0FBTixDQUFnQixNQUFoQjtBQUNBO0FBQ0QsQ0FIRDs7QUFLQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCBjcmVhdGVfd29ybGQgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge3llYXI6IDAsIGdvbGQ6MTAwLCB3aGVhdDogMTAwLCBzYXc6IDEsIGZhcm1lcnM6IDEwMCwgYXJteTogMCwgbWVzc2FnZXM6IFsnWW91IGJlY2FtZSB0aGUga2luZyEnXX07XHJcbn1cclxuXHJcbmNvbnN0IHRoZV9icmFpbiA9IChzdGF0ZSA9IGNyZWF0ZV93b3JsZCgpLCBhY3Rpb24pID0+IHtcclxuICBzd2l0Y2goYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ1NUT1JBR0VfVE9fRklFTEQnOlxyXG4gICAgICBpZiAoc3RhdGUud2hlYXQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQgLSAxLFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3ICsgMSxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgbWVzc2FnZXM6IFtdfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhc2UgJ0ZJRUxEX1RPX1NUT1JBR0UnOlxyXG4gICAgICAgIGlmIChzdGF0ZS5zYXcgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCArIDEsXHJcbiAgICAgICAgICBzYXc6IHN0YXRlLnNhdyAtIDEsXHJcbiAgICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgICAgYXJteTogc3RhdGUuYXJteSxcclxuICAgICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgY2FzZSAnTEVTU19BUk1ZJzpcclxuICAgICAgaWYgKHN0YXRlLmFybXkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyArIDEsXHJcbiAgICAgICAgYXJteTogc3RhdGUuYXJteSAtIDEsXHJcbiAgICAgICAgbWVzc2FnZXM6IFtdfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICBjYXNlICdNT1JFX0FSTVknOlxyXG4gICAgICBpZiAoc3RhdGUuZmFybWVycyA+IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzIC0gMSxcclxuICAgICAgICBhcm15OiBzdGF0ZS5hcm15ICsgMSxcclxuICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG5cclxuICAgIGNhc2UgJ05FWFRfWUVBUic6XHJcbiAgICAgIHZhciBseV9tZXNhZ2VzID0gW107XHJcbiAgICAgIHZhciBuZXdfZmFybWVycyA9IHN0YXRlLmZhcm1lcnM7XHJcbiAgICAgIGlmIChuZXdfZmFybWVycyA9PSAwKSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSBubyBwZW9wbGUgdG8gcnVsZSBhbnkgbW9yZS4gVGhpcyBpcyB0aGUgZW5kLi4uJyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMsXHJcbiAgICAgICAgICBhcm15OiBzdGF0ZS5hcm15LFxyXG4gICAgICAgICAgbWVzc2FnZXM6IGx5X21lc2FnZXN9O1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwcm9kdWN0aXZpdHkgPSAoMyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpKTtcclxuICAgICAgaWYgKHByb2R1Y3Rpdml0eSA+IDYpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0l0IHdhcyBhIGdvb2QgeWVhciBmb3IgZmFybWVycy4nKTtcclxuICAgICAgfSBlbHNlIGlmIChwcm9kdWN0aXZpdHkgPCA1KSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdJdCB3YXMgYSBiYWQgeWVhciBmb3IgZmFybWVycy4nKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgZ3Jvd2VkID0gc3RhdGUuc2F3ICogcHJvZHVjdGl2aXR5O1xyXG4gICAgICBseV9tZXNhZ2VzLnB1c2goYFlvdXIgZmFybXMgZ3Jvd2VkICR7Z3Jvd2VkfSB3aGVhdGApO1xyXG4gICAgICB2YXIgc2F2ZWQgPSBzdGF0ZS53aGVhdDtcclxuXHJcbiAgICAgIHZhciBuZXdfYXJteSA9IHN0YXRlLmFybXk7XHJcbiAgICAgIHZhciBuZXdfZ29sZCA9IHN0YXRlLmdvbGQ7XHJcbiAgICAgIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgPiA3KSB7XHJcbiAgICAgICAgdmFyIGJhcmJhcmlhbkFybXkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCk7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKGBCYXJiYXJpYW5zIGF0dGFja2VkIHlvdSB3aXRoIGFybXkgb2YgJHtiYXJiYXJpYW5Bcm15fSB3YXJyaW9ycyFgKTtcclxuICAgICAgICBpZiAoYmFyYmFyaWFuQXJteSA+IG5ld19hcm15ICkge1xyXG4gICAgICAgICAgaWYgKG5ld19hcm15ID09IDApIHtcclxuICAgICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSB0byBhcm15LCBiYXJiYXJpYW5zIGtpbGxlZCBhbGwgZmFybWVycycpO1xyXG4gICAgICAgICAgICBuZXdfZmFybWVycyA9IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgZGVmZWF0ZWQgeW91ciBhcm15IGFuZCBraWxsZWQgYWxsIHNvbGRpZXJzJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgdG9vayBhbGwgZ29sZCcpO1xyXG4gICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdCYXJiYXJpYW5zIHRvb2sgYWxsIHdoZWF0IGluIHN0b3JhZ2UnKTtcclxuICAgICAgICAgIG5ld19nb2xkID0gMDtcclxuICAgICAgICAgIG5ld19hcm15ID0gMDtcclxuICAgICAgICAgIHNhdmVkID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3VyIGFybXkgaGFzIGRlZmVhdGVkIGJhcmJhcmlhbnMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHdhc3RlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyb3dlZC8yICk7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKGBXYXIgcnVpbmVkIHdoZWF0IGZpZWxkcywgJHt3YXN0ZWR9IHdoZWF0IGp1c3Qgd2FzdGVkIG9uIHRoZSBmaWVsZHNgKTtcclxuICAgICAgICBncm93ZWQgPSBncm93ZWQgLSB3YXN0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChuZXdfZ29sZCA8IG5ld19hcm15KSB7XHJcbiAgICAgICAgbHlfbWVzYWdlcy5wdXNoKCdZb3UgaGF2ZSBub3QgZW5vdWdoIG1vbmV5IHRvIHBheSB5b3VyIGFybXkuIFBhcnQgb2YgYXJteSByYW4gYXdheS4nKTtcclxuICAgICAgICBuZXdfYXJteSA9IG5ld19nb2xkO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld19nb2xkID0gbmV3X2dvbGQgLSBuZXdfYXJteTtcclxuXHJcbiAgICAgIHZhciBuZXdfd2hlYXQgPSBzYXZlZCArIGdyb3dlZDtcclxuXHJcblxyXG4gICAgICBpZiAobmV3X3doZWF0IDwgbmV3X2Zhcm1lcnMpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vdGhpbmcgdG8gZmVlZCB5b3VyIGZhcm1lcnMuIFBhcnQgb2YgZmFybWVycyBkaWVkIGZyb20gaHVuZ2VyLicpO1xyXG4gICAgICAgIG5ld19mYXJtZXJzID0gbmV3X3doZWF0O1xyXG4gICAgICB9XHJcbiAgICAgIG5ld193aGVhdCA9IG5ld193aGVhdCAtIG5ld19mYXJtZXJzO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyICsxLFxyXG4gICAgICAgIGdvbGQ6IG5ld19nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBuZXdfd2hlYXQsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcsXHJcbiAgICAgICAgZmFybWVyczogbmV3X2Zhcm1lcnMsXHJcbiAgICAgICAgYXJteTogIG5ld19hcm15LFxyXG4gICAgICAgIG1lc3NhZ2VzOiBseV9tZXNhZ2VzfTtcclxuICB9XHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG5jb25zdCB7IGNyZWF0ZVN0b3JlIH0gPSBSZWR1eDtcclxuXHJcbnZhciBzdG9yZSA9IGNyZWF0ZVN0b3JlKHRoZV9icmFpbik7XHJcblxyXG5jb25zdCBZZWFyID0gKHsgdmFsdWUsIG9uTmV4dFllYXIsIG9uTGVzc0FybXksIG9uTW9yZUFybXksIG9uU3RvcmFnZVRvRmllbGQsIG9uRmllbGRUb1N0b3JhZ2UgfSkgPT4gKFxyXG4gICA8ZGl2PlxyXG4gICA8YnV0dG9uIG9uQ2xpY2s9e29uTmV4dFllYXJ9Pk5leHQgeWVhcjwvYnV0dG9uPlxyXG4gICA8aDE+WWVhciB7dmFsdWUueWVhcn08L2gxPlxyXG4gICA8aDI+UmVzb3VyY2VzPC9oMj5cclxuICAgPGgzPkdvbGQ6IHt2YWx1ZS5nb2xkfSA8L2gzPlxyXG4gICA8YnV0dG9uIG9uQ2xpY2s9e29uRmllbGRUb1N0b3JhZ2V9Pl48L2J1dHRvbj5cclxuICA8aDM+V2hlYXQgaW4gc3RvcmFnZToge3ZhbHVlLndoZWF0fTwvaDM+XHJcbiAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkZpZWxkVG9TdG9yYWdlfT5ePC9idXR0b24+XHJcbiAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvblN0b3JhZ2VUb0ZpZWxkfT5WPC9idXR0b24+XHJcbiAgICA8aDM+RmllbGQ6IHt2YWx1ZS5zYXd9PC9oMz5cclxuICAgPGgyPlBlb3BsZTwvaDI+XHJcbiAgIDxoMz5GYXJtZXJzOiB7dmFsdWUuZmFybWVyc30gPC9oMz5cclxuICAgIDxidXR0b24gb25DbGljaz17b25MZXNzQXJteX0+XjwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtvbk1vcmVBcm15fT5WPC9idXR0b24+XHJcbiAgIDxoMz4gQXJteToge3ZhbHVlLmFybXl9PC9oMz5cclxuICAgPGg0PldoYXQgaGFwcGVuZWQgbGFzdCB5ZWFyOjwvaDQ+XHJcbiAgIDx1bD57dmFsdWUubWVzc2FnZXMubWFwKChtZXNzYWdlLCBpbmRleCkgPT5cclxuICAgICAgPGxpIGtleT17aW5kZXh9PlxyXG4gICAgICAgIHttZXNzYWdlfVxyXG4gICAgICA8L2xpPlxyXG4gICAgKX08L3VsPlxyXG4gICA8L2Rpdj5cclxuIClcclxuXHJcblxyXG5jb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgUmVhY3RET00ucmVuZGVyKFxyXG4gICA8WWVhciB2YWx1ZT17c3RvcmUuZ2V0U3RhdGUoKX1cclxuICAgIG9uTmV4dFllYXI9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J05FWFRfWUVBUid9KX1cclxuICAgIG9uTGVzc0FybXk9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J0xFU1NfQVJNWSd9KX1cclxuICAgIG9uTW9yZUFybXk9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J01PUkVfQVJNWSd9KX1cclxuICAgIG9uU3RvcmFnZVRvRmllbGQ9eygpID0+c3RvcmUuZGlzcGF0Y2goe3R5cGU6J1NUT1JBR0VfVE9fRklFTEQnfSl9XHJcbiAgICBvbkZpZWxkVG9TdG9yYWdlPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidGSUVMRF9UT19TVE9SQUdFJ30pfVxyXG4gICAgLz4sXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpXHJcbiAgKTtcclxufVxyXG5cclxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XHJcbiAgc3RvcmUuc3Vic2NyaWJlKHJlbmRlcik7XHJcbiAgcmVuZGVyKCk7XHJcbn1cclxuXHJcbnN0YXJ0KCk7XHJcbiJdfQ==
