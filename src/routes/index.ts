import { app } from '@/app';
import v1 from './v1';
import healthyCheck from './healthy';

app.register(healthyCheck);
app.register(v1, { prefix: '/api/v1'/*, foo: 'foo-str'*/ });
