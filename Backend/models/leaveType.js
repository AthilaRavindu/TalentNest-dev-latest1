const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaveTypeSchema = new Schema(
    {
        /*leave_type_id: {
            type: Number,
            required: true,
            unique: true, // acts like PK
        },*/
        leave_type_name: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
        },
        leave_type_code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 50,
        },
        description: {
            type: String,
            maxlength: 255,
        },
        leave_category: {
            type: String,
            maxlength: 50,
        },
        is_paid: {
            type: Boolean,
            default: true,
        },
        requires_approval: {
            type: Boolean,
            default: false,
        },
        is_carry_forward_allowed: {
            type: Boolean,
            default: false,
        },
        max_carry_forward_days: {
            type: Number,
            default: 0,
        },
        is_encashment_allowed: {
            type: Boolean,
            default: false,
        },
        encashment_percentage: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0,
        },
        calculation_basis: {
            type: String,
            maxlength: 50,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        /*created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },*/
    },
    { timestamps: true } // auto-manages createdAt & updatedAt
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);