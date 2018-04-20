class AsyncQueue {
  queue = [];
  interval = 2000;
  pending = false;
  counter = 0;

  constructor(timeout) {
    this.interval = timeout || this.interval;
  }

  crawl = () => {
    if (this.queue.length === 0) {
      this.pending = false;
      this.counter = 0;
      return;
    }

    this.pending = true;
    this.counter++;
    const head = this.queue.shift();
    head();
    setTimeout(this.crawl, !(this.counter % 10) ? this.interval : 100);
  }

  add = fn => {
    this.queue.push(fn);
    if (!this.pending) {
      this.crawl();
    }
  }
}

const asyncQueue = new AsyncQueue();

export default asyncQueue;
