import * as dotenv from 'dotenv';
import createServer from './utils/createServer';

dotenv.config();

const PORT = process.env.PORT || '8080';
const app = createServer();

app.listen(PORT, () => {
  console.log('Server is listening');
});
