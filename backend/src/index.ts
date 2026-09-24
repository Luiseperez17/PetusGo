import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './lib/errors';
import { catalogRouter } from './routes/catalog';
import { membersRouter } from './routes/members';
import { authRouter } from './routes/auth';
import { operationsRouter } from './routes/operations';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '8mb' })); // foto base64 ≤5MB

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api', rateLimit({ windowMs: 60_000, limit: 120 }));
app.use('/api/members', rateLimit({ windowMs: 60_000, limit: 10, skip: (r) => r.method !== 'POST' }));
app.use('/api/auth', rateLimit({ windowMs: 60_000, limit: 5 }));
app.use('/api', authRouter);
app.use('/api', catalogRouter);
app.use('/api', membersRouter);
app.use('/api/staff', operationsRouter);

app.use(errorHandler);
app.listen(env.port, () => console.log(`API en :${env.port}`));
