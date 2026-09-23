import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  admin: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. "CREATE", "UPDATE", "DELETE", "LOGIN"
    resource: { type: String, required: true }, // e.g. "PRODUCT", "ORDER", "ROLE"
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed }, // Can store diffs, old/new states, etc.
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } // Audit logs are immutable, no updates
  }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
