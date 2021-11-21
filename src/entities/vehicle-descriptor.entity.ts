import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VehicleDescriptorEntity {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  licensePlate: string;
}
