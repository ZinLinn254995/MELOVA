export type PracticeBlockType = 'notes' | 'scales' | 'chords' | 'fingers' | 'speed';
export interface PracticeBlock { id: string; type: PracticeBlockType; minutes: number; }
export interface PracticeRoutine { id: string; name: string; blocks: PracticeBlock[]; }
export interface RoutineSession { routineId: string; blockIndex: number; remainingSeconds: number; status: 'idle' | 'running' | 'paused' | 'completed'; }
export const ROUTINE_STORAGE_KEY = 'melova_custom_practice_routines';
export const PRACTICE_BLOCKS: PracticeBlockType[] = ['notes', 'scales', 'chords', 'fingers', 'speed'];
export const DEFAULT_ROUTINE: PracticeRoutine = { id: 'daily-foundations', name: 'Daily Foundations', blocks: [{ id: 'starter-notes', type: 'notes', minutes: 3 }, { id: 'starter-scales', type: 'scales', minutes: 5 }, { id: 'starter-chords', type: 'chords', minutes: 4 }, { id: 'starter-fingers', type: 'fingers', minutes: 3 }] };
export function createPracticeBlock(type: PracticeBlockType, id: string, minutes = 3): PracticeBlock { return { id, type, minutes: Math.max(1, Math.min(30, Math.floor(minutes) || 1)) }; }
export function validateRoutineName(name: string): boolean { return name.trim().length > 0 && name.trim().length <= 40; }
export function normalizeRoutine(routine: PracticeRoutine): PracticeRoutine { return { ...routine, name: routine.name.trim().slice(0, 40), blocks: routine.blocks.map((b) => createPracticeBlock(b.type, b.id, b.minutes)) }; }
export function movePracticeBlock(blocks: PracticeBlock[], from: number, to: number): PracticeBlock[] { if (from < 0 || from >= blocks.length || to < 0 || to >= blocks.length || from === to) return blocks; const next = [...blocks]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next; }
export function serializeRoutines(routines: PracticeRoutine[]): string { return JSON.stringify(routines.map(normalizeRoutine)); }
export function parseRoutines(raw: string | null): PracticeRoutine[] {
  if (!raw) return [DEFAULT_ROUTINE];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [DEFAULT_ROUTINE];
    const valid = parsed.filter((item): item is PracticeRoutine => !!item && typeof item === 'object' && typeof (item as PracticeRoutine).id === 'string' && typeof (item as PracticeRoutine).name === 'string' && Array.isArray((item as PracticeRoutine).blocks) && (item as PracticeRoutine).blocks.every((b) => b && typeof b.id === 'string' && PRACTICE_BLOCKS.includes(b.type) && Number.isFinite(b.minutes))).map(normalizeRoutine).filter((r) => validateRoutineName(r.name) && r.blocks.length > 0);
    return valid.length ? valid : [DEFAULT_ROUTINE];
  } catch { return [DEFAULT_ROUTINE]; }
}
export function createRoutineSession(routine: PracticeRoutine, blockIndex = 0): RoutineSession { const block = routine.blocks[blockIndex]; return { routineId: routine.id, blockIndex, remainingSeconds: block ? block.minutes * 60 : 0, status: block ? 'idle' : 'completed' }; }
export function advanceRoutineSession(session: RoutineSession, routine: PracticeRoutine, direction: -1 | 1): RoutineSession { const nextIndex = Math.max(0, Math.min(routine.blocks.length - 1, session.blockIndex + direction)); const block = routine.blocks[nextIndex]; return { routineId: routine.id, blockIndex: nextIndex, remainingSeconds: block.minutes * 60, status: session.status === 'running' ? 'running' : 'paused' }; }
export function tickRoutineSession(session: RoutineSession): RoutineSession { if (session.status !== 'running') return session; const remainingSeconds = Math.max(0, session.remainingSeconds - 1); return { ...session, remainingSeconds, status: remainingSeconds === 0 ? 'paused' : 'running' }; }
