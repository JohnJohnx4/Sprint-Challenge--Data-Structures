/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    for (let i = 0; i < oldStorage.length; i++) {
      this.storage.set(i, oldStorage[i]);
    }
  }

  capacityIsFull() {
    return this.storage.length / this.limit >= 0.75;
  }

  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index);
    if (bucket === undefined) {
      bucket = new LinkedList();
    }
    let current = bucket.head;
    while (current) {
      if (current.value[0] === key) {
        current.value[1] = value;
      }
      current = current.next;
    }
    bucket.addToTail([key, value]);
    this.storage.set(index, bucket);
  }

  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket !== undefined) {
      let current = bucket.head;
      if (current.value[0] === key) {
        bucket.removeHead();
      } else {
        while (current.next) {
          if (current.next.value[0] === key) {
            current = current.next.next;
          }
          current = current.next;
        }
      }
    }
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket !== undefined) {
      let current = bucket.head;
      while (current) {
        if (current.value[0] === key) {
          return current.value[1];
        }
        current = current.next;
      }
    }
  }
}

module.exports = HashTable;
