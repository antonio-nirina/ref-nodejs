import { Document } from "./document";
export class MailingGroup {

    public MailingGroupID: string;
    public MainDocumentName: string;
    public CSVDocumentName: string;
    public AnnexList: Document[];
    public LetterTypeID: number;
    public ColorID: number;
    public RectoVersoID: number;
    public EnvelopID: number;
    public AccompColorID: number;
    public AccompRectoVersoID: number;
    public SenderNotPrinted : boolean;
    public PrintedEnvelope: boolean;
    public PorteAdress: boolean;
    public ExtraStitched: boolean;
    public BarCode: boolean;
    public SenderPresent: boolean;
    public SenderID: number;
    public AdminStatusID: number;
    public PriceEstimate: number;
    public PricePostOfficeEstimate: number;
    public PriceServiceEstimate: number;
    public AnnexLinked: boolean;
    public IsMapped: boolean;
    public SenderImported: boolean;
    public minNumberOfPapers: number;
    public ScheduledDate: Date;

    constructor()
    {
        this.MailingGroupID = "";
        this.ColorID = 0;
        this.RectoVersoID = 0;
        this.AccompColorID = 0;
        this.AccompRectoVersoID = 0;
        this.EnvelopID = 0;
        this.LetterTypeID = 0;
        this.CSVDocumentName = "";
        this.MainDocumentName = "";
        this.AnnexList = new Array<Document>();
        this.SenderNotPrinted = false;
        this.PrintedEnvelope = false;
        this.PorteAdress = true;
        this.ExtraStitched = false;
        this.BarCode = false;
        this.SenderID = -1;
        this.AdminStatusID = 8;
        this.PriceEstimate = 0;
        this.PricePostOfficeEstimate = 0;
        this.PriceServiceEstimate = 0;
        this.SenderPresent = false;
        this.AnnexLinked = false;
        this.IsMapped = false;
        this.SenderImported = false;
        this.minNumberOfPapers = null;
    }

    setBarCode() {
        this.BarCode = true;
    }

    toggleEnvelopeType() {
        if (this.EnvelopID > 3)
            this.EnvelopID = this.EnvelopID - 5;
        else
            this.EnvelopID = this.EnvelopID + 5;
        return this;
    }
}