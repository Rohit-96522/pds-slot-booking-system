import { Stock } from '../types';

// Calculate ration entitlement based on family size
// Standard allocation per person per month (in kg/liters)
const PER_PERSON_ALLOCATION = {
  rice: 5,
  wheat: 3,
  sugar: 1,
  kerosene: 0.5,
};

export const calculateEntitlement = (familyMembers: number): Stock => {
  return {
    rice: familyMembers * PER_PERSON_ALLOCATION.rice,
    wheat: familyMembers * PER_PERSON_ALLOCATION.wheat,
    sugar: familyMembers * PER_PERSON_ALLOCATION.sugar,
    kerosene: familyMembers * PER_PERSON_ALLOCATION.kerosene,
  };
};

export const isStockAvailable = (required: Stock, available: Stock): boolean => {
  return (
    available.rice >= required.rice &&
    available.wheat >= required.wheat &&
    available.sugar >= required.sugar &&
    available.kerosene >= required.kerosene
  );
};

export const formatStock = (stock: Stock): string => {
  return `Rice: ${stock.rice}kg, Wheat: ${stock.wheat}kg, Sugar: ${stock.sugar}kg, Kerosene: ${stock.kerosene}L`;
};
