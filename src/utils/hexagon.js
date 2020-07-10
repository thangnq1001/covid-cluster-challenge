/**
 * @returns {{x, y}}
 */
import {Graph} from "./queue";

export function getNewHexagonPosition(hexagonQuery, border) {
  switch (border) {
    case 0:
      return {x: hexagonQuery.x, y: hexagonQuery.y - 1}
    case 1:
      return {x: hexagonQuery.x + 1, y: hexagonQuery.y - 1}
    case 2:
      return {x: hexagonQuery.x + 1, y: hexagonQuery.y}
    case 3:
      return {x: hexagonQuery.x, y: hexagonQuery.y + 1}
    case 4:
      return {x: hexagonQuery.x - 1, y: hexagonQuery.y + 1}
    case 5:
      return {x: hexagonQuery.x - 1, y: hexagonQuery.y}
    default:
      return null;
  }
}

/**
 * Check if hexagon2 is a neighbor of hexagon1
 * @returns {number} border index (0-5) (of hexagon1), or -1 if 'hexagon2' is not a neighbor of 'hexagon1'
 */
export function getBorder(hexagon1, hexagon2) {
  switch (hexagon2.x) {
    case hexagon1.x - 1:
      switch (hexagon2.y) {
        case hexagon1.y:
          return 5;
        case hexagon1.y + 1:
          return 4;
      }
      break;
    case hexagon1.x:
      switch (hexagon2.y) {
        case hexagon1.y - 1:
          return 0;
        case hexagon1.y + 1:
          return 3;
      }
      break;
    case hexagon1.x + 1:
      switch (hexagon2.y) {
        case hexagon1.y - 1:
          return 1;
        case hexagon1.y:
          return 2;
      }
  }
  return -1;
}

export function buildHexagonGraph(hexagons) {
  let graph = new Graph();
  if (!hexagons) {
    return graph;
  }
  hexagons.forEach(h1 => {
    hexagons.forEach(h2 => {
      if (h1.name === h2.name) {
        return;
      }
      let border = getBorder(h1, h2);
      if (border > -1) {
        graph.addEdge(h1.name, h2.name);
      }
    })
  });
  return graph;
}
