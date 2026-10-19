/**
 * Mapa de relaciones de vecindad entre casillas del Super Triki.
 * Cada casilla solo está conectada con sus casillas adyacentes por las líneas del tablero.
 */
export const VECINOS: Record<string, string[]> = {
    // Rectángulo Exterior
    A: ['B', 'J', 'D'],
    B: ['A', 'C', 'E'],
    C: ['B', 'O', 'F'],
    J: ['A', 'V', 'K'],
    O: ['C', 'X', 'N'],
    V: ['J', 'W', 'S'],
    W: ['V', 'X', 'T'],
    X: ['O', 'W', 'U'],

    // Rectángulo Intermedio
    D: ['A', 'G', 'E', 'K'],
    E: ['B', 'H', 'D', 'F'],
    F: ['C', 'I', 'E', 'N'],
    K: ['D', 'S', 'J', 'L'],
    N: ['F', 'U', 'M', 'O'],
    S: ['K', 'T', 'P', 'V'],
    T: ['Q', 'W', 'S', 'U'],
    U: ['N', 'T', 'R', 'X'],

    // Rectángulo Interior
    G: ['D', 'H', 'L'],
    H: ['E', 'G', 'I'],
    I: ['F', 'H', 'M'],
    L: ['G', 'P', 'K'],
    M: ['I', 'R', 'N'],
    P: ['L', 'Q', 'S'],
    Q: ['P', 'R', 'T'],
    R: ['M', 'Q', 'U']
};

/**
 * Comprueba si dos casillas son vecinas adyacentes conectadas
 * @param c1 Código de casilla 1 (ej: 'D')
 * @param c2 Código de casilla 2 (ej: 'E')
 * @returns true si son vecinas directas
 */
export const sonVecinos = (c1: string, c2: string): boolean => {
    if (!c1 || !c2 || !VECINOS[c1]) return false;
    return VECINOS[c1].indexOf(c2) >= 0;
};

/**
 * Retorna la lista de casillas vecinas de una casilla dada
 * @param c Código de casilla (ej: 'D')
 * @returns Array de códigos de casillas vecinas (ej: ['A', 'G', 'E', 'K'])
 */
export const getVecinos = (c: string): string[] => {
    return VECINOS[c] || [];
};
