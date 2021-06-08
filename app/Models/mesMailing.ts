export class MesMailing {
	public OrderID: number;
	public MailingGroupID: number;
	public LetterTypeID: number;
	public EnvelopID: number;
	public RectoVersoID: number;
	public ColorID: number;
	public Billed: boolean;
	public CreateDate: Date;
	public AccessRightID: number;
	public LetterCount: number;
	public EtapeID: number;
	public Text: string;
	public CensoredID: string;
	public WaitDownloadInvoice: boolean;
	public AdminStatusID: number;
	public GenerationStatus: number;
	public ScheduledDate: Date;

	MesMailing() {
		this.WaitDownloadInvoice = false;
	}

	onload() {
		this.optionsText();
	}

	public optionsText() {
		let text: string;
		text = this.ColorID == 0 ? "N&amp; B - " : "Color - ";
		text += this.RectoVersoID == 0 ? "Recto " : "Recto-verso ";
		switch (this.EnvelopID) {
			case 0 || 5:
				text += "A4 plié en trois ";
				break;
			case 1 || 6:
				text += "A4 plié en deux";
				break;
			case 2 || 7:
				text += "A4 non plié";
				break;
		}
		this.Text = text;
	}
}