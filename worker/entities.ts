import { IndexedEntity } from "./core-utils";
import type { Env } from "./core-utils";
import type { User, Chat, ChatMessage, Vacancy, Candidate } from "@shared/types";
import { MOCK_VACANCIES, MOCK_CANDIDATES } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate((s) => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
export class VacancyEntity extends IndexedEntity<Vacancy> {
  static readonly entityName = "vacancy";
  static readonly indexName = "vacancies";
  static readonly initialState: Vacancy = {
    id: "",
    title: "",
    department: "",
    status: "Open",
    priority: "Medium",
    createdAt: new Date().toISOString(),
    candidates: []
  };
  static seedData = MOCK_VACANCIES;
}
export class CandidateEntity extends IndexedEntity<Candidate> {
  static readonly entityName = "candidate";
  static readonly indexName = "candidates";
  static readonly initialState: Candidate = {
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
    appliedFor: "",
    status: "Active",
    stage: "Applied",
    appliedDate: new Date().toISOString()
  };
  static seedData = MOCK_CANDIDATES;
}