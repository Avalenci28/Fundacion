const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Event = require('../models/Event');
const Post = require('../models/Post');
const Gallery = require('../models/Gallery');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/malambo-sonrie');
    console.log('MongoDB Connected for seeding');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Event.deleteMany({});
    await Post.deleteMany({});
    await Gallery.deleteMany({});

    console.log('Existing data cleared');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin2024!', 12);
    const admin = await User.create({
      name: 'Administrador Malambo Sonríe',
      email: 'admin@malambosonrie.org',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      bio: 'Administrador principal de la fundación Malambo Sonríe'
    });
    console.log('Admin user created:', admin.email);

    // Create regular users
    const userPassword = await bcrypt.hash('Usuario2024!', 12);
    const users = await User.create([
      {
        name: 'María González',
        email: 'maria@ejemplo.com',
        password: userPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
        bio: 'Voluntaria apasionada por ayudar a la comunidad'
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@ejemplo.com',
        password: userPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        bio: 'Especialista en eventos comunitarios'
      },
      {
        name: 'Ana Patricia López',
        email: 'ana@ejemplo.com',
        password: userPassword,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        bio: 'Educadora y activista social'
      }
    ]);
    console.log('Regular users created:', users.length);

    // Create projects
    const projects = await Project.create([
      {
        title: 'Huerta Comunitaria "Sembrando Futuro"',
        description: 'Proyecto de agricultura urbana sostenible que busca crear huertos comunitarios en espacios públicos de Malambo. Los participantes aprenden técnicas de cultivo orgánico, compostaje y manejo responsable del agua. Se han establecido 5 huertos en diferentes barrios, beneficiando a más de 200 familias con acceso a alimentos frescos y educación ambiental.',
        shortDescription: 'Agricultura urbana sostenible con huertos comunitarios',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
        ],
        status: 'En proceso',
        category: 'ambiental',
        startDate: new Date('2024-01-15'),
        location: 'Barrios El Progreso, San José, Las Flores',
        beneficiaries: 200,
        volunteers: [users[0]._id, users[1]._id],
        isFeatured: true
      },
      {
        title: 'Biblioteca Itinerante "Leyendo Sueños"',
        description: 'Iniciativa que lleva libros y actividades de lectura a los barrios más vulnerables de Malambo. Contamos con una carreta adaptada como biblioteca móvil que visita 8 comunidades diferentes cada semana. Se realizan talleres de lectura, cuentacuentos y clubes de lectura para niños, jóvenes y adultos.',
        shortDescription: 'Biblioteca móvil que lleva la lectura a todos los barrios',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
        ],
        status: 'Completado',
        category: 'educativo',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2024-03-01'),
        location: 'Múltiples barrios de Malambo',
        beneficiaries: 500,
        volunteers: [users[0]._id, users[2]._id],
        isFeatured: true
      },
      {
        title: 'Centro de Capacitación Digital',
        description: 'Creación de un espacio tecnológico donde jóvenes y adultos pueden acceder a computadoras, internet y recibir capacitación en habilidades digitales. El proyecto incluye cursos de alfabetización digital, programación básica, manejo de herramientas ofimáticas y emprendimiento digital. Se han graduado 3 generaciones de estudiantes.',
        shortDescription: 'Capacitación en tecnología para todos',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
        ],
        status: 'Completado',
        category: 'educativo',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-06-01'),
        location: 'Casa de la Cultura, Malambo',
        beneficiaries: 350,
        volunteers: [users[1]._id],
        isFeatured: true
      },
      {
        title: 'Recuperación del Parque Central',
        description: 'Proyecto de embellecimiento y recuperación del parque principal de Malambo. Incluye jardinería, instalación de mobiliario urbano, creación de zonas de juegos infantiles, áreas deportivas y un anfiteatro para eventos culturales. El espacio se ha convertido en el corazón de la comunidad para encuentros y actividades.',
        shortDescription: 'Transformación del parque principal de Malambo',
        image: 'https://images.unsplash.com/photo-1519331379826-fbfbe8d65f8b?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1571896349842-68c967ba3f8d?w=800',
          'https://images.unsplash.com/photo-1496482475496-a91f31e0386c?w=800'
        ],
        status: 'Completado',
        category: 'social',
        startDate: new Date('2023-01-10'),
        endDate: new Date('2023-12-15'),
        location: 'Parque Central, Malambo',
        beneficiaries: 1000,
        volunteers: [users[0]._id, users[1]._id, users[2]._id],
        isFeatured: true
      },
      {
        title: 'Escuela de Arte y Cultura',
        description: 'Programa gratuito de formación artística que ofrece clases de música, danza, teatro y artes plásticas para niños y jóvenes. Se busca desarrollar talentos locales, fortalecer la identidad cultural y ofrecer alternativas constructivas de uso del tiempo libre. Contamos con instructores profesionales y espacios adecuados.',
        shortDescription: 'Formación artística gratuita para niños y jóvenes',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'
        ],
        status: 'En proceso',
        category: 'cultural',
        startDate: new Date('2024-02-01'),
        location: 'Centro Cultural Malambo',
        beneficiaries: 150,
        volunteers: [users[2]._id],
        isFeatured: true
      },
      {
        title: 'Ciclovía y Movilidad Sostenible',
        description: 'Proyecto para promover el uso de la bicicleta como medio de transporte alternativo y saludable. Incluye la creación de ciclorrutas, préstamo de bicicletas, talleres de mantenimiento y campañas de educación vial. Se busca reducir la contaminación y mejorar la calidad de vida de los habitantes.',
        shortDescription: 'Promoviendo el uso de la bicicleta en Malambo',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'
        ],
        status: 'Próximamente',
        category: 'ambiental',
        startDate: new Date('2024-08-01'),
        location: 'Vías principales de Malambo',
        beneficiaries: 800,
        isFeatured: false
      },
      {
        title: 'Programa de Salud Preventiva',
        description: 'Iniciativa que lleva jornadas de salud a las comunidades con servicios de chequeo médico gratuito, vacunación, educación en nutrición y hábitos saludables. Se realizan alianzas con profesionales de la salud para brindar atención de calidad a quienes más lo necesitan.',
        shortDescription: 'Salud preventiva para todas las comunidades',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        status: 'En proceso',
        category: 'social',
        startDate: new Date('2024-03-15'),
        location: 'Centros de salud y comunidades',
        beneficiaries: 600,
        volunteers: [users[0]._id],
        isFeatured: false
      },
      {
        title: 'Festival Cultural Malambo Vive',
        description: 'Organización del festival anual que celestra la cultura, música, gastronomía y tradiciones de Malambo. El evento reúne artistas locales, emprendedores, food trucks y actividades para toda la familia. Es una vitrina para el talento local y una oportunidad de generar ingresos para pequeños comerciantes.',
        shortDescription: 'El festival cultural más grande de la región',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
        ],
        status: 'Próximamente',
        category: 'cultural',
        startDate: new Date('2024-11-15'),
        location: 'Plaza Principal y alrededores',
        beneficiaries: 2000,
        isFeatured: true
      }
    ]);
    console.log('Projects created:', projects.length);

    // Create events
    const now = new Date();
    const events = await Event.create([
      {
        title: 'Festival de Música Comunitaria',
        description: 'Gran concierto al aire libre con artistas locales, grupos emergentes y bandas comunitarias. Una tarde llena de música, baile y unión familiar. Se contará con zona de comidas, artesanías y actividades para niños.',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        type: 'cultural',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 16, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 15, 23, 0),
        location: 'Parque Central, Malambo',
        capacity: 500,
        isFeatured: true,
        requiresRegistration: true
      },
      {
        title: 'Maratón Solidaria "Corazones Unidos"',
        description: 'Carrera recreativa de 5K y 10K para recaudar fondos para los proyectos sociales. Participantes de todas las edades. Incluye medallas para todos los finishers, hidratación, música en vivo y premiación.',
        image: 'https://images.unsplash.com/photo-1552674605-4694c0cc5ce6?w=800',
        type: 'deportivo',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 8, 6, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 2, 8, 12, 0),
        location: 'Avenida Principal, Malambo',
        capacity: 300,
        isFeatured: true,
        requiresRegistration: true
      },
      {
        title: 'Taller de Emprendimiento Juvenil',
        description: 'Capacitación intensiva para jóvenes emprendedores. Temas: modelos de negocio, marketing digital, finanzas básicas, pitch de ventas. Incluye mentoría personalizada y posibilidad de acceder a microcréditos.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
        type: 'educativo',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 22, 9, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 23, 17, 0),
        location: 'Centro de Capacitación Digital',
        capacity: 50,
        isFeatured: true,
        requiresRegistration: true
      },
      {
        title: 'Jornada de Limpieza del Río Malambo',
        description: 'Actividad ambiental para la limpieza y recuperación de las orillas del río. Se proporcionará equipo de protección, herramientas y refrigerios. Actividad ideal para familias, grupos de amigos y empresas que quieran contribuir.',
        image: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa1fd?w=800',
        type: 'ambiental',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 5, 7, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 5, 13, 0),
        location: 'Orillas del Río Malambo',
        capacity: 200,
        isFeatured: true,
        requiresRegistration: true
      },
      {
        title: 'Encuentro de Danzas Tradicionales',
        description: 'Celebración de las raíces culturales con presentaciones de grupos de danza folclórica, cumbia, mapalé y otros géneros tradicionales de la región caribeña. Incluye clases magistrales y exhibiciones.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
        type: 'cultural',
        date: new Date(now.getFullYear(), now.getMonth() + 3, 20, 18, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 20, 23, 0),
        location: 'Teatro Municipal',
        capacity: 400,
        isFeatured: false,
        requiresRegistration: false
      },
      {
        title: 'Campaña de Vacunación y Salud',
        description: 'Jornada de salud con vacunación gratuita, chequeos médicos básicos, control nutricional y educación en salud preventiva. Servicios gratuitos para toda la comunidad.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        type: 'social',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 10, 8, 0),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 10, 16, 0),
        location: 'Centro de Salud Principal',
        capacity: 500,
        isFeatured: false,
        requiresRegistration: false
      }
    ]);
    console.log('Events created:', events.length);

    // Create posts/blog entries
    const posts = await Post.create([
      {
        title: 'Celebramos 5 años transformando vidas en Malambo',
        excerpt: 'Un recorrido por los logros y sueños cumplidos durante medio década de trabajo comunitario incansable.',
        content: `Hace cinco años, un grupo de vecinos apasionados se reunió con una idea simple pero poderosa: hacer de Malambo un lugar mejor para todos. Hoy, celebramos medio década de transformación comunitaria que ha tocado miles de vidas.

Nuestros logros incluyen:
- Más de 2,000 personas beneficiadas directamente
- 15 proyectos completados exitosamente
- 120 voluntarios activos
- 8 comunidades impactadas

Pero más allá de los números, lo que más nos llena de orgullo son las historias de cambio: el niño que descubrió su talento para la música, la abuela que ahora tiene acceso a vegetales frescos de la huerta comunitaria, el joven que encontró su primer empleo gracias a la capacitación digital.

"Cada pequeña acción cuenta. Juntos hacemos de Malambo un mejor lugar para vivir."`,
        image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800',
        author: admin._id,
        category: 'noticia',
        tags: ['aniversario', 'logros', 'comunidad'],
        views: 245,
        isPublished: true,
        isFeatured: true
      },
      {
        title: 'La Huerta Comunitaria: Sembrando esperanza',
        excerpt: 'Cómo un terreno abandonado se convirtió en el corazón verde de la comunidad.',
        content: `Lo que comenzó como un terreno baldío lleno de escombros hoy es un vibrante espacio verde que alimenta cuerpos y almas. La Huerta Comunitaria "Sembrando Futuro" se ha convertido en un modelo replicable de agricultura urbana.

Los participantes no solo aprenden a cultivar alimentos orgánicos, sino que también desarrollan habilidades de trabajo en equipo, liderazgo y emprendimiento. Los excedentes de producción se venden en ferias locales, generando ingresos para las familias participantes.

"Antes no sabía nada de plantas, ahora tengo mi propio huerto en casa y vendo mis verduras en el mercado", cuenta María, una de las beneficiarias.

El proyecto ha sido reconocido a nivel departamental como una de las mejores prácticas de agricultura urbana sostenible.`,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        author: admin._id,
        category: 'blog',
        tags: ['huerta', 'sostenibilidad', 'agricultura'],
        views: 189,
        isPublished: true,
        isFeatured: true
      },
      {
        title: 'Jóvenes programadores crean app para la comunidad',
        excerpt: 'Graduados del Centro de Capacitación Digital desarrollan aplicación móvil gratuita para conectar vecinos.',
        content: `Un grupo de jóvenes graduados de nuestro Centro de Capacitación Digital ha desarrollado una aplicación móvil que permite a los vecinos reportar problemas en su sector, organizar actividades comunitarias y compartir recursos.

La app, llamada "Malambo Conecta", ya cuenta con más de 500 usuarios activos y ha facilitado la organización de 12 jornadas de limpieza vecinal, la recuperación de 5 espacios públicos y la creación de 3 nuevos grupos de apoyo mutuo.

"Lo más importante no es la tecnología en sí, sino cómo la usamos para fortalecer los lazos comunitarios", dice Carlos, uno de los desarrolladores.

El proyecto ha sido seleccionado para participar en una incubadora de emprendimientos tecnológicos a nivel nacional.`,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        author: users[1]._id,
        category: 'actividad',
        tags: ['tecnología', 'jóvenes', 'innovación'],
        views: 312,
        isPublished: true,
        isFeatured: false
      },
      {
        title: 'Testimonio: De beneficiaria a voluntaria',
        excerpt: 'La historia de Ana Patricia, quien transformó su vida y ahora ayuda a otros.',
        content: `Ana Patricia llegó a Malambo Sonríe buscando ayuda. Era madre soltera, desempleada y con dos hijos pequeños. Participó en nuestros talleres de capacitación y descubrió su pasión por la enseñanza.

"Malambo Sonríe no solo me dio herramientas para trabajar, me devolvió la esperanza y la dignidad", recuerda Ana Patricia con emoción.

Hoy, Ana es una de nuestras voluntarias más activas. Coordina el programa de alfabetización digital para adultos mayores y ha formado a más de 80 personas.

"Cuando ayudas a alguien, no cambias solo una vida, cambias toda una comunidad. Así funciona la cadena de solidaridad."`,
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        author: users[2]._id,
        category: 'historia',
        tags: ['testimonio', 'voluntariado', 'transformación'],
        views: 456,
        isPublished: true,
        isFeatured: true
      }
    ]);
    console.log('Posts created:', posts.length);

    // Create gallery items
    const gallery = await Gallery.create([
      {
        title: 'Festival Cultural 2023',
        description: 'Momentos inolvidables de nuestro festival anual',
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
        type: 'image',
        category: 'evento',
        isFeatured: true
      },
      {
        title: 'Huerta Comunitaria',
        description: 'Nuestros voluntarios trabajando en la huerta',
        url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
        type: 'image',
        category: 'proyecto',
        isFeatured: true
      },
      {
        title: 'Clases de Música',
        description: 'Niños descubriendo su talento musical',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        type: 'image',
        category: 'comunidad',
        isFeatured: true
      },
      {
        title: 'Jornada de Limpieza',
        description: 'Comunidad unida por un Malambo más limpio',
        url: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa1fd?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa1fd?w=400',
        type: 'image',
        category: 'voluntariado',
        isFeatured: true
      },
      {
        title: 'Taller de Arte',
        description: 'Creando arte y construyendo sueños',
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
        type: 'image',
        category: 'comunidad',
        isFeatured: true
      },
      {
        title: 'Capacitación Digital',
        description: 'Jóvenes aprendiendo habilidades tecnológicas',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
        type: 'image',
        category: 'proyecto',
        isFeatured: false
      }
    ]);
    console.log('Gallery items created:', gallery.length);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('  Email: admin@malambosonrie.org');
    console.log('  Password: Admin2024!');
    console.log('\nUser credentials:');
    console.log('  Email: maria@ejemplo.com (or carlos@ejemplo.com, ana@ejemplo.com)');
    console.log('  Password: Usuario2024!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

