export class Preference {

    public PreferenceID: number;
    public RectoVersoID: number;
    public ColorID: number;
    public EnvelopeID: number;
    public PrintSenderOnEnvelope: boolean;
    public LetterTypeID: number;
    public NotificationEmail: boolean;
    public BarCode: boolean;
    public ExtraStitched: boolean;
    public AccompColorID: number;
    public AccompRectoVersoID: number;
    public PorteAdress: boolean;
    public AnnexLinked: boolean;

    constructor() {
        this.PreferenceID = -1;
        this.ColorID = 0;
        this.RectoVersoID = 0;
        this.AccompColorID = 0;
        this.AccompRectoVersoID = 0;
        this.EnvelopeID = 0;
        this.LetterTypeID = 1;
        this.PrintSenderOnEnvelope = true;
        this.PorteAdress = true;
        this.ExtraStitched = false;
        this.BarCode = false;
        this.AnnexLinked = false;
        this.NotificationEmail = true;
    }

}