import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, VacancyEntity, CandidateEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { CreateVacancy, UpdateVacancy, Vacancy, CreateCandidate, UpdateCandidate, Candidate, VacancyCandidate } from "@shared/types";
// Helper to find a vacancy by title (case-insensitive)
async function findVacancyByTitle(env: Env, title: string): Promise<Vacancy | null> {
  const allVacancies = await VacancyEntity.list(env, null, 1000); // Assuming max 1000 vacancies for simplicity
  return allVacancies.items.find(v => v.title.toLowerCase() === title.toLowerCase()) || null;
}
// Helper to update vacancy with candidate info
async function updateVacancyWithCandidate(env: Env, candidate: Candidate) {
  const vacancyToUpdate = await findVacancyByTitle(env, candidate.appliedFor);
  if (vacancyToUpdate) {
    const vacancyEntity = new VacancyEntity(env, vacancyToUpdate.id);
    const newVacancyCandidate: VacancyCandidate = {
      id: candidate.id,
      name: candidate.name,
      avatarUrl: candidate.avatarUrl,
    };
    await vacancyEntity.mutate(v => {
      const existing = v.candidates.find(c => c.id === newVacancyCandidate.id);
      if (!existing) {
        v.candidates.push(newVacancyCandidate);
      } else {
        // Update existing candidate info if needed
        v.candidates = v.candidates.map(c => c.id === newVacancyCandidate.id ? newVacancyCandidate : c);
      }
      return v;
    });
  }
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // VACANCIES
  app.get('/api/vacancies', async (c) => {
    await VacancyEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await VacancyEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/vacancies', async (c) => {
    const body = await c.req.json<CreateVacancy>();
    if (!body.title || !body.department) {
      return bad(c, 'Title and department are required');
    }
    const newVacancy: Vacancy = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      candidates: [],
      ...body,
    };
    const created = await VacancyEntity.create(c.env, newVacancy);
    return ok(c, created);
  });
  app.get('/api/vacancies/:id', async (c) => {
    const { id } = c.req.param();
    const vacancy = new VacancyEntity(c.env, id);
    if (!(await vacancy.exists())) {
      return notFound(c, 'Vacancy not found');
    }
    return ok(c, await vacancy.getState());
  });
  app.patch('/api/vacancies/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<UpdateVacancy>();
    const vacancy = new VacancyEntity(c.env, id);
    if (!(await vacancy.exists())) {
      return notFound(c, 'Vacancy not found');
    }
    await vacancy.patch(body);
    return ok(c, await vacancy.getState());
  });
  app.put('/api/vacancies/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<UpdateVacancy>();
    const vacancy = new VacancyEntity(c.env, id);
    if (!(await vacancy.exists())) {
      return notFound(c, 'Vacancy not found');
    }
    await vacancy.patch(body);
    return ok(c, await vacancy.getState());
  });
  app.delete('/api/vacancies/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await VacancyEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Vacancy not found');
    }
    return ok(c, { id });
  });
  // CANDIDATES
  app.get('/api/candidates', async (c) => {
    await CandidateEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await CandidateEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/candidates', async (c) => {
    const body = await c.req.json<CreateCandidate>();
    if (!body.name || !body.email) {
      return bad(c, 'Name and email are required');
    }
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      appliedDate: new Date().toISOString(),
      avatarUrl: `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`,
      ...body,
    };
    const created = await CandidateEntity.create(c.env, newCandidate);
    await updateVacancyWithCandidate(c.env, created);
    return ok(c, created);
  });
  app.get('/api/candidates/:id', async (c) => {
    const { id } = c.req.param();
    const candidate = new CandidateEntity(c.env, id);
    if (!(await candidate.exists())) {
      return notFound(c, 'Candidate not found');
    }
    return ok(c, await candidate.getState());
  });
  app.put('/api/candidates/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<UpdateCandidate>();
    const candidate = new CandidateEntity(c.env, id);
    if (!(await candidate.exists())) {
      return notFound(c, 'Candidate not found');
    }
    await candidate.patch(body);
    const updatedCandidate = await candidate.getState();
    await updateVacancyWithCandidate(c.env, updatedCandidate);
    return ok(c, updatedCandidate);
  });
  app.delete('/api/candidates/:id', async (c) => {
    const { id } = c.req.param();
    const candidateEntity = new CandidateEntity(c.env, id);
    if (!(await candidateEntity.exists())) {
      return notFound(c, 'Candidate not found');
    }
    const candidate = await candidateEntity.getState();
    // Remove candidate from vacancy
    const vacancy = await findVacancyByTitle(c.env, candidate.appliedFor);
    if (vacancy) {
      const vacancyEntity = new VacancyEntity(c.env, vacancy.id);
      await vacancyEntity.mutate(v => {
        v.candidates = v.candidates.filter(vc => vc.id !== id);
        return v;
      });
    }
    const deleted = await CandidateEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // --- Template routes below, can be modified or removed ---
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'COSTUMA Talentos API' }}));
  // USERS
  app.get('/api/users', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
}