import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { userEmailAndPassword } from "@/auth/action/auth-action";

//Implementamos la funcionalidad para poder iniciar sesion mediante GITHUB y GOOGLE.
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Correo", type: "Email", placeholder: "google@google.com" },
        password: { label: "Contraseña", type: "password", placeholder: "******" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied.
        const user = await userEmailAndPassword(credentials!.email, credentials!.password)

        if (user) {
          return user
        }
        return null
      }
    })
  ],

  //JSON.web.token, es un estandar abierto para definir una forma compacta y autocontenida para compartir informacion entre dos componentes como objeto JSON. 
  session: {
    strategy: 'jwt'
  },
  //Se ejecuta solamente cuando el usuario haya iniciado sesion, y solamente retornamos el true lo que indica que el inicio de sesion fue exitoso.
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log({user}); 
      return true;
    },
    //se ejecuta cuando se ha creado un JWT, luego agregamos informacion adicional al JWT con el rol y el id del usuario, sino lo encontramos agregamos un valor predeterminado.
    async jwt({ token, user, account, profile }) {
      // console.log({token});
      const dbUser = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } });
      if (dbUser?.isAcitve === false) {
        throw Error('El usuario no esta activo')
      }
      token.roles = dbUser?.role ?? ['no-roles']
      token.id = dbUser?.id ?? 'no-uuid'

      return token;
    },
    
    //solo se ejecuta cada vez que se inicia sesion.
    async session({ token, user, session, }) {
      console.log({ token });
      if (session && session.user) {
        session.user.roles = token.roles;
        session.user.id = token.id;
      }
      return session;
    }
  }

}

const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST }; 