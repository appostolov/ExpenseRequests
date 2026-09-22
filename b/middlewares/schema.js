const { z } = require( 'zod' );

module.exports = {

    submit: function( req, res ){

        return z.object({
            expenseType: z.enum(["Travel" , "Software" , "Equipment" , "Meal" , "Other"], {
                required_error: "You must select a Expense Type.",
                invalid_type_error: "Invalid Expense Type selection."
            }),

            amountCents: z.number({
                required_error: "Amount is required",
                invalid_type_error: "Amount must be a valid number"
            })
            .int("Amount must be a whole number (no decimals)")
            .nonnegative("Amount must be 0 or a positive number"),
            
            description: z.string({
                required_error: "Description is required",
                invalid_type_error: "Description must be text"
            })
            .trim()
            .min(1, "Description cannot be empty"),

            billable: z.boolean({
                invalid_type_error: "Billable must be a true or false value"
            }).optional(),

            client: z.string({
                invalid_type_error: "Client must be text"
            })
            .trim()
            .min(1, "Client cannot be empty")
            .optional(),

            additionalJustification: z.string({
                invalid_type_error: "Extra justification must be text"
            })
            .trim()
            .min(1, "Extra justification cannot be empty")
            .optional(),

            otherReason: z.string({
                invalid_type_error: "Other reason justification must be text"
            })
            .trim()
            .min(1, "Other reason justification cannot be empty")
            .optional(),
        })
        .refine((data) => {
            if (data.billable && (!data.client || !data.client.trim() === '')) {
                return false;
            }
            return true;
        }, {
            message: "Client is required when expense request is billable",
            path: ["client"]
        })
        .refine((data) => {
            if (data.amountCents >= 100000 && (!data.additionalJustification || !data.additionalJustification.trim() === '')) {
                return false;
            }
            return true;
        }, {
            message: "Extra justification is required when the amount is 1000$ and higher",
            path: ["additionalJustification"]
        })
        .refine((data) => {
            if (data.expenseType === "Other" && (!data.otherReason || !data.otherReason.trim() === '')) {
                return false;
            }
            return true;
        }, {
            message: "Other reason is required when expense type is Other",
            path: ["otherReason"]
        });
    },

    save: function( req, res ){

        return z.object({
            expenseType: z.enum(["Travel" , "Software" , "Equipment" , "Meal" , "Other"], {
                invalid_type_error: "Invalid Expense Type selection."
            })
            .optional(),

            amountCents: z.number({
                invalid_type_error: "Amount must be a valid number"
            })
            .int("Amount must be a whole number (no decimals)")
            .nonnegative("Amount must be 0 or a positive number")
            .optional(),
            
            description: z.string({
                invalid_type_error: "Description must be text"
            })
            .trim()
            .min(1, "Description cannot be empty")
            .optional(),

            billable: z.boolean({
                invalid_type_error: "Billable must be a true or false value"
            }).optional(),

            client: z.string({
                invalid_type_error: "Client must be text"
            })
            .trim()
            .min(1, "Client cannot be empty")
            .optional(),

            additionalJustification: z.string({
                invalid_type_error: "Extra justification must be text"
            })
            .trim()
            .min(1, "Extra justification cannot be empty")
            .optional(),

            otherReason: z.string({
                invalid_type_error: "Other reason justification must be text"
            })
            .trim()
            .min(1, "Other reason justification cannot be empty")
            .optional()
        });
    },

    filter: function( req, res ){

        return z.object({
            
            id: z.string({
                invalid_type_error: "ID must be text"
            })
            .trim()
            .min(1, "ID cannot be empty")
            .optional(),

            requesterId: z.string({
                invalid_type_error: "Requester must be text"
            })
            .trim()
            .min(1, "Requester cannot be empty")
            .optional(),

            approverId: z.string({
                invalid_type_error: "Approver must be text"
            })
            .trim()
            .min(1, "Approver cannot be empty")
            .optional(),

            status: z.number({
                invalid_type_error: "Status must be a valid number"
            })
            .int("Status must be a whole number (no decimals)")
            .nonnegative("Status must be 0 or a positive number")
            .optional()
        });
    }
};