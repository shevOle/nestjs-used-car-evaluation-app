import { DataSource } from 'typeorm';
const config = require('../../ormconfig');

export default new DataSource(config);
