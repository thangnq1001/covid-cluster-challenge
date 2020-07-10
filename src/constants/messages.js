export const message = {
  newHexagonNameEmpty() {
    return 'Name of new hexagon must not be empty';
  },
  newHexagonNameDuplicate(newName) {
    return `'${newName}' has already been taken`;
  },
  queriedHexagonEmpty() {
    return 'Queried hexagon must not be empty';
  },
  newHexagonPositionTaken() {
    return 'The position has been taken';
  },
  queriedHexagonNotExist(name) {
    return `'${name}' does not exist`;
  },
  borderInvalid() {
    return `Border invalid`;
  },
  addHexagonSuccess(name) {
    return `${name} has been added`;
  },
  removeHexagonSuccess(name) {
    return `${name} has been removed`;
  },
  removeHexagonFailure(name) {
    return `Cannot remove ${name} because all hexagons must be linked`;
  }
};
