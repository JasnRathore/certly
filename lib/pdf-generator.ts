import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { TextConfig } from './types';
import fs from 'fs/promises';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

export async function generateCertificate(templateInput: string | Buffer, name: string, config: TextConfig): Promise<Uint8Array> {
  const templateBytes = typeof templateInput === 'string' ? await fs.readFile(templateInput) : templateInput;
  const pdfDoc = await PDFDocument.load(templateBytes);
  
  pdfDoc.registerFontkit(fontkit);
  
  let font;
  switch (config.fontFamily) {
    case 'Helvetica': font = await pdfDoc.embedFont(StandardFonts.Helvetica); break;
    case 'Helvetica-Bold': font = await pdfDoc.embedFont(StandardFonts.HelveticaBold); break;
    case 'TimesRoman': font = await pdfDoc.embedFont(StandardFonts.TimesRoman); break;
    case 'TimesRoman-Bold': font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold); break;
    case 'Courier': font = await pdfDoc.embedFont(StandardFonts.Courier); break;
    case 'Courier-Bold': font = await pdfDoc.embedFont(StandardFonts.CourierBold); break;
    default: font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  // UI passes x and y as percentages (0 to 100), with 0,0 at top-left.
  // pdf-lib's origin (0,0) is bottom-left.
  const xPos = (config.x / 100) * width;
  const yPos = height - ((config.y / 100) * height);

  const textWidth = font.widthOfTextAtSize(name, config.fontSize);
  const textColor = hexToRgb(config.color);

  firstPage.drawText(name, {
    // center text horizontally around the given X coordinate
    x: xPos - (textWidth / 2),
    // center text vertically around the given Y coordinate (approximate with half font size)
    y: yPos - (config.fontSize / 3),
    size: config.fontSize,
    font: font,
    color: rgb(textColor.r, textColor.g, textColor.b),
  });

  return await pdfDoc.save();
}

export async function getPdfDimensions(templateBytes: Buffer | Uint8Array) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  return page.getSize(); // { width, height }
}
