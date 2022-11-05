const fs = require('fs/promises'),
  crypto = require('crypto'),
  Path = require('path');

const BASE_PATH = Path.join(__dirname, '..', '..', '.data');

class BaseModel {
  static dataFile = null;
  static initialized = false;
  values_ = null;
  id = null;

  static async initialize() {
    try {
      await fs.access(BASE_PATH);
      this.initialized = true;
    } catch (_e) {
      await fs.mkdir(BASE_PATH);
    }
  }

  /**
   * Reads json file and parses the output
   * @returns {Promise<Record<string, any>>}
   */
  static async readAndParse() {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      const data = await fs.readFile(Path.join(BASE_PATH, this.dataFile), { encoding: 'utf-8' });
      return JSON.parse(data);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return {};
      }
      throw e;
    }
  }

  static async write(data) {
    await fs.writeFile(Path.join(BASE_PATH, this.dataFile), JSON.stringify(data, null, 2), {
      encoding: 'utf-8',
      flag: 'w',
    });
    return data;
  }
  static async getById(id) {
    const data = await this.readAndParse();
    if (data[id]) {
      return new this(data[id]);
    }
    return null;
  }

  static getAll() {
    return this.readAndParse();
  }

  static async deleteById(id) {
    const data = await this.readAndParse();
    if (data[id]) {
      const value = { ...data[id] };
      delete data[id];
      await this.write(data);
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
    const data = await this.constructor.readAndParse();
    const valuesWithId = { ...this.values, id: this.id };
    const newData = { ...data, [this.id]: valuesWithId };
    await this.constructor.write(newData);
    return this;
  }
}

module.exports = BaseModel;
