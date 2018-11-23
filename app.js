(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.testing = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var create_world = function create_world() {
  return { year: 0, gold: 100, wheat: 100, saw: 1, farmers: 100, army: 0, taxes: 1, messages: ['You became the king!'] };
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
          taxes: state.taxes,
          messages: [] };
      } else {
        return state;
      }

    case 'FIELD_TO_STORAGE':
      if (state.saw > 0) {

        return {
          year: state.year,
          taxes: state.taxes,
          gold: state.gold,
          wheat: state.wheat + 1,
          saw: state.saw - 1,
          farmers: state.farmers,
          army: state.army,
          messages: [] };
      } else {
        return state;
      }

    case 'CHANGE_TAXES':
      if (state.saw > 0) {

        return {
          year: state.year,
          taxes: state.taxes + 1,
          gold: state.gold,
          wheat: state.wheat,
          saw: state.saw,
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
          taxes: state.taxes,
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
          taxes: state.taxes,
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
          taxes: state.taxes,
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
      new_gold = new_farmers * state.taxes + new_gold;
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
        taxes: state.taxes,
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
      onFieldToStorage = _ref.onFieldToStorage,
      onFarmerToTaxer = _ref.onFarmerToTaxer;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      { onClick: onNextYear, id: 'nextYear' },
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
      'Taxes per farmer: ',
      value.taxes,
      ' gold'
    ),
    React.createElement(
      'button',
      { onClick: onFarmerToTaxer },
      'Add Taxes'
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
      'v'
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
      'v'
    ),
    React.createElement(
      'h3',
      null,
      ' Army: ',
      value.army,
      ' people'
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
    },
    onFarmerToTaxer: function onFarmerToTaxer() {
      return store.dispatch({ type: 'CHANGE_TAXES' });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL25wZWNoXzAwMC8uYXRvbS9wYWNrYWdlcy9hdG9tLWJhYmVsLWNvbXBpbGVyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxJQUFNLGVBQWUsU0FBZixZQUFlLEdBQU07QUFDdkIsU0FBTyxFQUFDLE1BQU0sQ0FBUCxFQUFVLE1BQUssR0FBZixFQUFvQixPQUFPLEdBQTNCLEVBQWdDLEtBQUssQ0FBckMsRUFBd0MsU0FBUyxHQUFqRCxFQUFzRCxNQUFNLENBQTVELEVBQStELE9BQU8sQ0FBdEUsRUFBeUUsVUFBVSxDQUFDLHNCQUFELENBQW5GLEVBQVA7QUFDSCxDQUZEOztBQUlBLElBQU0sWUFBWSxTQUFaLFNBQVksR0FBb0M7QUFBQSxNQUFuQyxLQUFtQyx1RUFBM0IsY0FBMkI7QUFBQSxNQUFYLE1BQVc7O0FBQ3BELFVBQU8sT0FBTyxJQUFkO0FBQ0UsU0FBSyxrQkFBTDtBQUNFLFVBQUksTUFBTSxLQUFOLEdBQWMsQ0FBbEIsRUFBcUI7QUFDYixlQUFPO0FBQ2IsZ0JBQU0sTUFBTSxJQURDO0FBRWIsZ0JBQUssTUFBTSxJQUZFO0FBR2IsaUJBQU8sTUFBTSxLQUFOLEdBQWMsQ0FIUjtBQUliLGVBQUssTUFBTSxHQUFOLEdBQVksQ0FKSjtBQUtiLG1CQUFTLE1BQU0sT0FMRjtBQU1iLGdCQUFNLE1BQU0sSUFOQztBQU9iLGlCQUFPLE1BQU0sS0FQQTtBQVFiLG9CQUFVLEVBUkcsRUFBUDtBQVVQLE9BWEQsTUFXTztBQUNMLGVBQU8sS0FBUDtBQUNEOztBQUVELFNBQUssa0JBQUw7QUFDRSxVQUFJLE1BQU0sR0FBTixHQUFZLENBQWhCLEVBQW1COztBQUVYLGVBQU87QUFDYixnQkFBTSxNQUFNLElBREM7QUFFYixpQkFBTyxNQUFNLEtBRkE7QUFHYixnQkFBSyxNQUFNLElBSEU7QUFJYixpQkFBTyxNQUFNLEtBQU4sR0FBYyxDQUpSO0FBS2IsZUFBSyxNQUFNLEdBQU4sR0FBWSxDQUxKO0FBTWIsbUJBQVMsTUFBTSxPQU5GO0FBT2IsZ0JBQU0sTUFBTSxJQVBDO0FBUWIsb0JBQVUsRUFSRyxFQUFQO0FBU1AsT0FYRCxNQVdPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBSyxjQUFMO0FBQ0UsVUFBSSxNQUFNLEdBQU4sR0FBWSxDQUFoQixFQUFtQjs7QUFFWCxlQUFPO0FBQ2IsZ0JBQU0sTUFBTSxJQURDO0FBRWIsaUJBQU8sTUFBTSxLQUFOLEdBQWMsQ0FGUjtBQUdiLGdCQUFLLE1BQU0sSUFIRTtBQUliLGlCQUFPLE1BQU0sS0FKQTtBQUtiLGVBQUssTUFBTSxHQUxFO0FBTWIsbUJBQVMsTUFBTSxPQU5GO0FBT2IsZ0JBQU0sTUFBTSxJQVBDO0FBUWIsb0JBQVUsRUFSRyxFQUFQO0FBU1AsT0FYRCxNQVdPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7QUFDUCxTQUFLLFdBQUw7QUFDRSxVQUFJLE1BQU0sSUFBTixHQUFhLENBQWpCLEVBQW9CO0FBQ1osZUFBTztBQUNiLGdCQUFNLE1BQU0sSUFEQztBQUViLGlCQUFPLE1BQU0sS0FGQTtBQUdiLGdCQUFLLE1BQU0sSUFIRTtBQUliLGlCQUFPLE1BQU0sS0FKQTtBQUtiLGVBQUssTUFBTSxHQUxFO0FBTWIsbUJBQVMsTUFBTSxPQUFOLEdBQWdCLENBTlo7QUFPYixnQkFBTSxNQUFNLElBQU4sR0FBYSxDQVBOO0FBUWIsb0JBQVUsRUFSRyxFQUFQO0FBU1AsT0FWRCxNQVVPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUgsU0FBSyxXQUFMO0FBQ0UsVUFBSSxNQUFNLE9BQU4sR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDZixlQUFPO0FBQ2IsZ0JBQU0sTUFBTSxJQURDO0FBRWIsaUJBQU8sTUFBTSxLQUZBO0FBR2IsZ0JBQUssTUFBTSxJQUhFO0FBSWIsaUJBQU8sTUFBTSxLQUpBO0FBS2IsZUFBSyxNQUFNLEdBTEU7QUFNYixtQkFBUyxNQUFNLE9BQU4sR0FBZ0IsQ0FOWjtBQU9iLGdCQUFNLE1BQU0sSUFBTixHQUFhLENBUE47QUFRYixvQkFBVSxFQVJHLEVBQVA7QUFTUCxPQVZELE1BVU87QUFDTCxlQUFPLEtBQVA7QUFDRDs7QUFFSCxTQUFLLFdBQUw7QUFDRSxVQUFJLGFBQWEsRUFBakI7QUFDQSxVQUFJLGNBQWMsTUFBTSxPQUF4QjtBQUNBLFVBQUksZUFBZSxDQUFuQixFQUFzQjtBQUNwQixtQkFBVyxJQUFYLENBQWdCLHlEQUFoQjtBQUNBLGVBQU87QUFDTCxpQkFBTyxNQUFNLEtBRFI7QUFFTCxnQkFBTSxNQUFNLElBRlA7QUFHTCxnQkFBSyxNQUFNLElBSE47QUFJTCxpQkFBTyxNQUFNLEtBSlI7QUFLTCxlQUFLLE1BQU0sR0FMTjtBQU1MLG1CQUFTLE1BQU0sT0FOVjtBQU9MLGdCQUFNLE1BQU0sSUFQUDtBQVFMLG9CQUFVLFVBUkwsRUFBUDtBQVNEO0FBQ0QsVUFBSSxlQUFnQixJQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixDQUEzQixDQUF4QjtBQUNBLFVBQUksZUFBZSxDQUFuQixFQUFzQjtBQUNwQixtQkFBVyxJQUFYLENBQWdCLGlDQUFoQjtBQUNELE9BRkQsTUFFTyxJQUFJLGVBQWUsQ0FBbkIsRUFBc0I7QUFDM0IsbUJBQVcsSUFBWCxDQUFnQixnQ0FBaEI7QUFDRDtBQUNELFVBQUksU0FBUyxNQUFNLEdBQU4sR0FBWSxZQUF6QjtBQUNBLGlCQUFXLElBQVgsd0JBQXFDLE1BQXJDO0FBQ0EsVUFBSSxRQUFRLE1BQU0sS0FBbEI7O0FBRUEsVUFBSSxXQUFXLE1BQU0sSUFBckI7QUFDQSxVQUFJLFdBQVcsTUFBTSxJQUFyQjtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLEVBQTNCLElBQWlDLENBQXJDLEVBQXdDO0FBQ3RDLFlBQUksZ0JBQWdCLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixDQUFwQjtBQUNBLG1CQUFXLElBQVgsMkNBQXdELGFBQXhEO0FBQ0EsWUFBSSxnQkFBZ0IsUUFBcEIsRUFBK0I7QUFDN0IsY0FBSSxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCLHVCQUFXLElBQVgsQ0FBZ0IsaURBQWhCO0FBQ0EsMEJBQWMsQ0FBZDtBQUNELFdBSEQsTUFHTztBQUNMLHVCQUFXLElBQVgsQ0FBZ0IsdURBQWhCO0FBQ0Q7QUFDRCxxQkFBVyxJQUFYLENBQWdCLDBCQUFoQjtBQUNBLHFCQUFXLElBQVgsQ0FBZ0Isc0NBQWhCO0FBQ0EscUJBQVcsQ0FBWDtBQUNBLHFCQUFXLENBQVg7QUFDQSxrQkFBUSxDQUFSO0FBQ0QsU0FaRCxNQVlPO0FBQ0wscUJBQVcsSUFBWCxDQUFnQixtQ0FBaEI7QUFDRDtBQUNELFlBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsTUFBaEIsR0FBdUIsQ0FBbEMsQ0FBYjtBQUNBLG1CQUFXLElBQVgsK0JBQTRDLE1BQTVDO0FBQ0EsaUJBQVMsU0FBUyxNQUFsQjtBQUNEOztBQUVELFVBQUksV0FBVyxRQUFmLEVBQXlCO0FBQ3ZCLG1CQUFXLElBQVgsQ0FBZ0Isb0VBQWhCO0FBQ0EsbUJBQVcsUUFBWDtBQUNEO0FBQ0QsaUJBQVcsV0FBVyxRQUF0QjtBQUNBLGlCQUFXLGNBQWMsTUFBTSxLQUFwQixHQUE0QixRQUF2QztBQUNBLFVBQUksWUFBWSxRQUFRLE1BQXhCOztBQUdBLFVBQUksWUFBWSxXQUFoQixFQUE2QjtBQUMzQixtQkFBVyxJQUFYLENBQWdCLDBFQUFoQjtBQUNBLHNCQUFjLFNBQWQ7QUFDRDtBQUNELGtCQUFZLFlBQVksV0FBeEI7O0FBRUEsYUFBTztBQUNMLGNBQU0sTUFBTSxJQUFOLEdBQVksQ0FEYjtBQUVMLGNBQU0sUUFGRDtBQUdMLGVBQU8sU0FIRjtBQUlMLGFBQUssTUFBTSxHQUpOO0FBS0wsaUJBQVMsV0FMSjtBQU1MLGNBQU8sUUFORjtBQU9MLGVBQU8sTUFBTSxLQVBSO0FBUUwsa0JBQVUsVUFSTCxFQUFQO0FBL0lKO0FBeUpBLFNBQU8sS0FBUDtBQUNELENBM0pEOzthQTZKd0IsSztJQUFoQixXLFVBQUEsVzs7O0FBRVIsSUFBSSxRQUFRLFlBQVksU0FBWixDQUFaOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxNQUFHLEtBQUgsUUFBRyxLQUFIO0FBQUEsTUFBVSxVQUFWLFFBQVUsVUFBVjtBQUFBLE1BQXNCLFVBQXRCLFFBQXNCLFVBQXRCO0FBQUEsTUFBa0MsVUFBbEMsUUFBa0MsVUFBbEM7QUFBQSxNQUE4QyxnQkFBOUMsUUFBOEMsZ0JBQTlDO0FBQUEsTUFBZ0UsZ0JBQWhFLFFBQWdFLGdCQUFoRTtBQUFBLE1BQWtGLGVBQWxGLFFBQWtGLGVBQWxGO0FBQUEsU0FDVjtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUEsUUFBUSxTQUFTLFVBQWpCLEVBQTZCLElBQUcsVUFBaEM7QUFBQTtBQUFBLEtBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFVLFlBQU07QUFBaEIsS0FGQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FIQTtBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQVcsWUFBTSxJQUFqQjtBQUFBO0FBQUEsS0FKQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQXVCLFlBQU0sS0FBN0I7QUFBQTtBQUFBLEtBTEE7QUFNQTtBQUFBO0FBQUEsUUFBUSxTQUFTLGVBQWpCO0FBQUE7QUFBQSxLQU5BO0FBT0Q7QUFBQTtBQUFBO0FBQUE7QUFBdUIsWUFBTTtBQUE3QixLQVBDO0FBUUU7QUFBQTtBQUFBLFFBQVEsU0FBUyxnQkFBakI7QUFBQTtBQUFBLEtBUkY7QUFTRTtBQUFBO0FBQUEsUUFBUSxTQUFTLGdCQUFqQjtBQUFBO0FBQUEsS0FURjtBQVVDO0FBQUE7QUFBQTtBQUFBO0FBQVksWUFBTTtBQUFsQixLQVZEO0FBV0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQVhBO0FBWUE7QUFBQTtBQUFBO0FBQUE7QUFBYyxZQUFNLE9BQXBCO0FBQUE7QUFBQSxLQVpBO0FBYUM7QUFBQTtBQUFBLFFBQVEsU0FBUyxVQUFqQjtBQUFBO0FBQUEsS0FiRDtBQWNDO0FBQUE7QUFBQSxRQUFRLFNBQVMsVUFBakI7QUFBQTtBQUFBLEtBZEQ7QUFlQTtBQUFBO0FBQUE7QUFBQTtBQUFZLFlBQU0sSUFBbEI7QUFBQTtBQUFBLEtBZkE7QUFnQkE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQWhCQTtBQWlCQTtBQUFBO0FBQUE7QUFBSyxZQUFNLFFBQU4sQ0FBZSxHQUFmLENBQW1CLFVBQUMsT0FBRCxFQUFVLEtBQVY7QUFBQSxlQUNyQjtBQUFBO0FBQUEsWUFBSSxLQUFLLEtBQVQ7QUFDRztBQURILFNBRHFCO0FBQUEsT0FBbkI7QUFBTDtBQWpCQSxHQURVO0FBQUEsQ0FBYjs7QUEyQkEsSUFBTSxTQUFTLFNBQVQsTUFBUyxHQUFNO0FBQ25CLFdBQVMsTUFBVCxDQUNDLG9CQUFDLElBQUQsSUFBTSxPQUFPLE1BQU0sUUFBTixFQUFiO0FBQ0MsZ0JBQVk7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxXQUFOLEVBQWYsQ0FBTDtBQUFBLEtBRGI7QUFFQyxnQkFBWTtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLFdBQU4sRUFBZixDQUFMO0FBQUEsS0FGYjtBQUdDLGdCQUFZO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssV0FBTixFQUFmLENBQUw7QUFBQSxLQUhiO0FBSUMsc0JBQWtCO0FBQUEsYUFBSyxNQUFNLFFBQU4sQ0FBZSxFQUFDLE1BQUssa0JBQU4sRUFBZixDQUFMO0FBQUEsS0FKbkI7QUFLQyxzQkFBa0I7QUFBQSxhQUFLLE1BQU0sUUFBTixDQUFlLEVBQUMsTUFBSyxrQkFBTixFQUFmLENBQUw7QUFBQSxLQUxuQjtBQU1DLHFCQUFpQjtBQUFBLGFBQUssTUFBTSxRQUFOLENBQWUsRUFBQyxNQUFLLGNBQU4sRUFBZixDQUFMO0FBQUE7QUFObEIsSUFERCxFQVNFLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQVRGO0FBV0QsQ0FaRDs7QUFjQSxJQUFNLFFBQVEsU0FBUixLQUFRLEdBQU07QUFDbEIsUUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ0E7QUFDRCxDQUhEOztBQUtBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IGNyZWF0ZV93b3JsZCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7eWVhcjogMCwgZ29sZDoxMDAsIHdoZWF0OiAxMDAsIHNhdzogMSwgZmFybWVyczogMTAwLCBhcm15OiAwLCB0YXhlczogMSwgbWVzc2FnZXM6IFsnWW91IGJlY2FtZSB0aGUga2luZyEnXX07XHJcbn1cclxuXHJcbmNvbnN0IHRoZV9icmFpbiA9IChzdGF0ZSA9IGNyZWF0ZV93b3JsZCgpLCBhY3Rpb24pID0+IHtcclxuICBzd2l0Y2goYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ1NUT1JBR0VfVE9fRklFTEQnOlxyXG4gICAgICBpZiAoc3RhdGUud2hlYXQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQgLSAxLFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3ICsgMSxcclxuICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgdGF4ZXM6IHN0YXRlLnRheGVzLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSAnRklFTERfVE9fU1RPUkFHRSc6XHJcbiAgICAgICAgaWYgKHN0YXRlLnNhdyA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgIHRheGVzOiBzdGF0ZS50YXhlcyxcclxuICAgICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCArIDEsXHJcbiAgICAgICAgICBzYXc6IHN0YXRlLnNhdyAtIDEsXHJcbiAgICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgICAgYXJteTogc3RhdGUuYXJteSxcclxuICAgICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgJ0NIQU5HRV9UQVhFUyc6XHJcbiAgICAgICAgICBpZiAoc3RhdGUuc2F3ID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgICAgdGF4ZXM6IHN0YXRlLnRheGVzICsgMSxcclxuICAgICAgICAgICAgZ29sZDpzdGF0ZS5nb2xkLFxyXG4gICAgICAgICAgICB3aGVhdDogc3RhdGUud2hlYXQsXHJcbiAgICAgICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgICAgICBmYXJtZXJzOiBzdGF0ZS5mYXJtZXJzLFxyXG4gICAgICAgICAgICBhcm15OiBzdGF0ZS5hcm15LFxyXG4gICAgICAgICAgICBtZXNzYWdlczogW119O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgfVxyXG4gICAgY2FzZSAnTEVTU19BUk1ZJzpcclxuICAgICAgaWYgKHN0YXRlLmFybXkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIHRheGVzOiBzdGF0ZS50YXhlcyxcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMgKyAxLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXkgLSAxLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSAnTU9SRV9BUk1ZJzpcclxuICAgICAgaWYgKHN0YXRlLmZhcm1lcnMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB5ZWFyOiBzdGF0ZS55ZWFyLFxyXG4gICAgICAgIHRheGVzOiBzdGF0ZS50YXhlcyxcclxuICAgICAgICBnb2xkOnN0YXRlLmdvbGQsXHJcbiAgICAgICAgd2hlYXQ6IHN0YXRlLndoZWF0LFxyXG4gICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgIGZhcm1lcnM6IHN0YXRlLmZhcm1lcnMgLSAxLFxyXG4gICAgICAgIGFybXk6IHN0YXRlLmFybXkgKyAxLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBbXX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSAnTkVYVF9ZRUFSJzpcclxuICAgICAgdmFyIGx5X21lc2FnZXMgPSBbXTtcclxuICAgICAgdmFyIG5ld19mYXJtZXJzID0gc3RhdGUuZmFybWVycztcclxuICAgICAgaWYgKG5ld19mYXJtZXJzID09IDApIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vIHBlb3BsZSB0byBydWxlIGFueSBtb3JlLiBUaGlzIGlzIHRoZSBlbmQuLi4nKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdGF4ZXM6IHN0YXRlLnRheGVzLFxyXG4gICAgICAgICAgeWVhcjogc3RhdGUueWVhcixcclxuICAgICAgICAgIGdvbGQ6c3RhdGUuZ29sZCxcclxuICAgICAgICAgIHdoZWF0OiBzdGF0ZS53aGVhdCxcclxuICAgICAgICAgIHNhdzogc3RhdGUuc2F3LFxyXG4gICAgICAgICAgZmFybWVyczogc3RhdGUuZmFybWVycyxcclxuICAgICAgICAgIGFybXk6IHN0YXRlLmFybXksXHJcbiAgICAgICAgICBtZXNzYWdlczogbHlfbWVzYWdlc307XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHByb2R1Y3Rpdml0eSA9ICgzICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSkpO1xyXG4gICAgICBpZiAocHJvZHVjdGl2aXR5ID4gNikge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnSXQgd2FzIGEgZ29vZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb2R1Y3Rpdml0eSA8IDUpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0l0IHdhcyBhIGJhZCB5ZWFyIGZvciBmYXJtZXJzLicpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBncm93ZWQgPSBzdGF0ZS5zYXcgKiBwcm9kdWN0aXZpdHk7XHJcbiAgICAgIGx5X21lc2FnZXMucHVzaChgWW91ciBmYXJtcyBncm93ZWQgJHtncm93ZWR9IHdoZWF0YCk7XHJcbiAgICAgIHZhciBzYXZlZCA9IHN0YXRlLndoZWF0O1xyXG5cclxuICAgICAgdmFyIG5ld19hcm15ID0gc3RhdGUuYXJteTtcclxuICAgICAgdmFyIG5ld19nb2xkID0gc3RhdGUuZ29sZDtcclxuICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSA+IDcpIHtcclxuICAgICAgICB2YXIgYmFyYmFyaWFuQXJteSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYEJhcmJhcmlhbnMgYXR0YWNrZWQgeW91IHdpdGggYXJteSBvZiAke2JhcmJhcmlhbkFybXl9IHdhcnJpb3JzIWApO1xyXG4gICAgICAgIGlmIChiYXJiYXJpYW5Bcm15ID4gbmV3X2FybXkgKSB7XHJcbiAgICAgICAgICBpZiAobmV3X2FybXkgPT0gMCkge1xyXG4gICAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIHRvIGFybXksIGJhcmJhcmlhbnMga2lsbGVkIGFsbCBmYXJtZXJzJyk7XHJcbiAgICAgICAgICAgIG5ld19mYXJtZXJzID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyBkZWZlYXRlZCB5b3VyIGFybXkgYW5kIGtpbGxlZCBhbGwgc29sZGllcnMnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGx5X21lc2FnZXMucHVzaCgnQmFyYmFyaWFucyB0b29rIGFsbCBnb2xkJyk7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ0JhcmJhcmlhbnMgdG9vayBhbGwgd2hlYXQgaW4gc3RvcmFnZScpO1xyXG4gICAgICAgICAgbmV3X2dvbGQgPSAwO1xyXG4gICAgICAgICAgbmV3X2FybXkgPSAwO1xyXG4gICAgICAgICAgc2F2ZWQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdXIgYXJteSBoYXMgZGVmZWF0ZWQgYmFyYmFyaWFucycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgd2FzdGVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3Jvd2VkLzIgKTtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goYFdhciBydWluZWQgd2hlYXQgZmllbGRzLCAke3dhc3RlZH0gd2hlYXQganVzdCB3YXN0ZWQgb24gdGhlIGZpZWxkc2ApO1xyXG4gICAgICAgIGdyb3dlZCA9IGdyb3dlZCAtIHdhc3RlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5ld19nb2xkIDwgbmV3X2FybXkpIHtcclxuICAgICAgICBseV9tZXNhZ2VzLnB1c2goJ1lvdSBoYXZlIG5vdCBlbm91Z2ggbW9uZXkgdG8gcGF5IHlvdXIgYXJteS4gUGFydCBvZiBhcm15IHJhbiBhd2F5LicpO1xyXG4gICAgICAgIG5ld19hcm15ID0gbmV3X2dvbGQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X2dvbGQgPSBuZXdfZ29sZCAtIG5ld19hcm15O1xyXG4gICAgICBuZXdfZ29sZCA9IG5ld19mYXJtZXJzICogc3RhdGUudGF4ZXMgKyBuZXdfZ29sZDtcclxuICAgICAgdmFyIG5ld193aGVhdCA9IHNhdmVkICsgZ3Jvd2VkO1xyXG5cclxuXHJcbiAgICAgIGlmIChuZXdfd2hlYXQgPCBuZXdfZmFybWVycykge1xyXG4gICAgICAgIGx5X21lc2FnZXMucHVzaCgnWW91IGhhdmUgbm90aGluZyB0byBmZWVkIHlvdXIgZmFybWVycy4gUGFydCBvZiBmYXJtZXJzIGRpZWQgZnJvbSBodW5nZXIuJyk7XHJcbiAgICAgICAgbmV3X2Zhcm1lcnMgPSBuZXdfd2hlYXQ7XHJcbiAgICAgIH1cclxuICAgICAgbmV3X3doZWF0ID0gbmV3X3doZWF0IC0gbmV3X2Zhcm1lcnM7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHN0YXRlLnllYXIgKzEsXHJcbiAgICAgICAgZ29sZDogbmV3X2dvbGQsXHJcbiAgICAgICAgd2hlYXQ6IG5ld193aGVhdCxcclxuICAgICAgICBzYXc6IHN0YXRlLnNhdyxcclxuICAgICAgICBmYXJtZXJzOiBuZXdfZmFybWVycyxcclxuICAgICAgICBhcm15OiAgbmV3X2FybXksXHJcbiAgICAgICAgdGF4ZXM6IHN0YXRlLnRheGVzLFxyXG4gICAgICAgIG1lc3NhZ2VzOiBseV9tZXNhZ2VzfTtcclxuICB9XHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG5jb25zdCB7IGNyZWF0ZVN0b3JlIH0gPSBSZWR1eDtcclxuXHJcbnZhciBzdG9yZSA9IGNyZWF0ZVN0b3JlKHRoZV9icmFpbik7XHJcblxyXG5jb25zdCBZZWFyID0gKHsgdmFsdWUsIG9uTmV4dFllYXIsIG9uTGVzc0FybXksIG9uTW9yZUFybXksIG9uU3RvcmFnZVRvRmllbGQsIG9uRmllbGRUb1N0b3JhZ2UsIG9uRmFybWVyVG9UYXhlciB9KSA9PiAoXHJcbiAgIDxkaXY+XHJcbiAgIDxidXR0b24gb25DbGljaz17b25OZXh0WWVhcn0gaWQ9XCJuZXh0WWVhclwiID5OZXh0IHllYXI8L2J1dHRvbj5cclxuICAgPGgxPlllYXIge3ZhbHVlLnllYXJ9PC9oMT5cclxuICAgPGgyPlJlc291cmNlczwvaDI+XHJcbiAgIDxoMz5Hb2xkOiB7dmFsdWUuZ29sZH0gPC9oMz5cclxuICAgPGgzPlRheGVzIHBlciBmYXJtZXI6IHt2YWx1ZS50YXhlc30gZ29sZDwvaDM+XHJcbiAgIDxidXR0b24gb25DbGljaz17b25GYXJtZXJUb1RheGVyfT5BZGQgVGF4ZXM8L2J1dHRvbj5cclxuICA8aDM+V2hlYXQgaW4gc3RvcmFnZToge3ZhbHVlLndoZWF0fTwvaDM+XHJcbiAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkZpZWxkVG9TdG9yYWdlfT5ePC9idXR0b24+XHJcbiAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvblN0b3JhZ2VUb0ZpZWxkfT52PC9idXR0b24+XHJcbiAgICA8aDM+RmllbGQ6IHt2YWx1ZS5zYXd9PC9oMz5cclxuICAgPGgyPlBlb3BsZTwvaDI+XHJcbiAgIDxoMz5GYXJtZXJzOiB7dmFsdWUuZmFybWVyc30gPC9oMz5cclxuICAgIDxidXR0b24gb25DbGljaz17b25MZXNzQXJteX0+XjwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtvbk1vcmVBcm15fT52PC9idXR0b24+XHJcbiAgIDxoMz4gQXJteToge3ZhbHVlLmFybXl9IHBlb3BsZTwvaDM+XHJcbiAgIDxoND5XaGF0IGhhcHBlbmVkIGxhc3QgeWVhcjo8L2g0PlxyXG4gICA8dWw+e3ZhbHVlLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+XHJcbiAgICAgIDxsaSBrZXk9e2luZGV4fT5cclxuICAgICAgICB7bWVzc2FnZX1cclxuICAgICAgPC9saT5cclxuICAgICl9PC91bD5cclxuICAgPC9kaXY+XHJcbiApXHJcblxyXG5cclxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xyXG4gIFJlYWN0RE9NLnJlbmRlcihcclxuICAgPFllYXIgdmFsdWU9e3N0b3JlLmdldFN0YXRlKCl9XHJcbiAgICBvbk5leHRZZWFyPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidORVhUX1lFQVInfSl9XHJcbiAgICBvbkxlc3NBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidMRVNTX0FSTVknfSl9XHJcbiAgICBvbk1vcmVBcm15PXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidNT1JFX0FSTVknfSl9XHJcbiAgICBvblN0b3JhZ2VUb0ZpZWxkPXsoKSA9PnN0b3JlLmRpc3BhdGNoKHt0eXBlOidTVE9SQUdFX1RPX0ZJRUxEJ30pfVxyXG4gICAgb25GaWVsZFRvU3RvcmFnZT17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonRklFTERfVE9fU1RPUkFHRSd9KX1cclxuICAgIG9uRmFybWVyVG9UYXhlcj17KCkgPT5zdG9yZS5kaXNwYXRjaCh7dHlwZTonQ0hBTkdFX1RBWEVTJ30pfVxyXG4gICAgLz4sXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpXHJcbiAgKTtcclxufVxyXG5cclxuY29uc3Qgc3RhcnQgPSAoKSA9PiB7XHJcbiAgc3RvcmUuc3Vic2NyaWJlKHJlbmRlcik7XHJcbiAgcmVuZGVyKCk7XHJcbn1cclxuXHJcbnN0YXJ0KCk7XHJcbiJdfQ==
