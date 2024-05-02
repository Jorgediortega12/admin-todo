import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs'; 
import { getServerSession } from "next-auth";

export const getUserSessionServer = async() => {
    const session = await getServerSession(authOptions); 
    return session?.user; 
}

export const userEmailAndPassword = async (email: string, password: string) => {
    if (!email || !password) return null;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const dbUser = await createUser(email, password);
        return dbUser; 
    }
    // Si la contraseña no coincide, puedes devolver null o algún otro valor.
    if (!bcrypt.compareSync(password, user.password ?? '')) {
        return null;
    }
    // Si la contraseña coincide, puedes devolver el usuario.
    return user;
}

// No puedo mandar el password en plano ya que debemos encriptarlo usando la libreria bycrypt.
const createUser = async (email: string, password: string) => {
    const hashedPassword = bcrypt.hashSync(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword, 
            name: email.split('@')[0]
        }
    });
    return user; 
}
