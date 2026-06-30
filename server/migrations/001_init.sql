CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'renter', 'both'))
);

CREATE TABLE IF NOT EXISTS boats (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT,
  neighborhood TEXT,
  price_per_hour NUMERIC,
  price_per_player NUMERIC,
  price_unit TEXT CHECK (price_unit IN ('hora', 'jugador')),
  capacity INTEGER,
  tables INTEGER DEFAULT 1,
  levels TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  host TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  open_24h BOOLEAN DEFAULT false,
  owner_id UUID REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  boat_id INTEGER REFERENCES boats(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending'
);

INSERT INTO profiles (full_name, avatar_url, role) VALUES
  ('Álvaro', NULL, 'owner'),
  ('Mireia', NULL, 'owner'),
  ('Sergio', NULL, 'owner'),
  ('Lucía', NULL, 'owner'),
  ('Iker', NULL, 'owner'),
  ('Pablo', NULL, 'owner'),
  ('Carla', NULL, 'owner'),
  ('Rocío', NULL, 'owner')
ON CONFLICT DO NOTHING;

INSERT INTO boats (slug, name, description, city, neighborhood, price_per_hour, price_per_player, price_unit, capacity, tables, levels, amenities, photos, host, rating, reviews, open_24h, owner_id)
SELECT * FROM (VALUES
  (
    'loft-malasana',
    'Loft del Conjurador en Malasaña',
    'Un loft acogedor en pleno corazón de Malasaña, pensado para partidas largas de Commander. Mesa redonda de roble macizo con espacio de sobra para tus mazos, tokens y vasos. Estantería con sleeves y deck boxes a tu disposición, luz cálida regulable y ambiente perfecto para una noche de magia.',
    'Madrid',
    'Malasaña',
    8, 12, 'jugador',
    4, 1,
    ARRAY['Casual', 'Optimizado'],
    ARRAY['Tapetes incluidos', 'Snacks & bebidas', 'Luces regulables', 'Música de ambiente', 'Espacio para dados y contadores', 'WiFi alta velocidad'],
    ARRAY['/images/space-1.jpg', '/images/space-2.jpg', '/images/space-6.jpg'],
    'Álvaro', 4.92, 87, false,
    (SELECT id FROM profiles WHERE full_name = 'Álvaro')
  ),
  (
    'garage-poblenou',
    'Garaje Arcano Neón — Commander Nocturno',
    'Un garaje totalmente acondicionado en Poblenou, con dos mesas grandes con tapete cosido, iluminación LED púrpura regulable y nevera siempre llena. El sitio perfecto para una mesa de cEDH sin prisas: abrimos hasta el amanecer.',
    'Barcelona',
    'Poblenou',
    14, 9, 'hora',
    8, 2,
    ARRAY['Optimizado', 'cEDH'],
    ARRAY['Tapetes incluidos', 'Snacks & bebidas', 'Luces regulables', 'Espacio para dados y contadores', 'Token holders', 'Aire acondicionado', 'Abierto 24h', 'Aparcamiento'],
    ARRAY['/images/space-2.jpg', '/images/space-5.jpg', '/images/space-1.jpg'],
    'Mireia', 4.88, 142, true,
    (SELECT id FROM profiles WHERE full_name = 'Mireia')
  ),
  (
    'sala-ruzafa',
    'Sala Vintage del Planeswalker',
    'Sala señorial con sillones chesterfield y vidriera modernista. Mesa ovalada de caoba pulida, perfecta para partidas multimazo. Ideal si buscas un ambiente premium y silencioso para concentrarte en cada turno.',
    'Valencia',
    'Ruzafa',
    10, 14, 'hora',
    6, 1,
    ARRAY['Casual', 'Optimizado'],
    ARRAY['Tapetes incluidos', 'Luces regulables', 'Música de ambiente', 'Espacio para dados y contadores', 'WiFi alta velocidad', 'Aire acondicionado'],
    ARRAY['/images/space-3.jpg', '/images/space-1.jpg', '/images/space-4.jpg'],
    'Sergio', 4.95, 58, false,
    (SELECT id FROM profiles WHERE full_name = 'Sergio')
  ),
  (
    'buhardilla-sevilla',
    'Buhardilla del Mago en Triana',
    'Un rinconcito mágico en Triana con tapiz de dragones, velas y mucha tranquilidad. Pensado para grupos casuales que quieren reírse, comer algo y jugar Commander sin prisas. Trae tu mazo y olvídate del resto.',
    'Sevilla',
    'Triana',
    6, 8, 'jugador',
    4, 1,
    ARRAY['Casual'],
    ARRAY['Tapetes incluidos', 'Snacks & bebidas', 'Música de ambiente', 'WiFi alta velocidad', 'Cocina disponible'],
    ARRAY['/images/space-4.jpg', '/images/space-6.jpg', '/images/space-1.jpg'],
    'Lucía', 4.78, 36, false,
    (SELECT id FROM profiles WHERE full_name = 'Lucía')
  ),
  (
    'hall-bilbao',
    'Hall Competitivo del Norte',
    'Espacio profesional con cuatro mesas independientes. Ideal para organizar pods de cEDH, torneos privados o quedadas de varias mesas. Proxies bienvenidos. Sin distracciones, todo enfocado al juego.',
    'Bilbao',
    'Abando',
    18, 10, 'hora',
    16, 4,
    ARRAY['Optimizado', 'cEDH'],
    ARRAY['Tapetes incluidos', 'Espacio para dados y contadores', 'Token holders', 'Cartas proxy permitidas', 'Aire acondicionado', 'WiFi alta velocidad', 'Aparcamiento'],
    ARRAY['/images/space-5.jpg', '/images/space-2.jpg', '/images/space-7.jpg'],
    'Iker', 4.84, 103, false,
    (SELECT id FROM profiles WHERE full_name = 'Iker')
  ),
  (
    'atico-granada',
    'Ático Bohemio del Albaicín',
    'Buhardilla con vistas al Albaicín, llena de luces cálidas, libros de fantasía y mucho carácter. Mesa redonda vintage para hasta 5 jugadores. Perfecta para una noche de Commander con cervezas, tapas y buena vibra.',
    'Granada',
    'Albaicín',
    7, 9, 'jugador',
    5, 1,
    ARRAY['Casual', 'Optimizado'],
    ARRAY['Tapetes incluidos', 'Snacks & bebidas', 'Luces regulables', 'Música de ambiente', 'Cocina disponible'],
    ARRAY['/images/space-6.jpg', '/images/space-4.jpg', '/images/space-8.jpg'],
    'Pablo', 4.9, 64, false,
    (SELECT id FROM profiles WHERE full_name = 'Pablo')
  ),
  (
    'studio-zaragoza',
    'Studio Minimal cEDH Lab',
    'Espacio minimalista enfocado al máximo nivel competitivo. Mesa larga negra, sin distracciones visuales, iluminación cenital y silencio absoluto. Pensado para que cada turno cuente. Proxies bienvenidos.',
    'Zaragoza',
    'Centro',
    12, 11, 'hora',
    4, 1,
    ARRAY['cEDH'],
    ARRAY['Tapetes incluidos', 'Espacio para dados y contadores', 'Token holders', 'Cartas proxy permitidas', 'Aire acondicionado', 'WiFi alta velocidad', 'Abierto 24h'],
    ARRAY['/images/space-7.jpg', '/images/space-5.jpg', '/images/space-2.jpg'],
    'Carla', 4.97, 41, true,
    (SELECT id FROM profiles WHERE full_name = 'Carla')
  ),
  (
    'terraza-malaga',
    'Terraza Mística sobre Málaga',
    'Una terraza al atardecer con vistas a la ciudad, guirnaldas de luces y mesa de madera maciza. Perfecto para empezar la tarde tomando algo y alargar la partida hasta la noche con el skyline de Málaga de fondo.',
    'Málaga',
    'La Malagueta',
    9, 13, 'jugador',
    6, 1,
    ARRAY['Casual', 'Optimizado'],
    ARRAY['Tapetes incluidos', 'Snacks & bebidas', 'Luces regulables', 'Música de ambiente', 'WiFi alta velocidad', 'Cocina disponible'],
    ARRAY['/images/space-8.jpg', '/images/space-1.jpg', '/images/space-6.jpg'],
    'Rocío', 4.86, 72, false,
    (SELECT id FROM profiles WHERE full_name = 'Rocío')
  )
) AS v
WHERE NOT EXISTS (SELECT 1 FROM boats WHERE boats.slug = v.column1);
