import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';

async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text, x, y, size = 11, isBold = false) => {
    page.drawText(text, {
      x, y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0)
    });
  };

  // Header
  drawText('LEGAL NOTICE', 220, 790, 16, true);
  drawText('(Under Section 138, Negotiable Instruments Act 1881)', 
    100, 765, 10);

  // Date and details
  drawText('Date: 07th April 2024', 400, 730, 11);
  drawText('To,', 50, 700, 11);
  drawText('Mr. Suresh Patel', 50, 682, 11, true);
  drawText('Director, Patel Enterprises Pvt. Ltd.', 50, 664, 11);
  drawText('42, Industrial Area, Phase 2,', 50, 646, 11);
  drawText('Hyderabad, Telangana - 500081', 50, 628, 11);

  // Subject
  drawText('Subject: Legal Notice for Dishonour of Cheque', 
    50, 595, 11, true);

  // Body
  drawText('Dear Mr. Suresh Patel,', 50, 565, 11);

  drawText('I, Rajesh Mehta, am sending you this legal notice on', 
    50, 540, 11);
  drawText('behalf of my client Mr. Vikram Singh, residing at 15,', 
    50, 522, 11);
  drawText('Banjara Hills, Hyderabad, Telangana - 500034.', 
    50, 504, 11);

  drawText('FACTS OF THE CASE:', 50, 474, 11, true);

  drawText('1. My client had provided a loan of Rs. 5,00,000', 
    50, 450, 11);
  drawText('   (Five Lakhs Rupees Only) to your company on', 
    50, 432, 11);
  drawText('   15th January 2024 as per the loan agreement.', 
    50, 414, 11);

  drawText('2. In repayment of the said loan, you issued a cheque', 
    50, 390, 11);
  drawText('   bearing No. 004521, dated 01st March 2024,', 
    50, 372, 11);
  drawText('   drawn on HDFC Bank, Hyderabad Branch,', 
    50, 354, 11);
  drawText('   for an amount of Rs. 5,00,000.', 50, 336, 11);

  drawText('3. When my client presented the said cheque for', 
    50, 312, 11);
  drawText('   payment on 05th March 2024, the same was', 
    50, 294, 11);
  drawText('   returned unpaid by the bank with the remark', 
    50, 276, 11);
  drawText('   "INSUFFICIENT FUNDS".', 50, 258, 11, true);

  drawText('4. The dishonour of cheque is a criminal offence', 
    50, 234, 11);
  drawText('   under Section 138 of the Negotiable Instruments', 
    50, 216, 11);
  drawText('   Act, 1881, punishable with imprisonment up to', 
    50, 198, 11);
  drawText('   2 years or fine twice the cheque amount or both.', 
    50, 180, 11);

  drawText('DEMAND:', 50, 150, 11, true);
  drawText('You are hereby called upon to pay the cheque amount of', 
    50, 130, 11);
  drawText('Rs. 5,00,000 within 15 days of receiving this notice.', 
    50, 112, 11);
  drawText('Failing which my client will initiate criminal and civil', 
    50, 94, 11);
  drawText('proceedings against you without further notice.', 
    50, 76, 11);

  // Add second page
  const page2 = pdfDoc.addPage([595, 842]);

  const drawText2 = (text, x, y, size = 11, isBold = false) => {
    page2.drawText(text, {
      x, y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0)
    });
  };

  drawText2('LEGAL CONSEQUENCES:', 50, 790, 11, true);

  drawText2('If you fail to make the payment within the stipulated', 
    50, 765, 11);
  drawText2('time period, my client shall be constrained to:', 
    50, 747, 11);

  drawText2('1. File a criminal complaint under Section 138 of the', 
    50, 720, 11);
  drawText2('   Negotiable Instruments Act 1881 before the', 
    50, 702, 11);
  drawText2('   Metropolitan Magistrate Court, Hyderabad.', 
    50, 684, 11);

  drawText2('2. File a civil suit for recovery of the loan amount', 
    50, 660, 11);
  drawText2('   along with 18% interest per annum.', 50, 642, 11);

  drawText2('3. Report the matter to the Credit Information Bureau', 
    50, 618, 11);
  drawText2('   which will affect your credit rating and future', 
    50, 600, 11);
  drawText2('   banking facilities.', 50, 582, 11);

  drawText2('Please treat this as a final opportunity to settle', 
    50, 552, 11);
  drawText2('this matter amicably and avoid legal proceedings.', 
    50, 534, 11);

  drawText2('Yours faithfully,', 50, 490, 11);
  drawText2('Rajesh Mehta', 50, 460, 11, true);
  drawText2('Advocate', 50, 442, 11);
  drawText2('Bar Council No. AP/2010/1234', 50, 424, 11);
  drawText2('Chamber No. 45, District Court Complex,', 50, 406, 11);
  drawText2('Hyderabad, Telangana - 500001', 50, 388, 11);
  drawText2('Phone: 9848012345', 50, 370, 11);

  drawText2('Copy to:', 50, 330, 11, true);
  drawText2('1. Client Mr. Vikram Singh for records', 50, 312, 11);
  drawText2('2. HDFC Bank, Hyderabad Branch for information', 
    50, 294, 11);

  drawText2('Note: This notice is sent via Registered Post with', 
    50, 254, 11);
  drawText2('Acknowledgement Due and via Email.', 50, 236, 11);

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/test_legal_notice.pdf', pdfBytes);
  console.log('✅ Test PDF created: public/test_legal_notice.pdf');
}

createTestPDF().catch(console.error);

