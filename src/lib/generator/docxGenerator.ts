import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';

export function generateDocx(templatePath: string, data: any): Buffer {
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  return buf;
}
