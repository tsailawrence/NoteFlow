import { object as yupObject, string as yupString } from 'yup';

const Token = yupObject().shape({
  userId: yupString().required(),
  token: yupString().required(),
});

export default Token;
