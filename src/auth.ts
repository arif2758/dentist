import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { UserRole } from "@/types/auth";

// Default demo accounts
export const DEMO_USERS = [
  {
    id: "user-doc-1",
    name: "ডা. মো. আসিফুল হক",
    email: "doctor@dentist.com",
    passwordPlain: "doctor123",
    role: "doctor" as UserRole,
    phone: "01711223344",
  },
  {
    id: "user-stf-1",
    name: "মো. শফিকুল ইসলাম (সহকারী)",
    email: "staff@dentist.com",
    passwordPlain: "staff123",
    role: "staff" as UserRole,
    phone: "01811223344",
  },
  {
    id: "user-adm-1",
    name: "সিস্টেম অ্যাডমিন",
    email: "admin@dentist.com",
    passwordPlain: "admin123",
    role: "admin" as UserRole,
    phone: "01911223344",
  },
];

async function seedInitialUsersIfEmpty() {
  try {
    await connectDB();
    const count = await UserModel.countDocuments();
    if (count === 0) {
      for (const demo of DEMO_USERS) {
        const hashedPassword = await bcrypt.hash(demo.passwordPlain, 10);
        await UserModel.create({
          name: demo.name,
          email: demo.email.toLowerCase(),
          password: hashedPassword,
          role: demo.role,
          phone: demo.phone,
          status: "active",
        });
      }
    }
  } catch (err) {
    console.warn("MongoDB user seeding skipped (in-memory demo fallback active):", err);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        try {
          await connectDB();
          await seedInitialUsersIfEmpty();

          const user = await UserModel.findOne({ email });
          if (user && user.status === "active") {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              UserModel.updateOne({ _id: user._id }, { lastLoginAt: new Date() }).catch(() => {});
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
              };
            }
          }
        } catch (dbError) {
          console.warn("MongoDB auth query error, trying demo fallback:", dbError);
        }

        // In-memory demo fallback for immediate local testing
        const demoUser = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email && u.passwordPlain === password
        );
        if (demoUser) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            phone: demoUser.phone,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
});
