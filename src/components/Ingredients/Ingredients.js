import React, { useState, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //const [userIngredients, setUserIngredients] = useState([]); //initial state an array empty
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-bf465.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient } //responseData Arg that's .name come from firebase, name is a unic the id on firebase
      // ]);
      dispatch({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ingredient }
      })
    });
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-bf465.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false);
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({
        type: 'DELETE',
        id: ingredientId
      })
    }).catch(error => {
      setErrorState('Something went wrong!');//React Batch together this two only one lifecycle
      setIsLoading(false);//React Batch together this two only one lifecycle
    });
  }

  const clearError = () => {
    setErrorState(null);
  }
  return (
    <div className="App">
      {errorState && <ErrorModal onClose={clearError}>{errorState}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
