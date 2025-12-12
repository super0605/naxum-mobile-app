const getItemAsync = jest.fn();
const setItemAsync = jest.fn();
const deleteItemAsync = jest.fn();

module.exports = {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  default: {
    getItemAsync,
    setItemAsync,
    deleteItemAsync,
  },
};

