import type { User, Note, ChatMessage } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@university.edu',
    role: 'teacher',
    avatarUrl: 'https://picsum.photos/seed/101/100/100',
    subject: 'Quantum Physics',
  },
  {
    id: 'user_2',
    name: 'Prof. Samuel Greene',
    email: 's.greene@university.edu',
    role: 'teacher',
    avatarUrl: 'https://picsum.photos/seed/102/100/100',
    subject: 'Organic Chemistry',
  },
  {
    id: 'user_3',
    name: 'Alex Johnson',
    email: 'a.johnson@student.edu',
    role: 'student',
    avatarUrl: 'https://picsum.photos/seed/103/100/100',
  },
  {
    id: 'user_4',
    name: 'Maria Garcia',
    email: 'm.garcia@student.edu',
    role: 'student',
    avatarUrl: 'https://picsum.photos/seed/104/100/100',
  },
  {
    id: 'user_5',
    name: 'Chen Wei',
    email: 'c.wei@student.edu',
    role: 'student',
    avatarUrl: 'https://picsum.photos/seed/105/100/100',
  },
];

let MOCK_NOTES: Note[] = [
  {
    id: 'note_1',
    title: 'Introduction to Quantum Mechanics',
    subject: 'Physics',
    semester: 'Fall 2024',
    teacherId: 'user_1',
    teacherName: 'Dr. Evelyn Reed',
    content: `Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.
Key concepts include quantization of energy, wave-particle duality, the uncertainty principle, and quantum entanglement.
The Schrödinger equation is a mathematical equation that describes the changes over time of a physical system in which quantum effects, such as wave-particle duality, are significant.`,
    summary: 'An introductory overview of quantum mechanics, covering its fundamental role in modern physics and key concepts like quantization, wave-particle duality, and the Schrödinger equation.',
    keywords: ['quantum mechanics', 'physics', 'Schrödinger equation'],
    downloadCount: 128,
    viewCount: 450,
    createdAt: '2024-08-15T10:00:00Z',
  },
  {
    id: 'note_2',
    title: 'Wave-Particle Duality',
    subject: 'Physics',
    semester: 'Fall 2024',
    teacherId: 'user_1',
    teacherName: 'Dr. Evelyn Reed',
    content: `Wave-particle duality is the concept in quantum mechanics that every particle or quantum entity may be described as either a particle or a wave. It expresses the inability of the classical concepts "particle" or "wave" to fully describe the behavior of quantum-scale objects.
The double-slit experiment is a classic demonstration of this phenomenon. Electrons, which are particles, create an interference pattern characteristic of waves when passed through two closely spaced slits.`,
    summary: 'A detailed explanation of wave-particle duality, using the double-slit experiment as a prime example of how quantum entities exhibit both particle and wave-like properties.',
    keywords: ['wave-particle duality', 'double-slit experiment', 'quantum'],
    downloadCount: 95,
    viewCount: 310,
    createdAt: '2024-09-01T14:30:00Z',
  },
  {
    id: 'note_3',
    title: 'Basics of Alkanes and Cycloalkanes',
    subject: 'Chemistry',
    semester: 'Fall 2024',
    teacherId: 'user_2',
    teacherName: 'Prof. Samuel Greene',
    content: `Alkanes are saturated hydrocarbons, meaning they consist of hydrogen and carbon atoms arranged in a tree structure in which all the carbon-carbon bonds are single. Alkanes have the general chemical formula C_n H_{2n+2}.
Cycloalkanes are a type of alkane which have one or more rings of carbon atoms in their chemical structure. They are also saturated as all of the carbon-carbon bonds are single bonds.`,
    summary: 'An introduction to saturated hydrocarbons, focusing on the structure and general formula of alkanes and the cyclic nature of cycloalkanes.',
    keywords: ['alkanes', 'chemistry', 'hydrocarbons', 'cycloalkanes'],
    downloadCount: 210,
    viewCount: 680,
    createdAt: '2024-08-20T09:00:00Z',
  },
  {
    id: 'note_4',
    title: 'Introduction to JavaScript',
    subject: 'Computer Science',
    semester: 'Spring 2024',
    teacherId: 'user_2',
    teacherName: 'Prof. Samuel Greene',
    content: `JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.7% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries.
It is a high-level, often just-in-time compiled, and multi-paradigm language that has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.`,
    summary: 'A foundational overview of JavaScript, covering its role as a core web technology, its main features like dynamic typing and first-class functions, and its ubiquitous use in modern websites.',
    keywords: ['javascript', 'web development', 'programming'],
    downloadCount: 500,
    viewCount: 1500,
    createdAt: '2024-02-10T11:00:00Z',
  },
];

let MOCK_CHAT_MESSAGES: { [noteId: string]: ChatMessage[] } = {
  'note_1': [
    { id: 'msg_1', role: 'user', content: 'Can you explain the uncertainty principle in simple terms?' },
    { id: 'msg_2', role: 'assistant', content: 'Of course! The Uncertainty Principle, formulated by Werner Heisenberg, states that there is a fundamental limit to how precisely we can know certain pairs of physical properties of a particle at the same time. For example, the more precisely you know the position of a particle, the less precisely you can know its momentum, and vice versa. It\'s an inherent property of the quantum world!' },
  ],
};

// Functions to interact with the mock data
export const getNotes = async () => MOCK_NOTES;
export const getNoteById = async (id: string) => MOCK_NOTES.find(note => note.id === id);
export const addNote = async (note: Note) => {
  MOCK_NOTES.unshift(note);
  return note;
};
export const updateNote = async (updatedNote: Note) => {
    const index = MOCK_NOTES.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
        MOCK_NOTES[index] = updatedNote;
    }
    return updatedNote;
};

export const getChatMessages = async (noteId: string) => MOCK_CHAT_MESSAGES[noteId] || [];
export const addChatMessage = async (noteId: string, message: ChatMessage) => {
  if (!MOCK_CHAT_MESSAGES[noteId]) {
    MOCK_CHAT_MESSAGES[noteId] = [];
  }
  MOCK_CHAT_MESSAGES[noteId].push(message);
  return message;
};

export const getUserById = async (id: string) => MOCK_USERS.find(user => user.id === id);
export const updateUser = async (updatedUser: User) => {
    const index = MOCK_USERS.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        MOCK_USERS[index] = updatedUser;
    }
    return updatedUser;
};
