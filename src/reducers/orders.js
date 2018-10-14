import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';
import _ from 'lodash';
const positions = [
  'clients',
  'conveyor_1',
  'conveyor_2',
  'conveyor_3',
  'conveyor_4',
  'finish'
];

const equalArrays = (recipe, ingredients) =>
  recipe.length === ingredients.length;

const getNextPosition = element => {
  const index = positions.indexOf(element.position);

  if (index === 4 && equalArrays(element.recipe, element.ingredients)) {
    return positions[index + 1];
  }
  if (index >= 0 && index < 4) {
    return positions[index + 1];
  }
  return element.position;
};

const getBackPosition = element => {
  const index = positions.indexOf(element.position);
  if (index === 1) {
    return element.position;
  }

  return positions[index - 1];
};

export default (state = [], action) => {
  switch (action.type) {
    case CREATE_NEW_ORDER:
      return [
        ...state,
        { ...action.payload, ingredients: [], position: positions[0] }
      ];

    case ADD_INGREDIENT:
      const index = state.findIndex(el => el.position === action.payload.from);
      const newState = _.cloneDeep(state);
      if (state[index].recipe.includes(action.payload.ingredient)) {
        const newIngredients = state[index].ingredients.includes(
          action.payload.ingredient
        )
          ? state[index].ingredients
          : [...newState[index].ingredients, action.payload.ingredient];
        newState[index] = {
          ...newState[index],
          ingredients: newIngredients
        };
      }
      return newState;

    case MOVE_ORDER_NEXT: {
      const index = state.findIndex(el => el.id === action.payload);
      const newState = _.cloneDeep(state);
      newState[index] = {
        ...newState[index],
        position: getNextPosition(newState[index])
      };
      return newState;
    }

    case MOVE_ORDER_BACK: {
      const index = state.findIndex(el => el.id === action.payload);
      const newState = _.cloneDeep(state);
      newState[index] = {
        ...newState[index],
        position: getBackPosition(newState[index])
      };
      return newState;
    }

    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
