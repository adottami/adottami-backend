import Entity, { EntityProps } from '@/shared/entities/entity';

interface ImageProps extends EntityProps {
  url: string;
}

class Image extends Entity {
  readonly url: string;

  private constructor({ id, url, createdAt }: ImageProps) {
    super({ id, createdAt });
    this.url = url;
  }

  static create(imageProps: ImageProps) {
    const image = new Image(imageProps);

    return image;
  }

  static createMany(imagesProps: ImageProps[]): Image[] {
    const images = imagesProps.map((imageProps) => Image.create(imageProps));

    return images;
  }

  toJson() {
    const { id, url, createdAt } = this;

    return {
      id,
      url,
      createdAt,
    };
  }
}

export default Image;
