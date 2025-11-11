

// --- GUÍA DE INICIO RÁPIDO ---
//
// ¡Bienvenido a Oliva Reads! Para echar a andar esta aplicación una vez que descargues los archivos, sigue estos pasos.
//
// **Contexto Importante:**
// Esta es una aplicación de *frontend* puro (HTML, CSS, TypeScript/React). Funciona en el navegador y se conecta a la API de Google Gemini.
// La aplicación está diseñada para un entorno donde la Clave de API de Gemini se inyecta de forma segura.
//
// **Pasos para la Ejecución:**
//
// 1. **Servidor Web Local:**
//    No puedes abrir el archivo `index.html` directamente en tu navegador (haciendo doble clic). Debes servir los archivos a través de un servidor web local. Esto es necesario para que los módulos de JavaScript (`import`/`export`) funcionen correctamente.
//
//    Tienes varias opciones sencillas:
//
//    *   **Opción A: Extensión "Live Server" en Visual Studio Code:**
//        1. Abre la carpeta del proyecto en VS Code.
//        2. Instala la extensión "Live Server" de Ritwick Dey desde el mercado de extensiones.
//        3. Haz clic derecho en el archivo `index.html` y selecciona "Open with Live Server".
//        4. Se abrirá una nueva pestaña en tu navegador con la aplicación funcionando.
//
//    *   **Opción B: Usando Python (si lo tienes instalado):**
//        1. Abre una terminal o línea de comandos en la carpeta del proyecto.
//        2. Ejecuta el comando: `python -m http.server`
//        3. Abre tu navegador y ve a `http://localhost:8000`.
//
//    *   **Opción C: Usando Node.js (si lo tienes instalado):**
//        1. Abre una terminal en la carpeta del proyecto.
//        2. Instala un servidor globalmente (solo necesitas hacerlo una vez): `npm install -g serve`
//        3. Inicia el servidor: `serve .`
//        4. Abre la dirección que te indique la terminal (normalmente `http://localhost:3000`).
//
// 2. **Configuración de la Clave de API de Gemini:**
//    La funcionalidad para obtener recomendaciones de libros (`Obtener Sugerencias`) requiere una clave de API de Google Gemini. La aplicación está configurada para buscar esta clave en el entorno de ejecución (`process.env.API_KEY`).
//
//    En el entorno de desarrollo para el que esta aplicación está diseñada (como AI Studio), esta clave se proporciona automáticamente. Si ejecutas esto en tu propio servidor, necesitarás un sistema (como un bundler tipo Webpack o Vite) para gestionar las variables de entorno y ponerlas a disposición del código del navegador de forma segura.
//
// **¡Y eso es todo!** Una vez que el servidor esté en marcha, podrás interactuar con la interfaz de "Oliva Reads".


import React, { useState, useCallback, useMemo, FC } from 'react';
import { User, Author, Book, ReadingLog, ReadingStatus, ReadingFormat, ReadingGoal, Friendship, Review, ReadingNote, BookRecommendation, Challenge } from './types';
import { getBookRecommendations } from './services/geminiService';
import { BookOpenIcon, ChartBarIcon, StarIcon, PlusCircleIcon, SparklesIcon, UserGroupIcon, ArrowRightOnRectangleIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, TrophyIcon, UserCircleIcon, PencilIcon } from './components/Icons';

type View = 'dashboard' | 'stats' | 'friends' | 'book-detail' | 'add-book' | 'global-stats' | 'friend-profile' | 'profile' | 'challenges' | 'create-challenge';

// --- MOCK DATA ---
const MOCK_USERS: { [key: string]: User } = {
  'user1': { 
    id: 'user1', name: 'Usuario Principal', avatar_url: 'https://i.pravatar.cc/80?u=user1',
    username: 'lectorvoraz', birth_date: '1990-05-15', nationality: 'España',
    favorite_books: ['Dune', 'Cien Años de Soledad'],
    favorite_authors: ['J.R.R. Tolkien', 'Haruki Murakami'],
    favorite_bookstore: 'La Casa del Libro',
  },
  'user2': { 
    id: 'user2', name: 'Ana García', avatar_url: 'https://i.pravatar.cc/80?u=user2',
    username: 'analee', birth_date: '1992-08-20', nationality: 'México',
    favorite_books: ['Good Omens'], favorite_authors: ['Terry Pratchett'], favorite_bookstore: 'Gandhi',
  },
  'user3': {
    id: 'user3', name: 'Carlos Pérez', avatar_url: 'https://i.pravatar.cc/80?u=user3',
    username: 'carlosp', birth_date: '1988-11-30', nationality: 'Argentina',
    favorite_books: ['1984', 'The Lord of the Rings'], favorite_authors: ['George Orwell'], favorite_bookstore: 'El Ateneo Grand Splendid',
  },
};

const MOCK_FRIENDSHIPS: Friendship[] = [
    { user_id_1: 'user1', user_id_2: 'user2', status: 'accepted' }
];

const MOCK_AUTHORS: { [key: string]: Author } = {
  'tolkien': { id: '1', name: 'J.R.R. Tolkien', gender: 'male', country: 'United Kingdom', continent: 'Europe' },
  'herbert': { id: '2', name: 'Frank Herbert', gender: 'male', country: 'United States', continent: 'North America' },
  'rowling': { id: '3', name: 'J.K. Rowling', gender: 'female', country: 'United Kingdom', continent: 'Europe' },
  'pratchett': { id: '4', name: 'Terry Pratchett', gender: 'male', country: 'United Kingdom', continent: 'Europe' },
  'murakami': { id: '5', name: 'Haruki Murakami', gender: 'male', country: 'Japan', continent: 'Asia' },
  'marquez': { id: '6', name: 'Gabriel García Márquez', gender: 'male', country: 'Colombia', continent: 'South America' },
  'orwell': { id: '7', name: 'George Orwell', gender: 'male', country: 'United Kingdom', continent: 'Europe'},
};

const MOCK_BOOKS: { [key: string]: Book } = {
  'lotr': { id: '1', ol_key: 'OL27448W', title: 'The Lord of the Rings', author: MOCK_AUTHORS['tolkien'], publisher: 'Minotauro', page_count: 1178, publication_year: 1954, cover_url: 'https://picsum.photos/seed/lotr/300/450' },
  'dune': { id: '2', ol_key: 'OL31828W', title: 'Dune', author: MOCK_AUTHORS['herbert'], publisher: 'Ace Books', page_count: 412, publication_year: 1965, cover_url: 'https://picsum.photos/seed/dune/300/450' },
  'hp': { id: '3', ol_key: 'OL264222W', title: 'Harry Potter y la Piedra Filosofal', author: MOCK_AUTHORS['rowling'], publisher: 'Salamandra', page_count: 309, publication_year: 1997, cover_url: 'https://picsum.photos/seed/hp/300/450' },
  'goodomens': { id: '4', ol_key: 'OL24372W', title: 'Good Omens', author: MOCK_AUTHORS['pratchett'], publisher: 'Gollancz', page_count: 432, publication_year: 1990, cover_url: 'https://picsum.photos/seed/goodomens/300/450' },
  'kafka': { id: '5', ol_key: 'OL122851W', title: 'Kafka on the Shore', author: MOCK_AUTHORS['murakami'], publisher: 'Harvill Secker', page_count: 505, publication_year: 2002, cover_url: 'https://picsum.photos/seed/kafka/300/450' },
  'cienanos': { id: '6', ol_key: 'OL24637W', title: 'Cien Años de Soledad', author: MOCK_AUTHORS['marquez'], publisher: 'Sudamericana', page_count: 417, publication_year: 1967, cover_url: 'https://picsum.photos/seed/cienanos/300/450' },
  '1984': { id: '7', ol_key: 'OL24638W', title: '1984', author: MOCK_AUTHORS['orwell'], publisher: 'Debolsillo', page_count: 328, publication_year: 1949, cover_url: 'https://picsum.photos/seed/1984/300/450' },
};

const INITIAL_READING_LOGS: ReadingLog[] = [
  { id: 1, user_id: 'user1', book: MOCK_BOOKS['dune'], status: ReadingStatus.CurrentlyReading, start_date: '2024-07-01', abandoned: false, format: ReadingFormat.Physical, rereading: false, progress: 150, notes: [{ id: 'n1', date: '2024-07-10', content: '"El miedo es el asesino de mentes." ¡Qué gran frase para empezar!' }] },
  { id: 2, user_id: 'user1', book: MOCK_BOOKS['lotr'], status: ReadingStatus.Read, start_date: '2024-05-10', finish_date: '2024-06-20', abandoned: false, format: ReadingFormat.Physical, rereading: true, user_rating: 5, notes: [{ id: 'n2', date: '2024-06-05', content: 'La descripción de Lothlórien es mágica.' }] },
  { id: 3, user_id: 'user1', book: MOCK_BOOKS['hp'], status: ReadingStatus.Read, start_date: '2024-04-01', finish_date: '2024-04-15', abandoned: false, format: ReadingFormat.Digital, rereading: false, user_rating: 4 },
  { id: 4, user_id: 'user1', book: MOCK_BOOKS['kafka'], status: ReadingStatus.Read, start_date: '2024-02-15', finish_date: '2024-03-10', abandoned: false, format: ReadingFormat.Digital, rereading: false, user_rating: 5 },
  { id: 5, user_id: 'user1', book: MOCK_BOOKS['cienanos'], status: ReadingStatus.Read, start_date: '2024-03-11', finish_date: '2024-03-30', abandoned: false, format: ReadingFormat.Physical, rereading: false, user_rating: 5 },
];

const ALL_MOCK_LOGS: ReadingLog[] = [
    ...INITIAL_READING_LOGS,
    { id: 6, user_id: 'user2', book: MOCK_BOOKS['goodomens'], status: ReadingStatus.CurrentlyReading, start_date: '2024-07-05', abandoned: false, format: ReadingFormat.Digital, rereading: false, progress: 50 },
    { id: 7, user_id: 'user2', book: MOCK_BOOKS['cienanos'], status: ReadingStatus.Read, start_date: '2024-06-01', finish_date: '2024-06-25', abandoned: false, format: ReadingFormat.Physical, rereading: false, user_rating: 5 },
    { id: 8, user_id: 'user2', book: MOCK_BOOKS['hp'], status: ReadingStatus.Read, start_date: '2024-05-01', finish_date: '2024-05-18', abandoned: false, format: ReadingFormat.Digital, rereading: false, user_rating: 4 },
    { id: 9, user_id: 'user3', book: MOCK_BOOKS['dune'], status: ReadingStatus.Read, start_date: '2024-01-01', finish_date: '2024-01-20', abandoned: false, format: ReadingFormat.Digital, rereading: false, user_rating: 5 },
    { id: 10, user_id: 'user3', book: MOCK_BOOKS['1984'], status: ReadingStatus.Read, start_date: '2024-02-01', finish_date: '2024-02-15', abandoned: false, format: ReadingFormat.Physical, rereading: false, user_rating: 5 },
    { id: 11, user_id: 'user3', book: MOCK_BOOKS['lotr'], status: ReadingStatus.CurrentlyReading, start_date: '2024-07-15', abandoned: false, format: ReadingFormat.Physical, rereading: false, progress: 200 },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', user_id: 'user2', book_id: '6', rating: 5, date: '2024-06-26', review_text: 'Una obra maestra absoluta. El realismo mágico en su máxima expresión. La historia de los Buendía te atrapa y no te suelta.' },
  { id: 'r2', user_id: 'user3', book_id: '2', rating: 5, date: '2024-01-22', review_text: 'El mejor libro de ciencia ficción que he leído. La construcción del mundo es increíble y los personajes son complejos.' },
  { id: 'r3', user_id: 'user1', book_id: '4', rating: 5, date: '2024-03-11', review_text: 'Murakami nunca decepciona. Una historia extraña, onírica y profundamente conmovedora. Me encantó.' },
];

const MOCK_READING_GOAL: ReadingGoal = {
  year: 2024,
  target_unit: 'books',
  target_value: 12,
  current_value: INITIAL_READING_LOGS.filter(l => l.status === ReadingStatus.Read && l.finish_date?.startsWith('2024')).length,
};

const MOCK_CHALLENGES: Challenge[] = [
    { id: 'c1', title: 'Leer 5 Clásicos de la Ciencia Ficción', description: 'Un reto para explorar los pilares del género.', creator_id: 'user3', participants_ids: ['user1', 'user3'], status: 'active' },
    { id: 'c2', title: 'Viaje por Sudamérica', description: 'Leer un libro de un autor de cada país sudamericano.', creator_id: 'user1', participants_ids: ['user1', 'user2'], status: 'active' },
    { id: 'c3', title: 'Reto Murakami', description: 'Leer tres libros de Haruki Murakami este año.', creator_id: 'user1', participants_ids: ['user1'], status: 'completed' },
    { id: 'c4', title: 'El Ladrillo del Verano', description: 'Leer un libro de más de 1000 páginas.', creator_id: 'user2', participants_ids: ['user1', 'user2'], status: 'failed' },
];


// --- Helper & UI Components ---
const Section: FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
    <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-lime-900">{title}</h2>
            {action}
        </div>
        {children}
    </section>
);

const BookCard: FC<{ log: ReadingLog, onClick: () => void }> = ({ log, onClick }) => (
    <div className="flex-shrink-0 w-48 space-y-2 text-center cursor-pointer" onClick={onClick}>
        <img src={log.book.cover_url} alt={`Cover of ${log.book.title}`} className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-4 border-white" />
        <div>
            <h4 className="font-bold text-lime-900 truncate">{log.book.title}</h4>
            <p className="text-sm text-lime-900/70">{log.book.author.name}</p>
            {log.status === ReadingStatus.CurrentlyReading && log.progress && (
                <div className="w-full bg-stone-200 rounded-full h-2.5 mt-2">
                    <div className="bg-lime-700 h-2.5 rounded-full" style={{ width: `${(log.progress / log.book.page_count) * 100}%` }}></div>
                </div>
            )}
             {log.status === ReadingStatus.Read && log.user_rating && (
                <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-amber-500" filled={i < log.user_rating!} />
                    ))}
                </div>
            )}
        </div>
    </div>
);

const StatDetailCard: FC<{ title: string; data: [string, number][] }> = ({ title, data }) => (
    <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50">
        <h3 className="text-xl font-bold text-lime-900 mb-4">{title}</h3>
        <ol className="list-decimal list-inside space-y-2">
            {data.slice(0, 5).map(([item, count]) => (
                <li key={item}>
                    <span className="font-semibold">{item}</span> <span className="text-sm text-lime-900/70">({count} {count > 1 ? 'libros' : 'libro'})</span>
                </li>
            ))}
        </ol>
    </div>
);

// --- Pages / Views ---
const Dashboard: FC<{ 
    readingLogs: ReadingLog[], 
    onGetRecommendations: () => void, 
    recommendations: BookRecommendation[], 
    isLoading: boolean, 
    error: string | null, 
    onNavigate: (view: View) => void, 
    onSelectBook: (bookId: string) => void,
    onSelectRecommendation: (rec: BookRecommendation) => void,
}> = ({ readingLogs, onGetRecommendations, recommendations, isLoading, error, onNavigate, onSelectBook, onSelectRecommendation }) => {
    const currentlyReading = readingLogs.filter(log => log.status === ReadingStatus.CurrentlyReading);
    const booksRead = readingLogs.filter(log => log.status === ReadingStatus.Read);
    
    return (
      <main className="container mx-auto p-4 md:p-8">
        <Section title="Lecturas Actuales" action={<button onClick={() => onNavigate('add-book')} className="flex items-center gap-2 px-4 py-2 border border-lime-700 text-lime-700 rounded-full font-semibold hover:bg-lime-700 hover:text-white transition-colors"><PlusCircleIcon className="w-6 h-6" /> Añadir un Libro</button>}>
          <div className="flex gap-8 overflow-x-auto pb-4 -mx-4 px-4">
            {currentlyReading.length > 0 ? (currentlyReading.map(log => <BookCard key={log.id} log={log} onClick={() => onSelectBook(log.book.id)} />)) : (<p className="text-lime-900/70">No estás leyendo ningún libro actualmente.</p>)}
          </div>
        </Section>
        
        <Section title="Sugerencias para ti" action={
          <button onClick={onGetRecommendations} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-lime-700 text-white rounded-full font-semibold hover:bg-lime-800 transition-colors disabled:bg-stone-400">
            <SparklesIcon className="w-6 h-6"/> {isLoading ? 'Buscando...' : 'Obtener Sugerencias'}
          </button>
        }>
            {isLoading && <p className="text-lime-900/70 text-center">Buscando recomendaciones personalizadas para ti...</p>}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</p>}
            {!isLoading && !error && recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                        <div key={rec.title} onClick={() => onSelectRecommendation(rec)} className="bg-white/50 p-4 rounded-lg shadow-sm border border-stone-300/50 hover:shadow-md hover:border-lime-700/50 transition-all cursor-pointer">
                            <h4 className="font-bold text-lime-900">{rec.title}</h4>
                            <p className="text-sm text-lime-900/70">{rec.author}</p>
                            <p className="mt-2 text-sm italic text-lime-900/80">"{rec.reason}"</p>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && !error && recommendations.length === 0 && (
                <p className="text-lime-900/70 text-center">Haz clic en "Obtener Sugerencias" para descubrir tu próxima gran lectura.</p>
            )}
        </Section>

        <Section title="Mi Biblioteca 2024">
            <div className="flex gap-8 overflow-x-auto pb-4 -mx-4 px-4">
                {booksRead.length > 0 ? (booksRead.map(log => <BookCard key={log.id} log={log} onClick={() => onSelectBook(log.book.id)} />)) : (<p className="text-lime-900/70">Aún no has terminado ningún libro este año.</p>)}
            </div>
        </Section>
      </main>
    )
};

const AddBookPage: FC<{ onAddBook: (book: Book) => void, onBack: () => void }> = ({ onAddBook, onBack }) => {
    const searchResults = [MOCK_BOOKS['1984'], MOCK_BOOKS['goodomens']]; // Simulated search results
    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver al Panel</button>
            <Section title="Añadir un Libro a tus Lecturas">
                <div className="flex items-center gap-2 p-2 border border-stone-300 rounded-full bg-white max-w-lg mx-auto">
                    <MagnifyingGlassIcon className="w-6 h-6 text-stone-400 ml-2"/>
                    <input type="search" placeholder="Buscar por título, autor o ISBN..." className="w-full bg-transparent focus:outline-none text-lg" />
                    <button className="px-6 py-2 bg-lime-700 text-white rounded-full font-semibold">Buscar</button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-lime-900 mb-4">Resultados de la Búsqueda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map(book => (
                            <div key={book.id} className="bg-white/50 p-4 rounded-lg shadow-sm border border-stone-300/50 flex gap-4">
                                <img src={book.cover_url} alt={book.title} className="w-24 h-36 object-cover rounded-md" />
                                <div>
                                    <h4 className="font-bold">{book.title}</h4>
                                    <p className="text-sm text-lime-900/70">{book.author.name}</p>
                                    <button onClick={() => onAddBook(book)} className="mt-4 px-3 py-1 text-sm bg-lime-700 text-white rounded-full font-semibold">Añadir a mis lecturas</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </main>
    )
}

const BookDetailPage: FC<{ book: Book, currentUserId: string, allLogs: ReadingLog[], allReviews: Review[], users: typeof MOCK_USERS, onBack: () => void, onAddNote: (logId: number, note: ReadingNote) => void, onAddReview: (review: Review) => void }> = ({ book, currentUserId, allLogs, allReviews, users, onBack, onAddNote, onAddReview }) => {
    const userLog = allLogs.find(log => log.user_id === currentUserId && log.book.id === book.id);
    const bookReviews = allReviews.filter(r => r.book_id === book.id);
    
    const [noteText, setNoteText] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState<any>(0);

    if (!book) return <main className="container mx-auto p-8">Libro no encontrado. <button onClick={onBack} className="text-lime-700 underline">Volver</button></main>;

    const averageRating = bookReviews.length ? (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1) : "N/A";
    
    const handleAddNote = () => {
        if (noteText.trim() && userLog) {
            const newNote: ReadingNote = { id: `n${Date.now()}`, date: new Date().toISOString().split('T')[0], content: noteText };
            onAddNote(userLog.id, newNote);
            setNoteText("");
        }
    };

    const handleAddReview = () => {
        if (reviewText.trim() && reviewRating > 0) {
            const newReview: Review = { id: `r${Date.now()}`, user_id: currentUserId, book_id: book.id, rating: reviewRating, review_text: reviewText, date: new Date().toISOString().split('T')[0] };
            onAddReview(newReview);
            setReviewText("");
            setReviewRating(0);
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <img src={book.cover_url} alt={book.title} className="w-full h-auto object-cover rounded-lg shadow-xl border-4 border-white" />
                    <div className="mt-4 text-center">
                        <div className="text-2xl font-bold">{averageRating} <span className="text-base font-normal text-lime-900/70">({bookReviews.length} reseñas)</span></div>
                        <div className="flex justify-center mt-1">
                            {Array.from({length: 5}).map((_, i) => <StarIcon key={i} className="w-6 h-6 text-amber-500" filled={parseFloat(averageRating) > i} />)}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold text-lime-900">{book.title}</h1>
                    <h2 className="text-2xl text-lime-900/80">{book.author.name}</h2>
                    <p className="mt-2 text-sm text-lime-900/70">{book.publisher} - {book.publication_year}</p>

                    {/* Interaction Section */}
                    <div className="mt-8 bg-white/50 p-6 rounded-lg border border-stone-300/50">
                        {userLog?.status === ReadingStatus.CurrentlyReading && (
                            <div>
                                <h3 className="text-xl font-bold mb-2">Añadir Nota Privada</h3>
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full p-2 border border-stone-300 rounded-md" rows={3} placeholder="Escribe tus pensamientos..."></textarea>
                                <button onClick={handleAddNote} className="mt-2 px-4 py-2 bg-lime-700 text-white rounded-full font-semibold">Guardar Nota</button>
                            </div>
                        )}
                        {userLog?.status === ReadingStatus.Read && (
                            <div>
                                 <h3 className="text-xl font-bold mb-2">Escribir una Reseña Pública</h3>
                                 <div className="flex items-center mb-2">
                                     {Array.from({length: 5}).map((_, i) => <StarIcon key={i} onClick={() => setReviewRating(i + 1)} className={`w-7 h-7 cursor-pointer ${reviewRating > i ? 'text-amber-500' : 'text-stone-300'}`} filled={reviewRating > i} />)}
                                 </div>
                                 <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full p-2 border border-stone-300 rounded-md" rows={4} placeholder="Comparte tu opinión con la comunidad..."></textarea>
                                 <button onClick={handleAddReview} className="mt-2 px-4 py-2 bg-lime-700 text-white rounded-full font-semibold">Publicar Reseña</button>
                            </div>
                        )}
                        {userLog?.notes && userLog.notes.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-stone-300/70">
                                <h3 className="text-xl font-bold mb-2">Mis Notas Privadas</h3>
                                <ul className="space-y-2 text-sm">
                                    {userLog.notes.map(note => <li key={note.id} className="bg-amber-100/50 p-2 rounded-md italic">"{note.content}" <span className="text-xs not-italic text-stone-500 block text-right">- {note.date}</span></li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Community Reviews */}
                    <div className="mt-12">
                         <h3 className="text-2xl font-bold text-lime-900 mb-4 flex items-center gap-2"><ChatBubbleLeftRightIcon className="w-7 h-7"/> Reseñas de la Comunidad</h3>
                         <div className="space-y-6">
                            {bookReviews.length > 0 ? bookReviews.map(review => (
                                <div key={review.id} className="flex gap-4">
                                    <img src={users[review.user_id]?.avatar_url} alt={users[review.user_id]?.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{users[review.user_id]?.name}</span>
                                            <div className="flex">
                                                {Array.from({length: 5}).map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-500" filled={review.rating > i} />)}
                                            </div>
                                        </div>
                                        <p className="mt-1">{review.review_text}</p>
                                    </div>
                                </div>
                            )) : <p className="text-lime-900/70">Aún no hay reseñas para este libro. ¡Sé el primero!</p>}
                         </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

const GlobalStatsPage: FC<{ allLogs: ReadingLog[], onBack: () => void }> = ({ allLogs, onBack }) => {
    const allReadBooks = allLogs.filter(log => log.status === ReadingStatus.Read);

    const useStatsByCategory = (logs: ReadingLog[]) => {
      // FIX: Explicitly define the return type for calculateStats to prevent TypeScript from inferring a wider type `(string | number)[][]` instead of `[string, number][]`. This resolves the type mismatch with the `StatDetailCard` component's `data` prop.
      const calculateStats = (category: 'author' | 'country' | 'publisher' | 'gender' | 'format' | 'rereads'): [string, number][] => {
        const counts: { [key: string]: number } = {};
        if (category === 'rereads') {
            const count = logs.filter(log => log.rereading).length;
            return [['Relecturas', count]];
        }
        logs.forEach(log => {
            let key: string | undefined;
            if (category === 'author') key = log.book.author.name;
            else if (category === 'country') key = log.book.author.country;
            else if (category === 'publisher') key = log.book.publisher;
            else if (category === 'gender') key = log.book.author.gender;
            else if (category === 'format') key = log.format;
            if (key) {
                counts[key] = (counts[key] || 0) + 1;
            }
        });
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
      };
      return calculateStats;
    };
    
    const calculate = useStatsByCategory(allReadBooks);

    return (
         <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver a Mis Estadísticas</button>
            <Section title="Estadísticas Globales de la Comunidad">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatDetailCard title="Autores Más Leídos" data={calculate('author')} />
                    <StatDetailCard title="Países Más Leídos" data={calculate('country')} />
                    <StatDetailCard title="Editoriales Más Populares" data={calculate('publisher')} />
                    <StatDetailCard title="Lecturas por Género de Autor" data={calculate('gender')} />
                    <StatDetailCard title="Lecturas por Formato" data={calculate('format')} />
                    <StatDetailCard title="Total de Relecturas" data={calculate('rereads')} />
                </div>
            </Section>
        </main>
    )
};

const StatsPage: FC<{ readingLogs: ReadingLog[], onNavigate: (view: View) => void, readingGoal: ReadingGoal }> = ({ readingLogs, onNavigate, readingGoal }) => {
    const booksRead = readingLogs.filter(l => l.status === ReadingStatus.Read);

    const booksByMonth = useMemo(() => {
        const months = Array(12).fill(0);
        booksRead.forEach(log => {
            if (log.finish_date?.startsWith('2024')) {
                const month = parseInt(log.finish_date.split('-')[1], 10) - 1;
                months[month]++;
            }
        });
        return months;
    }, [booksRead]);

    const authorsByContinent = useMemo(() => {
      const counts: { [key: string]: number } = {};
      booksRead.forEach(log => {
        const continent = log.book.author.continent || 'Desconocido';
        counts[continent] = (counts[continent] || 0) + 1;
      });
      return Object.entries(counts);
    }, [booksRead]);

    const ratingsDistribution = useMemo(() => {
      const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      booksRead.forEach(log => {
        if (log.user_rating) {
          counts[log.user_rating]++;
        }
      });
      return Object.entries(counts).map(([rating, count]) => ({ rating: parseInt(rating), count }));
    }, [booksRead]);
    
    const goalProgress = (readingGoal.current_value / readingGoal.target_value) * 100;
    
    const useStatsByCategory = (logs: ReadingLog[]) => {
      // FIX: Explicitly define the return type for calculateStats to prevent TypeScript from inferring a wider type `(string | number)[][]` instead of `[string, number][]`. This resolves the type mismatch with the `StatDetailCard` component's `data` prop.
      const calculateStats = (category: 'author' | 'country' | 'publisher' | 'gender' | 'format' | 'rereads'): [string, number][] => {
        const counts: { [key: string]: number } = {};
        if (category === 'rereads') {
            const count = logs.filter(log => log.rereading).length;
            return [['Relecturas', count]];
        }
        logs.forEach(log => {
            let key: string | undefined;
            if (category === 'author') key = log.book.author.name;
            else if (category === 'country') key = log.book.author.country;
            else if (category === 'publisher') key = log.book.publisher;
            else if (category === 'gender') key = log.book.author.gender;
            else if (category === 'format') key = log.format;
            if (key) {
                counts[key] = (counts[key] || 0) + 1;
            }
        });
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
      };
      return calculateStats;
    };

    const calculate = useStatsByCategory(booksRead);
    
    return (
        <main className="container mx-auto p-4 md:p-8">
            <Section title="Mis Estadísticas 2024">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Reading Goal */}
                    <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50">
                        <h3 className="font-bold text-lg mb-2">Reto de Lectura Anual</h3>
                        <p className="text-3xl font-bold">{readingGoal.current_value}<span className="text-lg font-normal text-lime-900/70">/{readingGoal.target_value} libros</span></p>
                        <div className="w-full bg-stone-200 rounded-full h-4 mt-2">
                            <div className="bg-lime-700 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${goalProgress}%` }}>
                                {Math.round(goalProgress)}%
                            </div>
                        </div>
                    </div>
                    {/* Books by Month */}
                    <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50 lg:col-span-2">
                         <h3 className="font-bold text-lg mb-2">Libros Leídos por Mes</h3>
                         <div className="flex items-end justify-between h-40 gap-2">
                             {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                                 <div key={month} className="flex-1 flex flex-col items-center justify-end">
                                     <div className="w-full bg-lime-700/50 hover:bg-lime-700" style={{ height: `${(booksByMonth[i] / Math.max(...booksByMonth, 1)) * 100}%` }}></div>
                                     <span className="text-xs mt-1">{month}</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                    {/* Ratings */}
                    <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50">
                        <h3 className="font-bold text-lg mb-2">Distribución de Calificaciones</h3>
                        <div className="space-y-1">
                            {ratingsDistribution.reverse().map(({rating, count}) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="w-12">{rating} Estrellas</span>
                                    <div className="flex-1 bg-stone-200 h-5 rounded-sm"><div className="bg-amber-500 h-5" style={{width: `${(count / booksRead.length) * 100}%`}}></div></div>
                                    <span className="w-4">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Continents */}
                    <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50 lg:col-span-2">
                         <h3 className="font-bold text-lg mb-2">Lecturas por Continente del Autor</h3>
                          <div className="flex flex-wrap gap-4 mt-4">
                              {authorsByContinent.map(([continent, count]) => (
                                  <div key={continent} className="text-center">
                                      <p className="font-bold text-2xl text-lime-800">{count}</p>
                                      <p className="text-sm text-lime-900/70">{continent}</p>
                                  </div>
                              ))}
                          </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-lime-900 mb-4">Otras Estadísticas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <StatDetailCard title="Autores Más Leídos" data={calculate('author')} />
                         <StatDetailCard title="Países de Origen" data={calculate('country')} />
                         <StatDetailCard title="Editoriales" data={calculate('publisher')} />
                         <StatDetailCard title="Género del Autor" data={calculate('gender')} />
                         <StatDetailCard title="Formato" data={calculate('format')} />
                         <StatDetailCard title="Relecturas" data={calculate('rereads')} />
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button onClick={() => onNavigate('global-stats')} className="text-lime-700 font-semibold hover:underline">Ver Estadísticas Globales de la Comunidad →</button>
                </div>
            </Section>
        </main>
    )
}

const FriendsPage: FC<{ currentUser: User, allUsers: typeof MOCK_USERS, friendships: Friendship[], onSelectFriend: (friendId: string) => void, onOpenChat: (user: User) => void, onBack: () => void }> = ({ currentUser, allUsers, friendships, onSelectFriend, onOpenChat, onBack }) => {
    const friends = friendships
        .filter(f => f.user_id_1 === currentUser.id || f.user_id_2 === currentUser.id)
        .map(f => f.user_id_1 === currentUser.id ? allUsers[f.user_id_2] : allUsers[f.user_id_1]);

    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver</button>
            <Section title="Mis Amigos">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friends.map(friend => (
                        <div key={friend.id} className="bg-white/50 p-4 rounded-lg shadow-sm border border-stone-300/50 text-center">
                            <img src={friend.avatar_url} alt={friend.name} className="w-24 h-24 rounded-full mx-auto" />
                            <h3 className="font-bold text-lg mt-2">{friend.name}</h3>
                            <p className="text-sm text-lime-900/70">Leyendo actualmente: "Good Omens"</p>
                            <div className="mt-4 flex gap-2 justify-center">
                                <button onClick={() => onSelectFriend(friend.id)} className="px-3 py-1 text-sm bg-lime-700 text-white rounded-full font-semibold">Ver Perfil</button>
                                <button onClick={() => onOpenChat(friend)} className="px-3 py-1 text-sm border border-lime-700 text-lime-700 rounded-full font-semibold">Enviar Mensaje</button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </main>
    )
};

const FriendProfilePage: FC<{ friend: User, friendLogs: ReadingLog[], onSelectBook: (bookId: string) => void, onBack: () => void }> = ({ friend, friendLogs, onSelectBook, onBack }) => {
    const currentlyReading = friendLogs.filter(log => log.status === ReadingStatus.CurrentlyReading);
    const booksRead = friendLogs.filter(log => log.status === ReadingStatus.Read);
    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver a Amigos</button>
            <div className="text-center mb-8">
                <img src={friend.avatar_url} alt={friend.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-lime-900">{friend.name}</h1>
            </div>
            <Section title="Lecturas Actuales">
                <div className="flex gap-8 overflow-x-auto pb-4 -mx-4 px-4">
                    {currentlyReading.map(log => <BookCard key={log.id} log={log} onClick={() => onSelectBook(log.book.id)} />)}
                </div>
            </Section>
            <Section title={`Biblioteca de ${friend.name}`}>
                <div className="flex gap-8 overflow-x-auto pb-4 -mx-4 px-4">
                    {booksRead.map(log => <BookCard key={log.id} log={log} onClick={() => onSelectBook(log.book.id)} />)}
                </div>
            </Section>
        </main>
    )
};

const ChatModal: FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-stone-300 flex justify-between items-center">
                <h3 className="font-bold text-lg">Chat con {user.name}</h3>
                <button onClick={onClose} className="font-bold text-xl">&times;</button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
                <p className="text-sm text-lime-900/70 text-center">Simulación de chat. La funcionalidad real requiere un backend.</p>
            </div>
            <div className="p-4 border-t border-stone-300">
                <input type="text" placeholder="Escribe un mensaje..." className="w-full p-2 border border-stone-300 rounded-full" />
            </div>
        </div>
    </div>
);

const ProfilePage: FC<{ user: User, onUpdateUser: (updatedUser: User) => void, onBack: () => void }> = ({ user, onUpdateUser, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderField = (label: string, name: keyof User, value: string) => (
        <div className="mb-4">
            <label className="block text-sm font-bold text-lime-900/70">{label}</label>
            {isEditing ? (
                <input type="text" name={name} value={value} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded-md bg-white"/>
            ) : (
                <p className="text-lg">{value}</p>
            )}
        </div>
    );
    
    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver</button>
             <Section title="Mi Perfil" action={
                isEditing ? (
                    <button onClick={handleSave} className="px-4 py-2 bg-lime-700 text-white rounded-full font-semibold">Guardar Cambios</button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 border border-lime-700 text-lime-700 rounded-full font-semibold"><PencilIcon className="w-5 h-5"/> Editar Perfil</button>
                )
             }>
                <div className="bg-white/50 p-8 rounded-lg shadow-sm border border-stone-300/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField("Nombre de Usuario", "username", formData.username)}
                        {renderField("Nombre Completo", "name", formData.name)}
                        {renderField("Fecha de Nacimiento", "birth_date", formData.birth_date)}
                        {renderField("Nacionalidad", "nationality", formData.nationality)}
                        {renderField("Librería Favorita", "favorite_bookstore", formData.favorite_bookstore)}
                        <div>
                          <label className="block text-sm font-bold text-lime-900/70">Libros Favoritos</label>
                          <p className="text-lg">{user.favorite_books.join(', ')}</p>
                        </div>
                         <div>
                          <label className="block text-sm font-bold text-lime-900/70">Autores Favoritos</label>
                          <p className="text-lg">{user.favorite_authors.join(', ')}</p>
                        </div>
                    </div>
                </div>
             </Section>
        </main>
    );
};

const ChallengesPage: FC<{ currentUser: User, allUsers: typeof MOCK_USERS, challenges: Challenge[], onNavigate: (view: View) => void, onBack: () => void }> = ({ currentUser, allUsers, challenges, onNavigate, onBack }) => {
    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'failed' | 'friends'>('active');
    
    const myChallenges = challenges.filter(c => c.participants_ids.includes(currentUser.id));
    const friendChallenges = challenges.filter(c => !c.participants_ids.includes(currentUser.id) && c.participants_ids.some(pId => MOCK_FRIENDSHIPS.some(f => (f.user_id_1 === currentUser.id && f.user_id_2 === pId) || (f.user_id_2 === currentUser.id && f.user_id_1 === pId))));
    
    const filteredChallenges = {
        active: myChallenges.filter(c => c.status === 'active'),
        completed: myChallenges.filter(c => c.status === 'completed'),
        failed: myChallenges.filter(c => c.status === 'failed'),
        friends: friendChallenges,
    };

    const TabButton: FC<{ tab: typeof activeTab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-full ${activeTab === tab ? 'bg-lime-700 text-white' : 'text-lime-700'}`}
        >
            {label}
        </button>
    );

    const ChallengeCard: FC<{ challenge: Challenge }> = ({ challenge }) => (
        <div className="bg-white/50 p-6 rounded-lg shadow-sm border border-stone-300/50">
            <h3 className="text-xl font-bold text-lime-900">{challenge.title}</h3>
            <p className="text-lime-900/70 mt-1">{challenge.description}</p>
            <div className="flex -space-x-2 mt-4">
                {challenge.participants_ids.map(id => (
                    <img key={id} src={allUsers[id].avatar_url} alt={allUsers[id].name} className="w-8 h-8 rounded-full border-2 border-white" title={allUsers[id].name}/>
                ))}
            </div>
        </div>
    );

    return (
        <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver</button>
            <Section title="Mis Retos de Lectura" action={
                <button onClick={() => onNavigate('create-challenge')} className="flex items-center gap-2 px-4 py-2 bg-lime-700 text-white rounded-full font-semibold">
                    <PlusCircleIcon className="w-6 h-6"/> Crear un Reto
                </button>
            }>
                <div className="flex gap-2 mb-6 border-b border-stone-300 pb-2">
                    <TabButton tab="active" label="Activos" />
                    <TabButton tab="completed" label="Completados" />
                    <TabButton tab="failed" label="Fallados" />
                    <TabButton tab="friends" label="De Amigos" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredChallenges[activeTab].length > 0 ? (
                        filteredChallenges[activeTab].map(c => <ChallengeCard key={c.id} challenge={c} />)
                    ) : (
                        <p className="text-lime-900/70 md:col-span-2 text-center py-8">No hay retos en esta categoría.</p>
                    )}
                </div>
            </Section>
        </main>
    );
};

const CreateChallengePage: FC<{ currentUser: User, allUsers: typeof MOCK_USERS, friendships: Friendship[], onCreateChallenge: (challenge: Challenge) => void, onBack: () => void }> = ({ currentUser, allUsers, friendships, onCreateChallenge, onBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
    
    const friends = friendships
        .filter(f => f.user_id_1 === currentUser.id || f.user_id_2 === currentUser.id)
        .map(f => f.user_id_1 === currentUser.id ? allUsers[f.user_id_2] : allUsers[f.user_id_1]);

    const handleToggleFriend = (friendId: string) => {
        setInvitedFriends(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]);
    };
    
    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) return;
        const newChallenge: Challenge = {
            id: `c${Date.now()}`,
            title,
            description,
            creator_id: currentUser.id,
            participants_ids: [currentUser.id, ...invitedFriends],
            status: 'active'
        };
        onCreateChallenge(newChallenge);
    };

    return (
         <main className="container mx-auto p-4 md:p-8">
            <button onClick={onBack} className="mb-6 text-lime-700 font-semibold hover:underline">← Volver a Retos</button>
            <Section title="Crear Nuevo Reto">
                <div className="bg-white/50 p-8 rounded-lg shadow-sm border border-stone-300/50 max-w-2xl mx-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-lime-900/70 mb-1">Título del Reto</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-stone-300 rounded-md bg-white"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-lime-900/70 mb-1">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-stone-300 rounded-md bg-white" rows={4}></textarea>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-lime-900 mb-2">Invitar Amigos</h4>
                        <div className="space-y-2">
                            {friends.map(friend => (
                                <label key={friend.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-amber-100/50 cursor-pointer">
                                    <input type="checkbox" checked={invitedFriends.includes(friend.id)} onChange={() => handleToggleFriend(friend.id)} className="h-5 w-5 rounded border-gray-300 text-lime-600 focus:ring-lime-500" />
                                    <img src={friend.avatar_url} alt={friend.name} className="w-10 h-10 rounded-full"/>
                                    <span>{friend.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="w-full py-3 bg-lime-700 text-white rounded-full font-semibold text-lg">Crear Reto</button>
                </div>
            </Section>
         </main>
    );
};


// --- Main App Component ---
export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS['user1']);
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>(INITIAL_READING_LOGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [viewingBookId, setViewingBookId] = useState<string | null>(null);
  const [viewingFriendId, setViewingFriendId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chattingWith, setChattingWith] = useState<User | null>(null);

  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [tempBooks, setTempBooks] = useState<{[key: string]: Book}>({});

  const allKnownBooks = useMemo(() => ({ ...MOCK_BOOKS, ...tempBooks }), [tempBooks]);
  
  const handleNavigate = (view: View) => {
      setPreviousView(currentView);
      setViewingBookId(null);
      setViewingFriendId(null);
      setCurrentView(view);
      setIsProfileMenuOpen(false);
  }

  const handleSelectBook = (bookId: string) => {
      setPreviousView(currentView);
      setViewingBookId(bookId);
      setCurrentView('book-detail');
  }

   const handleSelectFriend = (friendId: string) => {
      setPreviousView(currentView);
      setViewingFriendId(friendId);
      setCurrentView('friend-profile');
  }

  const handleOpenChat = (user: User) => {
      setChattingWith(user);
      setIsChatOpen(true);
  }

  const handleBack = () => {
      setViewingBookId(null);
      setViewingFriendId(null);
      const targetView = previousView === currentView ? 'dashboard' : previousView;
      handleNavigate(targetView);
  }
  
  const handleAddNote = (logId: number, note: ReadingNote) => {
      setReadingLogs(logs => logs.map(log => {
          if (log.id === logId) {
              const newNotes = [...(log.notes || []), note];
              return { ...log, notes: newNotes };
          }
          return log;
      }));
  };

  const handleAddReview = (review: Review) => {
      setReviews(prev => [...prev, review]);
  };
  
  const handleAddBook = (book: Book) => {
      const newLog: ReadingLog = {
          id: Date.now(),
          user_id: currentUser.id,
          book: book,
          status: ReadingStatus.CurrentlyReading,
          start_date: new Date().toISOString().split('T')[0],
          abandoned: false,
          format: ReadingFormat.Digital, // Default format
          rereading: false,
          progress: 0,
      };
      setReadingLogs(prev => [newLog, ...prev]);
      setCurrentView('dashboard');
  };

  const handleGetRecommendations = useCallback(async () => {
    setIsRecommendationsLoading(true);
    setRecommendationsError(null);
    setRecommendations([]);
    try {
        const readBooks = readingLogs
            .filter(log => log.status === ReadingStatus.Read)
            .map(log => log.book);
        if (readBooks.length === 0) {
            throw new Error("Lee algunos libros primero para obtener recomendaciones personalizadas.");
        }
        const recs = await getBookRecommendations(readBooks);
        setRecommendations(recs);
    } catch (error) {
        setRecommendationsError(error instanceof Error ? error.message : "Un error desconocido ocurrió.");
    } finally {
        setIsRecommendationsLoading(false);
    }
  }, [readingLogs]);

  const handleSelectRecommendedBook = (rec: BookRecommendation) => {
    const existingBook = Object.values(MOCK_BOOKS).find(b => b.title.toLowerCase() === rec.title.toLowerCase());
    if (existingBook) {
        handleSelectBook(existingBook.id);
        return;
    }

    const tempBookId = `temp-${rec.title.toLowerCase().replace(/\s/g, '-')}`;
    
    if(allKnownBooks[tempBookId]) {
        handleSelectBook(tempBookId);
        return;
    }

    const newTempBook: Book = {
        id: tempBookId,
        ol_key: `temp-ol-${Date.now()}`,
        title: rec.title,
        author: {
            id: `temp-author-${rec.author.toLowerCase().replace(/\s/g, '-')}`,
            name: rec.author,
            gender: 'other',
        },
        publisher: 'Desconocido',
        page_count: 300,
        cover_url: `https://picsum.photos/seed/${encodeURIComponent(rec.title)}/300/450`,
        publication_year: new Date().getFullYear(),
    };
    
    setTempBooks(prev => ({...prev, [tempBookId]: newTempBook}));
    handleSelectBook(tempBookId);
  }

  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  };
  
  const handleCreateChallenge = (challenge: Challenge) => {
      setChallenges(prev => [challenge, ...prev]);
      handleNavigate('challenges');
  };

  const renderContent = () => {
      switch(currentView) {
          case 'profile':
              return <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} onBack={handleBack} />;
          case 'challenges':
              return <ChallengesPage currentUser={currentUser} allUsers={MOCK_USERS} challenges={challenges} onNavigate={handleNavigate} onBack={handleBack} />;
          case 'create-challenge':
              return <CreateChallengePage currentUser={currentUser} allUsers={MOCK_USERS} friendships={MOCK_FRIENDSHIPS} onCreateChallenge={handleCreateChallenge} onBack={() => handleNavigate('challenges')} />;
          case 'stats':
              return <StatsPage readingLogs={readingLogs} onNavigate={handleNavigate} readingGoal={MOCK_READING_GOAL} />;
          case 'friends':
              return <FriendsPage currentUser={currentUser} allUsers={MOCK_USERS} friendships={MOCK_FRIENDSHIPS} onSelectFriend={handleSelectFriend} onOpenChat={handleOpenChat} onBack={handleBack} />;
          case 'friend-profile':
              const friend = viewingFriendId ? MOCK_USERS[viewingFriendId] : null;
              if (friend) return <FriendProfilePage friend={friend} friendLogs={ALL_MOCK_LOGS.filter(l => l.user_id === friend.id)} onSelectBook={handleSelectBook} onBack={() => handleNavigate('friends')} />;
              return null;
          case 'global-stats':
              return <GlobalStatsPage allLogs={ALL_MOCK_LOGS} onBack={() => setCurrentView('stats')} />;
          case 'add-book':
              return <AddBookPage onAddBook={handleAddBook} onBack={handleBack} />;
          case 'book-detail':
              const selectedBook = viewingBookId ? allKnownBooks[viewingBookId] : null;
              if (selectedBook) return <BookDetailPage book={selectedBook} currentUserId={currentUser.id} allLogs={[...readingLogs, ...ALL_MOCK_LOGS.filter(l => l.user_id !== currentUser.id)]} allReviews={reviews} users={MOCK_USERS} onBack={handleBack} onAddNote={handleAddNote} onAddReview={handleAddReview} />;
              return null;
          case 'dashboard':
          default:
              return <Dashboard 
                readingLogs={readingLogs} 
                onGetRecommendations={handleGetRecommendations}
                recommendations={recommendations}
                isLoading={isRecommendationsLoading}
                error={recommendationsError}
                onNavigate={handleNavigate}
                onSelectBook={handleSelectBook}
                onSelectRecommendation={handleSelectRecommendedBook}
              />;
      }
  }

  return (
    <div className="min-h-screen bg-amber-50 text-lime-900">
      <header className="bg-lime-700/10 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-stone-300">
          <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
                  <BookOpenIcon className="h-8 w-8 text-lime-900" />
                  <h1 className="text-2xl font-bold text-lime-900">Oliva Reads</h1>
              </div>
              <div className="relative">
                  <img src={currentUser.avatar_url} alt="User Avatar" className="w-12 h-12 rounded-full cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
                  {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-stone-200">
                          <button onClick={() => handleNavigate('profile')} className="w-full text-left px-4 py-2 text-sm text-lime-900 hover:bg-amber-50 flex items-center gap-2"><UserCircleIcon className="w-5 h-5"/> Mi Perfil</button>
                          <button onClick={() => handleNavigate('stats')} className="w-full text-left px-4 py-2 text-sm text-lime-900 hover:bg-amber-50 flex items-center gap-2"><ChartBarIcon className="w-5 h-5"/> Mis Estadísticas</button>
                          <button onClick={() => handleNavigate('friends')} className="w-full text-left px-4 py-2 text-sm text-lime-900 hover:bg-amber-50 flex items-center gap-2"><UserGroupIcon className="w-5 h-5"/> Mis Amigos</button>
                          <button onClick={() => handleNavigate('challenges')} className="w-full text-left px-4 py-2 text-sm text-lime-900 hover:bg-amber-50 flex items-center gap-2"><TrophyIcon className="w-5 h-5"/> Mis Retos</button>
                          <div className="border-t border-stone-200 my-1"></div>
                          <button className="w-full text-left px-4 py-2 text-sm text-lime-900 hover:bg-amber-50 flex items-center gap-2"><ArrowRightOnRectangleIcon className="w-5 h-5"/> Cerrar Sesión</button>
                      </div>
                  )}
              </div>
          </div>
      </header>
      {renderContent()}
      {chattingWith && isChatOpen && <ChatModal user={chattingWith} onClose={() => setIsChatOpen(false)} />}
      <footer className="text-center py-6 border-t border-stone-300 text-sm text-lime-900/60">
        <p>Oliva Reads - Un Diario Social para Amantes de los Libros.</p>
      </footer>
    </div>
  );
}