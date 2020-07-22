import { Schema, Types } from 'mongoose';

export const availabilityStatusTypeSchema = new Schema({
  name: String,
  planned: Boolean,
  capacity: Number
});

export const locationSchema = new Schema({
  fullAddress: String
});

export const personSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  phone: String,
  fax: String,
  locationId: {
    type: Types.ObjectId,
    ref: 'location'
  },
  availability: {
    typeId: {
      type: Types.ObjectId,
      ref: 'availabilityStatusType'
    },
    capacity: Number,
    start: Date,
    plannedEnd: Date
  }
});

export const roleSchemaDefinition = {
  name: String,
  assignedId: {
    type: Types.ObjectId,
    ref: 'person'
  }
}

export const organizationSchema = new Schema({
  name: String,
  type: String,
  parentId: {
    type: Types.ObjectId,
    ref: 'organization'
  },
  locationId: {
    type: Types.ObjectId,
    ref: 'location'
  },
  roles: [roleSchemaDefinition]
});

export const organizationHierarchySchema = new Schema({
  level: Number,
  aboveId: {
    type: Types.ObjectId,
    ref: 'organization'
  },
  belowId: {
    type: Types.ObjectId,
    ref: 'organization'
  }
});
