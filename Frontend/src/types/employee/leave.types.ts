// types/leave.types.ts

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type LeaveType = 'Casual' | 'Sick' | 'Annual' | 'Unpaid';

export interface Leave {
  id: string;
  leaveType: LeaveType;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  approver: string;
}

export interface LeaveStats {
  available: number;
  compensatory: number;
  deducted: number;
  pending: number;
}