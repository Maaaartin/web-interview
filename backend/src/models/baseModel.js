const fs = require('fs/promises'),
  crypto = require('crypto'),
  Path = require('path');

const BASE_PATH = Path.join(__dirname, '..', '..', '.data');

// TODO handle file creation
class BaseModel {
  static dataFile = null;
  values_ = null;
  id = null;

  /**
   * Reads json file and parses the output
   * @returns {Promise<Record<string, any>>}
   */
  static async readAndParse() {
    try {
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
    await fs.writeFile(Path.join(BASE_PATH, this.dataFile), JSON.stringify(data, null, '\t'), {
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

  constructor(props = {}) {
    const id = props.id || crypto.randomUUID();
    this.id = id;
    this.values_ = { ...this.defaultValues, ...props };
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
    const newData = { ...data, [this.id]: this.values };
    await this.constructor.write(newData);
    return { ...this.values, id: this.id };
  }
}

module.exports = BaseModel;
