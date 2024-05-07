/**
* DevExtreme (esm/__internal/scheduler/r1/semaphore/index.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export class Semaphore {
  constructor() {
    this.counter = 0;
  }
  isFree() {
    return this.counter === 0;
  }
  take() {
    this.counter += 1;
  }
  release() {
    this.counter -= 1;
    if (this.counter < 0) {
      this.counter = 0;
    }
  }
}
