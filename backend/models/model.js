// models/Model.js
import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema({
  name: String
});

const Model = mongoose.model('Model', ModelSchema);

export default Model;