CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(100),
    senha_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS generos (
    id_genero SERIAL PRIMARY KEY,
    nome_genero VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
    id_livro SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100),
    id_genero INTEGER REFERENCES generos(id_genero)
);

CREATE TABLE IF NOT EXISTS estante_usuario (
    id_estante SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    id_livro INTEGER REFERENCES livros(id_livro),
    disponibilidade VARCHAR(20) CHECK (disponibilidade IN ('colecao','para_troca')),
    estado_conservacao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS interesse_livro (
    id_interesse SERIAL PRIMARY KEY,
    id_solicitante INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    id_dono INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    id_livro INTEGER NOT NULL REFERENCES livros(id_livro),
    id_estante INTEGER NOT NULL REFERENCES estante_usuario(id_estante),
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
