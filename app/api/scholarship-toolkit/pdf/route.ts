export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const { country, course, academicLevel, email, whatsapp } = await req.json();
    // Generate PDF in memory
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(20).text('Personalized Scholarship Toolkit', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Country: ${country}`);
    doc.text(`Course: ${course}`);
    doc.text(`Academic Level: ${academicLevel}`);
    doc.moveDown();
    doc.fontSize(16).text('Scholarship List (Sample)', { underline: true });
    doc.fontSize(12).text('- Chevening Scholarship (UK)\n- Mastercard Foundation (USA/Canada)\n- DAAD (Germany)\n- Commonwealth (UK)\n- Erasmus+ (Europe)\n- Australia Awards (Australia)');
    doc.moveDown();
    doc.fontSize(16).text('Application Guide', { underline: true });
    doc.fontSize(12).text('1. Prepare your documents (transcripts, CV, SOP, LOR).\n2. Write a strong personal statement.\n3. Apply before deadlines.\n4. Use the included templates.');
    doc.moveDown();
    doc.fontSize(16).text('Templates & Toolkit', { underline: true });
    doc.fontSize(12).text('See attached: Statement of Purpose, Letter of Recommendation, Checklist.');
    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const bufs: Buffer[] = [];
      doc.on('data', (d) => bufs.push(d));
      doc.on('end', () => resolve(Buffer.concat(bufs)));
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="scholarship-toolkit.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF', details: error }, { status: 500 });
  }
}
