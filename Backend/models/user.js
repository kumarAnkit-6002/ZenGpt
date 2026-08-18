import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

// Hash the password before saving, only if it was modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Instance method to check a plaintext password against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Never leak the password hash when the document is sent as JSON
userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export { User };
