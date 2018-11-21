
const create_world = () => {
    return {year: 0, gold:100, wheat: 100, saw: 1, farmers: 100, army: 0, messages: ['You became the king!']};
}

const the_brain = (state = create_world(), action) => {
  switch(action.type) {
    case 'STORAGE_TO_FIELD':
      if (state.wheat > 0) {
              return {
        year: state.year,
        gold:state.gold,
        wheat: state.wheat - 1,
        saw: state.saw + 1,
        farmers: state.farmers,
        army: state.army,
        messages: []};
      } else {
        return state;
      }

      case 'FIELD_TO_STORAGE':
        if (state.saw > 0) {
                return {
          year: state.year,
          gold:state.gold,
          wheat: state.wheat + 1,
          saw: state.saw - 1,
          farmers: state.farmers,
          army: state.army,
          messages: []};
        } else {
          return state;
        }

    case 'LESS_ARMY':
      if (state.army > 0) {
              return {
        year: state.year,
        gold:state.gold,
        wheat: state.wheat,
        saw: state.saw,
        farmers: state.farmers + 1,
        army: state.army - 1,
        messages: []};
      } else {
        return state;
      }

    case 'MORE_ARMY':
      if (state.farmers > 0) {
              return {
        year: state.year,
        gold:state.gold,
        wheat: state.wheat,
        saw: state.saw,
        farmers: state.farmers - 1,
        army: state.army + 1,
        messages: []};
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
          gold:state.gold,
          wheat: state.wheat,
          saw: state.saw,
          farmers: state.farmers,
          army: state.army,
          messages: ly_mesages};
      }
      var productivity = (3 + Math.floor(Math.random() * 5));
      if (productivity > 6) {
        ly_mesages.push('It was a good year for farmers.');
      } else if (productivity < 5) {
        ly_mesages.push('It was a bad year for farmers.');
      }
      var growed = state.saw * productivity;
      ly_mesages.push(`Your farms growed ${growed} wheat`);
      var saved = state.wheat;

      var new_army = state.army;
      var new_gold = state.gold;
      if (Math.floor(Math.random() * 10) > 7) {
        var barbarianArmy = Math.floor(Math.random() * 50);
        ly_mesages.push(`Barbarians attacked you with army of ${barbarianArmy} warriors!`);
        if (barbarianArmy > new_army ) {
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
        var wasted = Math.floor(Math.random() * growed/2 );
        ly_mesages.push(`War ruined wheat fields, ${wasted} wheat just wasted on the fields`);
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
        year: state.year +1,
        gold: new_gold,
        wheat: new_wheat,
        saw: state.saw,
        farmers: new_farmers,
        army:  new_army,
        messages: ly_mesages};
  }
  return state;
}

const { createStore } = Redux;

var store = createStore(the_brain);

const Year = ({ value, onNextYear, onLessArmy, onMoreArmy, onStorageToField, onFieldToStorage }) => (
   <div>
   <button onClick={onNextYear}>Next year</button>
   <h1>Year {value.year}</h1>
   <h2>Resources</h2>
   <h3>Gold: {value.gold} </h3>
  <h3>Wheat in storage: {value.wheat}</h3>
     <button onClick={onFieldToStorage}>^</button>
     <button onClick={onStorageToField}>V</button>
    <h3>Field: {value.saw}</h3>
   <h2>People</h2>
   <h3>Farmers: {value.farmers} </h3>
    <button onClick={onLessArmy}>^</button>
    <button onClick={onMoreArmy}>V</button>
   <h3> Army: {value.army}</h3>
   <h4>What happened last year:</h4>
   <ul>{value.messages.map((message, index) =>
      <li key={index}>
        {message}
      </li>
    )}</ul>
   </div>
 )


const render = () => {
  ReactDOM.render(
   <Year value={store.getState()}
    onNextYear={() =>store.dispatch({type:'NEXT_YEAR'})}
    onLessArmy={() =>store.dispatch({type:'LESS_ARMY'})}
    onMoreArmy={() =>store.dispatch({type:'MORE_ARMY'})}
    onStorageToField={() =>store.dispatch({type:'STORAGE_TO_FIELD'})}
    onFieldToStorage={() =>store.dispatch({type:'FIELD_TO_STORAGE'})}
    />,
    document.getElementById('root')
  );
}

const start = () => {
  store.subscribe(render);
  render();
}

start();
