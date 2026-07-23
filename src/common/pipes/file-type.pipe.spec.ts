import { BadRequestException } from '@nestjs/common';
import { FileTypePipe } from './file-type.pipe';

describe('FileTypePipe', () => {
  const pipe = new FileTypePipe(['image/jpeg', 'image/png', 'image/webp']);
  const file = (buffer: Buffer, mimetype: string, originalname: string) =>
    ({ buffer, mimetype, originalname }) as Express.Multer.File;

  it('accepts a PNG with a valid binary signature', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(pipe.transform(file(png, 'image/png', 'image.png'))).toBeDefined();
  });

  it('accepts the standard .jpeg extension', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    expect(
      pipe.transform(file(jpeg, 'image/jpeg', 'image.jpeg')),
    ).toBeDefined();
  });

  it('rejects a spoofed MIME type and extension', () => {
    expect(() =>
      pipe.transform(
        file(Buffer.from('not an image'), 'image/png', 'image.png'),
      ),
    ).toThrow(BadRequestException);
  });
});
