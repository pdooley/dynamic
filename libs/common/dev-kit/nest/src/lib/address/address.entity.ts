import { Column } from 'typeorm';

import { Address, Country } from '@vsolv/dev-kit/domain';

export class CountryEmbeddedEntity implements Country {
  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  alpha2Code!: string;

  @Column({ nullable: true })
  alpha3Code!: string;

  @Column({ nullable: true })
  numericCode!: string;
}

export class AddressEmbeddedEntity implements Address {
  @Column({ nullable: true })
  formatted!: string;

  @Column({ nullable: true })
  line1!: string;

  @Column({ nullable: true })
  line2!: string;

  @Column({ nullable: true })
  postalCode!: string;

  @Column({ nullable: true })
  state!: string;

  @Column(() => CountryEmbeddedEntity)
  country!: CountryEmbeddedEntity;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  latitude!: number;

  @Column({ nullable: true })
  longitude!: number;

  @Column({ nullable: true })
  placeId?: string;
}
