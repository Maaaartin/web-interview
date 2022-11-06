const fs = require('fs/promises'),
  crypto = require('crypto'),
  Path = require('path');

const BASE_PATH = Path.join(__dirname, '..', '..', '.data');

const cloneDeep = (data) => JSON.parse(JSON.stringify(data));

/**
 * Mongo-like class for handling data changes
 */
class BaseModel {
  static dataFile = null;
  static initialized = false;
  static data = {};
  values_ = null;
  id = null;

  static async initialize() {
    if (this.initialized) {
      return this.data;
    }
    this.initialized = true;
    try {
      await fs.access(BASE_PATH);
    } catch (_e) {
      await fs.mkdir(BASE_PATH);
    }

    try {
      const data = await fs.readFile(Path.join(BASE_PATH, this.dataFile), { encoding: 'utf-8' });
      this.data = JSON.parse(data);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return (this.data = {});
      }
      throw e;
    }
  }

  /**
   * Reads json file and parses the output
   * @returns {Promise<Record<string, any>>}
   */
  static async getData() {
    await this.initialize();
    return cloneDeep(this.data);
  }

  static async write() {
    await this.initialize();
    await fs.writeFile(Path.join(BASE_PATH, this.dataFile), JSON.stringify(this.data, null, 2), {
      encoding: 'utf-8',
      flag: 'w',
    });
    return cloneDeep(this.data);
  }
  static async getById(id) {
    const data = await this.getData();
    if (data[id]) {
      return new this(data[id]);
    }
    return null;
  }

  static getAll() {
    return this.getData();
  }

  static async deleteById(id) {
    const data = await this.getData();
    if (data[id]) {
      const value = { ...data[id] };
      delete this.data[id];
      await this.write();
      return value;
    }
    return null;
  }

  constructor(props = {}) {
    const id = props.id || crypto.randomUUID();
    this.id = id;
    this.values_ = { ...this.defaultValues, id, ...props };
  }

  set values(v) {
    this.values_ = v;
  }

  get values() {
    return this.values_;
  }

  get defaultValues() {
    return {};
  }

  async save() {
    await this.constructor.initialize();
    const valuesWithId = { ...this.values, id: this.id };
    const newData = { ...this.constructor.data, [this.id]: valuesWithId };
    this.constructor.data = newData;
    await this.constructor.write();
    return this;
  }
}

module.exports = BaseModel;
