const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('vibemaster99', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@vibeconnect.com' },
        update: {},
        create: {
            email: 'demo@vibeconnect.com',
            name: 'Demo User',
            handle: '@vibemaster',
            password: hashedPassword,
            bio: 'Digital nomad exploring the metaverse. 🌌 | Synthwave addict 🎹 | Building the future of social connection through vibes.',
            color: 'bg-gradient-to-br from-blue-600 to-indigo-600'
        },
    });

    console.log('Seed successful: Demo user created/verified');
    console.log('Email: demo@vibeconnect.com');
    console.log('Password: vibemaster99');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
