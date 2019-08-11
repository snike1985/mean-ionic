import {Injectable} from '@angular/core';

@Injectable()
export class MimeService {

    public getMIMEtype(ext) {
        const MIMETypes = {
            txt: 'text/plain',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            doc: 'application/msword',
            pdf: 'application/pdf',
            gif: 'image/gif',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            bmp: 'image/bmp',
            png: 'image/png',
            tif: 'image/tiff',
            tiff: 'image/tiff',
            ico: 'image/x-icon',
            svg: 'image/svg+xml',
            webp: 'image/webp',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            rtf: 'application/rtf',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };

        return MIMETypes[ext] ? MIMETypes[ext] : '';
    }
}
