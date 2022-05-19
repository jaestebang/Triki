/**
 * Class SingletonIdPlayer: Patron de diseñon Singleton
 */
export class SingletonIdPlayer {

    //Variables privadas
    private static instance: SingletonIdPlayer;
    public iterator: number = 0;

    /**
     * Constructor privado para impedir creaciones de clase
     */
    private constructor() {
    }

    /**
     * Retorna una única instancia
     * @returns Instancia
     */
    public static getInstance(): SingletonIdPlayer {
        if (!SingletonIdPlayer.instance)
            SingletonIdPlayer.instance = new SingletonIdPlayer();
        
        //Incrementa identificador
        SingletonIdPlayer.instance.iterator += 1;
        
        return SingletonIdPlayer.instance;
    }
}