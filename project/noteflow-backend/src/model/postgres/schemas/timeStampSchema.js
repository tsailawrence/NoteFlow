import yup from 'yup';
import validator from 'validator';

const timeStampsSchema = yup
  .object()
  .shape({
    createdAt: yup
      .string()
      .required()
      .test({
        name: 'createdAt',
        message: '${path} must be valid ISO8601 date', // eslint-disable-line
        test: (value) =>
          value ? validator.isISO8601(new Date(value).toISOString()) : true,
      })
      .transform(function (value) {
        return this.isType(value) && value !== null
          ? new Date(value).toISOString()
          : value;
      })
      .default(() => new Date().toISOString()),

    updatedAt: yup
      .string()
      .required()
      .test({
        name: 'updatedAt',
        message: '${path} must be valid ISO8601 date', // eslint-disable-line
        test: (value) =>
          value ? validator.isISO8601(new Date(value).toISOString()) : true,
      })
      .transform(function (value) {
        return this.isType(value) && value !== null
          ? new Date(value).toISOString()
          : value;
      })
      .default(() => new Date().toISOString()),
  })
  .noUnknown();

export default timeStampsSchema;
