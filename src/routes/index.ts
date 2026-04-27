import { app } from '../app.js';
import v1 from './v1/index.js';
import healthyCheck from './healthy.js';

app.register(healthyCheck);
app.register(v1, { prefix: '/api/v1'/*, foo: 'foo-str'*/ });
