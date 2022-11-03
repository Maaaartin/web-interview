const fs = require('fs/promises'),
  crypto = require('crypto'),
  Path = require('path');

const BASE_PATH = Path.join(__dirname, '..', '..', '.data');

class BaseModel {
  static dataFile = null;
  values_ = null;
  #exists = false;
  /**
   * Reads json file and parses the output
   * @returns {Promise<any[]>}
   */
  static async readAndParse() {
    try {
      const data = await fs.readFile(Path.join(BASE_PATH, this.dataFile), { encoding: 'utf-8' });
      return JSON.parse(data);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return [];
      }
      throw e;
    }
  }

  static async write(data) {
    await fs.writeFile(Path.join(BASE_PATH, this.dataFile), JSON.stringify(data, null, '\t'), {
      encoding: 'utf-8',
      flag: 'w',
    });
    return data;
  }
  static async getById(id) {
    const data = await this.readAndParse();
    const thingy = data.find((d) => d.id === id) ?? null;
    return new this(thingy);
  }
  static getAll() {
    return this.readAndParse();
  }

  constructor(props = {}) {
    this.values_ = { ...this.defaultValues, id: crypto.randomUUID(), ...props };
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
    const found = data.indexOf((d) => d.id === this.values.id);
    if (found > -1) {
      data[found] = this.values;
    } else {
      data.concat(this.values);
    }
    await this.constructor.write(data);
    return this.values;
  }
}

module.exports = BaseModel;
