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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL25wZWNoXzAwMC8uYXRvbS9wYWNrYWdlcy9hdG9tLWJhYmVsLWNvbXBpbGVyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxJQUFNLGVBQWUsU0FBZixZQUFlLEdBQU07QUFDdkIsU0FBTyxFQUFDLE1BQU0sQ0FBUCxFQUFVLE1BQUssR0FBZixFQUFvQixPQUFPLEdBQTNCLEVBQWdDLEtBQUssQ0FBckMsRUFBd0MsU0FBUyxHQUFqRCxFQUFzRCxNQUFNLENBQTVELEVBQStELFVBQVUsQ0FBQyxzQkFBRCxDQUF6RSxFQUFQO0FBQ0gsQ0FGRDs7QUFJQSxJQUFNLFlBQVksU0FBWixTQUFZLEdBQW9DO0FBQUEsTUFBbkMsS0FBbUMsdUVBQTNCLGNBQTJCO0FBQUEsTUFBWCxNQUFXOztBQUNwRCxVQUFPLE9BQU8sSUFBZDtBQUNFLFNBQUssa0JBQUw7QUFDRSxVQUFJLE1BQU0sS0FBTixHQUFjLENBQWxCLEVBQXFCO0FBQ2IsZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FBTixHQUFjLENBSFI7QUFJYixlQUFLLE1BQU0sR0FBTixHQUFZLENBSko7QUFLYixtQkFBUyxNQUFNLE9BTEY7QUFNYixnQkFBTSxNQUFNLElBTkM7QUFPYixvQkFBVSxFQVBHLEVBQVA7QUFRUCxPQVRELE1BU087QUFDTCxlQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFLLGtCQUFMO0FBQ0UsVUFBSSxNQUFNLEdBQU4sR0FBWSxDQUFoQixFQUFtQjtBQUNYLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBQU4sR0FBYyxDQUhSO0FBSWIsZUFBSyxNQUFNLEdBQU4sR0FBWSxDQUpKO0FBS2IsbUJBQVMsTUFBTSxPQUxGO0FBTWIsZ0JBQU0sTUFBTSxJQU5DO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUwsU0FBSyxXQUFMO0FBQ0UsVUFBSSxNQUFNLElBQU4sR0FBYSxDQUFqQixFQUFvQjtBQUNaLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixnQkFBSyxNQUFNLElBRkU7QUFHYixpQkFBTyxNQUFNLEtBSEE7QUFJYixlQUFLLE1BQU0sR0FKRTtBQUtiLG1CQUFTLE1BQU0sT0FBTixHQUFnQixDQUxaO0FBTWIsZ0JBQU0sTUFBTSxJQUFOLEdBQWEsQ0FOTjtBQU9iLG9CQUFVLEVBUEcsRUFBUDtBQVFQLE9BVEQsTUFTTztBQUNMLGVBQU8sS0FBUDtBQUNEOztBQUVILFNBQUssV0FBTDtBQUNFLFVBQUksTUFBTSxPQUFOLEdBQWdCLENBQXBCLEVBQXVCO0FBQ2YsZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGdCQUFLLE1BQU0sSUFGRTtBQUdiLGlCQUFPLE1BQU0sS0FIQTtBQUliLGVBQUssTUFBTSxHQUpFO0FBS2IsbUJBQVMsTUFBTSxPQUFOLEdBQWdCLENBTFo7QUFNYixnQkFBTSxNQUFNLElBQU4sR0FBYSxDQU5OO0FBT2Isb0JBQVUsRUFQRyxFQUFQO0FBUVAsT0FURCxNQVNPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUgsU0FBSyxXQUFMO0FBQ0UsVUFBSSxhQUFhLEVBQWpCO0FBQ0EsVUFBSSxjQUFjLE1BQU0sT0FBeEI7QUFDQSxVQUFJLGVBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsbUJBQVcsSUFBWCxDQUFnQix5REFBaEI7QUFDQSxlQUFPO0FBQ0wsZ0JBQU0sTUFBTSxJQURQO0FBRUwsZ0JBQUssTUFBTSxJQUZOO0FBR0wsaUJBQU8sTUFBTSxLQUhSO0FBSUwsZUFBSyxNQUFNLEdBSk47QUFLTCxtQkFBUyxNQUFNLE9BTFY7QUFNTCxnQkFBTSxNQUFNLElBTlA7QUFPTCxvQkFBVSxVQVBMLEVBQVA7QUFRRDtBQUNELFVBQUksZUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsQ0FBM0IsQ0FBeEI7QUFDQSxVQUFJLGVBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsbUJBQVcsSUFBWCxDQUFnQixpQ0FBaEI7QUFDRCxPQUZELE1BRU8sSUFBSSxlQUFlLENBQW5CLEVBQXNCO0FBQzNCLG1CQUFXLElBQVgsQ0FBZ0IsZ0NBQWhCO0FBQ0Q7QUFDRCxVQUFJLFNBQVMsTUFBTSxHQUFOLEdBQVksWUFBekI7QUFDQSxpQkFBVyxJQUFYLHdCQUFxQyxNQUFyQztBQUNBLFVBQUksUUFBUSxNQUFNLEtBQWxCOztBQUVBLFVBQUksV0FBVyxNQUFNLElBQXJCO0FBQ0EsVUFBSSxXQUFXLE1BQU0sSUFBckI7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixJQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxZQUFJLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBcEI7QUFDQSxtQkFBVyxJQUFYLDJDQUF3RCxhQUF4RDtBQUNBLFlBQUksZ0JBQWdCLFFBQXBCLEVBQStCO0FBQzdCLGNBQUksWUFBWSxDQUFoQixFQUFtQjtBQUNqQix1QkFBVyxJQUFYLENBQWdCLGlEQUFoQjtBQUNBLDBCQUFjLENBQWQ7QUFDRCxXQUhELE1BR087QUFDTCx1QkFBVyxJQUFYLENBQWdCLHVEQUFoQjtBQUNEO0FBQ0QscUJBQVcsSUFBWCxDQUFnQiwwQkFBaEI7QUFDQSxxQkFBVyxJQUFYLENBQWdCLHNDQUFoQjtBQUNBLHFCQUFXLENBQVg7QUFDQSxxQkFBVyxDQUFYO0FBQ0Esa0JBQVEsQ0FBUjtBQUNELFNBWkQsTUFZTztBQUNMLHFCQUFXLElBQVgsQ0FBZ0IsbUNBQWhCO0FBQ0Q7QUFDRCxZQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLE1BQWhCLEdBQXVCLENBQWxDLENBQWI7QUFDQSxtQkFBVyxJQUFYLCtCQUE0QyxNQUE1QztBQUNBLGlCQUFTLFNBQVMsTUFBbEI7QUFDRDs7QUFFRCxVQUFJLFdBQVcsUUFBZixFQUF5QjtBQUN2QixtQkFBVyxJQUFYLENBQWdCLG9FQUFoQjtBQUNBLG1CQUFXLFFBQVg7QUFDRDtBQUNELGlCQUFXLFdBQVcsUUFBdEI7O0FBRUEsVUFBSSxZQUFZLFFBQVEsTUFBeEI7O0FBR0EsVUFBSSxZQUFZLFdBQWhCLEVBQTZCO0FBQzNCLG1CQUFXLElBQVgsQ0FBZ0IsMEVBQWhCO0FBQ0Esc0JBQWMsU0FBZDtBQUNEO0FBQ0Qsa0JBQVksWUFBWSxXQUF4Qjs7QUFFQSxhQUFPO0FBQ0wsY0FBTSxNQUFNLElBQU4sR0FBWSxDQURiO0FBRUwsY0FBTSxRQUZEO0FBR0wsZUFBTyxTQUhGO0FBSUwsYUFBSyxNQUFNLEdBSk47QUFLTCxpQkFBUyxXQUxKO0FBTUwsY0FBTyxRQU5GO0FBT0wsa0JBQVUsVUFQTCxFQUFQO0FBekhKO0FBa0lBLFNBQU8sS0FBUDtBQUNELENBcElEOzthQXNJd0IsSztJQUFoQixXLFVBQUEsVzs7O0FBRVIsSUFBSSxRQUFRLFlBQVksU0FBWixDQUFaOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxNQUFHLEtBQUgsUUFBRyxLQUFIO0FBQUEsTUFBVSxVQUFWLFFBQVUsVUFBVjtBQUFBLE1BQXNCLFVBQXRCLFFBQXNCLFVBQXRCO0FBQUEsTUFBa0MsVUFBbEMsUUFBa0MsVUFBbEM7QUFBQSxNQUE4QyxnQkFBOUMsUUFBOEMsZ0JBQTlDO0FBQUEsTUFBZ0UsZ0JBQWhFLFFBQWdFLGdCQUFoRTtBQUFBLFNBQ1Y7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLFFBQVEsU0FBUyxVQUFqQjtBQUFBO0FBQUEsS0FEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQVUsWUFBTTtBQUFoQixLQUZBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUhBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBVyxZQUFNLElBQWpCO0FBQUE7QUFBQSxLQUpBO0FBS0Q7QUFBQTtBQUFBO0FBQUE7QUFBdUIsWUFBTTtBQUE3QixLQUxDO0FBTUU7QUFBQTtBQUFBLFFBQVEsU0FBUyxnQkFBakI7QUFBQTtBQUFBLEtBTkY7QUFPRTtBQUFBO0FBQUEsUUFBUSxTQUFTLGdCQUFqQjtBQUFBO0FBQUEsS0FQRjtBQVFDO0FBQUE7QUFBQTtBQUFBO0FBQVksWUFBTTtBQUFsQixLQVJEO0FBU0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQVRBO0FBVUE7QUFBQTtBQUFBO0FBQUE7QUFBYyxZQUFNLE9BQXBCO0FBQUE7QUFBQSxLQVZBO0FBV0M7QUFBQTtBQUFBLFFBQVEsU0FBUyxVQUFqQjtBQUFBO0FBQUEsS0FYRDtBQVlDO0FBQUE7QUFBQSxRQUFRLFNBQVMsVUFBakI7QUFBQTtBQUFBLEtBWkQ7QUFhQTtBQUFBO0FBQUE7QUFBQTtBQUFZLFlBQU07QUFBbEIsS0FiQTtBQWNBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FkQTtBQWVBO0FBQUE7QUFBQTtBQUFLLFlBQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsVUFBQyxPQUFELEVBQVUsS0FBVjtBQUFBLGVBQ3JCO0FBQUE7QUFBQSxZQUFJLEtBQUssS0FBVDtBQUNHO0FBREgsU0FEcUI7QUFBQSxPQUFuQjtBQUFMO0FBZkEsR0FEVTtBQUFBLENBQWI7O0FBeUJBLElBQU0sU0FBUyxTQUFULE1BQVMsR0FBTTtBQUNuQixXQUFTLE1BQVQsQ0FDQyxvQkFBQyxJQUFELElBQU0sT0FBTyxNQUFNLFFBQU4sRUFBYjtBQUNDLGdCQUFZO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssV0FBTixFQUFmLENBQUw7QUFBQSxLQURiO0FBRUMsZ0JBQVk7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxXQUFOLEVBQWYsQ0FBTDtBQUFBLEtBRmI7QUFHQyxnQkFBWTtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLFdBQU4sRUFBZixDQUFMO0FBQUEsS0FIYjtBQUlDLHNCQUFrQjtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLGtCQUFOLEVBQWYsQ0FBTDtBQUFBLEtBSm5CO0FBS0Msc0JBQWtCO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssa0JBQU4sRUFBZixDQUFMO0FBQUE7QUFMbkIsSUFERCxFQVFFLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQVJGO0FBVUQsQ0FYRDs7QUFhQSxJQUFNLFFBQVEsU0FBUixLQUFRLEdBQU07QUFDbEIsUUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ0E7QUFDRCxDQUhEOztBQUtBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IGNyZWF0ZV93b3JsZCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7eWVhcjogMCwgZ29sZDoxMDAsIHdoZWF0OiAxMDAsIHNhdzogMSwgZmFybWVyczogMTAwLCBhcm15OiAwLCBtZXNzYWdlczogWydZb3UgYmVjYW1lIHRoZSBraW5nISddfTtcclxufVxyXG5cclxuY29uc3QgdGhlX2JyYWluID0gKHN0YXRlID0gY3JlYXRlX3dvcmxkKCksIGFjdGlvbikgPT4ge1xyXG4gIHN3aXRjaChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSAnU1RPUkFHRV9UT19GSUVMRCc6XHJcbiAgICAgIGlmIChzdGF0ZS53aGVhdCA+IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCAtIDEsXHJcbiAgICAgICAgc2F3OiBzdGF0ZS5zYXcgKyAxLFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMsXHJcbiAgICAgICAgYXJteTogc3RhdGUuYXJteSxcclxuICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSAnRklFTERfVE9fU1RPUkFHRSc6XHJcbiAgICAgICAgaWYgKHN0YXRlLnNhdyA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0ICsgMSxcclxuICAgICAgICAgIHNhdzogc3RhdGUuc2F3IC0gMSxcclxuICAgICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMsXHJcbiAgICAgICAgICBhcm15OiBzdGF0ZS5hcm15LFxyXG4gICAgICAgICAgbWVzc2FnZXM6IFtdfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICBjYXNlICdMRVNTX0FSTVknOlxyXG4gICAgICBpZiAoc3RhdGUuYXJteSA+IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIsXHJcbiAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzICsgMSxcclxuICAgICAgICBhcm15OiBzdGF0ZS5hcm15IC0gMSxcclxuICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG5cclxuICAgIGNhc2UgJ01PUkVfQVJNWSc6XHJcbiAgICAgIGlmIChzdGF0ZS5mYXJtZXJzID4gMCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMgLSAxLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXkgKyAxLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSAnTkVYVF9ZRUFSJzpcclxuICAgICAgdmFyIGx5X21lc2FnZXMgPSBbXTtcclxuICAgICAgdmFyIG5ld19mYXJtZXJzID0gc3RhdGUuZmFybWVycztcclxuICAgICAgaWYgKG5ld19mYXJtZXJzID09IDApIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vIHBlb3BsZSB0byBydWxlIGFueSBtb3JlLiBUaGlzIGlzIHRoZSBlbmQuLi4nKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyxcclxuICAgICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgICBtZXNzYWdlczogbHlfbWVzYWdlc307XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHByb2R1Y3Rpdml0eSA9ICgzICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSkpO1xyXG4gICAgICBpZiAocHJvZHVjdGl2aXR5ID4gNikge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnSXQgd2FzIGEgZ29vZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb2R1Y3Rpdml0eSA8IDUpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0l0IHdhcyBhIGJhZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBncm93ZWQgPSBzdGF0ZS5zYXcgKiBwcm9kdWN0aXZpdHk7XHJcbiAgICAgIGx5X21lc2FnZXMucHVzaChgWW91ciBmYXJtcyBncm93ZWQgJHtncm93ZWR9IHdoZWF0YCk7XHJcbiAgICAgIHZhciBzYXZlZCA9IHN0YXRlLndoZWF0O1xyXG5cclxuICAgICAgdmFyIG5ld19hcm15ID0gc3RhdGUuYXJteTtcclxuICAgICAgdmFyIG5ld19nb2xkID0gc3RhdGUuZ29sZDtcclxuICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSA+IDcpIHtcclxuICAgICAgICB2YXIgYmFyYmFyaWFuQXJteSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYEJhcmJhcmlhbnMgYXR0YWNrZWQgeW91IHdpdGggYXJteSBvZiAke2JhcmJhcmlhbkFybXl9IHdhcnJpb3JzIWApO1xyXG4gICAgICAgIGlmIChiYXJiYXJpYW5Bcm15ID4gbmV3X2FybXkgKSB7XHJcbiAgICAgICAgICBpZiAobmV3X2FybXkgPT0gMCkge1xyXG4gICAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIHRvIGFybXksIGJhcmJhcmlhbnMga2lsbGVkIGFsbCBmYXJtZXJzJyk7XHJcbiAgICAgICAgICAgIG5ld19mYXJtZXJzID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyBkZWZlYXRlZCB5b3VyIGFybXkgYW5kIGtpbGxlZCBhbGwgc29sZGllcnMnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyB0b29rIGFsbCBnb2xkJyk7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgdG9vayBhbGwgd2hlYXQgaW4gc3RvcmFnZScpO1xyXG4gICAgICAgICAgbmV3X2dvbGQgPSAwO1xyXG4gICAgICAgICAgbmV3X2FybXkgPSAwO1xyXG4gICAgICAgICAgc2F2ZWQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdXIgYXJteSBoYXMgZGVmZWF0ZWQgYmFyYmFyaWFucycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgd2FzdGVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3Jvd2VkLzIgKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYFdhciBydWluZWQgd2hlYXQgZmllbGRzLCAke3dhc3RlZH0gd2hlYXQganVzdCB3YXN0ZWQgb24gdGhlIGZpZWxkc2ApO1xyXG4gICAgICAgIGdyb3dlZCA9IGdyb3dlZCAtIHdhc3RlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5ld19nb2xkIDwgbmV3X2FybXkpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vdCBlbm91Z2ggbW9uZXkgdG8gcGF5IHlvdXIgYXJteS4gUGFydCBvZiBhcm15IHJhbiBhd2F5LicpO1xyXG4gICAgICAgIG5ld19hcm15ID0gbmV3X2dvbGQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X2dvbGQgPSBuZXdfZ29sZCAtIG5ld19hcm15O1xyXG5cclxuICAgICAgdmFyIG5ld193aGVhdCA9IHNhdmVkICsgZ3Jvd2VkO1xyXG5cclxuXHJcbiAgICAgIGlmIChuZXdfd2hlYXQgPCBuZXdfZmFybWVycykge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgbm90aGluZyB0byBmZWVkIHlvdXIgZmFybWVycy4gUGFydCBvZiBmYXJtZXJzIGRpZWQgZnJvbSBodW5nZXIuJyk7XHJcbiAgICAgICAgbmV3X2Zhcm1lcnMgPSBuZXdfd2hlYXQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X3doZWF0ID0gbmV3X3doZWF0IC0gbmV3X2Zhcm1lcnM7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIgKzEsXHJcbiAgICAgICAgZ29sZDogbmV3X2dvbGQsXHJcbiAgICAgICAgd2hlYXQ6IG5ld193aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBuZXdfZmFybWVycyxcclxuICAgICAgICBhcm15OiAgbmV3X2FybXksXHJcbiAgICAgICAgbWVzc2FnZXM6IGx5X21lc2FnZXN9O1xyXG4gIH1cclxuICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbmNvbnN0IHsgY3JlYXRlU3RvcmUgfSA9IFJlZHV4O1xyXG5cclxudmFyIHN0b3JlID0gY3JlYXRlU3RvcmUodGhlX2JyYWluKTtcclxuXHJcbmNvbnN0IFllYXIgPSAoeyB2YWx1ZSwgb25OZXh0WWVhciwgb25MZXNzQXJteSwgb25Nb3JlQXJteSwgb25TdG9yYWdlVG9GaWVsZCwgb25GaWVsZFRvU3RvcmFnZSB9KSA9PiAoXHJcbiAgIDxkaXY+XHJcbiAgIDxidXR0b24gb25DbGljaz17b25OZXh0WWVhcn0+TmV4dCB5ZWFyPC9idXR0b24+XHJcbiAgIDxoMT5ZZWFyIHt2YWx1ZS55ZWFyfTwvaDE+XHJcbiAgIDxoMj5SZXNvdXJjZXM8L2gyPlxyXG4gICA8aDM+R29sZDoge3ZhbHVlLmdvbGR9IDwvaDM+XHJcbiAgPGgzPldoZWF0IGluIHN0b3JhZ2U6IHt2YWx1ZS53aGVhdH08L2gzPlxyXG4gICAgIDxidXR0b24gb25DbGljaz17b25GaWVsZFRvU3RvcmFnZX0+XjwvYnV0dG9uPlxyXG4gICAgIDxidXR0b24gb25DbGljaz17b25TdG9yYWdlVG9GaWVsZH0+VjwvYnV0dG9uPlxyXG4gICAgPGgzPkZpZWxkOiB7dmFsdWUuc2F3fTwvaDM+XHJcbiAgIDxoMj5QZW9wbGU8L2gyPlxyXG4gICA8aDM+RmFybWVyczoge3ZhbHVlLmZhcm1lcnN9IDwvaDM+XHJcbiAgICA8YnV0dG9uIG9uQ2xpY2s9e29uTGVzc0FybXl9Pl48L2J1dHRvbj5cclxuICAgIDxidXR0b24gb25DbGljaz17b25Nb3JlQXJteX0+VjwvYnV0dG9uPlxyXG4gICA8aDM+IEFybXk6IHt2YWx1ZS5hcm15fTwvaDM+XHJcbiAgIDxoND5XaGF0IGhhcHBlbmVkIGxhc3QgeWVhcjo8L2g0PlxyXG4gICA8dWw+e3ZhbHVlLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+XHJcbiAgICAgIDxsaSBrZXk9e2luZGV4fT5cclxuICAgICAgICB7bWVzc2FnZX1cclxuICAgICAgPC9saT5cclxuICAgICl9PC91bD5cclxuICAgPC9kaXY+XHJcbiApXHJcblxyXG5cclxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xyXG4gIFJlYWN0RE9NLnJlbmRlcihcclxuICAgPFllYXIgdmFsdWU9e3N0b3JlLmdldFN0YXRlKCl9XHJcbiAgICBvbk5leHRZZWFyPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidORVhUX1lFQVInfSl9XHJcbiAgICBvbkxlc3NBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidMRVNTX0FSTVknfSl9XHJcbiAgICBvbk1vcmVBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidNT1JFX0FSTVknfSl9XHJcbiAgICBvblN0b3JhZ2VUb0ZpZWxkPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidTVE9SQUdFX1RPX0ZJRUxEJ30pfVxyXG4gICAgb25GaWVsZFRvU3RvcmFnZT17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonRklFTERfVE9fU1RPUkFHRSd9KX1cclxuICAgIC8+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKVxyXG4gICk7XHJcbn1cclxuXHJcbmNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xyXG4gIHN0b3JlLnN1YnNjcmliZShyZW5kZXIpO1xyXG4gIHJlbmRlcigpO1xyXG59XHJcblxyXG5zdGFydCgpO1xyXG4iXX0=
