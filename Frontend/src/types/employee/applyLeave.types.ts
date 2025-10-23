// types/applyLeave.types.ts

export interface LeaveFormData {
  leaveType: string;
  approver: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachments: File[];
}

export interface LeaveDateSelection {
  date: string;
  leaveType: string;
  isChecked: boolean;
}

export type LeaveTimeType = 
  | 'Full day' 
  | 'Half day - Morning' 
  | 'Half day - Afternoon' 
  | 'None Working Day';