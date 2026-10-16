export interface Activity {
  id: string;
  title: string;
  prompt: string;
  inputType: 'jsx' | 'json';
  starter: string;
  hints: string[];
  inputLabel: string;
}
export function getActivity(exerciseId: string): Activity | null;
export function listActivities(): Activity[];
