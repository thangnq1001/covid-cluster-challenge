export class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class Queue {
  constructor() {
    this.length = 0;
    this.head = null;
  }

  push(data) {
    let node = new Node(data),
      current;

    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
  }

  pop() {
    let current = this.head;

    if (current) {
      let data = current.data;
      current = current.next;
      this.head = current;
      this.length--;
      return data;
    }
    return null;
  }

  front() {
    if (this.head) {
      return this.head.data;
    }
    return null;
  }

  rear() {
    let current = this.head;
    if (current === null) {
      return null;
    }
    while (current.next) {
      current = current.next;
    }
    return current.data;
  }

  toArray() {
    let arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }

    return arr;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  clear() {
    this.head = null;
    this.length = 0;
  }
}

export class Graph {
  constructor() {
    this.adjacentsByVertex = {};
  }

  addEdge(v, w) {
    if (!this.adjacentsByVertex[v]) {
      this.adjacentsByVertex[v] = new Queue();
    }
    this.adjacentsByVertex[v].push(w);
  }

  bfsAndGetVisitedVertexes(entryVertex) {
    if (Object.keys(this.adjacentsByVertex).length === 0 || !this.adjacentsByVertex[entryVertex]) {
      return {
        [entryVertex]: true
      }
    }
    let visited = {};
    let queue = new Queue();
    visited[entryVertex] = true;
    queue.push(entryVertex);

    while(queue.size() > 0) {
      let vertex = queue.pop();
      let adjacents = this.adjacentsByVertex[vertex];
      let cur = adjacents.head;
      while(cur) {
        if (!visited[cur.data]) {
          visited[cur.data] = true;
          queue.push(cur.data);
        }
        cur = cur.next
      }
    }
    return visited;
  }
}
